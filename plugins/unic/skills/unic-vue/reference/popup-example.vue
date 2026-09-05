<!--
REFERENCE EXAMPLE: Popup/Modal Components
This example demonstrates how to use popup components from Control/Popup/
-->
<template>
  <div class="container mt-4">
    <!-- Buttons to trigger popups -->
    <div class="row mb-4">
      <div class="col-12">
        <ControlButton
          type="primary"
          name="Show Info"
          @onClick="showInfo"
        />
        <ControlButton
          type="warning"
          name="Confirm Action"
          @onClick="showConfirm"
        />
        <ControlButton
          type="danger"
          name="Reject Item"
          @onClick="showReject"
        />
      </div>
    </div>

    <!-- Info Popup -->
    <ControlPopupInfo
      :visible="show_info"
      title="Information"
      message="This is an informational message for the user."
      @onClose="onCloseInfo"
    />

    <!-- Confirm Popup -->
    <ControlPopupConfirm
      :visible="show_confirm"
      :title="t('Confirm')"
      :message="t('Are you sure you want to proceed with this action?')"
      @onClose="onCloseConfirm"
      @onConfirm="onConfirmAction"
    />

    <!-- Reject Popup (with reason input) -->
    <ControlPopupReject
      :visible="show_reject"
      title="Reject Item"
      message="Please provide a reason for rejection:"
      @onClose="onCloseReject"
      @onConfirm="onConfirmReject"
    />

    <!-- Modal Info (larger modal) -->
    <ControlPopupModalInfo
      :visible="show_modal"
      title="Detail Information"
      @onClose="onCloseModal"
    >
      <!-- Custom content inside modal -->
      <template #content>
        <div class="p-3">
          <p>Custom modal content goes here.</p>
          <p>You can add any HTML or components.</p>
        </div>
      </template>
    </ControlPopupModalInfo>
  </div>
</template>

<script>
export default {
  computed: {
    // Computed properties first
  },
  data() {
    return {
      show_info: false,
      show_confirm: false,
      show_reject: false,
      show_modal: false,
    };
  },

  methods: {
    // Info popup methods
    showInfo() {
      this.show_info = true;
    },
    onCloseInfo() {
      this.show_info = false;
    },

    // Confirm popup methods
    showConfirm() {
      this.show_confirm = true;
    },
    onCloseConfirm() {
      this.show_confirm = false;
    },
    async onConfirmAction() {
      // Perform the confirmed action
      console.log("Action confirmed");

      // Example: Delete record
      // let data = {
      //   schema: get_schema(),
      //   table: "items",
      //   id_items: this.selected_id,
      // };
      // await request("/hard_delete", data);

      this.show_confirm = false;
    },

    // Reject popup methods
    showReject() {
      this.show_reject = true;
    },
    onCloseReject() {
      this.show_reject = false;
    },
    async onConfirmReject(reason) {
      // Handle rejection with reason
      console.log("Rejected with reason:", reason);

      // Example: Update record status
      // let data = {
      //   schema: get_schema(),
      //   table: "items",
      //   data: JSON.stringify({
      //     id_items: this.selected_id,
      //     status: "rejected",
      //     reject_reason: reason,
      //   }),
      // };
      // await request("/update", data, "post");

      this.show_reject = false;
    },

    // Modal methods
    showModal() {
      this.show_modal = true;
    },
    onCloseModal() {
      this.show_modal = false;
    },
  },

  async mounted() {
    // Initialize if needed
  },

  watch: {
    // Watchers here
  },
};
</script>
