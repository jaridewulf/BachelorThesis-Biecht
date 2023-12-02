import { CardinalClosedCurve } from "react-svg-curve";

const BlobWithCurves = () => {
  const data = [4, 3, 2, 8, 8];

  // Variables
  const center = { x: 100, y: 100 };
  const maxRadius = 100;
  const tension = 0.5;
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
    <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
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
