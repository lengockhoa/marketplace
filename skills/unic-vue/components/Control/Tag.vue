<!-- Example Hard code -->
<!-- 
<ControlTag
  v-model="variable"
  :required="true"
  placeholder="Name"
  :id="this_id"
  :name="this_name"
  :disable="true"
/> 
-->
<template>
  <ControlLabel :required="required" :name="name" :classes="label_classes" />
  <a-select v-model:value="value" size="large" :disabled="disabled" mode="tags" style="width: 100%" :open="false" :placeholder="placeholder" @change="handleChange"> </a-select>
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
      type: [Array],
      default: [],
    },
    required: {
      type: Boolean,
      default: false,
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
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["update:modelValue"],
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
    handleChange(val) {
      // Remove empty or whitespace-only values
      this.value = val.filter((v) => v && v.trim() !== "");
    },
  },
};
</script>
