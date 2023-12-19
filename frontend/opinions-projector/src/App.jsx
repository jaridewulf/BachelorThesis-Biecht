import "./App.css";
import { useState, useEffect } from "react";
import BlobWithCurves from "./components/BlobWithCurves";

function App() {
  const [feedbackData, setFeedbackData] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [groupedFeedbackData, setGroupedFeedbackData] = useState(null); // Initialize with null

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseFeedback = await fetch('http://172.18.0.1:3000/feedback');
        const dataFeedback = await responseFeedback.json();
        setFeedbackData(dataFeedback);

        const responseDepartments = await fetch('http://172.18.0.1:3000/departments');
        const dataDepartments = await responseDepartments.json();
        setDepartments(dataDepartments);

        const groupedData = dataFeedback.reduce((acc, item) => {
          const existingItem = acc.find((group) => group.departmentId === item.departmentId);

          if (existingItem) {
            existingItem.items.push(item);
          } else {
            const department = dataDepartments.find((dept) => dept.id === item.departmentId);
            acc.push({ departmentId: item.departmentId, items: [item], color: department.color });
          }
          return acc;
        }, []);

        setGroupedFeedbackData(groupedData);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  console.log(groupedFeedbackData);

  return (
    <>
      <div className="blob__center" style={{
        position: "absolute",
        top: "30vh",
        left: "40vw"
      }}>
        <BlobWithCurves feedbackData={feedbackData} bigBlob={true} color="#E30613" />
      </div>
      <div>
        {groupedFeedbackData && groupedFeedbackData.slice(1).map((group, index) => (
          <div key={group.departmentId} style={{
            position: "absolute",
            top: `calc(40vh + ${40 * Math.sin((2 * Math.PI * index) / (groupedFeedbackData.length - 1))}%)`,
            left: `calc(45vw + ${30 * Math.cos((2 * Math.PI * index) / (groupedFeedbackData.length - 1))}%)`,
          }}>
            <BlobWithCurves
              key={group.departmentId}
              feedbackData={group.items}
              color={group.color}
            />
          </div>
        ))}
      </div>
    </>
  );
}

export default App;
