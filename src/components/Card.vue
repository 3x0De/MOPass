<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  url: string;
}>();

const favicon = computed(() => {
  try {
    const domain = new URL(props.url).hostname;
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
  } catch {
    return "";
  }
});

const Name = computed(() => {
  try {
    const hostname = new URL(props.url).hostname.replace(/^www\./, "");
    const name = hostname.split(".")[0];
    return name.charAt(0).toUpperCase() + name.slice(1);
  } catch {
    return props.url;
  }
});
</script>

<template>
  <div class="card">
    <img :src="favicon" alt="Favicon" width="32" height="32" />
    <p>{{ Name }}</p>
  </div>
</template>
