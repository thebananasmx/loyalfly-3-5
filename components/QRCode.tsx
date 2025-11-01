import React, { useRef, useEffect } from 'react';
import QRCode from 'qrcode';

interface RealQRCodeProps {
  url: string;
  cardColor?: string;
  textColorScheme?: 'dark' | 'light';
}

const RealQRCode: React.FC<RealQRCodeProps> = ({ url, cardColor = '#FFFFFF', textColorScheme = 'dark' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas && url) {
      const isDarkCard = textColorScheme === 'light';
      
      QRCode.toCanvas(canvas, url, {
        width: 120,
        margin: 1,
        errorCorrectionLevel: 'H',
        color: {
          dark: isDarkCard ? '#FFFFFF' : '#000000',
          light: cardColor,
        }
      }, (error) => {
        if (error) console.error('Error generating QR Code:', error);
      });
    }
  }, [url, cardColor, textColorScheme]);

  return <canvas ref={canvasRef} />;
};

export default RealQRCode;