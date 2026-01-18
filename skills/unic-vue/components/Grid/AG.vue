<!-- <GridAG id="gridag" :columns="columns_list" :rows="rows" @onClickDetail="onClickDetail" @onAdd="onAdd" @reloadData="reloadData" :can_delete="true" :height="table_height" :table="table_name" :table_schema="table_schema" /> -->
<!-- :extra_button="[{ name: 'test', key: 'test', 'type': 'warning' }]" @onExtraBtnClick="onExtraBtnClick" -->
<!-- If have checkbox then use @getSelectedRows="getSelectedRows" -->
<template>
  <div>
    <ControlPopupConfirm :visible="show_confirm_delete" :title="t('Confirm')" :message="t('Are you sure to delete this record?')" @onClose="onClose" @onConfirm="onConfirm" />
    <ControlPopupConfirm
      :visible="show_confirm_sync"
      title="Confirm"
      message="All data will be deleted and replaced with new data. You must be sure that you want to replace all the data with the uploaded Excel file. You should DOWNLOAD the data for BACKUP to ensure safety before synchronization"
      @onClose="onCloseSync"
      @onConfirm="onConfirmSync"
    />
    <ControlPopupConfirm :visible="show_confirm_upload" title="Confirm" :message="'The data will be added. Make sure COLUMN: ' + upload_key.join(', ') + ' NOT have dupplicate value.'" @onClose="onCloseUpload" @onConfirm="onConfirmUpload" />
    <div class="d-flex justify-content-between mb-2">
      <span>
        <ControlButton v-if="can_add" classes="button button-success button-small" :name="t('Add')" @onClick="onAdd" />
        <ControlButton v-if="can_export" classes="button button-warning button-small" :name="t('Refresh')" @onClick="reloadData" />
        <ControlButton v-if="can_export" classes="button button-light button-small" :name="t('Export')" @onClick="onBtnExportExcel" />
        <ControlButton v-if="can_upload" classes="button button-light button-small" :name="t('Import')" @onClick="onBtnUpload" />
        <ControlButton v-for="item in extra_button" :classes="`button button-${item.type} button-small`" :name="item.name" @onClick="onExtraBtnClick(item.key)" />
      </span>
      <input style="display: none" ref="click_sync_file" id="click_sync_file" type="file" class="form-control input-style" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" @change="onChooseImg" />
      <input style="display: none" ref="click_upload_file" id="click_upload_file" type="file" class="form-control input-style" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" @change="onChooseImgUpload" />
      <div style="display: flex; align-items: center; height: 50px">
        <i style="margin-left: 10px" v-if="can_upload" @click="onBtnUpload" class="fas fa-upload"></i>
        <i style="margin-left: 10px" v-if="can_sync" @click="onBtnSync" class="fas fa-sync"></i>
        <input v-if="can_search" type="text" class="form-control" style="width: 250px; height: 30px; margin: 10px 5px 10px 15px; border-radius: 2px" id="filter-text-box" :placeholder="'&#128269; ' + t('Type to search')" v-on:input="onFilterTextBoxChanged()" />
      </div>
    </div>
    <div>
      <ag-grid-vue
        :id="id"
        :ref="id"
        class="ag-theme-alpine"
        :pagination="true"
        :paginationPageSize="pagesize"
        :suppressSizeToFit="true"
        :enableCellTextSelection="true"
        @grid-ready="onGridReady"
        @first-data-rendered="onFirstDataRendered"
        :quickFilterMatcher="quickFilterMatcher"
        @cell-clicked="onCellClicked"
        @column-resized="onColumnResized"
        @cellValueChanged="onCellValueChanged"
        @filter-changed="onFilterChanged"
        :defaultColDef="defaultColDef"
        :style="'width: 100%; height: ' + this.calculateGridHeight() + 'px'"
        :rowSelection="'multiple'"
        :columnDefs="columns_computed"
        :rowData="rows"
        :pinnedBottomRowData="pinnedBottomRowData"
        :getRowStyle="getRowStyle"
      >
      </ag-grid-vue>
    </div>
  </div>
