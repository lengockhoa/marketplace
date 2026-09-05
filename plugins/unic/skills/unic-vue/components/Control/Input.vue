<!-- Example Hard code -->
<!-- 
<ControlInput
  type="text"
  v-model="vairiable"
  :required="true"
  placeholder="Name"
  :id="this_id"
  :name="this_name"
/> 
-->
<template>
  <ControlLabel :required="required" :name="name" :classes="label_classes" />
  <a-input-password size="large" :disabled="disabled" v-if="type === 'password'" v-model:value="value" :id="id" :name="name" :class="classes" :placeholder="placeholder" allow-clear />
  <a-input-search size="large" :disabled="disabled" v-if="type === 'search'" v-model:value="value" :placeholder="placeholder" allow-clear :id="id" :name="name" :class="classes" enter-button @search="onSearch" />
  <a-textarea :disabled="disabled" v-if="type === 'textarea'" v-model:value="value" :placeholder="placeholder" allow-clear :id="id" :name="name" :class="classes" :rows="parseInt(rows)" />
  <ClientOnly>
    <a-input-number
      size="large"
      v-if="type === 'number'"
      :disabled="disabled"
      v-model:value="value"
      :formatter="(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
      :parser="(value) => value.replace(/\$\s?|(,*)/g, '')"
      :id="id"
      :name="name"
      allow-clear
      style="width: 100%"
      :class="classes" />
  </ClientOnly>
  <a-input size="large" :disabled="disabled" v-if="!['password', 'search', 'textarea', 'number'].includes(type)" v-model:value="value" :id="id" :name="name" :class="classes" :placeholder="placeholder" allow-clear />
</template>
<style>
input[disabled] {
  color: black !important;
}
textarea[disabled] {
  color: black !important;
}
</style>

<script>
import { v4 as uuidv4 } from "uuid";
export default {
  props: {
    modelValue: {
      type: [String, Number],
      default: "",
    },
    required: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: "text",
    },
    placeholder: {
      type: String,
      default: "",
    },
    id: {
      type: String,
      default: () => {
        return uuidv4();
      },
    },
    name: {
      type: String,
      default: "",
    },
    classes: {
      type: String,
      default: "",
    },
    label_classes: {
      type: String,
      default: "",
    },
    rows: {
      type: String,
      default: "3",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["update:modelValue", "onSearch"],
  computed: {
    value: {
      get() {
        return this.modelValue;
      },
      set(value) {
        this.$emit("update:modelValue", value);
      },
    },
  },
  methods: {
    onSearch() {
      this.$emit("onSearch", this.value);
    },
  },
};
</script>
