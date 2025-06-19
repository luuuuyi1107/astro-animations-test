<template>
  <div 
    ref="el" 
    :class="{ 
      [props.class]: true,
      [props.bgClass]: true, 
      [isOverflow ? 'justify-start' : 'justify-center']: true 
    }"
  >
    <div
      v-for="tab in props.tabs"
      class="active flex-shrink-0"
      :class="{ 
        [props.tabClass]: true, 
        [props.activeClass]: model === tab.key 
      }"
      @click="onClick(tab.key as string | number)"
    >
      <div class="tab-name">{{ tab.name }}</div>
    </div>
    
    <template v-for="tab in props.tabs">
      <slot 
        v-if="model === tab.key"
        :name="tab.key"
        :tab="tab"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue"

const props = withDefaults(defineProps<{
  bgClass?: string
  tabClass?: string
  activeClass?: string
  class?: string
  tabs: Record<string, string | number>[]
  shouldToggle?: boolean
}>(), {
  bgClass: "bg-white",
  tabClass: "flex-1 text-center cursor-pointer text-xs border-l border-gray-300 first:border-l-0 leading-none",
  activeClass: "text-theme font-[600]",
  shouldToggle: true,
  class: "flex text-sm overflow-auto pt-3 pb-1",
})

const emit = defineEmits<{
  change: [key: string | number]
}>()
const model = defineModel()
const el = ref<HTMLElement>()
const onClick = (key: string | number) => {
  if (!props.shouldToggle && model.value === key) return

  const _key = model.value === key ? "" : key
  model.value = _key
  emit("change", _key)
}
const isOverflow = computed(() => {
  return el.value && el.value.scrollWidth > el.value.clientWidth
})
onMounted(() => {
  if (!isOverflow || !el.value) return
  const $active = el.value.querySelector(".active") as HTMLElement
  if ($active.offsetLeft + $active.clientWidth > el.value.clientWidth) {
    Promise.resolve().then(() => (el.value!.scrollLeft = $active.offsetLeft))
  }
})
</script>
