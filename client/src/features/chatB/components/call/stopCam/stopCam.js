export function stopCam(video) {
  // Check if the stream exists before attempting to stop it
  if (video && video.getTracks) {
    video.getTracks().forEach((track) => {
      track.stop();
    });

    // Set the stream to null or whatever value you prefer using the state setter
    video = null;
  }
}