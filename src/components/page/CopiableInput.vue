<script setup lang="ts">
import { ref, watch } from "vue";
import { RiPencilFill, RiDeleteBinFill } from "@remixicon/vue";
import Input from "./Input.vue";

interface Props {
  type: "text" | "password";
  default?: string;
  noncopiable?: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

const modifing = ref<boolean>(false);
const copied = ref<boolean>(false);
const value = ref<string>(props.default ?? "");

watch(
  () => props.default,
  (newVal) => {
    value.value = newVal ?? "";
  },
);

const toggleModify = () => {
  modifing.value = !modifing.value;
  if (!modifing.value) {
    emit("update:modelValue", value.value);
  }
};

const clearValue = () => {
  value.value = "";
  emit("update:modelValue", "");
};

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(value.value);
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  } catch (err) {
    console.error("Erreur de copie :", err);
  }
};
</script>

<template>
  <div>
    <template v-if="!modifing">
      <p v-if="type == 'text'">{{ value || "..." }}</p>
      <p v-else>{{ value == "" ? "..." : "●●●●●●●●" }}</p>
      <button @click="copyToClipboard" v-if="!noncopiable">
        {{ copied ? "Copié !" : "Copier" }}
      </button>
      <RiDeleteBinFill @click="clearValue" />
    </template>

    <template v-else>
      <Input v-model="value" :type="type" />
    </template>

    <RiPencilFill @click="toggleModify" />
  </div>
</template>

<style scoped lang="scss">
@use "../../variables.scss" as v;

div {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 2rem;
  gap: 5px;

  > *:first-child {
    flex: 1;
  }

  p {
    word-break: break-all;
    max-width: 100%;
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
