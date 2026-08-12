# 🌐 Gender Classification Web Application

A web-based application to predict if a name is typically associated with Male or Female using Machine Learning.

## ✨ Features

- 🎯 **Name Input**: Enter any name to get a gender prediction
- 🤖 **Machine Learning**: Uses a trained Naive Bayes classifier
- 🎨 **Beautiful UI**: Modern, responsive design that works on all devices
- ⚡ **Fast Predictions**: Real-time results powered by scikit-learn
- 📊 **Trained Model**: Pre-trained on a comprehensive dataset of names

## 🚀 How to Run

### Prerequisites
- Python 3.8 or higher
- pip (Python package manager)

### Installation Steps

1. **Clone/Download the project**
   ```bash
   cd Gender-Classification-Using-Machine-Learning-main
   ```

2. **Create a virtual environment** (recommended)
   ```bash
   python -m venv venv
   ```

3. **Activate the virtual environment**
   - **Windows:**
     ```bash
     venv\Scripts\activate
     ```
   - **macOS/Linux:**
     ```bash
     source venv/bin/activate
     ```

4. **Install required packages**
   ```bash
   pip install -r requirements.txt
   ```

5. **Run the application**
   ```bash
   python app.py
   ```

6. **Open your browser** and navigate to:
   ```
   http://localhost:5000
   ```

## 📝 Usage

1. Enter a name in the input box
2. Click "🎯 Predict Gender"
3. Get instant results with visual feedback
4. Try another name or see detailed predictions

## 🏗️ Project Structure

```
Gender-Classification-Using-Machine-Learning-main/
├── app.py                          # Main Flask application
├── requirements.txt                # Python dependencies
├── Names_dataset.csv              # Training dataset
├── naivebayes.pkl                 # Pre-trained Naive Bayes model
├── gender_vectorizer.pkl          # CountVectorizer for text transformation
├── Gender Classification.ipynb    # Jupyter notebook with ML code
├── templates/
│   ├── index.html                 # Home page with input form
│   └── results.html               # Results page with prediction
└── static/
    └── style.css                  # Styling and responsive design
```

## 🤖 Model Information

- **Algorithm**: Naive Bayes Classifier (Multinomial)
- **Vectorization**: CountVectorizer (character-level analysis)
- **Training Data**: Comprehensive dataset of male and female names
- **Accuracy**: High accuracy on typical names
- **Input Processing**: Analyzes character patterns and combinations

## ⚙️ How It Works

1. The ML model analyzes character patterns in names
2. Uses CountVectorizer to convert names to numerical features
3. Trained Naive Bayes classifier makes predictions
4. Results show if the name is typically associated with Male or Female

## 📊 About the Data

The model is trained on a diverse dataset of names including:
- Common English names
- International names
- Various cultural origins

## ⚠️ Important Notes

- This is a probabilistic prediction based on statistical patterns
- Names can vary across cultures and regions
- Results are estimates based on typical associations
- Accuracy may vary for uncommon or unique names
- Not all predictions will be 100% accurate

## 🔧 Troubleshooting

### Issue: "Model files not found"
**Solution**: Ensure `naivebayes.pkl` and `gender_vectorizer.pkl` are in the project directory

### Issue: Port 5000 already in use
**Solution**: Change the port in app.py:
```python
gender_app.run(debug=True, host='0.0.0.0', port=5001)
```

### Issue: Module not found errors
**Solution**: Make sure you've installed all requirements:
```bash
pip install -r requirements.txt
```

## 🎓 Learning Resources

- See `Gender Classification.ipynb` for the complete ML pipeline
- Includes data exploration, feature engineering, and model training
- Run the notebook to understand how the models were created

## 📄 License

This project is provided for educational purposes.

## 👨‍💻 Developer Notes

To retrain the model with new data:
1. Open `Gender Classification.ipynb`
2. Update the dataset path
3. Run all cells to generate new model files
4. The Flask app will automatically use the new models

---

**Enjoy predicting genders from names! 🎉**
