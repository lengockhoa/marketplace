<template>
  <label :class="classes">
    <span v-if="icon !== ''" class="icon-style">
      <i style="color: white" :class="icon"></i>
    </span>
    {{ name }} <span v-if="required" style="color: red">*</span>
  </label>
</template>
<script>
export default {
  props: {
    required: {
      type: Boolean,
      default: false,
    },
    classes: {
      type: String,
      default: "",
    },
    name: {
      type: String,
      default: "",
    },
    icon: {
      type: String,
      default: "",
    },
  },
};
</script>

<style>
.icon-style {
  background-color: #2d82b5 !important;
  border-radius: 50% !important;
  padding: 3px 5px !important;
}
</style>
