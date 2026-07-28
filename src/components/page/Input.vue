<script setup lang="ts">
import { ref } from "vue";
import { RiEyeFill, RiEyeOffFill } from "@remixicon/vue";

interface Props {
  type?: "text" | "password";
}

const props = withDefaults(defineProps<Props>(), {
  type: "text",
});

const visible = ref<boolean>(false);
</script>

<template>
  <input :type="type === 'password' && visible ? 'text' : type" />

  <template v-if="type === 'password'" @click="visible = !visible">
    <RiEyeOffFill v-if="visible" @click="visible = !visible" />
    <RiEyeFill v-else @click="visible = !visible" />
  </template>
</template>
