<script setup lang="ts">
import UploadButton from '~/components/UploadButton.vue';

const props = defineProps<{
  uploading: boolean;
  isRoot: boolean;
}>();

const emit = defineEmits<{
  (e: 'new-folder'): void;
  (e: 'upload-selected', files: File[]): void;
}>();

function onSelected(files: File[]) {
  emit('upload-selected', files);
}
</script>

<template>
  <div class="flex items-center gap-2">
    <UButton
      color="info"
      size="sm"
      class="cursor-pointer"
      @click="emit('new-folder')"
    >
      <UIcon
        name="i-heroicons-plus-20-solid"
        class="w-4 h-4 mr-1"
      />
      New Folder
    </UButton>

    <UTooltip :text="isRoot ? 'Tidak bisa upload di Root' : 'Upload files'">
      <div>
        <UploadButton
          :busy="uploading"
          label="Upload"
          :disabled="isRoot"
          @selected="onSelected"
        />
      </div>
    </UTooltip>
  </div>
</template>
