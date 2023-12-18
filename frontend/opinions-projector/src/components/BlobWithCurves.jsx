import { CardinalClosedCurve } from "react-svg-curve";
import { useEffect, useState } from "react";

const BlobWithCurves = ({ feedbackData, bigBlob }) => {
  // Set Data
  const [intensity, setIntensity] = useState([]);
  const [tensionValue, setTensionValue] = useState(0);
  const [fill, setFill] = useState(`rgba(0, 120, 255, 1)`);
  const [width] = useState(bigBlob ? 400 : 200);
  const [height] = useState(bigBlob ? 400 : 200);

  // Variables
  const center = { x: width / 2, y: height / 2 };
  const maxRadius = Math.max(width, height) / 2 - 10;

  // Calculate tension
  const calculateTension = (sentiment) => {
    if (sentiment === "NEGATIVE") {
      setTensionValue((prevTensionValue) => {
        const newTensionValue = prevTensionValue + 1;
        return newTensionValue;
      });
    }
    setFill(`rgba(0, 120, 255, ${tensionValue + 0.1})`);
  };

  useEffect(() => {
    if (feedbackData.length >= 3) {
      setIntensity([]);
      setTensionValue(0);
      // Use map to create an array of intensities
      const intensitiesArray = feedbackData.map(feedback => {
        feedback.intensity;
        calculateTension(feedback.sentiment);
        return feedback.intensity;
      });

      // Use spread operator to concatenate the existing intensity state with the new values
      setIntensity(prevIntensity => [...prevIntensity, ...intensitiesArray]);
      setTensionValue((prevTensionValue) => {
        const newTensionValue = prevTensionValue / feedbackData.length;
        return newTensionValue;
      });
    }
  }, [feedbackData]);

  // Function to scale data values to a radius range
  const scaleValueToRadius = (value, max) => Math.round((value / 9) * max);

  // Convert data values to scaled coordinates
  const coordinates = intensity.map((value, index) => [
    Math.round(
      center.x +
      scaleValueToRadius(value, maxRadius) *
      Math.cos(index * ((2 * Math.PI) / intensity.length))
    ),
    Math.round(
      center.y +
      scaleValueToRadius(value, maxRadius) *
      Math.sin(index * ((2 * Math.PI) / intensity.length))
    ),
  ]);

  if (width) {
    return (
      <svg width={width} height={height} xmlns="http://www.w3.org/2000/svg">
        <CardinalClosedCurve
          data={coordinates}
          tension={tensionValue}
          fill={fill}
          showPoints={false}
          strokeWidth={0}
        />
      </svg>
    );
  } else {
    return null;
  }
};

export default BlobWithCurves;
