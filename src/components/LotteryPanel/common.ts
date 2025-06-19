import { lotteryStatusEnum, ZodiacnimalMap } from '@/libs/constants'
import { setupPinia } from '@/libs/pinia-setup'
import { useLotteryStore } from '@/store/lottery'
import { ref, computed, type Ref } from 'vue'
import { getSessionStorageData, setSessionStorageData } from "@/libs/Common";
type StateChangeCallback = (state: lotteryStatusEnum) => void
type LotteryDataChangeCallback = (data: iOpenLottery) => void
let initialPiniaSetup = false
export const useLotteryData = (cachedData?: iGetPush) => {
  if (!initialPiniaSetup) {
    initialPiniaSetup = true
    setupPinia()
  }

  const previousLotteryState = ref(lotteryStatusEnum.COUNTING)
  const previousGameID = ref("")
  const store = useLotteryStore()
  if (cachedData) store.setGetPush(cachedData)
  // 储存回调函数
  const stateChangeCallbacks: StateChangeCallback[] = []
  const lotteryDataChangeCallbacks: LotteryDataChangeCallback[] = []

  store.$subscribe(() => {
    if (store.OpenLottery?.NewKai?.GameID !== previousGameID.value) {
      previousGameID.value = store.OpenLottery?.NewKai.GameID || ""
      lotteryDataChangeCallbacks.forEach(callback => {
        callback(store.OpenLottery as iOpenLottery)
      })
    }

    if (previousLotteryState.value !== store.LotteryState) {
      previousLotteryState.value = store.LotteryState as lotteryStatusEnum
      // 触发所有回调函数
      stateChangeCallbacks.forEach(callback => {
        callback(store.LotteryState as lotteryStatusEnum)
      })
    }
  })

  // 注册状态变化回调
  const onStateChange = (callback: StateChangeCallback): (() => void) => {
    stateChangeCallbacks.push(callback)
    
    // 返回取消注册的函数
    return () => {
      const index = stateChangeCallbacks.indexOf(callback)
      if (index > -1) {
        stateChangeCallbacks.splice(index, 1)
      }
    }
  }

  const onLotteryDataChange = (callback: LotteryDataChangeCallback): (() => void) => {
    lotteryDataChangeCallbacks.push(callback)
    return () => {
      const index = lotteryDataChangeCallbacks.indexOf(callback)
      if (index > -1) {
        lotteryDataChangeCallbacks.splice(index, 1) 
      }
    }
  }

  return { store, onStateChange, onLotteryDataChange }
}





const defaultPagination: iPaginationData = {
  PageIndex: 1,
  PageSize: 10,
  PageCount: 0
}

