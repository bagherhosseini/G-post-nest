import React from 'react';

export default function VideoCam({ videoRef, muted }) {
  return (
    <div>
      {videoRef && (
        <video
          id='userVideo'
          className="rounded-full"
          ref={videoRef}
          autoPlay
          playsInline
          muted={muted}
          style={{
            width: '300px',
            position: 'absolute',
            top: '300px',
            right: muted ? '0' : '300px',
            left: muted ? '0' : '300px',
            zIndex: '10000',
            backgroundColor: muted ? 'red' : 'blue',
          }}
        />
      )}
    </div>
  );
}
