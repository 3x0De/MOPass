<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
</script>

<template>
  <header>
    <nav>
      <RouterLink to="/"><img src="/logos/max.svg" alt="MOPass" /></RouterLink>
      <div id="Add">
        <img src="./assets/Add.svg" alt="" height="32" width="32" />
      </div>
    </nav>
  </header>

  <main>
    <RouterView />
  </main>
</template>

<style scoped lang="scss">
@use "variables" as v;

header {
  position: sticky;
  top: 0;
  background-color: v.$redApple;
  z-index: 10;

  nav {
    display: flex;
    align-items: center;
    justify-content: space-between;

    #Add {
      height: 100%;
      aspect-ratio: 1;
      margin-left: 20px;
      cursor: pointer;
      transition: 0.3s all;
      border-radius: 5px;

      &:hover {
        background-color: v.$whiteSpirit;
      }
    }
  }
}
</style>
