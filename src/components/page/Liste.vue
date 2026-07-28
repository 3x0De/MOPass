<script setup lang="ts">
import { ref } from "vue";
import Compte from "./Compte.vue";

interface Compte {
  domaine: string;
  nom?: string;
}

const comptes = ref<Compte[]>([
  { domaine: "https://google.com" },
  { domaine: "https://twitch.tv" },
  { domaine: "https://github.com" },
  { domaine: "https://strudel.cc" },
  { domaine: "https://gemini.google.com/app" },
  { domaine: "https://w3schools.com/vue/vue_v-for.php" },
  {
    domaine:
      "http://juhanurmihxlp77nkq76byazcldy2hlmovfu2epvl5ankdibsot4csyd.onion/",
  },
  {
    domaine:
      "http://2gzyxa5ihm7nsggfxnu52rck2vv4rvmdlkiu3zzui5du4xyclen53wid.onion/",
  },
  { domaine: "https://ahmia.fi/", nom: "aa" },
  { domaine: "https://ssssssss" },
  { domaine: "https://lokinet.loki/" },
  { domaine: "http://zzz.i2p" },
  {
    domaine:
      "USK@g29a73m3sCq2A-M~U5tP-RjX~6eE4gX11Y2E~01G5A0,9X1Y8Z7W6V5U4T3S2R1Q,AQACAAE/social-guide/1/",
  },
]);

comptes.value.sort();
</script>

<template>
  <nav>
    <ul>
      <Compte v-for="(value, i) in comptes" :compte="value" :url="i" />
    </ul>
  </nav>
</template>

<style scoped lang="scss">
nav {
  width: 20%;
  height: 100%;
  flex-shrink: 0;

  overflow-y: auto;
  min-height: 0;
}
</style>
