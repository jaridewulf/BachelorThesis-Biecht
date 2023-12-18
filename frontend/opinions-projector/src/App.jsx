import "./App.css";
import { useState, useEffect } from "react";
import BlobWithCurves from "./components/BlobWithCurves";

import { useRef } from "react";

function App() {
  const [feedbackData, setFeedbackData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://49.12.236.9:3000/feedback');
        const data = await response.json();
        setFeedbackData(data);
      } catch (error) {
        console.error('Error fetching feedback data:', error);
      }
    };

    fetchData();
  }, []);

  const groupedFeedbackData = feedbackData.reduce((acc, item) => {
    // Check if there is an existing group with the same departmentId
    const existingItem = acc.find((group) => group.departmentId === item.departmentId);

    if (existingItem) {
      // If an existing group is found, push the item to its items array
      existingItem.items.push(item);
    } else {
      // If no existing group is found, create a new group with the departmentId and items array
      acc.push({ departmentId: item.departmentId, items: [item] });
    }

    return acc;
  }, [feedbackData]);

  console.log(groupedFeedbackData);

  return (
    <>
      <div style={{ position: "relative" }}>
        <BlobWithCurves feedbackData={feedbackData} />
        {groupedFeedbackData.slice(1).map((group, index) => (
          <BlobWithCurves
            key={group.departmentId}
            feedbackData={group.items}
            style={{
              position: "absolute",
              top: `${50 + 100 * Math.sin((2 * Math.PI * index) / groupedFeedbackData.length)}%`,
              left: `${50 + 100 * Math.cos((2 * Math.PI * index) / groupedFeedbackData.length)}%`,
            }}
          />
        ))}
      </div>
    </>
  );
}

export default App;
