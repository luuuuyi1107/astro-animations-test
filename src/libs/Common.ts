export function parseJsonDate(jsonDate: string | undefined): Date {
  if (!jsonDate) return new Date();
  // 提取毫秒数
  const milliseconds = parseInt(jsonDate.replace(/\/Date\((-?\d+)\)\//, '$1'), 10);
  // 创建 Date 对象
  return new Date(milliseconds);
}