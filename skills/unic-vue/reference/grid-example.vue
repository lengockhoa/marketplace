<!--
REFERENCE EXAMPLE: Data Grid with AG Grid Component
This example demonstrates how to use GridAG component for displaying data tables
-->
<template>
  <div class="container-fluid mt-4">
    <!-- Filter Section using predefined components -->
    <div class="row mb-3">
      <div class="col-md-3">
        <ControlDatetime
          v-model="from_date"
          name="From Date"
          :required="true"
        />
      </div>
      <div class="col-md-3">
        <ControlDatetime
          v-model="to_date"
          name="To Date"
          :required="true"
        />
      </div>
      <div class="col-md-3">
        <ControlDropdownlist
          v-model="status"
          name="Status"
          :list="status_list"
          placeholder="All Status"
        />
      </div>
      <div class="col-md-3 d-flex align-items-end">
        <ControlButton
          type="primary"
          name="Search"
          @onClick="get_data"
        />
      </div>
    </div>

    <!-- AG Grid Component -->
    <GridAG
      id="user_grid"
      :columns="columns"
      :rows="rows"
      :can_add="true"
      :can_edit="true"
      :can_delete="true"
      :can_export="true"
      :table="table_name"
      :table_schema="table_schema"
      @onClickDetail="onClickDetail"
      @onAdd="onAdd"
      @reloadData="get_data"
    />
  </div>
</template>

<script>
export default {
  computed: {
    // Computed properties first
  },
  data() {
    return {
      // Filter data
      from_date: "",
      to_date: "",
      status: "",

      // Grid data
      rows: [],
      table_name: "users",
      table_schema: "",

      // Dropdown options
      status_list: [
        { value: "active", label: "Active" },
        { value: "inactive", label: "Inactive" },
      ],

      // Column definitions for AG Grid
      columns: [
        { key: "username", title: "Username", type: "text" },
        { key: "email", title: "Email", type: "text" },
        { key: "status", title: "Status", type: "text" },
        { key: "created_date", title: "Created Date", type: "date" },
        { key: "amount", title: "Amount", type: "number" },
      ],
    };
  },

  methods: {
    async get_data() {
      // Validate required fields
      if (check_is_null_or_blank(this.from_date) || check_is_null_or_blank(this.to_date)) {
        return;
      }

      // Build conditions object
      let conditions = {
        "(>=)created_date": this.from_date,
        "(<=)created_date": this.to_date,
      };

      // Add optional filters
      if (!check_is_null_or_blank(this.status)) {
        conditions.status = this.status;
      }

      // Build payload
      let data = {
        schema: get_schema(),
        table: this.table_name,
        conditions: JSON.stringify(conditions),
        order_by: ["created_date desc"],
      };

      // Call backend
      this.rows = await request("/select", data, "get");
    },

    onClickDetail(row) {
      // Handle edit click - navigate to detail page or open modal
      console.log("Edit row:", row);
      // Example: this.$router.push(`/users/${row.id_users}`);
    },

    onAdd() {
      // Handle add new - navigate to create page or open modal
      console.log("Add new");
      // Example: this.$router.push('/users/create');
    },
  },

  async mounted() {
    // Set default dates
    this.table_schema = get_schema();

    // Load initial data
    await this.get_data();
  },

  watch: {
    // Watchers here
  },
};
</script>
