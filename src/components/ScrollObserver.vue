<template>
  <div>
    <slot />
    <div v-if="!props.hasMore" class="text-center text-gray-300 text-xs pt-3 pb-6">{{ props.noMoreText }}</div>
    <div ref="lastElementRef" :style="{ height: '1px' }" />
  </div>
</template>

<script setup lang="ts">
  import { onMounted, onUnmounted, ref, nextTick } from 'vue';
  let observer: IntersectionObserver | null = null
  const lastElementRef = ref<HTMLElement | null>(null)
  const props = withDefaults(defineProps<{
    hasMore?: boolean,
    noMoreText?: string
  }>(), {
    hasMore: true,
    noMoreText: '别扯，到底了'
  })
  // 创建观察器
  const createObserver = () => {
    observer = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting && props.hasMore) {
        emit('onBottom');
      }
    })
  }


  // 开始观察
  const startObserving = async () => {
    await nextTick()
    if (lastElementRef.value && observer) {
      observer.observe(lastElementRef.value)
    }
  }

  onMounted(() => {
    createObserver()
    startObserving()
  })
  // onUnmounted(cleanup)
  onUnmounted(() => {
    if (observer && lastElementRef.value) {
      observer.unobserve(lastElementRef.value)
    }
    observer = null
  })

  const emit = defineEmits<{
    onBottom: [void]
  }>()

  
</script>
