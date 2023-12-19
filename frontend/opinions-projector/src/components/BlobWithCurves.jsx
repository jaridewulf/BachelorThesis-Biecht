import { CardinalClosedCurve } from "react-svg-curve";
import { useEffect, useState } from "react";

const BlobWithCurves = ({ feedbackData, bigBlob, color }) => {
  // Set Data
  const [intensity, setIntensity] = useState([]);
  const [tensionValue, setTensionValue] = useState(0);
  const [fill, setFill] = useState("#ffffff");
  const [width] = useState(bigBlob ? 400 : 200);
  const [height] = useState(bigBlob ? 400 : 200);

  // Variables
  const center = { x: width / 2, y: height / 2 };
  const maxRadius = Math.max(width, height) / 2 - 10;

  console.log(feedbackData);

  // Calculate tension
  const calculateTension = (sentiment) => {
    if (sentiment === "NEGATIVE") {
      setTensionValue((prevTensionValue) => {
        const newTensionValue = prevTensionValue + 1;
        return newTensionValue;
      });
    }
    hexToRgba(color, tensionValue);
  };

  // Convert hex to rgba
  const hexToRgba = (color) => {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    setFill(`rgba(${r}, ${g}, ${b}, ${1 - tensionValue + 0.2})`);
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
