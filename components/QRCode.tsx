import React from 'react';
import QRCode from 'react-qr-code';

const RealQRCode: React.FC<{ url: string }> = ({ url }) => {
  return (
    <QRCode
      value={url}
      size={256} // Render at a higher resolution and let CSS scale it down.
      style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
      viewBox="0 0 256 256"
      level="H" // High error correction level for better readability
    />
  );
};

export default RealQRCode;