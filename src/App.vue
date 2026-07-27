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
]);

urls.value.sort();
</script>

<template>
  <Card v-for="url in urls" :key="url" :url="url" />
</template>
