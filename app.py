from flask import Flask, jsonify, request
from flask_cors import CORS
import pickle
import re
import string
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression

#Initializing flask app
app = Flask(__name__)
CORS(app)

# Load saved model and vectorizer
with open('vectorizer.pkl', 'rb') as f:
    vectorizer = pickle.load(f)

with open('model.pkl', 'rb') as f:
    model = pickle.load(f)

with open('model1.pkl','rb') as f:
    model1 = pickle.load(f)

# Text preprocessing function
def preprocess_text(text):
    text = text.lower()  # Convert to lowercase
    text = re.sub(f"[{string.punctuation}]", "", text)  # Remove punctuation
    text = re.sub("\d+", "", text)  # Remove numbers
    return text

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    email_text = data.get("text","")

    if not email_text:
        return jsonify({"error":"No text provided"}),400
      # Preprocess and vectorize
    processed_text = preprocess_text(email_text)
    text_vectorized = vectorizer.transform([processed_text])
    
    # Make prediction
    prediction_NB = model.predict(text_vectorized)[0]
    prediction_LR = model.predict(text_vectorized)[0]
    print(prediction_LR)
    print(prediction_NB)
    
    return jsonify({"prediction1": prediction_NB, "prediction2":prediction_LR})
if __name__ == '__main__':
    app.run(debug=True)