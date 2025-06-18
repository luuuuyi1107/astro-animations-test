<template>
  <div class="empty-state">

    <div class="empty-text">
      <slot>暂无资料</slot>
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'EmptyState'
})
</script>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  color: #999;
}

.empty-icon {
  margin-bottom: 1rem;
}

.empty-text {
  font-size: 0.875rem;
}
</style>