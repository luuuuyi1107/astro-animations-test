/**
 * API 响应的标准接口
 * @template T 响应数据的类型
 */
interface iResponse<T = any> {
  Code: number // 响应状态码，0 表示成功，其他值表示错误
  Message?: string
  Data?: T // 响应数据，类型为 T
}

/**
 * API Promise 类型，表示一个返回 ApiResponse<T> 的 Promise
 * @template T 响应数据的类型
 */
type ApiPromise<T = any> = Promise<iResponse<T>>

type iOption = {
  errorHandler: (res: iResponse<any>) => void
}

type iOpenLottery = {
  LastKai: Partial<{
    DxDs: string
    GameID: string
    HashCode: string
    JqYs: string
    KaiText: string
    KaiTime: string
    Sm: number
    TmBs: string
    TmSx: string
    TmWx: string
    Zodiac: string
  }>
  NewKai: Partial<{
    EndTime: string
    GameID: string
    KaiTime: string
  }>
}

type iConfig = {
  method: string
  uri: string
}

type iAvatar = {
  ID: number
  FilePath: string | null
}

type iUserData = {
  AddTime: string | null
  Username: string | null
  ApplyTotal: number
  Avatar: iAvatar
  ID: number
  GiftTotal: number
  KuaiMoney: string
  Money: number
  RecTotal: number
  Token: string | null
  UpTime: string | null
}


type iGetPush = {
  UserData: iUserData
  MsgCount: {
    Notifys: number
    PopUpsMsg: string | null
  }
  HXAnimal?: {
    Status: boolean
    Text: string
  }
  ServerTime: string
  LotteryRate?:
    | {
        Rate: Record<string, number>
        Rebate: Record<string, number>
        Set: Record<string, boolean>
      }
    | Record<string, number>
  OpenLottery?: iOpenLottery
}