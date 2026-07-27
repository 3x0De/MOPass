<script setup lang="ts">
interface Props {
  id: number;
}

const props = defineProps<Props>();
</script>

<template>
  <h1>{{ id }}</h1>
</template>
