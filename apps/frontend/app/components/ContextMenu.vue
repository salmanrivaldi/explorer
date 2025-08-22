<script setup lang="ts">
const props = defineProps<{
  show: boolean;
  x: number;
  y: number;
  minWidth?: number;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();
</script>

<template>
  <div
    v-if="show"
    class="fixed z-50 bg-white border border-gray-200 rounded shadow-lg py-1"
    :style="{ left: x + 'px', top: y + 'px', minWidth: (minWidth || 200) + 'px' }"
    @click.stop
  >
    <slot />
  </div>
</template>
