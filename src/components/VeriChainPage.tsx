import React from 'react';

const VeriChainPage = () => {
  return (
    <iframe
      title="VeriChain Prototype"
      src="/verichain/index.html"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        border: 'none',
        margin: 0,
        padding: 0,
        background: '#15201A',
      }}
    />
  );
};

export default VeriChainPage;
