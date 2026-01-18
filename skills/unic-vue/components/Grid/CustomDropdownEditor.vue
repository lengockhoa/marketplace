<template>
  <div class="custom-editor">
    <ControlDropdownlist v-model="selectedValue" :list="options" :style="'width: '+params.column.actualWidth+'px;'" /> 
  </div>
</template>

<script>
export default {
  props: ["params"],
  data() {
    return {
      selectedValue: this.params.value,
      options: this.params.options || [],
    };
  },
  methods: {
    getValue() {
      return this.selectedValue;
    },
    isPopup() {
      return true;
    },
    onChange() {
      this.params.stopEditing(); // closes editor on change
    },
    onBlur() {
      this.params.stopEditing();
    },
  },
  watch: {
    selectedValue() {
      this.params.stopEditing();
    },
  },
};
</script>

<style scoped>
.custom-editor {
  margin-top: -41px;
  z-index: 9999;
}
</style>
