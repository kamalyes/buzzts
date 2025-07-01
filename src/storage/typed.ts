/**
 * @enum StorageType
 * @description localStorage 和 sessionStorage 的存储类型枚举
 */
export enum StorageType {
  /** 使用 localStorage */
  Local = 'localStorage',

  /** 使用 sessionStorage */
  Session = 'sessionStorage',
}

/**
 * @interface StorageOptions
 * @description localStorage 和 sessionStorage 的可选参数类型，当前无参数，预留扩展。
 */
export interface StorageOptions {}

/**
 * @interface CookieOptions
 * @description Cookie 操作的可选参数
 */
export interface CookieOptions {
  /** 过期时间，单位为天，支持小数 */
  expires?: number;

  /** 路径，默认 '/' */
  path?: string;

  /** 域名 */
  domain?: string;

  /** 是否仅通过 HTTPS 传输 */
  secure?: boolean;
}
