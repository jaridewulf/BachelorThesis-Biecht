import { CardinalClosedCurve } from "react-svg-curve";

const BlobWithCurves = () => {
  const data = [3, 3, 7, 3, 5, 6, 6, 7];

  // Variables
  const width = 400;
  const height = 400;
  const center = { x: width / 2, y: height / 2 };
  const maxRadius = Math.max(width, height) / 2 - 10;
  // Will show severity
  const tension = 0.2;
  const fill = "rgba(0, 120, 255, 1)";

  // Function to scale data values to a radius range
  const scaleValueToRadius = (value, max) => Math.round((value / 9) * max);

  // Convert data values to scaled coordinates
  const coordinates = data.map((value, index) => [
    Math.round(
      center.x +
        scaleValueToRadius(value, maxRadius) *
          Math.cos(index * ((2 * Math.PI) / data.length))
    ),
    Math.round(
      center.y +
        scaleValueToRadius(value, maxRadius) *
          Math.sin(index * ((2 * Math.PI) / data.length))
    ),
  ]);

  return (
    <svg width={width} height={height} xmlns="http://www.w3.org/2000/svg">
      <CardinalClosedCurve
        data={coordinates}
        tension={tension}
        fill={fill}
        showPoints={false}
        strokeWidth={0}
      />
    </svg>
  );
};

export default BlobWithCurves;
