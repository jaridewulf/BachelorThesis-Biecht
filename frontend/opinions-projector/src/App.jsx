import "./App.css";
import { useState, useEffect } from "react";
import BlobWithCurves from "./components/BlobWithCurves";

function App() {
  const [feedbackData, setFeedbackData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3000/feedback');
        const data = await response.json();
        setFeedbackData(data);
      } catch (error) {
        console.error('Error fetching feedback data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <div>
        <BlobWithCurves feedbackData={feedbackData} />
      </div>
    </>
  );
}

export default App;
