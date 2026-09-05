<template>
  <a-modal v-model:visible="is_show_info">
    <a-result :status="status" :title="title"></a-result>
    <template #footer>
      <a-button @click="onClose()" type="primary">Close</a-button>
    </template>
  </a-modal>
</template>

<script>
export default {
  props: ["status", "title", "visible"],
  data() {
    return {
      is_show_info: false,
    };
  },
  methods: {
    onClose() {
      this.is_show_info = false;
    },
  },
  mounted() {
    this.is_show_info = this.visible;
  },
  watch: {
    visible() {
      this.is_show_info = this.visible;
    },
  },
};
</script>
