<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    label?: string;
    accept?: string;
    multiple?: boolean;
    busy?: boolean;
  }>(),
  {
    label: 'Upload',
    accept: '*/*',
    multiple: true,
    busy: false,
  },
);

const emit = defineEmits<{ (e: 'selected', files: File[]): void }>();

const fileInput = ref<HTMLInputElement | null>(null);

function openPicker() {
  if (props.busy) return;
  fileInput.value?.click();
}

function onChange(e: Event) {
  const t = e.target as HTMLInputElement;
  const files = Array.from(t.files ?? []);
  if (files.length) emit('selected', files);
  t.value = '';
}
</script>

<template>
  <div class="inline-flex items-center">
    <UButton
      :disabled="busy"
      color="info"
      variant="outline"
      size="sm"
      class="cursor-pointer"
      @click="openPicker"
    >
      <UIcon
        name="i-heroicons-arrow-up-tray-20-solid"
        class="w-4 h-4 mr-1"
      />
      {{ label }}
    </UButton>
    <input
      ref="fileInput"
      type="file"
      class="hidden"
      :accept="accept"
      :multiple="multiple"
      @change="onChange"
    />
  </div>
</template>
