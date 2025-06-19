export enum GetPushKeysEnum {
  LOTTERY_RATE = "lotteryrate",
  HXANIMAL = "hxanimal",
  SIXSET = "sixset",
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

export enum BallType {
  NB = 'recordNumber',
  DX = 'recordDX',
  DS = 'recordDS',
  XT = 'recordXT'
}

export const filters: Record<string, iFilterData[]> = {
  ssc: [
    { type: BallType.NB, name: "号码" },
    { type: BallType.DX, name: "大小" },
    { type: BallType.DS, name: "单双" },
    { type: BallType.XT, name: "形态" },
  ],
  pks: [
    { type: BallType.NB, name: "号码" },
    { type: BallType.DX, name: "大小" },
    { type: BallType.DS, name: "单双" },
    { type: BallType.XT, name: "冠军/龙虎" },
  ],
  pcdd: [
    { type: BallType.NB, name: "号码" },
    { type: BallType.XT, name: "总和/形态" },
  ],
  lhc: [
    { type: BallType.NB, name: "号码" },
    { type: "recordTM", name: "特码属性" },
  ],
  syxw: [
    { type: BallType.NB, name: "号码" },
    { type: BallType.DX, name: "大小" },
    { type: BallType.DS, name: "单双" },
    { type: BallType.XT, name: "总和" },
  ],
  klsf: [
    { type: BallType.NB, name: "号码" },
    { type: BallType.DX, name: "大小" },
    { type: BallType.DS, name: "单双" },
    { type: BallType.XT, name: "形态" },
  ],
  klb: [{ type: BallType.NB, name: "号码" }],
  ks: [{ type: BallType.NB, name: "号码" }],
  qxc: [
    { type: BallType.NB, name: "号码" },
    { type: BallType.DX, name: "大小" },
    { type: BallType.DS, name: "单双" },
  ],
  fc3: [
    { type: BallType.NB, name: "号码" },
    { type: BallType.DX, name: "大小" },
    { type: BallType.DS, name: "单双" },
  ],
  baccarat: [{ type: BallType.NB, name: "号码" }],
}


