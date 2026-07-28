<script setup lang="ts">
import CopiableInput from "./CopiableInput.vue";
interface Props {
  id: number;
}

const props = defineProps<Props>();
</script>

<template>
  <h1>{{ id }}</h1>
  <CopiableInput />
</template>
