export enum GetPushKeysEnum {
  LOTTERY_RATE = "lotteryrate",
  HXANIMAL = "hxanimal",
}

export const ZodiacnimalMap: Record<number, string> = {
  2: "兔",
  4: "牛",
  7: "狗",
  6: "猪",
  9: "猴",
  10: "羊",
  3: "虎",
  0: "蛇",
  11: "马",
  8: "鸡",
  5: "鼠",
  1: "龙",
}

export const colorEnum = {
  red: "red",
  blue: "blue",
  green: "green",
}

export const colorMap: Record<keyof typeof colorEnum, number[]> = {
  red: [1, 2, 7, 8, 12, 13, 18, 19, 23, 24, 29, 30, 34, 35, 40, 45, 46],
  blue: [3, 4, 9, 10, 14, 15, 20, 25, 26, 31, 36, 37, 41, 42, 47, 48],
  green: [5, 6, 11, 16, 17, 21, 22, 27, 28, 32, 33, 38, 39, 43, 44, 49]
}

export enum lotteryStatusEnum {
  COUNTING,
  END,
  OPENING,
}