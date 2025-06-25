/**
 * @func exitFullScreen
 * @returns {void}
 * @desc 📝 退出全屏
 * @example exitFullScreen();
 */
export const exitFullScreen = (): void => {
  const doc = document as any;

  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (doc.msExitFullscreen) {
    doc.msExitFullscreen();
  } else if (doc.mozCancelFullScreen) {
    doc.mozCancelFullScreen();
  } else if (doc.webkitExitFullscreen) {
    doc.webkitExitFullscreen();
  }
};
