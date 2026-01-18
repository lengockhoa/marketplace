<template>
  <div>
    <a-checkbox class="unic-custom-checkbox" :disabled="disabled" :checked="checked" v-model="checked" @change="onChange">{{ label }}</a-checkbox>
  </div>
</template>
<script>
export default {
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
      default: "",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
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
  data() {
    return {
      checked: this.modelValue,
    };
  },
  methods: {
    onChange(event) {
      this.checked = event.target.checked;
      this.$emit("update:modelValue", this.checked);
    },
  },
  watch: {
    value() {
      this.checked = this.value;
    },
  },
};
</script>
<style>
.ant-checkbox-disabled + span {
  color: black !important;
  cursor: not-allowed;
}
.unic-custom-checkbox .ant-checkbox-checked .ant-checkbox-inner::after {
  border-color: black; /* Change to the desired color */
}
</style>
