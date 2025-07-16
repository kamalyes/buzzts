/**
 * @func getImageFileName
 * @desc 生成图像文件名，包含纳秒级时间戳
 * @return {string} 返回生成的图像文件名
 * @example let fileName = getImageFileName();
 */
export function getImageFileName(extension: string = 'png'): string {
  // 获取当前时间的时间戳（毫秒）和纳秒部分
  const timestamp = Date.now() * 1e3 + Math.floor(performance.now() * 1e3); // 转换为纳秒
  return `${timestamp}.${extension}`;
}

/**
 * @func urlToImageBlob
 * @param {string} url - 要转换的图像 URL
 * @desc 将图像 URL 转换为 Blob 对象
 * @return {Promise<Blob>} 返回 Blob 对象的 Promise
 * @example urlToImageBlob(url).then(blob => { console.log(blob); })
 */
export const urlToImageBlob = async (url: string): Promise<Blob> => {
  if (!url) throw new Error('URL is required');

  const response = await fetch(url, { mode: 'no-cors' });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.blob();
};

/**
 * @func urlToImageFile
 * @param {string} url - 要转换的图像 URL
 * @param {string} [fileName] - 文件名（可选）
 * @desc 将图像 URL 转换为 File 对象
 * @return {Promise<File>} 返回 File 对象的 Promise
 * @example urlToImageFile(url).then(file => { console.log(file); })
 */
export const urlToImageFile = async (url: string, fileName: string = getImageFileName()): Promise<File> => {
  const blob = await urlToImageBlob(url);
  return new File([blob], fileName, { type: blob.type });
};

/**
 * @func base64ToImageFile
 * @param {string} base64 - 要转换的 base64 字符串
 * @param {string} [fileName] - 文件名（可选）
 * @desc 将 base64 字符串转换为 File 对象
 * @return {File} 返回 File 对象
 * @example let file = base64ToImageFile(base64, fileName)
 */
export const base64ToImageFile = (base64: string, fileName: string = getImageFileName()): File => {
  const [header, base64Data] = base64.split(',');
  const mimeMatch = header.match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : 'image/png'; // 默认 MIME 类型为 PNG

  const binaryString = atob(base64Data);
  const n = binaryString.length;
  const u8arr = new Uint8Array(n);

  // 将二进制字符串转换为 Uint8Array
  for (let i = 0; i < n; i++) {
    u8arr[i] = binaryString.charCodeAt(i);
  }

  return new File([u8arr], fileName, { type: mime });
};

/**
 * @func base64ToImageBlob
 * @param {string} base64 - 要转换的 base64 字符串
 * @desc 将 base64 字符串转换为 Blob 对象
 * @return {Blob | null} 返回 Blob 对象或 null
 * @example let blob = base64ToImageBlob(dataurl)
 */
export const base64ToImageBlob = (base64: string): Blob | null => {
  if (!base64) return null;
  const [header, base64Data] = base64.split(',');
  const mimeMatch = header.match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : 'image/png'; // 默认 MIME 类型为 PNG

  const binaryString = atob(base64Data);
  const n = binaryString.length;
  const u8arr = new Uint8Array(n);

  // 将二进制字符串转换为 Uint8Array
  for (let i = 0; i < n; i++) {
    u8arr[i] = binaryString.charCodeAt(i);
  }

  return new Blob([u8arr], { type: mime });
};

/**
 * @func blobToImageFile
 * @param {Blob} blob - 要转换的 Blob 对象
 * @param {string} [fileName] - 文件名（可选）
 * @desc 将 Blob 对象转换为 File 对象
 * @return {File} 返回 File 对象
 * @example let file = blobToImageFile(blob, filename)
 */
export const blobToImageFile = (blob: Blob, fileName: string = getImageFileName()): File => {
  return new File([blob], fileName, { type: blob.type });
};

/**
 * @func fileToBase64
 * @param {File} file - 文件对象
 * @desc 将文件对象转换为 base64 字符串
 * @return {Promise<string>} 返回 Promise 对象，异步处理
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = event => {
      if (event.target) {
        resolve(event.target.result as string);
      } else {
        reject(new Error('读取文件失败'));
      }
    };
    reader.onerror = error => reject(error); // 处理读取错误
  });
};
