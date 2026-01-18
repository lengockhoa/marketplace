<template>
  <ClientOnly>
    <a-modal :visible="visible" :title="title" :ok-text="t('Confirm')" :cancel-text="t('Cancel')" @ok="confirmAction" @cancel="close">
      <div class="col-12">
        <div class="col-12">
          {{ t('Please confirm this Agreement is Adhoc or On Plan') }}
        </div>
        <div class="col-6">
          <ControlCheckbox :label="t('Is Adhoc')" v-model="is_adhoc" />
        </div>
        <div class="col-6">
          <ControlCheckbox :label="t('Is On Plan')" v-model="is_onplan" />
        </div>
      </div>
      <ControlInput type="text" v-model="rejectReason" :name="t(message)" />
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
  data() {
    return {
      rejectReason: "",
      is_adhoc: false,
      is_onplan: true,
    };
  },
  methods: {
    confirmAction() {
      if(!this.is_adhoc && !this.is_onplan) return;
      this.$emit("onConfirm", this.rejectReason, this.is_adhoc, this.is_onplan);
    },
    close() {
      this.$emit("onClose");
    },
  },
  watch: {
    is_adhoc() {
      if(this.is_adhoc){
        this.is_onplan = false;
      }
    },
    is_onplan() {
      if(this.is_onplan){
        this.is_adhoc = false;
      }
    },
  },
};
</script>
