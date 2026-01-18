<template>
  <div>
    <input :disabled="disabled" type="checkbox" :checked="checked" v-model="checked" @change="onChange" @click="onChange" class="btn-check" :id="id" />
    <label class="btn btn-outline-primary" @click="onChange">{{ label }}</label
    ><br />
  </div>
</template>
<script>
import { v4 as uuidv4 } from "uuid";
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
    id: {
      type: String,
      default: () => {
        return uuidv4();
      },
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
<style scoped>
.btn {
  color: #2e86c1;
  border-color: #2e86c1;
  box-shadow: 3px 3px 5px #839192;
  border-radius: 2px;
}
.btn-check:checked + .btn,
.btn.active,
.btn.show,
.btn:first-child:active,
:not(.btn-check) + .btn:active {
  color: #ffffff;
  background: #2e86c1;
  border-color: #2e86c1;
}
</style>
