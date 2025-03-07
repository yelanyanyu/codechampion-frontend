<template>
  <Editor :value="value" :plugins="plugins" @change="handleChange" />
</template>

<script setup lang="ts">
import gfm from "@bytemd/plugin-gfm";
import highlight from "@bytemd/plugin-highlight";
import { Editor, Viewer } from "@bytemd/vue-next";
import { withDefaults, defineProps } from "vue";

const plugins = [
  gfm(),
  highlight(),
  // Add more plugins here
];

/**
 * @description Props interface for the MdEditor component
 * Defines the component's properties that can be passed from parent components
 */
interface Props {
  /**
   * The markdown content to be edited
   */
  value: string;

  /**
   * Callback function that is triggered when the markdown content changes
   * @param {string} value - The new markdown content
   */
  handleChange: (value: string) => void;
}

/**
 * Component props with default values
 * Initializes the component with empty content and a basic change handler
 */
const props = withDefaults(defineProps<Props>(), {
  value: "",
  handleChange: (v: string) => {
    console.log(v);
  },
});
</script>

<style scoped></style>
