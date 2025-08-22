<script setup lang="ts">
const props = defineProps<{
  canGoBack: boolean;
  viewMode: 'grid' | 'list';
  sortOrder: 'asc' | 'desc';
}>();

const emit = defineEmits<{
  (e: 'back'): void;
  (e: 'update:viewMode', v: 'grid' | 'list'): void;
  (e: 'update:sortOrder', v: 'asc' | 'desc'): void;
}>();
</script>

<template>
  <div class="flex items-center gap-2 mb-3">
    <!-- Back -->
    <UButton
      :disabled="!props.canGoBack"
      color="neutral"
      variant="soft"
      size="sm"
      class="cursor-pointer"
      aria-label="Back"
      @click="emit('back')"
    >
      <UIcon
        name="i-heroicons-arrow-left-20-solid"
        class="w-4 h-4"
      />
    </UButton>

    <!-- View: Grid -->
    <UButton
      :color="props.viewMode === 'grid' ? 'info' : 'neutral'"
      variant="soft"
      size="sm"
      class="cursor-pointer"
      aria-label="Grid view"
      @click="emit('update:viewMode', 'grid')"
    >
      <UIcon
        name="i-heroicons-squares-2x2-20-solid"
        class="w-4 h-4"
      />
    </UButton>

    <!-- View: List -->
    <UButton
      :color="props.viewMode === 'list' ? 'info' : 'neutral'"
      variant="soft"
      size="sm"
      class="cursor-pointer"
      aria-label="List view"
      @click="emit('update:viewMode', 'list')"
    >
      <UIcon
        name="i-heroicons-list-bullet-20-solid"
        class="w-4 h-4"
      />
    </UButton>

    <!-- Sort -->
    <div class="flex items-center gap-2 text-sm ml-2">
      <UIcon
        :name="props.sortOrder === 'asc' ? 'i-heroicons-arrow-up-20-solid' : 'i-heroicons-arrow-down-20-solid'"
        class="w-4 h-4"
      />
      <span>Sort:</span>
    </div>
    <USelectMenu
      v-model="(props.sortOrder as any)"
      :items="['asc', 'desc']"
      :search-input="false"
      class="min-w-[140px] cursor-pointer"
      :popper="{ strategy: 'fixed', placement: 'bottom-start' }"
      @update:model-value="(v:any)=> emit('update:sortOrder', v)"
    />
  </div>
</template>
