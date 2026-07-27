<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
</script>

<template>
  <header>
    <nav>
      <RouterLink to="/"><img src="/logos/max.svg" alt="MOPass" /></RouterLink>
    </nav>
  </header>

  <main>
    <RouterView />
  </main>
</template>
