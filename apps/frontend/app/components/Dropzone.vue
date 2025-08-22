<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    disabled?: boolean;
  }>(),
  { disabled: false },
);

const emit = defineEmits<{ (e: 'dropped', files: File[]): void }>();

const isOver = ref(false);

function onDragOver(e: DragEvent) {
  if (props.disabled) return;
  e.preventDefault();
  isOver.value = true;
}
function onDragLeave(e: DragEvent) {
  if (props.disabled) return;
  e.preventDefault();
  isOver.value = false;
}
function onDrop(e: DragEvent) {
  if (props.disabled) return;
  e.preventDefault();
  const files = Array.from(e.dataTransfer?.files ?? []);
  isOver.value = false;
  if (files.length) emit('dropped', files);
}
</script>

<template>
  <div
    :class="['relative h-full w-full', isOver ? 'ring-2 ring-blue-400/60 ring-offset-2' : '']"
    @dragover="onDragOver"
    @dragleave="onDragLeave"
    @drop="onDrop"
  >
    <slot :isOver="isOver" />
  </div>
</template>
