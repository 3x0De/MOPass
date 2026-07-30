<script setup lang="ts">
import { ref, computed, watch } from "vue";

import noneIcon from "@/assets/icons/none.svg";
import freenetIcon from "@/assets/icons/freenet.png";
import torIcon from "@/assets/icons/tor.png";
import lokinetIcon from "@/assets/icons/lokinet.jpg";
import i2pIcon from "@/assets/icons/I2P.jpg";

const props = defineProps<{
  url: string;
}>();

const currentFavicon = ref<string>(noneIcon);

watch(
  () => props.url,
  () => {
    const rawUrl = props.url?.trim() || "";

    if (!rawUrl) {
      currentFavicon.value = noneIcon;
      return;
    }

    if (
      rawUrl.startsWith("USK@") ||
      rawUrl.startsWith("KSK@") ||
      rawUrl.startsWith("SSK@") ||
      rawUrl.startsWith("CHK@")
    ) {
      currentFavicon.value = freenetIcon;
      return;
    }

    try {
      const parsedUrl = new URL(
        rawUrl.startsWith("http") ? rawUrl : `https://${rawUrl}`,
      );
      const domain = parsedUrl.hostname;

      if (domain.endsWith(".onion")) {
        currentFavicon.value = torIcon;
        return;
      }
      if (domain.endsWith(".loki")) {
        currentFavicon.value = lokinetIcon;
        return;
      }
      if (domain.endsWith(".i2p")) {
        currentFavicon.value = i2pIcon;
        return;
      }

      currentFavicon.value = `${parsedUrl.origin}/favicon.ico`;
    } catch {
      currentFavicon.value = noneIcon;
    }
  },
  { immediate: true },
);

function onError() {
  currentFavicon.value = noneIcon;
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
