<script setup lang="ts">
import { computed, ref } from 'vue';
import NamePromptModal from '~/components/NamePromptModal.vue';

type SortUnion = 'asc' | 'desc';

const props = defineProps<{ viewMode: 'grid' | 'list'; sortOrder: SortUnion }>();
const emit = defineEmits<{
  (e: 'update:viewMode', v: 'grid' | 'list'): void;
  (e: 'update:sortOrder', v: SortUnion): void;
  (e: 'new-folder', name: string): void;
}>();

const orderItems: SortUnion[] = ['asc', 'desc'];
const sortModel = computed<SortUnion>({
  get: () => props.sortOrder,
  set: (v) => emit('update:sortOrder', v),
});

const showNew = ref(false);
const sortIcon = computed(() => (sortModel.value === 'asc' ? 'i-heroicons-arrow-up-20-solid' : 'i-heroicons-arrow-down-20-solid'));

function openNewFolder() {
  showNew.value = true;
}

function submitNew(name: string) {
  emit('new-folder', name);
}
</script>

<template>
  <div class="flex items-center gap-2">
    <UButton
      color="info"
      size="sm"
      @click="openNewFolder"
    >
      <UIcon
        name="i-heroicons-plus-20-solid"
        class="w-4 h-4 mr-1"
      />
      New Folder
    </UButton>

    <UButton
      :color="props.viewMode === 'grid' ? 'info' : 'neutral'"
      variant="soft"
      size="sm"
      @click="$emit('update:viewMode', 'grid')"
    >
      <UIcon
        name="i-heroicons-squares-2x2-20-solid"
        class="w-4 h-4"
      />
    </UButton>
    <UButton
      :color="props.viewMode === 'list' ? 'info' : 'neutral'"
      variant="soft"
      size="sm"
      @click="$emit('update:viewMode', 'list')"
    >
      <UIcon
        name="i-heroicons-list-bullet-20-solid"
        class="w-4 h-4"
      />
    </UButton>

    <div class="flex items-center gap-2 text-sm">
      <UIcon
        :name="sortIcon"
        class="w-4 h-4"
      />
      <span>Sort:</span>
    </div>
    <USelectMenu
      v-model="sortModel"
      :items="orderItems"
      class="min-w-[140px]"
      :popper="{ strategy: 'fixed', placement: 'bottom-end' }"
    />

    <!-- Modal: New Folder -->
    <NamePromptModal
      v-model="showNew"
      title="Create new folder"
      label="Folder name"
      placeholder="e.g. Documents"
      confirm-text="Create"
      @submit="submitNew"
    />
  </div>
</template>
