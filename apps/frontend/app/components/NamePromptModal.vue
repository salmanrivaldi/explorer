<script setup lang="ts">
import { computed, reactive, watch } from 'vue';
import * as v from 'valibot';
import type { FormSubmitEvent } from '@nuxt/ui';
import { UModal, UForm, UFormField, UInput, UButton } from '#components';

const props = defineProps<{
  modelValue: boolean;
  title: string;
  initialValue?: string;
  label?: string;
  placeholder?: string;
  confirmText?: string;
  cancelText?: string;
  minLength?: number;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', v: boolean): void;
  (e: 'submit', name: string): void;
}>();

const isOpen = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
});

const minLen = props.minLength ?? 2;
const schema = v.object({
  name: v.pipe(v.string(), v.trim(), v.minLength(minLen, `Must be at least ${minLen} characters`), v.regex(/^[^\\/?:*"<>|]+$/, 'Invalid characters for a folder/file name')),
});
type Schema = v.InferOutput<typeof schema>;

const state = reactive<Schema>({
  name: props.initialValue?.trim() || '',
});

/**
 * Reset nilai input:
 * - Saat modal dibuka
 * - Saat initialValue berubah (mis. user klik rename item lain ketika modal sudah terbuka)
 */
watch(
  () => [props.modelValue, props.initialValue],
  ([open]) => {
    if (open) {
      state.name = (props.initialValue ?? '').trim();
    }
  },
  { immediate: true },
);

function onSubmit(ev: FormSubmitEvent<Schema>) {
  emit('submit', ev.data.name);
  isOpen.value = false;
}

// id unik untuk mengaitkan tombol submit footer -> form
const formId = 'name-modal-form';
</script>

<template>
  <UModal
    v-model:open="isOpen"
    :title="props.title"
    :ui="{ content: 'sm:max-w-md w-full', footer: 'justify-end' }"
  >
    <template #body>
      <UForm
        :id="formId"
        :schema="schema"
        :state="state"
        class="space-y-4"
        @submit="onSubmit"
      >
        <UFormField
          :label="props.label ?? 'Name'"
          name="name"
        >
          <UInput
            v-model="state.name"
            class="w-full"
            :placeholder="props.placeholder ?? 'Type name...'"
            autofocus
          />
        </UFormField>
      </UForm>
    </template>

    <template #footer>
      <UButton
        color="neutral"
        variant="outline"
        @click="isOpen = false"
      >
        {{ props.cancelText ?? 'Cancel' }}
      </UButton>
      <UButton
        color="info"
        class="ml-2"
        type="submit"
        :form="formId"
      >
        {{ props.confirmText ?? 'Save' }}
      </UButton>
    </template>
  </UModal>
</template>
