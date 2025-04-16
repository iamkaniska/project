import "../App.css";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import useClipboard from "react-use-clipboard";
import { useState } from "react";

const Kan = () => {
  const [textToCopy, setTextToCopy] = useState("");
  const [isCopied, setCopied] = useClipboard(textToCopy, {
    successDuration: 1000,
  });

  const startListening = () =>
    SpeechRecognition.startListening({ continuous: true, language: "en-IN" });

  const { transcript, browserSupportsSpeechRecognition } = useSpeechRecognition();
  if (!browserSupportsSpeechRecognition) {
    return <p>Your browser does not support speech recognition.</p>;
  }

  return (
    <div className="container">
      <h2>Speech to Text Converter</h2>
      <p>
        A React hook that converts speech from the microphone to text and makes
        it available to your React components.
      </p>

      <div
        className="main-content"
        onClick={() => setTextToCopy(transcript)}
        style={{ cursor: "pointer", border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}
      >
        {transcript || "Click 'Start Listening' and speak..."}
      </div>

      <div className="btn-style">
        <button onClick={() => setCopied()}>
          {isCopied ? "Copied!" : "Copy to clipboard"}
        </button>
        <button onClick={startListening}>Start Listening</button>
        <button onClick={SpeechRecognition.stopListening}>Stop Listening</button>
      </div>
    </div>
  );
};

export default Kan;
