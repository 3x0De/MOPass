<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import CopiableInput from "./CopiableInput.vue";
import Liste from "./Liste.vue";
import { RiDeleteBinFill } from "@remixicon/vue";

interface Props {
  id: number;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: "delete", deletedId: number): void;
  (e: "update:comptes", comptes: CompteCSV[]): void;
}>();

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

const saveAndOverwriteCSV = async () => {
  try {
    const headers = ["domain", "name", "password"];
    const rows = comptes.value.map(
      (c) => `${c.domain},${c.name},${c.password}`,
    );
    const csvContent = [headers.join(","), ...rows].join("\n");

    await fetch("http://localhost:3001/api/save-csv", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content: csvContent }),
    });

    emit("update:comptes", comptes.value);
  } catch (err) {
    console.error("Erreur lors de l'écriture du fichier :", err);
  }
};

const updateCompteField = async (field: keyof CompteCSV, value: string) => {
  if (!compte.value) return;

  comptes.value[props.id][field] = value;
  await saveAndOverwriteCSV();
};

const deleteCompte = async () => {
  if (props.id < 0 || props.id >= comptes.value.length) return;

  if (!confirm("Voulez-vous vraiment supprimer ?")) return;

  comptes.value.splice(props.id, 1);
  emit("delete", props.id);

  await saveAndOverwriteCSV();
};
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
      <RiDeleteBinFill class="Delete" @click="deleteCompte" />
      <div>
        <h1>Nom de domaine</h1>
        <CopiableInput
          type="text"
          :default="compte.domain"
          :noncopiable="true"
          @update:modelValue="(val: string) => updateCompteField('domain', val)"
        />
      </div>
      <div>
        <h1>Nom d'utilisateur</h1>
        <CopiableInput
          type="text"
          :default="compte.name"
          @update:modelValue="(val: string) => updateCompteField('name', val)"
        />
      </div>
      <div>
        <h1>Mot de passe</h1>
        <CopiableInput
          type="password"
          :default="compte.password"
          @update:modelValue="
            (val: string) => updateCompteField('password', val)
          "
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
    position: relative;

    > div {
      width: 80%;
    }

    .Delete {
      position: absolute;
      right: 20px;
      top: 0;
      cursor: pointer;
    }
  }
}
</style>
