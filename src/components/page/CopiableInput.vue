<script setup lang="ts">
import { ref } from "vue";
import { RiPencilFill, RiDeleteBinFill } from "@remixicon/vue";
import Input from "./Input.vue";

const modifing = ref<boolean>(false);
console.log(modifing);
</script>

<template>
  <div>
    <template v-if="!modifing">
      <p>champ</p>
      <button>copier</button>
      <RiDeleteBinFill />
    </template>

    <template v-else>
      <Input type="password" />
    </template>

    <RiPencilFill @click="modifing = !modifing" />
  </div>
</template>

<style scoped lang="scss">
@use "../../variables.scss" as v;

div {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 2rem;
  width: 40%;
  gap: 5px;

  > *:first-child {
    flex: 1;
  }

  button {
    cursor: pointer;
    padding: 5px;
    border: none;
    border-radius: 5px;
    color: v.$darkBlack;
    background-color: v.$whiteSpirit;
  }
}
</style>
