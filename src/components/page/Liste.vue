<script setup lang="ts">
import { ref, onMounted } from "vue";
import Compte from "./Compte.vue";

interface CompteCSV {
  domain: string;
  name: string;
  password: string;
}

const comptes = ref<CompteCSV[]>([]);
const isLoading = ref<boolean>(true);
const errorMsg = ref<string | null>(null);

const loadCSV = async () => {
  try {
    const response = await fetch("http://localhost:3001/api/comptes.csv");

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    const text = await response.text();

    const lines = text.trim().split("\n");
    if (lines.length === 0) return;

    const headers = lines[0].split(",").map((h) => h.trim());

    comptes.value = lines.slice(1).map((line) => {
      const values = line.split(",").map((v) => v.trim());
      const item: Record<string, string> = {};

      headers.forEach((header, index) => {
        item[header] = values[index] || "";
      });

      return item as unknown as CompteCSV;
    });
  } catch (err) {
    console.error(err);
    errorMsg.value = "Impossible de charger le fichier CSV.";
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  loadCSV();
});
</script>

<template>
  <nav>
    <ul>
      <Compte v-for="(value, i) in comptes" :key="i" :compte="value" :url="i" />
    </ul>
  </nav>
</template>

<style scoped lang="scss">
nav {
  width: 20%;
  height: 100%;
  flex-shrink: 0;

  overflow-y: auto;
  overflow-x: hidden;
  min-height: 0;
}
</style>
