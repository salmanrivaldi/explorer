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
    class="grid grid-cols-12 items-center p-3 border-b last:border-b-0 hover:bg-gray-50 cursor-pointer"
    @dblclick="$emit('open', props.item)"
    @contextmenu.stop.prevent="$emit('context', { item: props.item, evt: $event as MouseEvent })"
  >
    <div class="col-span-6 flex items-center gap-2 min-w-0">
      <FolderIcon
        v-if="isFolder(props.item)"
        class="w-5 h-5 text-yellow-600"
      />
      <img
        v-else-if="isImage(props.item)"
        :src="`${baseUrl}/${props.item.path}`"
        alt="preview"
        class="w-5 h-5 object-cover rounded"
      />
      <component
        v-else
        :is="iconFor(props.item)?.component"
        :class="['w-5 h-5', iconFor(props.item)?.colorClass]"
      />
      <span class="text-sm text-gray-800 truncate">{{ props.item.type === 'folder' ? props.item.name : props.item.original_name }}</span>
    </div>

    <div class="col-span-3 text-xs text-gray-500 capitalize truncate">{{ props.item.type }}</div>
    <div class="col-span-3 text-xs text-gray-500 truncate">
      <template v-if="props.item.size">{{ formatBytes(props.item.size) }}</template>
    </div>
  </div>
</template>
