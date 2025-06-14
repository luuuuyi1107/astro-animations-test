import axios, { AxiosError, type AxiosResponse } from "axios"




export default class BaseRequest<T extends Record<string, iConfig>> {
  protected config: T = {} as T

  protected get baseUrls() {
    return [import.meta.env.PUBLIC_API_HOST]
  }

  private readonly SuccessCode = 1

  protected async request(actionKey: keyof T, data: any = {}, option: Partial<iOption> = {}): Promise<any> {
    // const search = new URLSearchParams(window.location.href.split("?")[1])

    const token = ""

    const config: iConfig = this.config[actionKey]

    const processedData = Object.fromEntries(
    Object.entries(data).map(([key, value]) => {
      // 处理字符串
      if (typeof value === 'string') {
        return [key, decodeURIComponent(encodeURIComponent(value))];
      }
      // 处理数组 - 确保数组被正确序列化
      if (Array.isArray(value)) {
        // 对于简单数组，可以使用 key[] 格式
        // 或者针对特定的参数进行特殊处理
        if (key === 'keys') {
          // 如果后端期望的是逗号分隔的字符串
          return [key, value.join(',')];
          
          // 或者如果后端期望的是 keys[]=value1&keys[]=value2 格式
          // 在这种情况下应该在 axios 配置中设置 paramsSerializer
        }
      }
      return [key, value];
    })
  );

    return axios({
      baseURL: this.baseUrls.join("/"),
      method: config.method,
      url: config.uri,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      ...{
        [config.method.toUpperCase() === "GET" ? "params" : "data"]: {
          Authorization: token,
          ...processedData
          // ..._.mapValues(data, (value) => decodeURIComponent(encodeURIComponent(value))),
        },
      },
    })
      .then((res: AxiosResponse) => this.resultHandle(res.data, option))
      .catch((e: AxiosError<iResponse<any>>) => this.exceptionHandle(e))
  }

  private resultHandle(res: iResponse<any>, { errorHandler }: Partial<iOption>) {
    if (res.Code === this.SuccessCode) {
      return res
    } else {
      if (errorHandler) {
        errorHandler(res)
      }
      throw res
    }
  }

  private exceptionHandle(e: AxiosError<iResponse<any>>) {
    if (!e.status) {
      // from resultHandle
      throw e
    }
    let throwE
    switch (e.status) {
      case 400:
        throwE = { res: e.response, message: e.response?.data.Message ?? e.message }
        break
      case 404:
        throwE = { ...e, message: "page not found" }
        break
      case 500:
        throwE = { ...e, message: "api crashed" }
        break
      default:
        throwE = { ...e, message: "system error!! please try again later" }
    }
    throw throwE
  }
}
