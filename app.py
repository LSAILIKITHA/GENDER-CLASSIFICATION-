from flask import Flask, request, render_template, url_for, redirect
import joblib
import os
import sys

print("Starting Flask Application...")
sys.stdout.flush()

gender_app = Flask(__name__)

# Global variables to cache loaded models
clf_model = None
cv_vectorizer = None

def load_models():
    """Load models only when needed (lazy loading)"""
    global clf_model, cv_vectorizer
    
    if clf_model is not None and cv_vectorizer is not None:
        return True  # Already loaded
    
    model_path = "naivebayes.pkl"
    vectorizer_path = "gender_vectorizer.pkl"
    
    try:
        if not os.path.exists(model_path) or not os.path.exists(vectorizer_path):
            print(f"Error: Model files not found!")
            return False
        
        print("Loading vectorizer...")
        cv_vectorizer = joblib.load(vectorizer_path)
        print("✓ Vectorizer loaded")
        
        print("Loading model...")
        clf_model = joblib.load(model_path)
        print("✓ Model loaded successfully!")
        return True
    except Exception as e:
        print(f"Error loading models: {e}")
        return False

@gender_app.route('/')
def index():
    return render_template('index.html')

@gender_app.route('/predict', methods=['POST'])
def predict():
    if not load_models():
        return render_template('results.html', 
                             prediction=[None], 
                             name="Error",
                             error="Model could not be loaded.")
    
    if request.method == 'POST':
        name_query = request.form.get('name_query', '').strip()
        
        if not name_query:
            return render_template('results.html', 
                                 prediction=[None], 
                                 name="Error",
                                 error="Please enter a valid name.")
        
        # Transform and predict
        data = [name_query]
        try:
            vct = cv_vectorizer.transform(data).toarray()
            my_prediction = clf_model.predict(vct)
            print(f"✓ Predicted for '{name_query}': {['FEMALE', 'MALE'][my_prediction[0]]}")
            return render_template('results.html', 
                                 prediction=my_prediction, 
                                 name=name_query.upper())
        except Exception as e:
            print(f"Error: {e}")
            return render_template('results.html', 
                                 prediction=[None], 
                                 name=name_query.upper(),
                                 error=f"Error: {str(e)}")
    
    return redirect(url_for('index'))

@gender_app.route('/health')
def health():
    return "OK", 200

if __name__ == '__main__':
    print("\n" + "="*60)
    print("🚀 Gender Classification Web App")
    print("="*60)
    print("\n📱 Opening browser in 2 seconds...")
    print("   👉 http://localhost:5000")
    print("\n💡 Press CTRL+C to stop the server")
    print("="*60 + "\n")
    sys.stdout.flush()
    
    gender_app.run(debug=False, host='127.0.0.1', port=5000, use_reloader=False, threaded=True)