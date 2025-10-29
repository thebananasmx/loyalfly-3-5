import React, { useRef, useEffect } from 'react';
import QRCode from 'qrcode';

const RealQRCode: React.FC<{ url: string }> = ({ url }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas && url) {
      // The container div is 160x160px. We draw directly into the canvas at that size.
      QRCode.toCanvas(canvas, url, {
        width: 160,
        margin: 1, // Minimal margin to make the QR code larger within the container
        errorCorrectionLevel: 'H', // High error correction for better scannability
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        }
      }, (error) => {
        if (error) console.error('Error generating QR Code:', error);
      });
    }
  }, [url]); // This effect runs whenever the `url` prop changes

  // The canvas will be sized by the `toCanvas` function.
  // It's placed inside a sized div in the CardPreview component.
  return <canvas ref={canvasRef} />;
};

export default RealQRCode;