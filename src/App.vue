<script setup lang="ts">
import { ref } from "vue";
import Card from "./components/Card.vue";

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
]);

urls.value.sort();
</script>

<template>
  <Card v-for="url in urls" :key="url" :url="url" />
</template>
