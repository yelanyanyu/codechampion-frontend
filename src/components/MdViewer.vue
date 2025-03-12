<template>
  <Viewer :value="value" :plugins="plugins" readonly />
</template>

<script setup lang="ts">
import gfm from "@bytemd/plugin-gfm";
import highlight from "@bytemd/plugin-highlight";
import { Viewer } from "@bytemd/vue-next";
import { defineProps, withDefaults } from "vue";

interface Props {
  value: string;
}

const props = withDefaults(defineProps<Props>(), {
  value: () => "",
});
const plugins = [
  gfm(),
  highlight(),
  // Add more plugins here
];
</script>

<style scoped>
:deep(.markdown-body) {
  padding: 20px;
  max-height: calc(100vh - 250px);
  overflow-y: auto;
}

/* 自定义滚动条样式 */
:deep(.markdown-body::-webkit-scrollbar) {
  width: 6px;
  height: 6px;
}

:deep(.markdown-body::-webkit-scrollbar-thumb) {
  background: var(--color-text-4);
  border-radius: 3px;
}

:deep(.markdown-body::-webkit-scrollbar-track) {
  background: var(--color-fill-2);
  border-radius: 3px;
}
</style>
