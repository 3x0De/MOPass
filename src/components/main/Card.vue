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
      currentFavicon.value = "/icons/none.svg";
      return;
    }

    if (
      rawUrl.startsWith("USK@") ||
      rawUrl.startsWith("KSK@") ||
      rawUrl.startsWith("SSK@") ||
      rawUrl.startsWith("CHK@")
    ) {
      currentFavicon.value = "/icons/freenet.png";
      return;
    }

    try {
      const parsedUrl = new URL(
        rawUrl.startsWith("http") ? rawUrl : `https://${rawUrl}`,
      );
      const domain = parsedUrl.hostname;

      if (domain.endsWith(".onion")) {
        currentFavicon.value = "/icons/tor.png";
        return;
      }
      if (domain.endsWith(".loki")) {
        currentFavicon.value = "/icons/lokinet.jpg";
        return;
      }
      if (domain.endsWith(".i2p")) {
        currentFavicon.value = "/icons/I2P.jpg";
        return;
      }

      const targetFavicon = `${parsedUrl.origin}/favicon.ico`;

      const img = new Image();
      img.src = targetFavicon;

      img.onload = () => (currentFavicon.value = targetFavicon);

      img.onerror = () => (currentFavicon.value = "/icons/none.svg");
    } catch {
      currentFavicon.value = "/icons/none.svg";
    }
  },
  { immediate: true },
);

function onError() {
  currentFavicon.value = "/icons/none.svg";
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

<style scoped lang="scss">
@use "../../variables" as v;

.card {
  width: 75px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  border-radius: 5px;
  transition: 0.3s all;
  cursor: pointer;

  p {
    text-wrap: nowrap;
    align-self: flex-start;
    width: 100%;
    -webkit-mask-image: linear-gradient(90deg, black 75%, transparent 100%);
    mask-image: linear-gradient(90deg, black 75%, transparent 100%);
  }

  &:hover {
    background-color: v.$whiteSpirit;
  }
}
</style>
