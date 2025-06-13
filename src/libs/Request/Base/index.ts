import config from "./config.json"
import iBaseRequest from "../BaseRequest"
import { GetPushKeysEnum } from "../../constants";


export default class BaseRequest extends iBaseRequest<typeof config> {
  protected config = config

  async getPush(data?: Partial<{ keys: GetPushKeysEnum[] }>): Promise<iResponse<iGetPush>> {
    const res: iResponse<iGetPush> = await this.request("get_push", data)
    return res
  }
}
