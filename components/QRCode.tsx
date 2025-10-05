
import React from 'react';

// This is a simplified visual representation of a QR code for demo purposes.
// A real application would use a library to generate a dynamic QR code based on the URL.
const QRCode: React.FC<{ url: string }> = ({ url }) => {
  const size = 160;
  const modules = [
    [1,1,1,1,1,1,1,0,1,0,1,1,0,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,1,0,1,1,0,1,0,1,0,0,0,0,0,0,1],
    [1,0,1,1,1,0,1,0,0,1,1,0,0,1,0,1,1,1,1,0,1],
    [1,0,1,1,1,0,1,0,1,1,1,1,1,1,0,1,1,1,1,0,1],
    [1,0,1,1,1,0,1,0,0,1,0,1,0,1,0,1,1,1,1,0,1],
    [1,0,0,0,0,0,1,0,1,0,0,0,1,1,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,1,1,1,1,1,1],
    [0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0],
    [1,1,0,1,0,1,0,1,1,0,0,1,1,0,1,1,1,0,0,1,1],
    [0,1,0,1,1,0,1,0,0,1,1,1,0,0,1,0,1,1,0,1,0],
    [0,0,1,1,0,1,1,1,0,0,0,0,1,1,1,0,1,0,0,0,1],
    [1,0,1,0,0,0,0,1,1,1,0,1,0,1,1,0,1,1,0,1,0],
    [0,0,0,0,1,0,1,0,0,0,1,0,0,0,1,1,1,0,1,1,1],
    [0,0,0,0,0,0,0,0,1,1,1,0,0,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,0,0,1,0,0,1,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,1,0,1,0,1,0,1,1,0,1,1,1,1,0,1],
    [1,0,1,1,1,0,1,0,0,0,1,1,0,0,0,1,0,0,1,0,1],
    [1,0,1,1,1,0,1,0,1,1,0,1,0,0,1,1,1,1,0,0,1],
    [1,0,1,1,1,0,1,0,1,0,0,0,1,0,1,0,0,1,0,0,1],
    [1,0,0,0,0,0,1,0,0,1,1,1,0,1,0,1,0,1,1,0,1],
    [1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,0,1,1,1],
  ];

  const moduleSize = size / modules.length;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="bg-white">
      <title>QR Code for URL: {url}</title>
      {modules.map((row, y) =>
        row.map((cell, x) =>
          cell === 1 ? (
            <rect
              key={`${y}-${x}`}
              x={x * moduleSize}
              y={y * moduleSize}
              width={moduleSize}
              height={moduleSize}
              className="fill-current text-black"
            />
          ) : null
        )
      )}
    </svg>
  );
};

export default QRCode;
