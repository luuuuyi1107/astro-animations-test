import { colorMap, colorEnum } from './constants';
export function parseJsonDate(jsonDate: string | undefined): Date {
  if (!jsonDate) return new Date();
  // 提取毫秒数
  const milliseconds = parseInt(jsonDate.replace(/\/Date\((-?\d+)\)\//, '$1'), 10);
  // 创建 Date 对象
  return new Date(milliseconds);
}

// 安全地获取 sessionStorage 数据
export const getSessionStorageData = (key: string) => {
  if (typeof window !== 'undefined' && window.sessionStorage) {
    const data = window.sessionStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }
  return null;
}

// 安全地设置 sessionStorage 数据
export const setSessionStorageData = (key: string, value: any) => {
  if (typeof window !== 'undefined' && window.sessionStorage) {
    window.sessionStorage.setItem(key, JSON.stringify(value));
  }
}

// 生成随机数字
export function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

  // 根据数字获取颜色
export function getColorByNumber(num: number): string {
  let color = colorEnum.red
  Object.entries(colorMap).some(([_color, numbers]) => {
    if (numbers.includes(num)) {
      color = _color as string; // 确保 color 是 string 类型
      return true; // 找到匹配的颜色，退出循环
    }
    return false; // 继续查找
  })

  return color
}

/**
 * 将日期格式化为相对时间字串或指定格式
 * @param date 日期字串、时间戳或 Date 物件
 * @param format 可选的日期格式，预设为相对时间
 * @returns 格式化后的时间字串
 */
export function formatDate(date: Date | string | number, format?: string): string {
  const targetDate = typeof date === 'string' && date.startsWith('/Date(') && date.endsWith(')/')
    ? parseJsonDate(date)
    : new Date(date);
  // 如果有指定格式，进行格式化
  if (format) {
    const year = targetDate.getFullYear();
    const month = String(targetDate.getMonth() + 1).padStart(2, '0');
    const day = String(targetDate.getDate()).padStart(2, '0');
    const hours = String(targetDate.getHours()).padStart(2, '0');
    const minutes = String(targetDate.getMinutes()).padStart(2, '0');
    const seconds = String(targetDate.getSeconds()).padStart(2, '0');

    return format
      .replace('YYYY', year.toString())
      .replace('MM', month)
      .replace('DD', day)
      .replace('HH', hours)
      .replace('mm', minutes)
      .replace('ss', seconds);
  }

  // 否则返回相对时间
  const now = new Date();
  const diff = now.getTime() - targetDate.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 30) return '刚刚';
  if (seconds < 60) return `${seconds}秒前`;
  if (minutes < 60) return `${minutes}分钟前`;
  if (hours < 24) return `${hours}小时前`;
  if (days < 30) return `${days}天前`;
  if (days < 365) return `${Math.floor(days / 30)}个月前`;
  return `${Math.floor(days / 365)}年前`;
}