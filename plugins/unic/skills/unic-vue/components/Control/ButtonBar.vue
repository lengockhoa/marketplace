<template>
  <div class="row">
    <div class="d-flex justify-content-between text-center" v-if="button_list.length > 1">
      <ControlButton v-for="btn in button_list" :type="btn.type" :name="btn.name" @onClick="clickFunc(btn.name)" />
    </div>
    <div class="text-center" v-if="button_list.length === 1">
      <ControlButton v-for="btn in button_list" :type="btn.type" :name="btn.name" @onClick="clickFunc(btn.name)" />
    </div>
  </div>
</template>
<script>
export default {
  props: {
    button_list: {
      type: Array,
      default: () => [
        { name: "Close", type: "secondary" },
        { name: "Delete", type: "danger" },
        { name: "Save", type: "success" },
      ],
    },
  },
  methods: {
    clickFunc(btn_name) {
      this.$emit("click" + btn_name.replaceAll(" ", ""));
    },
  },
};
</script>
