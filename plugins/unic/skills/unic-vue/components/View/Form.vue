<template>
  <!--
    Starter template for a `Form.vue` view.

    This file is intentionally minimal so it can be copied and customized.
    The empty file used to confuse `git status`; copying this template gives
    you a valid component without inventing DuraOne-specific field names.

    Usage:
      1. Copy this file to your project (e.g. `views/users/Form.vue`).
      2. Replace the placeholder slots with the form sections you need.
      3. Wire it up in the parent route / page.
  -->
  <a-form
    layout="vertical"
    :model="formState"
    @finish="onSubmit"
  >
    <a-form-item label="Example field" name="example">
      <a-input v-model:value="formState.example" />
    </a-form-item>

    <a-form-item>
      <a-space>
        <a-button type="primary" html-type="submit">Submit</a-button>
        <a-button @click="onCancel">Cancel</a-button>
      </a-space>
    </a-form-item>
  </a-form>
</template>

<script>
import { reactive } from "vue";

export default {
  name: "FormView",
  setup() {
    const formState = reactive({
      example: "",
    });
    const onSubmit = (values) => {
      // Replace with your submit handler (e.g. await request("POST", "/save", values)).
      console.log("[Form.vue] submit", values);
    };
    const onCancel = () => {
      // Replace with router.back() or your own cancel handler.
      console.log("[Form.vue] cancel");
    };
    return { formState, onSubmit, onCancel };
  },
};
</script>
