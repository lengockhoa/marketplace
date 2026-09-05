<template>
  <div class="row">
    <a-table :ref="ref" :scroll="{ x: 240 }" bordered :dataSource="computed_rows" :columns="computed_columns" :pagination="pagination" :is_checkbox="is_checkbox" @change="handleTableChange">
      <template #customFilterDropdown="{ setSelectedKeys, selectedKeys, confirm, clearFilters, column }">
        <div style="padding: 8px">
          <a-input
            ref="searchInput"
            :placeholder="`Search ${column.dataIndex}`"
            :value="selectedKeys[0]"
            style="width: 188px; margin-bottom: 8px; display: block"
            @change="(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])"
            @pressEnter="handleSearch(selectedKeys, confirm, column.dataIndex)" />
          <a-button type="primary" size="small" style="width: 90px; margin-right: 8px" @click="handleSearch(selectedKeys, confirm, column.dataIndex)"> Search </a-button>
          <a-button size="small" style="width: 90px" @click="handleReset(clearFilters, confirm)"> Reset </a-button>
        </div>
      </template>
      <template v-if="is_checkbox" #headerCell="{ column }">
        <template v-if="column.key === 'checkbox'">
          <a-checkbox :checked="is_select_all" @change="selectAll"></a-checkbox>
        </template>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'checkbox' && is_checkbox">
          <a-checkbox :checked="record.selected" @change="onSelectChange(record, $event)"></a-checkbox>
        </template>
        <template v-if="column.key === 'edit' && is_edit">
          <button style="'min-width: 108px; background-color:' + color + ';'" class="btn btn-flat btn-small" @click="handleClickEdit(record)">
            <svg style="height: 20px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              <path
                d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z" />
            </svg>
          </button>
        </template>
        <template v-if="column.type === 'date'"> {{ get_date_format(record[column.key]) }} </template>
      </template>
    </a-table>
    <div class="pagination-container mb-5 mt-3">
      <a-button v-if="is_export" type="primary" style="background-color: #2e86c1" size="medium" @click="handleExport()">Excel</a-button>
      <span v-if="export_err_msg !== ''" style="color: red">{{ export_err_msg }}</span>
      <span v-if="pagination.total > 0">
        Total: <span style="font-weight: bold; color: #2e86c1">{{ pagination.total }}</span>
      </span>
      <a-pagination v-if="pagination.total > 0" :current="pagination.current" :total="pagination.total" :pageSize="pagination.pageSize" show-size-changer :page-size-options="pagination.pageSizeOptions" @change="handlePageChange" />
    </div>
  </div>
</template>
<script>
import { v4 as uuidv4 } from "uuid";
// import { utils, writeFile } from "xlsx";
import dayjs from "dayjs";
export default {
  computed: {
    computed_columns() {
      for (let i = 0; i < this.columns.length; i++) {
        this.columns[i]["customFilterDropdown"] = true;
        this.columns[i]["onFilter"] = (value, record) => record[this.columns[i]["key"]].toString().trim().toLowerCase().includes(value.toLowerCase().trim());
        this.columns[i]["sorter"] = (a, b) => {
          const valueA = a[this.columns[i]["key"]] ?? 0;
          const valueB = b[this.columns[i]["key"]] ?? 0;
          if (typeof valueA === "number" && typeof valueB === "number") {
            return valueA - valueB;
          } else {
            return String(valueA).localeCompare(String(valueB));
          }
        };
      }
      let result = this.columns.slice();
      if (this.is_checkbox) {
        result.unshift({
          key: "checkbox",
          dataIndex: "checkbox",
          title: "",
        });
      }
      if (this.is_edit) {
        result.unshift({
          key: "edit",
          dataIndex: "edit",
          title: "Detail",
          width: 80,
        });
      }
      return result;
    },
    computed_rows() {
      return this.rows.slice();
    },
  },
  props: {
    rows: {
      type: Array,
      default: () => {
        return [];
      },
    },
    columns: {
      type: Array,
      default: () => {
        return [];
      },
    },
    is_checkbox: {
      type: Boolean,
      default: false,
    },
    is_edit: {
      type: Boolean,
      default: true,
    },
    is_export: {
      type: Boolean,
      default: true,
    },
    ref: {
      type: String,
      default: () => {
        return uuidv4();
      },
    },
  },
  emits: ["onClickDetail", "onClickEdit"],
  methods: {
    resetErrorMsg() {
      this.export_err_msg = "";
    },
    onClickDetail(record) {
      this.$emit("onClickDetail", record);
    },
    handleClickEdit(record) {
      this.$emit("onClickEdit", record);
    },
    handleTableChange(pagination) {
      this.pagination = pagination;
    },
    onSelectChange(record, e) {
      const checked = e.target.checked;
      record.selected = checked;
      this.updateSelectedRows();
    },
    handlePageChange(page, pageSize) {
      this.pagination.current = page;
      this.pagination.pageSize = pageSize;
      // this.$refs[ref].setCurrentPage(page);
    },
    filterArrayToExport(toFilter, attributesToKeep) {
      let filteredArray = toFilter.map((obj) => {
        let filteredObj = {};
        Object.entries(obj).forEach(([key, value]) => {
          if (attributesToKeep.includes(key)) {
            filteredObj[key] = value;
          }
        });
        return filteredObj;
      });
      return filteredArray;
    },
    async handleExport() {
      this.resetErrorMsg();
      if (this.computed_rows.length === 0) {
        this.export_err_msg = t("No data to export");
        return;
      }
      let col_lst = this.columns.map((obj) => obj.dataIndex);
      let to_export = this.filterArrayToExport(this.computed_rows, col_lst);
      const fileName = "exported_data.xlsx";
      // const worksheet = utils.json_to_sheet(to_export);
      // const workbook = utils.book_new();
      // utils.book_append_sheet(workbook, worksheet, "Sheet 1");
      // writeFile(workbook, fileName);
    },
    selectAll(e) {
      const checked = e.target.checked;
      for (let i = 0; i < this.computed_rows.length; i++) {
        this.computed_rows[i].selected = checked;
      }
      this.updateSelectedRows();
    },
    updateSelectedRows() {
      this.selectedRows = this.computed_rows.filter((row) => row.selected);
    },
    handleSearch(selectedKeys, confirm, dataIndex) {
      confirm();
    },
    handleReset(clearFilters, confirm) {
      clearFilters({
        confirm: true,
      });
      confirm();
    },
    get_date_format(record) {
      return dayjs(record).format("DD/MM/YYYY");
    },
  },
  data() {
    return {
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0,
        pageSizeOptions: ["10", "20", "30", "40"],
      },
      is_select_all: false,
      selectedRows: [],
      export_err_msg: "",
    };
  },
  watch: {
    rows: {
      deep: true,
      handler(newVal) {
        this.pagination.total = this.rows.length;
      },
    },
    computed_rows() {
      this.resetErrorMsg();
    },
    selectedRows() {
      this.is_select_all = this.selectedRows.length > 0 ? true : false;
    },
  },
};
</script>
<style>
.ant-table-thead > tr > th {
  background-color: #fafafa !important;
}
table {
  box-shadow: 5px 10px 18px #888888;
  border-radius: 20px;
  border-collapse: collapse;
}
.ant-table-filter-trigger {
  color: black !important;
}
.ant-table-filter-trigger.active {
  color: #ff2718 !important;
}
.ant-table-column-sorter {
  color: black !important;
}
.ant-table-column-sorter-up.active,
.ant-table-column-sorter-down.active {
  color: #ff2718 !important;
}
.pagination-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.ant-table-pagination {
  display: none;
}
</style>
