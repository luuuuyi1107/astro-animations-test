<template>
  <div class="flex flex-col items-center justify-center p-8 text-gray-500">
    <div class="text-sm">
      <slot>暂无资料</slot>
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'EmptyState'
})
</script>
