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