</template>
<script>
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { AgGridVue } from "ag-grid-vue3";

import { v4 as uuidv4 } from "uuid";
import dayjs from "dayjs";
import { writeFile, read, utils } from "xlsx";

import CustomDropdownEditor from "./CustomDropdownEditor.vue";
import CustomDropdownEditorEnable from "./CustomDropdownEditorEnable.vue";

export default {
  props: {
    height: {
      type: [String, Number],
      default: "600px",
    },
    is_fix_height: {
      type: Boolean,
      default: false,
    },
    rows: {
      type: Array,
      default: [],
    },
    columns: {
      type: Array,
      default: [],
    },
    can_add: {
      type: Boolean,
      default: true,
    },
    can_search: {
      type: Boolean,
      default: true,
    },
    have_checkbox: {
      type: Boolean,
      default: false,
    },
    can_edit: {
      type: Boolean,
      default: true,
    },
    can_delete: {
      type: Boolean,
      default: false,
    },
    can_export: {
      type: Boolean,
      default: true,
    },
    can_refresh: {
      type: Boolean,
      default: true,
    },
    can_sync: {
      type: Boolean,
      default: false,
    },
    can_upload: {
      type: Boolean,
      default: false,
    },
    upload_key: {
      type: Array,
      default: [],
    },
    is_loading: {
      type: Boolean,
      default: false,
    },
    table: {
      type: String,
      default: "",
    },
    table_schema: {
      type: String,
      default: "",
    },
    detail_button_list: {
      type: Array,
      default: [],
    },
    extra_button: {
      type: Array,
      default: [],
    },
    show_total: {
      type: Boolean,
      default: false,
    },
    id: {
      type: String,
      default: () => {
        return uuidv4();
      },
    },
  },
  components: {
    AgGridVue,
    CustomDropdownEditor,
    CustomDropdownEditorEnable,
  },
  computed: {
    columns_computed() {
      let to_return = [];
      if (this.have_checkbox) {
        to_return.push({
          field: "is_check",
          headerName: "",
          headerCheckboxSelection: true,
          checkboxSelection: (params) => params.node.rowPinned !== "bottom",
          showDisabledCheckboxes: true,
          maxWidth: 50,
        });
      }
      if (this.can_edit) {
        to_return.push({
          field: "edit",
          headerName: "",
          cellRenderer: (params) => {
            if (params.node.rowPinned === "bottom") {
              return "";
            }
            return `<span>
                    <svg data-action="edit" xmlns="https://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512"><path d="M402.6 83.2l90.2 90.2c3.8 3.8 3.8 10 0 13.8L274.4 405.6l-92.8 10.3c-12.4 1.4-22.9-9.1-21.5-21.5l10.3-92.8L388.8 83.2c3.8-3.8 10-3.8 13.8 0zm162-22.9l-48.8-48.8c-15.2-15.2-39.9-15.2-55.2 0l-35.4 35.4c-3.8 3.8-3.8 10 0 13.8l90.2 90.2c3.8 3.8 10 3.8 13.8 0l35.4-35.4c15.2-15.3 15.2-40 0-55.2zM384 346.2V448H64V128h229.8c3.2 0 6.2-1.3 8.5-3.5l40-40c7.6-7.6 2.2-20.5-8.5-20.5H48C21.5 64 0 85.5 0 112v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V306.2c0-10.7-12.9-16-20.5-8.5l-40 40c-2.2 2.3-3.5 5.3-3.5 8.5z"/></svg>
                    </span>`;
          },
          maxWidth: 55,
          resizable: false,
          filter: false,
          sortable: false,
        });
      }
      for (let i = 0; i < this.detail_button_list.length; i++) {
        to_return.push({
          field: this.detail_button_list[i]["key"],
          headerName: "",
          cellRenderer: (params) => {
            if (params.node.rowPinned === "bottom") {
              return "";
            }
            return `<button type="button" class='btn btn-sm btn-${this.detail_button_list[i]["type"]}'>${this.detail_button_list[i]["name"]}</button>`;
          },
          maxWidth: this.detail_button_list[i]["width"] || 140,
          resizable: false,
          filter: false,
          sortable: false,
          cellClass: "no-padding-cell",
        });
      }
      // Count non-number columns for colSpan in total row
      let nonNumberColCount = 0;
      for (let j = 0; j < this.columns.length; j++) {
        if (this.columns[j].type === "number") break;
        nonNumberColCount++;
      }

      for (let i = 0; i < this.columns.length; i++) {
        this.columns[i]["headerName"] = this.columns[i]["title"];
        const obj = { field: this.columns[i]["key"], headerName: this.columns[i]["title"] };

        // Add colSpan and cellRenderer to first column for total row
        if (i === 0 && this.show_total && nonNumberColCount > 1) {
          obj["colSpan"] = (params) => {
            if (params.node.rowPinned === "bottom") {
              return nonNumberColCount;
            }
            return 1;
          };
          obj["cellRenderer"] = (params) => {
            if (params.node.rowPinned === "bottom") {
              return "<strong>Total</strong>";
            }
            return params.value;
          };
        }

        if (this.columns[i]["type"] === "number") {
          obj["filter"] = "agNumberColumnFilter";
          obj["type"] = "numericColumn";
          obj["valueFormatter"] = function (params) {
            if (typeof params.value === "string") {
              return params.value === "" ? "" : params.value;
            }
            if (params.value === null || params.value === undefined || isNaN(params.value)) {
              return "";
            }
            return params.value.toLocaleString();
          };
          obj["valueParser"] = function (params) {
            const newValue = Number(params.newValue);
            if (isNaN(newValue)) {
              alert("Please enter a valid number!");
              return params.oldValue; // Keep the old value if invalid
            }
            return newValue;
          };
        } else if (this.columns[i]["type"] === "date") {
          obj["filter"] = "agDateColumnFilter";
          obj["filterParams"] = {
            comparator: (filterLocalDateAtMidnight, cellValue) => {
              if (!cellValue) return -1;
              const cellDate = dayjs(cellValue, "YYYY-MM-DD").format("YYYY-MM-DD");
              const filterDate = dayjs(filterLocalDateAtMidnight).format("YYYY-MM-DD");
              if (cellDate > filterDate) return 1;
              if (cellDate < filterDate) return -1;
              return 0; // equal
            },
            filterOptions: ["equals", "greaterThanOrEqual", "lessThanOrEqual"],
          };
          obj["valueFormatter"] = this.dateFormatter;
        } else if (this.columns[i]["type"] === "datetime") {
          obj["filter"] = "agDateColumnFilter";
          obj["filterParams"] = {
            comparator: (filterLocalDateAtMidnight, cellValue) => {
              if (!cellValue) return -1;
              const cellDate = dayjs(cellValue, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD");
              const filterDate = dayjs(filterLocalDateAtMidnight).format("YYYY-MM-DD");
              if (cellDate > filterDate) return 1;
              if (cellDate < filterDate) return -1;
              return 0; // equal
            },
            filterOptions: ["equals", "greaterThanOrEqual", "lessThanOrEqual"],
          };
          obj["valueFormatter"] = this.datetimeFormatter;
        } else if (this.columns[i]["type"] === "html") {
          obj["cellRenderer"] = function (params) {
            return params.value;
          };
        } else if (this.columns[i]["type"] === "checkbox") {
          obj["cellEditor"] = "agCheckboxCellEditor";
          obj["cellDataType"] = "boolean";
        } else if (this.columns[i]["type"] === "selectbox") {
          obj["cellEditor"] = "agSelectCellEditor";
          obj["cellEditorParams"] = {
            values: this.columns[i]["selectbox_list"],
          };
          obj["editable"] = true; // this line is commented out
        } else if (this.columns[i]["type"] === "dropdown") {
          obj["cellRendererSelector"] = (params) => {
            if (params.node.rowPinned === "bottom") {
              return { component: () => "" };
            }
            return {
              component: "CustomDropdownEditorEnable",
              params: {
                options: this.columns[i]["dropdown_list"],
                can_edit: this.columns[i]["can_edit"],
              },
            };
          };
          obj["cellClass"] = "dropdown-cell";
          // obj["cellEditor"] = "CustomDropdownEditor";
          // obj["cellEditorParams"] = {
          //   options: this.columns[i]["dropdown_list"],
          // };
        } else {
          obj["filter"] = "agTextColumnFilter";
        }
        if (this.columns[i]["width"]) {
          obj["width"] = this.columns[i]["width"];
        }
        if (this.columns[i]["minWidth"]) {
          obj["minWidth"] = this.columns[i]["minWidth"];
        }
        if (this.columns[i]["maxWidth"]) {
          obj["maxWidth"] = this.columns[i]["maxWidth"];
        }
        if (this.columns[i]["editable"]) {
          obj["editable"] = true;
        } else {
          obj["editable"] = false;
        }
        if (this.columns[i]["aggFunc"]) {
          obj["aggFunc"] = this.columns[i]["aggFunc"];
        }
        if (this.columns[i]["suppressAutoSize"]) {
          obj["suppressAutoSize"] = this.columns[i]["suppressAutoSize"];
        }
        if (this.columns[i]["nopadding"]) {
          obj["cellClass"] = "no-padding-cell";
        }
        to_return.push(obj);
        // this.columns[i]["customFilterDropdown"] = true;
        // this.columns[i]["onFilter"] = (value, record) => record[this.columns[i]["key"]].toString().trim().toLowerCase().includes(value.toLowerCase().trim());
        // this.columns[i]["sorter"] = (a, b) => {
        //   const valueA = a[this.columns[i]["key"]] ?? 0;
        //   const valueB = b[this.columns[i]["key"]] ?? 0;
        //   if (typeof valueA === "number" && typeof valueB === "number") {
        //     return valueA - valueB;
        //   } else {
        //     return String(valueA).localeCompare(String(valueB));
        //   }
        // };
      }
      if (this.can_delete) {
        to_return.push({
          field: "delete",
          headerName: "",
          cellRenderer: (params) => {
            if (params.node.rowPinned === "bottom") {
              return "";
            }
            return `<span>
                      <svg data-action="delete" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg>
                    </span>`;
          },
          maxWidth: 55,
          resizable: false,
          filter: false,
          sortable: false,
        });
      }
      return to_return;
    },
    pinnedBottomRowData() {
      if (!this.show_total || !this.rows || this.rows.length === 0) {
        return [];
      }

      const totalRow = { _isTotalRow: true };

      // Put "Total" in the first column
      if (this.columns.length > 0) {
        totalRow[this.columns[0].key] = "Total";
      }

      // Calculate sums for numeric columns
      for (const col of this.columns) {
        if (col.type === "number") {
          let sum = 0;
          for (const row of this.rows) {
            const value = row[col.key];
            if (typeof value === "number" && !isNaN(value)) {
              sum += value;
            }
          }
          totalRow[col.key] = sum;
        }
      }

      return [totalRow];
    },
  },
  setup() {
    const myGrid = ref(null);
    return {
      myGrid,
      columnDefs: [],
      defaultColDef: {
        flex: 1,
        minWidth: 100,
        width: 100,
        sortable: true,
        resizable: true,
        filter: true,
      },
      rowSelection: null,
    };
  },
  data() {
    return {
      gridApi: null,
      gridColumnApi: null,
      show_confirm_delete: false,
      show_confirm_sync: false,
      show_confirm_upload: false,
      to_delete_obj: {},
      to_delete_row_index: {},
      pagesize: 20,
      pageSizes: [10, 20, 50, 100],
      rowHeight: 42,
    };
  },
  methods: {
    getRowStyle(params) {
      if (params.node.rowPinned === "bottom") {
        return {
          fontWeight: "bold",
          backgroundColor: "#f5f5f5",
          borderTop: "2px solid #ddd",
        };
      }
      return null;
    },
    onBtnUpload() {
      this.show_confirm_upload = true;
    },
    onCloseUpload() {
      this.show_confirm_upload = false;
    },
    onConfirmUpload() {
      this.show_confirm_upload = false;
      $("#click_upload_file").click();
    },
    onChooseImgUpload(e) {
      let attFiles = e.target.files;
      let arr = Array.from(attFiles);
      this.readExcelUpload(arr[0]);
      this.$refs.click_upload_file.value = "";
    },
    async readExcelUpload(file) {
      const fileReader = await new FileReader();
      fileReader.readAsArrayBuffer(file);

      fileReader.onload = (e) => {
        const bufferArray = e?.target.result;
        const wb = read(bufferArray, { type: "buffer" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const columnsArrayFromXlsx = utils.sheet_to_json(ws, { header: 1 })[0];
        const colArrayWeb = this.columns.map((obj) => obj.title);
        for (let i = 0; i < columnsArrayFromXlsx.length; i++) {
          if (!colArrayWeb.includes(columnsArrayFromXlsx[i])) {
            show_message("error", "File có tên cột " + columnsArrayFromXlsx[i] + " không đúng với web");
            return true;
          }
        }
        let renameObj = {};
        for (let i = 0; i < this.columns.length; i++) {
          renameObj[this.columns[i].title] = this.columns[i].key;
        }
        const data = utils.sheet_to_json(ws);
        if (check_is_null_or_blank(data)) {
          show_message("error", "File không có dữ liệu");
          return true;
        }
        const updatedArr = data.map((item) => {
          const newItem = {};
          for (const key in item) {
            const newKey = renameObj[key] || key; // use mapped key or keep original
            newItem[newKey] = item[key];
          }
          return newItem;
        });
        this.uploadDataToServer(updatedArr);
      };
    },
    async uploadDataToServer(uploadData) {
      let data = {
        schema: this.table_schema,
        table: this.table,
        data: uploadData,
        key: this.upload_key,
      };
      let resp = await request("/upload_more_data", data);
      if (resp.success) {
        show_message("success", "Upload success");
      } else {
        show_message("error", "Upload problem, please check excel file and try again");
      }
      await this.reloadData();
    },
    onBtnSync() {
      this.show_confirm_sync = true;
    },
    onCloseSync() {
      this.show_confirm_sync = false;
    },
    onConfirmSync() {
      this.show_confirm_sync = false;
      $("#click_sync_file").click();
    },
    onChooseImg(e) {
      this.attFiles = e.target.files;
      let tmp = [];
      let arr = Array.from(this.attFiles);
      this.readExcel(arr[0]);
      this.$refs.click_sync_file.value = "";
    },
    async readExcel(file) {
      const fileReader = await new FileReader();
      fileReader.readAsArrayBuffer(file);

      fileReader.onload = (e) => {
        const bufferArray = e?.target.result;
        const wb = read(bufferArray, { type: "buffer" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];

        const columnsArrayFromXlsx = utils.sheet_to_json(ws, { header: 1 })[0];
        const colArrayWeb = this.columns.map((obj) => obj.key);
        // if (columnsArrayFromXlsx.length !== colArrayWeb.length) {
        //   show_message("File có số cột không đúng với web", "error");
        //   return true;
        // }
        for (let i = 0; i < columnsArrayFromXlsx.length; i++) {
          if (!colArrayWeb.includes(columnsArrayFromXlsx[i])) {
            show_message("File có tên cột " + columnsArrayFromXlsx[i] + " không đúng với web", "error");
            return true;
          }
        }

        const data = utils.sheet_to_json(ws);
        if (check_is_null_or_blank(data)) {
          show_message("File không có dữ liệu", "error");
          return true;
        }
        this.syncDataToServer(data);
      };
    },
    async syncDataToServer(syncData) {
      let data = {
        schema: this.table_schema,
        table: this.table,
        data: syncData,
      };
      await request("/sync", data);
      await this.reloadData();
    },
    onExtraBtnClick(key) {
      this.$emit("onExtraBtnClick", key);
      if (this.have_checkbox) {
        this.getSelectedRows(key);
      }
    },
    getSelectedRows(key) {
      let selectedRows = this.gridApi.getSelectedRows();
      this.$emit("getSelectedRows", key, selectedRows);
    },
    onFilterChanged() {
      const filterModel = this.gridApi.getFilterModel();
      setSession(this.$route.path + "agGridFilterModel", JSON.stringify(filterModel));
    },
    async onGridReady(params) {
      this.gridApi = params.api;
      this.gridColumnApi = params.columnApi;
      this.gridApi.showLoadingOverlay();
      const savedFilterModel = getSession(this.$route.path + "agGridFilterModel");
      if (savedFilterModel) {
        this.gridApi.setFilterModel(JSON.parse(savedFilterModel));
      }
    },
    async onFirstDataRendered() {
      // console.log("after run first data");
      const agPagination = document.querySelector("#" + this.id + " .ag-paging-panel");
      // check if the select box already exists
      if (agPagination.querySelector(".custom-pagination-controls")) {
        return;
      }
      const selectBox = document.createElement("div");
      selectBox.classList.add("custom-pagination-controls");
      selectBox.innerHTML = `
        <label for="page-size" style="margin-right: 5px; font-weight: bold">${t("Rows")}:</label>
        <select id="page-size">
          ${this.pageSizes.map((size) => `<option value="${size}" ${size === this.pagesize ? "selected" : ""}>${size}</option>`).join("")}
        </select>
      `;
      // append child to the left
      agPagination.insertBefore(selectBox, agPagination.firstChild);
      // agPagination.appendChild(selectBox);

      // Add event listener for the select box
      selectBox.querySelector("select").addEventListener("change", this.onPageSizeChanged);
      // setTimeout(() => {
      //   this.autoSizeAll(true);
      // }, 1000);
    },
    onPageSizeChanged(event) {
      this.gridApi.paginationSetPageSize(Number(event.target.value));
      this.pagesize = Number(event.target.value);
    },
    calculateGridHeight() {
      const headerHeight = 49; // Adjust based on your grid header height
      const paginationHeight = 50; // Adjust based on your pagination controls height
      const horizontal_height = 15;
      const total_height = headerHeight + paginationHeight + +horizontal_height;
      if (this.is_fix_height) {
        return parseInt(this.height);
      } else {
        if (this.rows.length < this.pagesize) {
          if (this.rows.length === 0) {
            return total_height + 70;
          }
          return total_height + this.rows.length * this.rowHeight;
        }
        return total_height + this.pagesize * this.rowHeight;
      }
    },
    async onColumnResized() {
      // await this.autoSizeAll(true);
    },
    async autoSizeAll(skipHeader) {
      // console.log(skipHeader)
      // if (this.gridColumnApi == null) return;
      // if (this.columns.length > 10) {
      //   this.gridColumnApi.autoSizeAllColumns(skipHeader);
      // }
    },
    onFilterTextBoxChanged() {
      this.gridApi.setQuickFilter(bodautiengviet(document.getElementById("filter-text-box").value));
    },
    quickFilterMatcher(quickFilterParts, rowQuickFilterAggregateText) {
      return quickFilterParts.every((part) => {
        return bodautiengviet(rowQuickFilterAggregateText).toUpperCase().match(part.toUpperCase());
      });
    },
    onCellValueChanged(e) {
      this.$emit("onCellValueChanged", e);
    },
    onBtExport() {
      this.gridApi.exportDataAsCsv();
    },
    getColumnTitle(key) {
      for (let i = 0; i < this.columns.length; i++) {
        if (this.columns[i].key === key) {
          return this.columns[i].title;
        }
      }
      return "";
    },
    removeHTMLTags(str) {
      if (str && str.replace) {
        return str.replace(/<[^>]*>/g, "");
      }
      return str;
    },
    filterArrayToExport(toFilter, attributesToKeep) {
      let filteredArray = toFilter.map((obj) => {
        let filteredObj = {};
        // Use the order from this.columns to maintain consistency
        for (let i = 0; i < this.columns.length; i++) {
          const column = this.columns[i];
          const key = column.key;
          const title = column.title;

          if (obj.hasOwnProperty(key) && title !== "") {
            filteredObj[title] = this.removeHTMLTags(obj[key]);
          }
        }
        return filteredObj;
      });
      return filteredArray;
    },
    onBtnExportExcel() {
      let col_lst = this.columns.map((obj) => obj.key);
      let to_export = this.filterArrayToExport(this.rows, col_lst);
      // Create workbook & worksheet
      const fileName = "export.xlsx";
      const workbook = utils.book_new();
      const worksheet = utils.json_to_sheet(to_export);
      utils.book_append_sheet(workbook, worksheet, "Data");
      writeFile(workbook, fileName);
    },
    onAdd() {
      this.$emit("onAdd");
    },
    onClose() {
      this.show_confirm_delete = false;
    },
    resetSearchBox() {
      $("#filter-text-box").val("");
      this.onFilterTextBoxChanged();
    },
    async reloadData() {
      this.$emit("reloadData");
    },
    async onConfirm() {
      this.$emit("onDeleteRowIndex", this.to_delete_row_index);
      let data = {};
      data["id_" + this.table] = this.to_delete_obj["id_" + this.table];
      data["schema"] = this.table_schema;
      data["table"] = this.table;
      await request("/hard_delete", data);
      await this.reloadData();
      this.onClose();
    },
    onCellClicked(params) {
      if (params.column.colId === "edit") {
        this.$emit("onClickDetail", params.data);
        return;
      }
      if (params.column.colId === "delete") {
        this.to_delete_obj = params.data;
        this.to_delete_row_index = params.rowIndex;
        this.show_confirm_delete = true;
        return;
      }
      for (let i = 0; i < this.detail_button_list.length; i++) {
        if (params.column.colId === this.detail_button_list[i]["key"]) {
          this.$emit("onExtraDetailBtnClick", this.detail_button_list[i]["key"], params.data);
          return;
        }
      }
    },
    dateFormatter(params) {
      if (dayjs(params.value).isValid()) {
        return dayjs(params.value).format("DD-MM-YYYY");
      } else {
        return "";
      }
    },
    datetimeFormatter(params) {
      if (dayjs(params.value).isValid()) {
        return dayjs(params.value).format("DD-MM-YYYY HH:mm:ss");
      } else {
        return "";
      }
    },
  },
  mounted() {
    this.onFirstDataRendered();
  },
  watch: {
    is_loading: {
      async handler(newVal, oldVal) {
        if (newVal) {
          this.gridApi.showLoadingOverlay();
        } else {
          this.gridApi.hideOverlay();
        }
      },
      deep: true,
    },
  },
};
</script>
<style>
.ag-icon-filter {
  color: red;
}
.no-padding-cell {
  padding-left: 0 !important;
  padding-right: 0 !important;
}
.ag-header-cell,
.ag-header-group-cell {
  padding-left: 2px;
  padding-right: 2px;
}
.ag-header-cell-label,
.ag-header-group-cell-label {
  align-items: center;
  align-self: stretch;
  display: flex;
  flex: 1 1 auto;
  overflow: hidden;
  text-overflow: ellipsis;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}
</style>
