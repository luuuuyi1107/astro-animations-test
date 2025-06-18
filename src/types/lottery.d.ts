// 球的数据结构
type iBallData = {
  num: string
  text: string
  color: string
}

type iStoreState = {
  betAmount: string
  betTab: string
  betAmountList: Array<{ amount: number }>
  ServerTime: string
  OpenLottery: iOpenLottery | null
  UserData: iUserData | null
  LotteryState: keyof typeof lotteryStatusEnum | null
}