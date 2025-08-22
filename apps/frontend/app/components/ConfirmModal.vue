<script setup lang="ts">
import { computed } from 'vue';
import { UModal, UButton } from '#components';

const props = defineProps<{
  modelValue: boolean;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  // warna tombol konfirmasi
  confirmColor?: 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error' | 'neutral';
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', v: boolean): void;
  (e: 'confirm'): void;
}>();

const open = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
});

function doCancel() {
  open.value = false;
}
function doConfirm() {
  emit('confirm');
  open.value = false;
}
</script>

<template>
  <UModal
    v-model:open="open"
    :title="props.title ?? 'Confirm'"
    :ui="{ content: 'sm:max-w-md w-full', footer: 'justify-end' }"
  >
    <template #body>
      <p class="text-sm text-gray-700">
        {{ props.message ?? 'Are you sure?' }}
      </p>
    </template>

    <template #footer>
      <UButton
        color="neutral"
        variant="outline"
        @click="doCancel"
      >
        {{ props.cancelText ?? 'Cancel' }}
      </UButton>
      <UButton
        class="ml-2"
        :color="props.confirmColor ?? 'error'"
        @click="doConfirm"
      >
        {{ props.confirmText ?? 'Delete' }}
      </UButton>
    </template>
  </UModal>
</template>
