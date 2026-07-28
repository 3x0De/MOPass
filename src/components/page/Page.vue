<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import CopiableInput from "./CopiableInput.vue";
import Liste from "./Liste.vue";

interface Props {
  id: number;
}

const props = defineProps<Props>();

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
    const response = await fetch("/comptes.csv");

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

const compte = computed(() => comptes.value[props.id]);
</script>

<template>
  <div id="wrapper">
    <Liste />

    <div v-if="isLoading" id="main">
      <p>Chargement en cours...</p>
    </div>

    <div v-else-if="errorMsg" id="main">
      <p>{{ errorMsg }}</p>
    </div>

    <div v-else-if="compte" id="main">
      <div>
        <h1>Nom de domaine</h1>
        <CopiableInput
          type="text"
          :default="compte.domain || 'Nom de domaine'"
          :noncopiable="true"
        />
      </div>
      <div>
        <h1>Nom d'utilisateur</h1>
        <CopiableInput
          type="text"
          :default="compte.name || 'Nom d\'utilisateur'"
        />
      </div>
      <div>
        <h1>Mot de passe</h1>
        <CopiableInput
          type="password"
          :default="compte.password || 'Mot de passe'"
        />
      </div>
    </div>

    <div v-else id="main">
      <p>Aucun compte trouvé pour l'identifiant {{ id }}.</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
#wrapper {
  display: flex;
  width: 100%;
  height: 90vh;

  #main {
    flex: 1;
    width: 100%;
    height: 100%;
    overflow-y: auto;
    display: flex;
    align-items: center;
    flex-direction: column;

    > div {
      width: 80%;
    }
  }
}
</style>
