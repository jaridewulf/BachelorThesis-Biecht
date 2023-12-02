const Blob = () => {
  const data = [4, 3, 2, 8, 8];

  const center = { x: 150, y: 150 };
  const maxRadius = 100; // Maximum radius for the largest data value

  // Function to scale data values to a radius range
  const scaleValueToRadius = (value, max) => (value / 10) * max;

  // Convert data values to scaled coordinates
  const coordinates = data.map((value, index) => ({
    x:
      center.x +
      scaleValueToRadius(value, maxRadius) *
        Math.cos(index * ((2 * Math.PI) / data.length)),
    y:
      center.y +
      scaleValueToRadius(value, maxRadius) *
        Math.sin(index * ((2 * Math.PI) / data.length)),
  }));

  // Create the path for the radar chart blob
  const path =
    coordinates.reduce((acc, point, index) => {
      return acc + (index === 0 ? "M" : "L") + `${point.x},${point.y}`;
    }, "") + "Z";

  return (
    <svg width="300" height="300">
      {/* Draw the radar chart blob */}
      <path d={path} fill="rgba(0, 123, 255, 0.5)" />
    </svg>
  );
};

export default Blob;
