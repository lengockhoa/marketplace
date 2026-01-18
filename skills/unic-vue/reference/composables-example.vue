<!--
REFERENCE EXAMPLE: Composables Usage
This example demonstrates how to use the predefined composables from composables/ folder
All functions are auto-imported in Nuxt - no import statements needed
-->
<template>
  <div class="container mt-4">
    <!-- Search Form -->
    <div class="row mb-3">
      <div class="col-md-3">
        <ControlDatetime v-model="from_date" name="From Date" :required="true" />
      </div>
      <div class="col-md-3">
        <ControlDatetime v-model="to_date" name="To Date" :required="true" />
      </div>
      <div class="col-md-3">
        <ControlDropdownlist v-model="selected_user" name="User" :list="user_list" placeholder="Select User" />
      </div>
      <div class="col-md-3 d-flex align-items-end">
        <ControlButton type="primary" name="Search" @onClick="get_data" />
      </div>
    </div>

    <!-- Data Grid -->
    <GridAG
      id="example_grid"
      :columns="columns"
      :rows="rows"
      :can_add="true"
      :can_edit="true"
      :can_delete="true"
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
      selected_user: "",

      // Dropdown data
      user_list: [],

      // Grid data
      rows: [],
      table_name: "orders",
      table_schema: "",

      // Column definitions
      columns: [
        { key: "order_no", title: "Order No", type: "text" },
        { key: "customer_name", title: "Customer", type: "text" },
        { key: "order_date", title: "Order Date", type: "date" },
        { key: "total_amount", title: "Amount", type: "number" },
        { key: "status", title: "Status", type: "text" },
      ],
    };
  },

  methods: {
    // ============================================
    // VALIDATION EXAMPLES (check_is_null_or_blank)
    // ============================================
    validateForm() {
      // Check if required fields are filled
      if (check_is_null_or_blank(this.from_date)) {
        show_message("error", t("Please select from date"));
        return false;
      }
      if (check_is_null_or_blank(this.to_date)) {
        show_message("error", t("Please select to date"));
        return false;
      }
      return true;
    },

    // ============================================
    // API REQUEST EXAMPLES (request, get_schema)
    // ============================================
    async get_data() {
      // Step 1: Validate
      if (!this.validateForm()) {
        return;
      }

      // Step 2: Build conditions with operators
      let conditions = {
        "(>=)order_date": this.from_date,
        "(<=)order_date": this.to_date,
      };

      // Add optional filters
      if (!check_is_null_or_blank(this.selected_user)) {
        conditions.user_id = this.selected_user;
      }

      // Step 3: Build payload
      let data = {
        schema: get_schema(), // Returns 'qas' or 'prd' based on URL
        table: this.table_name,
        conditions: JSON.stringify(conditions),
        order_by: ["order_date desc"],
      };

      // Step 4: Call API
      this.rows = await request("/select", data, "get");
    },

    // ============================================
    // DROPDOWN CONVERSION (convertToDropdownValue)
    // ============================================
    async load_users() {
      let data = {
        schema: get_schema(),
        table: "users",
        conditions: JSON.stringify({ status: "active" }),
        order_by: ["fullname asc"],
      };

      let response = await request("/select", data, "get");

      // Convert API response to dropdown format
      // From: [{ id_user: 1, fullname: 'John' }, { id_user: 2, fullname: 'Jane' }]
      // To: [{ value: 1, label: 'John' }, { value: 2, label: 'Jane' }]
      this.user_list = convertToDropdownValue(response, "id_user", "fullname");
    },

    // ============================================
    // DATE FORMATTING (dayjs, formatDate)
    // ============================================
    getFormattedDates() {
      // Get today's date in YYYY-MM-DD format
      const today = dayjs().format("YYYY-MM-DD");

      // Get first day of current month
      const firstDay = dayjs().startOf("month").format("YYYY-MM-DD");

      // Get last day of current month
      const lastDay = dayjs().endOf("month").format("YYYY-MM-DD");

      // Format for display (DD/MM/YYYY)
      const displayDate = formatDate(today, "read_date"); // "18/01/2026"

      // Format with time
      const displayDateTime = formatDate(today, "read_datetime"); // "18/01/2026 10:30:00"

      return { today, firstDay, lastDay, displayDate };
    },

    setDefaultDates() {
      // Set from_date to first day of month
      this.from_date = dayjs().startOf("month").format("YYYY-MM-DD");
      // Set to_date to today
      this.to_date = dayjs().format("YYYY-MM-DD");
    },

    // ============================================
    // SESSION MANAGEMENT (getSession, setSession)
    // ============================================
    checkLogin() {
      const username = getSession("username");
      if (check_is_null_or_blank(username)) {
        // User not logged in, redirect to login
        go_to_page("/login");
        return false;
      }
      return true;
    },

    saveFilterToSession() {
      // Save current filter values to session for persistence
      setSession("order_filter", {
        from_date: this.from_date,
        to_date: this.to_date,
        selected_user: this.selected_user,
      });
    },

    loadFilterFromSession() {
      // Restore filter values from session
      const savedFilter = getSession("order_filter");
      if (!check_is_null_or_blank(savedFilter)) {
        this.from_date = savedFilter.from_date || "";
        this.to_date = savedFilter.to_date || "";
        this.selected_user = savedFilter.selected_user || "";
      }
    },

    // ============================================
    // TRANSLATION (t)
    // ============================================
    getTranslatedStatus(status) {
      // t() translates strings based on user's language setting
      const statusMap = {
        pending: t("Pending"),
        approved: t("Approved"),
        rejected: t("Rejected"),
      };
      return statusMap[status] || status;
    },

    // ============================================
    // MESSAGES (show_message)
    // ============================================
    async saveData() {
      try {
        let data = {
          schema: get_schema(),
          table: "orders",
          data: JSON.stringify(this.form),
        };

        const result = await request("/insert", data, "post");

        if (result.success) {
          // Success message
          show_message("success", t("Saved successfully"));
          await this.get_data(); // Refresh grid
        } else {
          // Error message
          show_message("error", t("Error saving data"));
        }
      } catch (error) {
        show_message("error", t("Connection error"));
      }
    },

    // ============================================
    // NAVIGATION (go_to_page, go_back)
    // ============================================
    onClickDetail(row) {
      // Navigate to detail page with query params
      go_to_page("/orders/detail", { id: row.id_orders });
    },

    onAdd() {
      // Navigate to create page
      go_to_page("/orders/create");
    },

    onCancel() {
      // Go back to previous page
      go_back("/orders");
    },

    // ============================================
    // UTILITY FUNCTIONS
    // ============================================
    async delayedAction() {
      show_message("info", "Processing...");
      await sleep(2000); // Wait 2 seconds
      show_message("success", "Done!");
    },

    // Get list of dates for a range
    getDateRange() {
      // Returns array of dates: ['2024-01-01', '2024-01-02', ...]
      return getDateList(this.from_date, this.to_date);
    },

    // Format numbers for display
    formatAmount(amount) {
      // 1234567 -> "1.234.567.00"
      return formatNumber(amount, ".", 2);
    },

    // Extract IDs from list
    getSelectedIds() {
      // From: [{ id: 1, name: 'A' }, { id: 2, name: 'B' }]
      // To: [1, 2]
      return convertListToListOfField(this.rows, "id_orders");
    },
  },

  async mounted() {
    // Set schema
    this.table_schema = get_schema();

    // Check login
    if (!this.checkLogin()) {
      return;
    }

    // Load dropdown data
    await this.load_users();

    // Set default dates
    this.setDefaultDates();

    // Load filter from session (if any)
    this.loadFilterFromSession();

    // Load initial data
    await this.get_data();
  },

  watch: {
    // Auto-save filter when changed
    from_date() {
      this.saveFilterToSession();
    },
    to_date() {
      this.saveFilterToSession();
    },
  },
};
</script>
