<script setup lang="ts">
import { FolderIcon } from '@heroicons/vue/24/outline';
import { useRuntimeConfig } from '#imports';
import { isImage, isFolder, iconFor } from '~/utils/file-icons';
import formatBytes from '~/utils/file-size';

const props = defineProps<{ item: any }>();
const emit = defineEmits<{
  (e: 'open', item: any): void;
  (e: 'context', payload: { item: any; evt: MouseEvent }): void;
}>();

const cfg = useRuntimeConfig();
const baseUrl = `${String(cfg.public.apiBase).replace(/\/+$/, '')}/files`;
</script>

<template>
  <div
    class="flex items-center p-3 border border-gray-200 rounded-lg hover:shadow-md hover:border-gray-300 cursor-pointer transition-all bg-white"
    @dblclick="$emit('open', props.item)"
    @contextmenu.stop.prevent="$emit('context', { item: props.item, evt: $event as MouseEvent })"
  >
    <!-- Folder -->
    <FolderIcon
      v-if="isFolder(props.item)"
      class="w-6 h-6 text-yellow-600 mr-3 flex-shrink-0"
    />

    <!-- Image file -->
    <img
      v-else-if="isImage(props.item)"
      :src="`${baseUrl}/${props.item.path}`"
      alt="preview"
      class="w-6 h-6 object-cover rounded mr-3 flex-shrink-0"
    />

    <!-- Other file types -->
    <component
      v-else
      :is="iconFor(props.item)?.component"
      :class="['w-6 h-6 mr-3 flex-shrink-0', iconFor(props.item)?.colorClass]"
    />

    <div class="min-w-0 flex-1">
      <p class="text-sm font-medium text-gray-800 truncate">{{ props.item.type === 'folder' ? props.item.name : props.item.original_name }}</p>
      <p class="text-xs text-gray-500 capitalize">
        {{ props.item.type }}
        <template v-if="props.item.size"> • {{ formatBytes(props.item.size) }}</template>
      </p>
    </div>
  </div>
</template>
