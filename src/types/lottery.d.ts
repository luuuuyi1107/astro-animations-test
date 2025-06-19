// 球的数据结构
type iBallData = {
  num: string
  text: string
  color?: string
}

type iStoreState = {
  betAmount: string
  betTab: string
  totalBets: number
  clearBet: boolean
  betAmountList: Array<{ amount: number }>
  ServerTime: string
  OpenLottery: iOpenLottery | null
  UserData: iUserData | null
  LotteryState: keyof typeof lotteryStatusEnum | null
  LotteryRate: iLotteryRate | null
  currentGame: iGameDataTransObject
}

type iGameConfig = {
  title?: string,
  list?: {
    name?: string,
    router?: (string | {
            id: number;
        })[],
    lx?: number,
    type?: string,
    enabled?: boolean,
  }[],
}

type iGameData = {
  id: number,
  title: string,
  config: iGameConfig[],
  showSpecial: boolean,
  showText: boolean,
}

type iGameDataTransObject = iGameData &{
  name: string,
  filter: iFilterData[] | null
}

interface iPaginationData {
  PageIndex: number
  PageSize: number
  PageCount?: number
}

interface iList<U> {
  list?: U[]
  List?: U[]
}

interface ProcessedLotteryRecord extends iLotteryRecordData {
  balls: iBallData[]
}

type iFilterData = Record<'type'|'name', string>

type iTabData = Record<'key'|'name', string>