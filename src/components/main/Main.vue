<script setup lang="ts">
import { ref } from "vue";
import Card from "./Card.vue";
import { RouterLink } from "vue-router";

const urls = ref<string[]>([
  "https://google.com",
  "https://twitch.tv",
  "https://github.com",
  "https://strudel.cc",
  "https://gemini.google.com/app",
  "https://w3schools.com/vue/vue_v-for.php",
  "http://juhanurmihxlp77nkq76byazcldy2hlmovfu2epvl5ankdibsot4csyd.onion/",
  "http://2gzyxa5ihm7nsggfxnu52rck2vv4rvmdlkiu3zzui5du4xyclen53wid.onion/",
  "https://ahmia.fi/",
  "https://ssssssss",
  "https://lokinet.loki/",
  "http://zzz.i2p",
  "USK@g29a73m3sCq2A-M~U5tP-RjX~6eE4gX11Y2E~01G5A0,9X1Y8Z7W6V5U4T3S2R1Q,AQACAAE/social-guide/1/",
  "USK@g29a73m3sCq2A-M~U5tP-RjX~6eE4gX11Y2E~01G5A0,9X1Y8Z7W6V5U4T3S2R1Q,AQACAAE/social-guide/1/",
  "USK@g29a73m3sCq2A-M~U5tP-RjX~6eE4gX11Y2E~01G5A0,9X1Y8Z7W6V5U4T3S2R1Q,AQACAAE/social-guide/1/",
  "USK@g29a73m3sCq2A-M~U5tP-RjX~6eE4gX11Y2E~01G5A0,9X1Y8Z7W6V5U4T3S2R1Q,AQACAAE/social-guide/1/",
  "USK@g29a73m3sCq2A-M~U5tP-RjX~6eE4gX11Y2E~01G5A0,9X1Y8Z7W6V5U4T3S2R1Q,AQACAAE/social-guide/1/",
  "USK@g29a73m3sCq2A-M~U5tP-RjX~6eE4gX11Y2E~01G5A0,9X1Y8Z7W6V5U4T3S2R1Q,AQACAAE/social-guide/1/",
  "USK@g29a73m3sCq2A-M~U5tP-RjX~6eE4gX11Y2E~01G5A0,9X1Y8Z7W6V5U4T3S2R1Q,AQACAAE/social-guide/1/",
  "USK@g29a73m3sCq2A-M~U5tP-RjX~6eE4gX11Y2E~01G5A0,9X1Y8Z7W6V5U4T3S2R1Q,AQACAAE/social-guide/1/",
  "USK@g29a73m3sCq2A-M~U5tP-RjX~6eE4gX11Y2E~01G5A0,9X1Y8Z7W6V5U4T3S2R1Q,AQACAAE/social-guide/1/",
  "USK@g29a73m3sCq2A-M~U5tP-RjX~6eE4gX11Y2E~01G5A0,9X1Y8Z7W6V5U4T3S2R1Q,AQACAAE/social-guide/1/",
  "USK@g29a73m3sCq2A-M~U5tP-RjX~6eE4gX11Y2E~01G5A0,9X1Y8Z7W6V5U4T3S2R1Q,AQACAAE/social-guide/1/",
  "USK@g29a73m3sCq2A-M~U5tP-RjX~6eE4gX11Y2E~01G5A0,9X1Y8Z7W6V5U4T3S2R1Q,AQACAAE/social-guide/1/",
  "USK@g29a73m3sCq2A-M~U5tP-RjX~6eE4gX11Y2E~01G5A0,9X1Y8Z7W6V5U4T3S2R1Q,AQACAAE/social-guide/1/",
  "USK@g29a73m3sCq2A-M~U5tP-RjX~6eE4gX11Y2E~01G5A0,9X1Y8Z7W6V5U4T3S2R1Q,AQACAAE/social-guide/1/",
  "USK@g29a73m3sCq2A-M~U5tP-RjX~6eE4gX11Y2E~01G5A0,9X1Y8Z7W6V5U4T3S2R1Q,AQACAAE/social-guide/1/",
  "USK@g29a73m3sCq2A-M~U5tP-RjX~6eE4gX11Y2E~01G5A0,9X1Y8Z7W6V5U4T3S2R1Q,AQACAAE/social-guide/1/",
  "USK@g29a73m3sCq2A-M~U5tP-RjX~6eE4gX11Y2E~01G5A0,9X1Y8Z7W6V5U4T3S2R1Q,AQACAAE/social-guide/1/",
  "USK@g29a73m3sCq2A-M~U5tP-RjX~6eE4gX11Y2E~01G5A0,9X1Y8Z7W6V5U4T3S2R1Q,AQACAAE/social-guide/1/",
  "USK@g29a73m3sCq2A-M~U5tP-RjX~6eE4gX11Y2E~01G5A0,9X1Y8Z7W6V5U4T3S2R1Q,AQACAAE/social-guide/1/",
  "USK@g29a73m3sCq2A-M~U5tP-RjX~6eE4gX11Y2E~01G5A0,9X1Y8Z7W6V5U4T3S2R1Q,AQACAAE/social-guide/1/",
  "USK@g29a73m3sCq2A-M~U5tP-RjX~6eE4gX11Y2E~01G5A0,9X1Y8Z7W6V5U4T3S2R1Q,AQACAAE/social-guide/1/",
  "USK@g29a73m3sCq2A-M~U5tP-RjX~6eE4gX11Y2E~01G5A0,9X1Y8Z7W6V5U4T3S2R1Q,AQACAAE/social-guide/1/",
]);

urls.value.sort();
</script>

<template>
  <div id="wrapper">
    <a v-for="(url, i) in urls" :key="i" :href="'/' + String(i)">
      <Card :url="url" />
    </a>
  </div>
</template>

<style scoped>
#wrapper {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  place-items: center;
}
</style>
