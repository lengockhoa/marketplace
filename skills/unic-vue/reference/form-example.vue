<!--
REFERENCE EXAMPLE: Standard Form with Predefined Components
This example demonstrates how to use the predefined components in components/ folder
-->
<template>
  <div class="container mt-4">
    <!-- Using ControlInput for text inputs -->
    <div class="row mb-3">
      <div class="col-md-6">
        <ControlInput
          v-model="form.username"
          name="Username"
          :required="true"
          placeholder="Enter username"
        />
      </div>
      <div class="col-md-6">
        <ControlInput
          v-model="form.email"
          name="Email"
          type="text"
          placeholder="Enter email"
        />
      </div>
    </div>

    <!-- Using ControlDatetime for date pickers -->
    <div class="row mb-3">
      <div class="col-md-6">
        <ControlDatetime
          v-model="form.from_date"
          name="From Date"
          :required="true"
        />
      </div>
      <div class="col-md-6">
        <ControlDatetime
          v-model="form.to_date"
          name="To Date"
          :required="true"
        />
      </div>
    </div>

    <!-- Using ControlDropdownlist for select inputs -->
    <div class="row mb-3">
      <div class="col-md-6">
        <ControlDropdownlist
          v-model="form.status"
          name="Status"
          :required="true"
          :list="status_list"
          placeholder="Select status"
        />
      </div>
      <div class="col-md-6">
        <ControlDropdownlist
          v-model="form.categories"
          name="Categories"
          :list="category_list"
          :multiple="true"
          placeholder="Select categories"
        />
      </div>
    </div>

    <!-- Using ControlInput for textarea -->
    <div class="row mb-3">
      <div class="col-12">
        <ControlInput
          v-model="form.description"
          name="Description"
          type="textarea"
          rows="4"
          placeholder="Enter description"
        />
      </div>
    </div>

    <!-- Using ControlCheckbox -->
    <div class="row mb-3">
      <div class="col-12">
        <ControlCheckbox
          v-model="form.is_active"
          name="Active"
        />
      </div>
    </div>

    <!-- Using ControlButton for actions -->
    <div class="row">
      <div class="col-12">
        <ControlButton
          type="primary"
          name="Save"
          @onClick="onSave"
        />
        <ControlButton
          type="secondary"
          name="Cancel"
          @onClick="onCancel"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    // Computed properties first
  },
  data() {
    return {
      form: {
        username: "",
        email: "",
        from_date: "",
        to_date: "",
        status: "",
        categories: [],
        description: "",
        is_active: false,
      },
      status_list: [
        { value: "active", label: "Active" },
        { value: "inactive", label: "Inactive" },
        { value: "pending", label: "Pending" },
      ],
      category_list: [
        { value: "cat1", label: "Category 1" },
        { value: "cat2", label: "Category 2" },
        { value: "cat3", label: "Category 3" },
      ],
    };
  },

  methods: {
    async onSave() {
      // Validate required fields
      if (check_is_null_or_blank(this.form.username)) {
        alert("Username is required");
        return;
      }

      // Build payload
      let data = {
        schema: get_schema(),
        table: "users",
        data: JSON.stringify(this.form),
      };

      // Call backend
      const result = await request("/insert", data, "post");
      if (result.success) {
        alert("Saved successfully!");
      }
    },

    onCancel() {
      // Reset form
      this.form = {
        username: "",
        email: "",
        from_date: "",
        to_date: "",
        status: "",
        categories: [],
        description: "",
        is_active: false,
      };
    },
  },

  async mounted() {
    // Load initial data if needed
  },

  watch: {
    // Watchers here
  },
};
</script>
