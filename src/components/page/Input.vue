<script setup lang="ts">
import { ref } from "vue";
import { RiEyeFill, RiEyeOffFill } from "@remixicon/vue";

interface Props {
  type?: "text" | "password";
}

const props = defineProps<Props>();
const model = defineModel<string>();

const visible = ref<boolean>(false);
</script>

<template>
  <input
    :type="type === 'password' && visible ? 'text' : type"
    v-model="model"
  />

  <template v-if="type === 'password'" @click="visible = !visible">
    <RiEyeOffFill v-if="visible" @click="visible = !visible" />
    <RiEyeFill v-else @click="visible = !visible" />
  </template>
</template>

<style scoped lang="scss">
@use "../../variables.scss" as v;

input {
  background-color: v.$whiteSpirit;
  border: none;
  border-radius: 5px;
  padding: 5px;
}
</style>
