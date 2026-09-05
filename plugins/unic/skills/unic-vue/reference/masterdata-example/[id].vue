<template>
    <div class="col-12">
      <div class="row mt-2">
        <div class="col-12">
          <div class="row">
            <div class="col-12">
              <ControlInput :name="t('Name')" id="name" :required="true" v-model="workingObj.name" />
            </div>
          </div>
          <div class="row">
            <div class="col-12">
              <ControlDropdownlist :name="t('Type')" id="type" :required="true" v-model="workingObj.modern_trade" :list="modernTradeList" />
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="mt-2 mb-2 col-12">
          <div class="d-flex justify-content-between text-center">
            <ControlButton type="secondary" :name="t('Close')" @onClick="clickClose()" />
            <ControlButton type="danger" :name="t('Delete')" @onClick="showConfirmDelete()" />
            <ControlButton type="success" :name="t('Save')" @onClick="clickSave()" />
          </div>
        </div>
      </div>
    </div>
    <ControlPopupConfirm :visible="show_confirm_delete" :title="t('Confirm')" :message="t('Are you sure to delete this record?')" @onClose="onClose" @onConfirm="clickDelete" />
  </template>
  <script>
  export default {
    data() {
      return {
        workingObj: {},
        modernTradeList: [],
        table: "branch",
        id_field_name: "id_branch",
        show_confirm_delete: false,
        required_fields: ['name', 'modern_trade']
      };
    },
    methods: {
      onClose(){
        this.show_confirm_delete = false;
      },
      showConfirmDelete(){
        this.show_confirm_delete = true;
      },
      async clickClose() {
        this.$router.back();
      },
      async clickDelete() {
        let data = this.workingObj;
        data["schema"] = get_schema();
        data["table"] = this.table;
        await request("/hard_delete", data);
        show_message("success", t("Data is Deleted"));
        this.clickClose();
      },
      async clickSave() {
        for (let field of this.required_fields) {
          if (check_is_null_or_blank(this.workingObj[field])) {
            show_message("error", field + ' ' + t(`is required`));
            return;
          }
        }
        let data = this.workingObj;
        data["schema"] = get_schema();
        data["table"] = this.table;
        await request("/save", data);
        show_message("success", t("Data is Saved"));
        this.clickClose();
      },
      async get_data(id) {
        let conditions = {};
        conditions[this.id_field_name] = id;
        let data = {
          schema: get_schema(),
          table: this.table,
          conditions: JSON.stringify(conditions),
        };
        let resp = await request("/select", data, "get");
        if (resp.length > 0) {
          this.workingObj = resp[0];
        }
      },
      async get_modern_trade_list() {
        let data = {
          schema: get_schema(),
          table: "modern_trade",
        };
        let resp = await request("/select", data, "get");
        this.modernTradeList = convertToDropdownValue(resp, "name", "name");
      },
    },
    async created() {
      let id_params = this.$route.params.id;
      if (id_params === "add") {
        this.workingObj = {};
      } else {
        await this.get_data(id_params);
      }
      await this.get_modern_trade_list();
    },
  };
  </script>
  