import React, { useState } from "react";
import axios from "axios";
import { useSpeechRecognition } from "react-speech-kit";
import p1 from "../pics/verysad.jpg";
import p2 from "../pics/sad.jpg";
import p3 from "../pics/neutral.jpg";
import p4 from "../pics/happy.jpg";
import p5 from "../pics/veryhappy.jpg";
import banner from "../pics/banner.png";

const photos = {
  "Very negative": p1,
  "Negative": p2,
  "Neutral": p3,

  "Positive": p4,

  "Very positive": p5,
};

const SentimentForm = () => {
  const [text, setText] = useState("");
  const [feedbacktext, setFeedbackText] = useState("");
  const [sentiment, setSentiment] = useState("");
  const [isListening, setIsListening] = useState(false);

  // Function to handle speech recognition result
  const onResult = (result) => {
    setText(result);
  };

  // Hook from react-speech-kit to manage speech recognition
  const { listen, stop } = useSpeechRecognition({
    onResult,
  });
``
  // Handle text input change
  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  // Handle form submission for sentiment analysis
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (text == "") {
      alert("Enter Input Field is empty");
    } else {
      try {
        const response = await axios.post(
          "http://localhost:5000/predict_sentiment",
          { text }
        );
        setSentiment(response.data.sentiment);
        setFeedbackText(response.data.feedback);
        console.log(feedbacktext);
      } catch (error) {
        console.error("Error fetching sentiment:", error);
      }
    }
  };

  // Handle button click to start/stop recording
  const handleListen = () => {
    if (isListening) {
      stop();
      setIsListening(false);
    } else {
      listen();
      setIsListening(true);
    }
  };

  return (  <div className="mt-[50px] mx-auto max-w-2xl p-4 shadow-lg rounded-lg bg-slate-200" >
    <h1 className="text-center font-bold text-3xl mb-8 underline">Sentiment Analysis</h1>
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <textarea
          placeholder="Enter text via text or mic"
          className="block w-full p-2.5 text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          value={text}
          onChange={handleTextChange}
          spellCheck="false"
          rows={5}
          cols={80}
        />
      </div>
      <div className="flex justify-center space-x-4 mb-4">
        <button
          type="button"
          className="text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5"
          onClick={handleListen}
        >
          {isListening ? "Stop Recording" : "Record Audio 🎤"}
        </button>
        <button
          type="submit"
          className="text-white bg-gray-500 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5"
        >
          Analyze Sentiment
        </button>
      </div>
    </form>
    {sentiment && <p className="text-center font-semibold text-lg mb-4 underline">Sentiment: {sentiment}</p>}
    {feedbacktext && <p className="text-center text-gray-700 mb-4">{feedbacktext}</p>}
    <div className="flex justify-center">
      {sentiment !== "" ? (
        <img
          src={photos[sentiment]}
          className="max-h-72 max-w-72 transition-transform transform ease-in-out duration-200 hover:scale-110 hover:opacity-90"
          alt={`Sentiment: ${sentiment}`}
        />
      ) : (
        <img
          className="max-h-72 max-w-72 rounded-xl"
          src={banner}
          alt="Sentiment: default"
        />
      )}
    </div>
  </div>
);
};

export default SentimentForm;
