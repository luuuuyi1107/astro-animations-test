import config from "./config.json"
import iBaseRequest from "../BaseRequest"
import { GetPushKeysEnum } from "../../constants";


export default class BaseRequest extends iBaseRequest<typeof config> {
  protected config = config

  async getPush(data?: Partial<{ keys: GetPushKeysEnum[], lotteryid: number }>): ApiPromise<iGetPush> {
    return this.request("get_push", data)
  }
}
