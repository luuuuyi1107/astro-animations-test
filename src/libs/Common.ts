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