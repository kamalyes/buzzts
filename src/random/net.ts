/**
 * @func randIPv4
 * @return {string} 随机IPv4地址字符串
 * @desc   生成合法的随机IPv4地址
 * @example randIPv4() // "192.168.0.1"
 */
export function randIPv4() {
  return Array.from({ length: 4 }, () => Math.floor(Math.random() * 256)).join('.');
}

/**
 * @func randIPv6
 * @return {string} 随机IPv6地址字符串
 * @desc   生成合法的随机IPv6地址（简化版）
 * @example randIPv6() // "2001:0db8:85a3:0000:0000:8a2e:0370:7334"
 */
export function randIPv6() {
  const hex = () =>
    Math.floor(Math.random() * 0x10000)
      .toString(16)
      .padStart(4, '0');
  return Array.from({ length: 8 }, hex).join(':');
}

/**
 * @func randMAC
 * @return {string} 随机MAC地址字符串
 * @desc   生成随机MAC地址，首字节最低位为0（非多播）
 * @example randMAC() // "3a:5f:1c:7e:9b:d0"
 */
export function randMAC() {
  const hexByte = () => Math.floor(Math.random() * 256);
  const bytes = [];
  for (let i = 0; i < 6; i++) {
    bytes.push(hexByte());
  }
  // 确保首字节最低位为0，表示单播地址
  bytes[0] = bytes[0] & 0xfe;
  return bytes.map(b => b.toString(16).padStart(2, '0')).join(':');
}