export function usePagination<U, T extends U[], V>(
  fetchFn: (pagination: iPaginationData) => ApiPromise<T>,
  pagination: Partial<iPaginationData> = { PageIndex: 1, PageSize: 10 },
  option: { shouldAppend?: boolean, cacheKey?: string, mapData?: (data: U) => V } = { shouldAppend: false }
) {
  const { shouldAppend = false } = option
  
  // 响应式数据
  let cahcedData = option.cacheKey
    ? getSessionStorageData(option.cacheKey) as {datas: T, paginate: iPaginationData, hasMore: boolean, timestamp: number}
    : null;
  if (cahcedData && (cahcedData.timestamp && Date.now() - cahcedData.timestamp > 1000 * 60 * 60) || cahcedData?.datas.length === 0) {
    cahcedData = null; // 如果缓存过期或数据为空，则清除缓存
  }
  const datas = ref<T | undefined>(cahcedData?.datas ? cahcedData.datas : [] as unknown as T)
  const computedDatas = computed<V[]>(() => {
    if (option.mapData) {
      return (datas.value || []).map((item: U) => option.mapData!(item) as V)
    }
    return []
  })
  const paginate: Ref<iPaginationData> = ref({
    ...defaultPagination,
    ...pagination,
    ...cahcedData?.paginate
  })
  const hasMore = ref(cahcedData?.hasMore ?? true)
  const loadRef = ref(false)

  const refresh = async (
    pageIndex?: number,
    PageSize: number = paginate.value.PageSize || 10,
  ) => {
    const PageIndex = pageIndex || 1
    hasMore.value = true
    loadRef.value = true
    
    try {
      const res = await fetchFn({ ...paginate.value, PageIndex, PageSize })
      if (res.Code !== 1) return Promise.reject(res.Message || '请求失败')
      hasMore.value = (res.Data?.length || 0) >= PageSize
      datas.value = res.Data
      // 更新分页信息
      paginate.value = {
        ...paginate.value,
        PageIndex,
        PageSize
      }
      setCacheData()
      return res
    } finally {
      loadRef.value = false
    }
  }

  const renew = async () => {
    hasMore.value = true
    loadRef.value = true
    
    try {
      const res = await fetchFn({
        PageIndex: 1,
        PageSize: paginate.value.PageSize * paginate.value.PageIndex,
      })
      if (res.Code !== 1) return Promise.reject(res.Message || '请求失败')
      paginate.value = { ...paginate.value, PageIndex: 1 }
      datas.value = res.Data
      hasMore.value = (res.Data?.length || 0) >= paginate.value.PageSize
      setCacheData()
    } finally {
      loadRef.value = false
    }
  }

  const appendNextPage = async (newPage: number = -1) => {
    if (!hasMore.value) return

    try {
      loadRef.value = true
      const nextPageIndex = newPage > 0 ? newPage : paginate.value.PageIndex + 1
      const res = await fetchFn({
        ...paginate.value,
        PageIndex: nextPageIndex,
      })
      if (res.Code !== 1) return Promise.reject(res.Message || '请求失败')
      const resList = res.Data || []

      if (shouldAppend && resList.length < paginate.value.PageSize) {
        hasMore.value = false
      }

      if (shouldAppend && resList.length) {
        const currentData = datas.value || ([] as unknown as T)
        datas.value = [...currentData, ...resList] as T
      } else {
        datas.value = res.Data
      }
      paginate.value = {
        ...paginate.value,
        PageIndex: nextPageIndex,
      }
      setCacheData()
    } finally {
      loadRef.value = false
    }
  }

  const hasNewChecker = async (uniqueKey: keyof U): Promise<boolean> => {
    try {
      const res = await fetchFn({ PageIndex: 1, PageSize: 1 })
      if (res.Code !== 1 || !res.Data || !datas.value) return false
      const resList = res.Data
      return !!(
        resList[0] &&
        datas.value[0] &&
        datas.value[0][uniqueKey] !== resList[0][uniqueKey]
      )
    } catch {
      return false
    }
  }

  const setCacheData = () => {
    if (option.cacheKey) {
      setSessionStorageData(option.cacheKey, {
        datas: datas.value,
        paginate: paginate.value,
        hasMore: hasMore.value,
        timestamp: Date.now(),
      })
    }
  }

  const setDatas = (newDatas: T | undefined) => {
    datas.value = newDatas
  }

  const setPaginate = (newPaginate: iPaginationData) => {
    paginate.value = newPaginate
  }

  return {
    datas,
    paginate,
    hasMore,
    loadRef,
    computedDatas,
    setDatas,
    setPaginate,
    refresh,
    appendNextPage,
    hasNewChecker,
    renew,
  }
}


export const applyRecordData = (showSpecialBall: boolean, record: iLotteryRecordData): ProcessedLotteryRecord => {
  const ballNum = record.OpenCode.split(',').map(num => +num);
  if (ballNum.length === 0) {
    return { ...record, balls: [] };
  }
  const convertBallData = (num: number) => ({
    num: num.toString(),
    text: ZodiacnimalMap[num % 12] || num.toString(),
  });

  const balls = ballNum.slice(0, showSpecialBall ? -1 : ballNum.length).map(convertBallData);
  return {
    ...record,
    balls
  }
}
