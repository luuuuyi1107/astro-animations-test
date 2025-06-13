import BaseApi from "./Request/Base/index"


const apiGroup = {
  base: new BaseApi(),
  
}
type iAPIs = typeof apiGroup
export const useApi = <T extends keyof iAPIs>(groupKey: T): iAPIs[T] => {
  return apiGroup[groupKey]
}

export const buildApiPath = (uri: string) => new URL(import.meta.env.PUBLIC_API_HOST, uri).href
