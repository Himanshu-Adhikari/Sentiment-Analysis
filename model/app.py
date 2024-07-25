from flask import Flask, request, jsonify
import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification
from google.cloud import translate_v2 as translate
from flask_cors import CORS
import os
# Load environment variables
from dotenv import load_dotenv
load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/')
def home():
    return 'Welcome to Sentiment Analysis API'

# Load model and tokenizer
mdl = AutoModelForSequenceClassification.from_pretrained('nlptown/bert-base-multilingual-uncased-sentiment')
tokenizer = AutoTokenizer.from_pretrained('nlptown/bert-base-multilingual-uncased-sentiment')
mdl.eval()
import google.generativeai as genai

#GEMINI KEY
ApiKey='AIzaSyDELCLw1s8HV5gBSVD7mxeZwn9i4kh6L8w'

#assign APIKEY
genai.configure(
  api_key=ApiKey
)

Genmodel=genai.GenerativeModel('gemini-pro')
chat=Genmodel.start_chat()

# Initialize Google Cloud Translate client
translate_client = translate.Client()

def translate_text(text, target_language='en'):
    result = translate_client.translate(text, target_language=target_language)
    return result['translatedText']

@app.route('/predict_sentiment', methods=['POST'])
def predict_sentiment():
    text = request.json['text']
    
    # Translate text to English
    translated_text = translate_text(text)
    print(translated_text)
    # Tokenize and get prediction
    inputs = tokenizer.encode(translated_text, return_tensors='pt')
    
    with torch.no_grad():
        outputs = mdl(inputs)
        predicted_class = torch.argmax(outputs.logits) + 1  
    
    sentiment_labels = {
        1: 'Very negative',
        2: 'Negative',
        3: 'Neutral',
        4: 'Positive',
        5: 'Very positive'
    }
    
    predicted_sentiment = sentiment_labels[predicted_class.item()]
    
    response=chat.send_message("Give short consize feedback(in 1-2 sentences) to someone feeling "+predicted_sentiment+" and  saying:"+text+".")
    feedback=response.text
    return jsonify({'sentiment': predicted_sentiment,'feedback':feedback})

@app.route('/favicon.ico')
def favicon():
    return '', 204  # Return empty response for favicon.ico request

if __name__ == '__main__':
    app.run(debug=True)
