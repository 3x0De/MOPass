<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { RouterLink } from "vue-router";

interface Compte {
  domain: string;
  name?: string;
}

interface Props {
  url: number;
  compte: Compte;
}

const props = defineProps<Props>();

const currentFavicon = ref<string>("/icons/none.svg");

watch(
  () => props.compte.domain,
  () => {
    const rawUrl = props.compte.domain?.trim() || "";

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

      currentFavicon.value = `${parsedUrl.origin}/favicon.ico`;
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
