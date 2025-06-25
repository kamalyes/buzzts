/**
 * @func toFullScreen
 * @returns {Promise<void> | void}
 * @desc 📝 使页面进入全屏模式，兼容多浏览器
 * @example
 * toFullScreen().then(() => {
 *   console.log('Entered fullscreen');
 * }).catch(err => {
 *   console.error('Fullscreen failed', err);
 * });
 */
export const toFullScreen = (): Promise<void> | void => {
  if (typeof document === 'undefined') return;

  const element = document.body as HTMLElement & {
    mozRequestFullScreen?: () => Promise<void>;
    msRequestFullscreen?: () => Promise<void>;
    webkitRequestFullscreen?: () => Promise<void>;
  };

  if (element.requestFullscreen) {
    return element.requestFullscreen();
  } else if (element.mozRequestFullScreen) {
    return element.mozRequestFullScreen();
  } else if (element.msRequestFullscreen) {
    return element.msRequestFullscreen();
  } else if (element.webkitRequestFullscreen) {
    return element.webkitRequestFullscreen();
  } else {
    return Promise.reject(new Error('Fullscreen API is not supported'));
  }
};
