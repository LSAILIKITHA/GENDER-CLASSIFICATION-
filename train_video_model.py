import os
import sys
import time
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader
from torchvision import datasets, transforms, models

# Ensure UTF-8 output encoding
if hasattr(sys.stdout, 'reconfigure'):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

def main():
    print("=" * 60)
    print(" NameLens AI - Training PyTorch ResNet-18 Facial Gender Model")
    print("=" * 60)

    base_dir = os.path.dirname(os.path.abspath(__file__))
    dataset_dir = os.path.join(base_dir, "dataset")
    train_dir = os.path.join(dataset_dir, "train")
    valid_dir = os.path.join(dataset_dir, "valid")
    test_dir = os.path.join(dataset_dir, "test")

    save_dir = os.path.join(base_dir, "backend", "models")
    os.makedirs(save_dir, exist_ok=True)
    model_save_path = os.path.join(save_dir, "resnet18_gender.pth")

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"Using device: {device}")

    # Data Augmentations & Transforms
    train_transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.RandomHorizontalFlip(p=0.5),
        transforms.RandomRotation(degrees=10),
        transforms.ColorJitter(brightness=0.15, contrast=0.15, saturation=0.15),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])

    eval_transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])

    print("\nLoading Datasets...")
    train_dataset = datasets.ImageFolder(root=train_dir, transform=train_transform)
    valid_dataset = datasets.ImageFolder(root=valid_dir, transform=eval_transform)
    test_dataset = datasets.ImageFolder(root=test_dir, transform=eval_transform)

    print(f"✓ Train Samples: {len(train_dataset)} ({train_dataset.class_to_idx})")
    print(f"✓ Valid Samples: {len(valid_dataset)}")
    print(f"✓ Test Samples:  {len(test_dataset)}")

    batch_size = 64
    train_loader = DataLoader(train_dataset, batch_size=batch_size, shuffle=True, num_workers=0)
    valid_loader = DataLoader(valid_dataset, batch_size=batch_size, shuffle=False, num_workers=0)
    test_loader = DataLoader(test_dataset, batch_size=batch_size, shuffle=False, num_workers=0)

    # Load ResNet-18 model with pretrained weights
    print("\nInitializing ResNet-18 pretrained architecture...")
    weights = models.ResNet18_Weights.DEFAULT
    model = models.resnet18(weights=weights)

    # Replace classifier head (2 output classes: female=0, male=1)
    in_features = model.fc.in_features
    model.fc = nn.Sequential(
        nn.Dropout(p=0.3),
        nn.Linear(in_features, 2)
    )

    model = model.to(device)

    criterion = nn.CrossEntropyLoss()
    optimizer = optim.AdamW(model.parameters(), lr=3e-4, weight_decay=1e-2)
    scheduler = optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=6)

    epochs = 6
    best_val_acc = 0.0

    print(f"\nStarting Model Training ({epochs} epochs)...")
    sys.stdout.flush()
    start_time = time.time()

    for epoch in range(1, epochs + 1):
        model.train()
        running_loss = 0.0
        correct_train = 0
        total_train = 0

        for images, labels in train_loader:
            images, labels = images.to(device), labels.to(device)
            optimizer.zero_grad()

            outputs = model(images)
            loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()

            running_loss += loss.item() * images.size(0)
            _, preds = torch.max(outputs, 1)
            correct_train += (preds == labels).sum().item()
            total_train += labels.size(0)

        scheduler.step()

        epoch_loss = running_loss / total_train
        epoch_train_acc = (correct_train / total_train) * 100.0

        # Evaluate on Validation Set
        model.eval()
        val_loss = 0.0
        correct_val = 0
        total_val = 0

        with torch.no_grad():
            for images, labels in valid_loader:
                images, labels = images.to(device), labels.to(device)
                outputs = model(images)
                loss = criterion(outputs, labels)

                val_loss += loss.item() * images.size(0)
                _, preds = torch.max(outputs, 1)
                correct_val += (preds == labels).sum().item()
                total_val += labels.size(0)

        val_epoch_loss = val_loss / total_val
        val_acc = (correct_val / total_val) * 100.0

        print(f"Epoch [{epoch:02d}/{epochs:02d}] "
              f"Train Loss: {epoch_loss:.4f} | Train Acc: {epoch_train_acc:.2f}% | "
              f"Val Loss: {val_epoch_loss:.4f} | Val Acc: {val_acc:.2f}%")

        if val_acc >= best_val_acc:
            best_val_acc = val_acc
            torch.save(model.state_dict(), model_save_path)
            print(f"   >>> Saved new best model checkpoint to {model_save_path} (Val Acc: {val_acc:.2f}%)")
        sys.stdout.flush()

    elapsed = time.time() - start_time
    print(f"\nTraining Complete in {elapsed / 60:.2f} minutes.")
    print(f"Best Validation Accuracy: {best_val_acc:.2f}%")

    # Load best checkpoint and evaluate on Test Set
    print("\n" + "=" * 60)
    print(" Evaluating Best Model on Independent Test Set...")
    print("=" * 60)

    model.load_state_dict(torch.load(model_save_path, map_location=device))
    model.eval()

    test_correct = 0
    test_total = 0
    tp, fp, fn, tn = 0, 0, 0, 0 # Class 1 = male, Class 0 = female

    with torch.no_grad():
        for images, labels in test_loader:
            images, labels = images.to(device), labels.to(device)
            outputs = model(images)
            _, preds = torch.max(outputs, 1)

            test_correct += (preds == labels).sum().item()
            test_total += labels.size(0)

            for p, l in zip(preds, labels):
                p_item, l_item = p.item(), l.item()
                if p_item == 1 and l_item == 1:
                    tp += 1
                elif p_item == 1 and l_item == 0:
                    fp += 1
                elif p_item == 0 and l_item == 1:
                    fn += 1
                elif p_item == 0 and l_item == 0:
                    tn += 1

    test_acc = (test_correct / test_total) * 100.0
    precision = (tp / (tp + fp)) * 100.0 if (tp + fp) > 0 else 0.0
    recall = (tp / (tp + fn)) * 100.0 if (tp + fn) > 0 else 0.0
    f1 = (2 * precision * recall / (precision + recall)) if (precision + recall) > 0 else 0.0

    print(f"✓ Test Accuracy:  {test_acc:.2f}%")
    print(f"✓ Test Precision: {precision:.2f}%")
    print(f"✓ Test Recall:    {recall:.2f}%")
    print(f"✓ Test F1-Score:  {f1:.2f}%")
    print(f"Confusion Matrix: True Female/Pred Female={tn}, True Female/Pred Male={fp}, True Male/Pred Female={fn}, True Male/Pred Male={tp}")

    print("\n✓ Model successfully saved to:", model_save_path)

if __name__ == "__main__":
    main()
