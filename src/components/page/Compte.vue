<script setup lang="ts">
import { ref, watch, computed } from "vue";
interface Compte {
  domaine: string;
  nom?: string;
}

interface Props {
  url: number;
  compte: Compte;
}

const props = defineProps<Props>();

const currentFavicon = ref<string>("/logos/none.svg");

watch(
  () => props.compte.domaine,
  () => {
    const rawUrl = props.compte.domaine?.trim() || "";

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
  const rawUrl = props.compte.domaine?.trim() || "";

  try {
    const parsedUrl = new URL(
      rawUrl.startsWith("http") ? rawUrl : `https://${rawUrl}`,
    );
    const hostname = parsedUrl.hostname.replace(/^www\./, "");
    const name = hostname.split(".")[0];
    return name
      ? name.charAt(0).toUpperCase() + name.slice(1)
      : props.compte.domaine;
  } catch {
    return props.compte.domaine;
  }
});
</script>

<template>
  <li>
    <a :href="'/' + String(url)">
      <img
        :src="currentFavicon"
        @error="onError"
        alt="Favicon"
        width="16"
        height="16"
      />
      <h2>{{ Name }}</h2>
      <p>{{ compte.nom ?? "‎ " }}</p>
    </a>
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
