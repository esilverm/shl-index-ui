import React from 'react';

export default () => (
  <video
    autoPlay
    loop
    muted
    className="absolute top-0 left-0 h-full w-full object-fill"
  >
    <source src="/404.webm" type="video/webm" />
    <source src="/404.mp4" type="video/mp4" />
  </video>
);
