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
