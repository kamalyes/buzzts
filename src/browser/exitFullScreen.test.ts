import { exitFullScreen } from './exitFullScreen';

describe('exitFullScreen', () => {
  let originalDoc: any;

  beforeEach(() => {
    // 备份 document 对象
    originalDoc = { ...document };

    // 清理所有模拟
    jest.restoreAllMocks();
  });

  afterEach(() => {
    // 恢复 document 对象
    Object.assign(document, originalDoc);
  });

  it('should call document.exitFullscreen if available', () => {
    const exitFullscreenMock = jest.fn();
    // @ts-ignore
    document.exitFullscreen = exitFullscreenMock;

    exitFullScreen();

    expect(exitFullscreenMock).toHaveBeenCalled();
  });

  it('should call msExitFullscreen if exitFullscreen not available', () => {
    // @ts-ignore
    document.exitFullscreen = undefined;
    // @ts-ignore
    document.msExitFullscreen = jest.fn();

    exitFullScreen();

    expect(document.msExitFullscreen).toHaveBeenCalled();
  });

  it('should call mozCancelFullScreen if others not available', () => {
    // @ts-ignore
    document.exitFullscreen = undefined;
    // @ts-ignore
    document.msExitFullscreen = undefined;
    // @ts-ignore
    document.mozCancelFullScreen = jest.fn();

    exitFullScreen();

    expect(document.mozCancelFullScreen).toHaveBeenCalled();
  });

  it('should call webkitExitFullscreen if others not available', () => {
    // @ts-ignore
    document.exitFullscreen = undefined;
    // @ts-ignore
    document.msExitFullscreen = undefined;
    // @ts-ignore
    document.mozCancelFullScreen = undefined;
    // @ts-ignore
    document.webkitExitFullscreen = jest.fn();

    exitFullScreen();

    expect(document.webkitExitFullscreen).toHaveBeenCalled();
  });

  it('should not throw if no fullscreen methods available', () => {
    // @ts-ignore
    document.exitFullscreen = undefined;
    // @ts-ignore
    document.msExitFullscreen = undefined;
    // @ts-ignore
    document.mozCancelFullScreen = undefined;
    // @ts-ignore
    document.webkitExitFullscreen = undefined;

    expect(() => exitFullScreen()).not.toThrow();
  });
});
