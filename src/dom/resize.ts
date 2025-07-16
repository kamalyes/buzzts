/**
 * @desc H5 软键盘弹起和收回的回调函数
 * 当软件键盘弹起时会改变当前 window.innerHeight，监听这个值变化
 * @param {Function} downCb - 当软键盘收回后的回调函数
 * @param {Function} upCb - 当软键盘弹起的回调函数
 */
export const windowResize = (downCb: () => void, upCb: () => void) => {
  let clientHeight = window.innerHeight; // 记录初始的窗口高度

  // 确保回调函数是有效的函数
  downCb = typeof downCb === 'function' ? downCb : () => {};
  upCb = typeof upCb === 'function' ? upCb : () => {};

  // 监听窗口大小变化事件
  const resizeHandler = () => {
    let height = window.innerHeight; // 获取当前窗口高度
    if (height === clientHeight) {
      downCb(); // 如果高度恢复到初始值，调用收回回调
    } else if (height < clientHeight) {
      upCb(); // 如果当前高度小于初始值，调用弹起回调
    }
  };

  window.addEventListener('resize', resizeHandler);

  // 返回一个函数以便在需要时可以移除事件监听器
  return () => {
    window.removeEventListener('resize', resizeHandler);
  };
};
