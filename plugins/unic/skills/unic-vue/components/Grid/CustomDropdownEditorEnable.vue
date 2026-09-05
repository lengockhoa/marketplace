<template>
  <div class="custom-dropdown-renderer" style="width: 100%; height: 100%">
    <ControlDropdownlist class="cell-value" :disabled="!this.params.can_edit" v-model="selectedValue" :list="options" :style="'width: '+params.column.actualWidth+'px;' " /> 
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
  watch: {
    selectedValue() {
      if (this.params.node && this.params.column) {
        this.params.node.setDataValue(this.params.column.colId, this.selectedValue);
      }
    },
  },
};
</script>

<style>
.dropdown-cell {
  padding-left: 0 !important;
  padding-right: 0 !important;
}
.custom-dropdown-renderer {
  display: flex;
  align-items: center;
  height: 100%;
  width: 100%;
}
.cell-value {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.icon-right {
  margin-left: auto;
  color: #a2a0a0;
  margin-top: 11px;
  font-size: 1.2rem;
}
.icon-right-with-value {
  margin-left: auto;
  color: #a2a0a0;
  margin-top: 1px;
  font-size: 1.2rem;
}
</style>
