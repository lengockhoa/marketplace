<template>
  <ClientOnly>
    <a-modal :visible="visible" :title="title" :ok-text="t('Confirm')" :cancel-text="t('Cancel')" @ok="confirmAction" @cancel="close">
      <p v-html="message"></p>
    </a-modal>
  </ClientOnly>
</template>
<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: true,
    },
    message: {
      type: String,
      default: true,
    },
    title: {
      type: String,
      default: true,
    },
  },
  methods: {
    confirmAction() {
      this.$emit("onConfirm");
    },
    close() {
      this.$emit("onClose");
    },
  },
};
</script>
