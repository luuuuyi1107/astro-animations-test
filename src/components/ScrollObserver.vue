<template>
  <div>
    <slot />
    <div ref="lastElementRef" :style="{ height: '1px' }" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, nextTick } from 'vue';
  const lastElementRef = ref<HTMLElement | null>(null)
  let observer: IntersectionObserver | null = null

  // 创建观察器
  const createObserver = () => {
    observer = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting) {
        console.log(entries[0]);
        emit('onBottom');
      }
      // console.log('IntersectionObserver triggered:', entries);
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
