<script setup lang="ts">
const props = defineProps<{
  items: Array<{ id: number; name: string }>;
}>();

const emit = defineEmits<{
  (e: 'navigate', item: any): void;
}>();
</script>

<template>
  <div class="flex items-center gap-1 text-sm text-gray-600">
    <template
      v-for="(crumb, idx) in props.items"
      :key="crumb.id"
    >
      <button
        class="hover:underline text-blue-600 text-lg font-semibold"
        @click="$emit('navigate', crumb)"
      >
        {{ crumb.name }}
      </button>
      <span v-if="idx < props.items.length - 1">/</span>
    </template>
  </div>
</template>
