import React from 'react';

export default () => (
  <video
    autoPlay
    loop
    muted
    className="absolute left-0 top-0 size-full object-fill"
  >
    <source src="/404.webm" type="video/webm" />
    <source src="/404.mp4" type="video/mp4" />
  </video>
);
