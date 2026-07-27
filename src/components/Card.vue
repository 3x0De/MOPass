<script setup lang="ts">
import { ref, computed, watch } from "vue";

const props = defineProps<{
  url: string;
}>();

const currentFavicon = ref<string>("/logos/none.svg");

watch(
  () => props.url,
  () => {
    const rawUrl = props.url?.trim() || "";

    if (!rawUrl) {
      currentFavicon.value = "/logos/none.svg";
      return;
    }

    if (
      rawUrl.startsWith("USK@") ||
      rawUrl.startsWith("KSK@") ||
      rawUrl.startsWith("SSK@") ||
      rawUrl.startsWith("CHK@")
    ) {
      currentFavicon.value = "/logos/freenet.png";
      return;
    }

    try {
      const parsedUrl = new URL(
        rawUrl.startsWith("http") ? rawUrl : `https://${rawUrl}`,
      );
      const domain = parsedUrl.hostname;

      if (domain.endsWith(".onion")) {
        currentFavicon.value = "/logos/tor.png";
        return;
      }
      if (domain.endsWith(".loki")) {
        currentFavicon.value = "/logos/lokinet.jpg";
        return;
      }
      if (domain.endsWith(".i2p")) {
        currentFavicon.value = "/logos/I2P.jpg";
        return;
      }

      const targetFavicon = `${parsedUrl.origin}/favicon.ico`;

      const img = new Image();
      img.src = targetFavicon;

      img.onload = () => (currentFavicon.value = targetFavicon);

      img.onerror = () => (currentFavicon.value = "/logos/none.svg");
    } catch {
      currentFavicon.value = "/logos/none.svg";
    }
  },
  { immediate: true },
);

function onError() {
  currentFavicon.value = "/logos/none.svg";
}

const Name = computed(() => {
  const rawUrl = props.url?.trim() || "";

  try {
    const parsedUrl = new URL(
      rawUrl.startsWith("http") ? rawUrl : `https://${rawUrl}`,
    );
    const hostname = parsedUrl.hostname.replace(/^www\./, "");
    const name = hostname.split(".")[0];
    return name ? name.charAt(0).toUpperCase() + name.slice(1) : props.url;
  } catch {
    return props.url;
  }
});
</script>

<template>
  <div class="card">
    <img
      :src="currentFavicon"
      @error="onError"
      alt="Favicon"
      width="64"
      height="64"
    />
    <p>{{ Name }}</p>
  </div>
</template>
