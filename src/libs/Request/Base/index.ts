import config from "./config.json"
import iBaseRequest from "../BaseRequest"
import { GetPushKeysEnum } from "../../constants";


export default class BaseRequest extends iBaseRequest<typeof config> {
  protected config = config

  async getPush(data?: Partial<{ keys: GetPushKeysEnum[], lotteryid: number }>): ApiPromise<iGetPush> {
    return this.request("get_push", data)
  }

  getLotterys(lotteryid: number = 21, pagination: iPaginationData = { PageIndex: 1, PageSize: 5 }): ApiPromise<iLotteryRecordData[]> {
    return this.request("get_lotterys", { lotteryid, date: 0, ...pagination })
  } 
}
