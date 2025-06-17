import { createPinia, setActivePinia, type Pinia } from 'pinia';

let pinia: Pinia | null = null;

/**
 * 初始化 Pinia 实例并设置为活动的 Pinia
 * @returns {Pinia} - 返回初始化的 Pinia 实例
 */
export function setupPinia(): Pinia {
  if (!pinia) {
    pinia = createPinia();
    setActivePinia(pinia);
  }
  return pinia;
}

/**
 * 获取已初始化的 Pinia 实例
 * 如果尚未初始化，则会调用 setupPinia 进行初始化
 * @returns {Pinia} - 返回 Pinia 实例
 */
export function getPinia(): Pinia {
  if (!pinia) {
    return setupPinia();
  }
  return pinia;
}