<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  url: string;
}>();

const favicon = computed(() => {
  try {
    const domain = new URL(props.url).hostname;

    if (domain.endsWith(".onion")) return "/logos/tor.png";
    if (domain.endsWith(".loki")) return "/logos/lokinet.jpg";
    if (domain.endsWith(".i2p")) return "/logos/I2P.jpg";

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
    <img :src="favicon" alt="Favicon" width="64" height="64" />
    <p>{{ Name }}</p>
  </div>
</template>
