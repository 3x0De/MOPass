<script setup lang="ts">
import CopiableInput from "./CopiableInput.vue";
import Liste from "./Liste.vue";
interface Props {
  id: number;
}

const props = defineProps<Props>();
</script>

<template>
  <div id="wrapper">
    <Liste />
    <div id="main">
      <div>
        <h1>Nom de domaine</h1>
        <CopiableInput
          type="text"
          default="Nom de domaine"
          :noncopiable="true"
        />
      </div>
      <div>
        <h1>Nom d'utilisateur</h1>
        <CopiableInput type="text" default="Nom d'utilisateur" />
      </div>
      <div>
        <h1>Mot de passe</h1>
        <CopiableInput type="password" default="Mot de passe" />
      </div>
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
