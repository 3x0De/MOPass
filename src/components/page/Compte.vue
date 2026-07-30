<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { RouterLink } from "vue-router";

import noneIcon from "@/assets/icons/none.svg";
import freenetIcon from "@/assets/icons/freenet.png";
import torIcon from "@/assets/icons/tor.png";
import lokinetIcon from "@/assets/icons/lokinet.jpg";
import i2pIcon from "@/assets/icons/I2P.jpg";

interface Compte {
  domain: string;
  name?: string;
}

interface Props {
  url: number;
  compte: Compte;
}

const props = defineProps<Props>();

const currentFavicon = ref<string>(noneIcon);

watch(
  () => props.compte.domain,
  () => {
    const rawUrl = props.compte.domain?.trim() || "";

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
  const rawUrl = props.compte.domain?.trim() || "";

  try {
    const parsedUrl = new URL(
      rawUrl.startsWith("http") ? rawUrl : `https://${rawUrl}`,
    );
    const hostname = parsedUrl.hostname.replace(/^www\./, "");
    const name = hostname.split(".")[0];
    return name
      ? name.charAt(0).toUpperCase() + name.slice(1)
      : props.compte.domain;
  } catch {
    return props.compte.domain;
  }
});
</script>

<template>
  <li>
    <RouterLink :to="'/' + url">
      <img
        :src="currentFavicon"
        @error="onError"
        alt="Favicon"
        width="16"
        height="16"
      />
      <h2>{{ Name }}</h2>
      <p>{{ compte.name ?? "‎ " }}</p>
    </RouterLink>
  </li>
</template>

<style scoped lang="scss">
li {
  list-style-type: none;
  margin: 10px;

  a {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    gap: 0;
    text-decoration: none;

    img {
      position: absolute;
      transform: translate(-150%, 50%);
    }

    h2 {
      font-size: 1.25rem;
      margin: 0;
      width: max-content;
    }

    p {
      margin: 0;
      font-size: 1rem;
    }
  }
}
</style>
