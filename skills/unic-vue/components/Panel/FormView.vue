<template>
  <ControlBox col="12" type="info">
    <div class="row">
      <template v-for="item in columns">
        <template v-if="item['show_form']">
          <template v-if="item['type'] === 'auto_generate'">
            <ControlMasterBoxColumn :item="item">
              <ControlInput :disabled="true" :name="item['title']" :id="item['key']" :required="item['required']" v-model="currentObj[item['key']]" />
            </ControlMasterBoxColumn>
          </template>
          <template v-if="item['type'] === 'input'">
            <ControlMasterBoxColumn :item="item">
              <ControlInput :disabled="item['primary'] && state.is_update" :name="item['title']" :id="item['key']" :required="item['required']" v-model="currentObj[item['key']]" />
            </ControlMasterBoxColumn>
          </template>
          <template v-if="item['type'] === 'number'">
            <ControlMasterBoxColumn :item="item">
              <ControlInput :disabled="item['primary'] && state.is_update" type="number" :name="item['title']" :id="item['key']" :required="item['required']" v-model="currentObj[item['key']]" />
            </ControlMasterBoxColumn>
          </template>
          <template v-if="item['type'] === 'password'">
            <ControlMasterBoxColumn :item="item">
              <ControlInput :disabled="item['primary'] && state.is_update" type="password" :name="item['title']" :id="item['key']" :required="item['required']" v-model="currentObj[item['key']]" />
            </ControlMasterBoxColumn>
          </template>
          <template v-if="item['type'] === 'boolean_dropdown'">
            <ControlMasterBoxColumn :item="item">
              <ControlDropdownlist :disabled="item['primary'] && state.is_update" :name="item['title']" :id="item['key']" :list="dropdown_data[item['key']]" :required="item['required']" v-model="currentObj[item['key']]" />
            </ControlMasterBoxColumn>
          </template>
          <template v-if="item['type'] === 'dropdown'">
            <ControlMasterBoxColumn :item="item">
              <ControlDropdownlist :disabled="item['primary'] && state.is_update" :name="item['title']" :id="item['key']" :list="dropdown_data[item['key']]" :required="item['required']" v-model="currentObj[item['key']]" />
            </ControlMasterBoxColumn>
          </template>
          <template v-if="item['type'] === 'dropdown_multiple'">
            <ControlMasterBoxColumn :item="item">
              <ControlDropdownlist :disabled="item['primary'] && state.is_update" :name="item['title']" :id="item['key']" :multiple="true" :list="dropdown_data[item['key']]" :required="item['required']" v-model="currentObj[item['key']]" />
            </ControlMasterBoxColumn>
          </template>
          <template v-if="item['type'] === 'date'">
            <ControlMasterBoxColumn :item="item">
              <ControlDatetime :disabled="item['primary'] && state.is_update" :name="item['title']" :id="item['key']" :required="item['required']" v-model="currentObj[item['key']]" />
            </ControlMasterBoxColumn>
          </template>
          <template v-if="item['type'] === 'datetime'">
            <ControlMasterBoxColumn :item="item">
              <ControlDatetime :disabled="item['primary'] && state.is_update" :show_time="true" :name="item['title']" :id="item['key']" :required="item['required']" v-model="currentObj[item['key']]" />
            </ControlMasterBoxColumn>
          </template>
          <template v-if="item['type'] === 'textarea'">
            <ControlMasterBoxColumn :item="item">
              <ControlInput :disabled="item['primary'] && state.is_update" type="textarea" :name="item['title']" :id="item['key']" :required="item['required']" v-model="currentObj[item['key']]" />
            </ControlMasterBoxColumn>
          </template>
        </template>
        <!-- 
        <div v-if="item['type'] === 'checkbox'">
          <ControlCheckbox :name="item['name']" :id="item['id']" :classes="item['classes']" :required="item['required']" v-model="item['value']" />
        </div>
        <div v-if="item['type'] === 'button'">
          <ButtonControl :button_list="item['button_list']" />
        </div> -->
      </template>
    </div>
  </ControlBox>
  <div class="row mb-5">
    <div class="d-flex justify-content-between text-center" v-if="allow_edit">
      <ControlButton type="secondary" name="Close" @onClick="clickClose()" />
      <ControlButton type="danger" name="Delete" @onClick="clickDelete()" />
      <ControlButton type="success" name="Save" @onClick="clickSave()" />
    </div>
    <div class="text-center" v-if="!allow_edit">
      <ControlButton type="secondary" name="Close" @onClick="clickClose()" />
    </div>
  </div>
</template>
<script>
export default {
  props: {
    workingObj: {
      type: Object,
      default: {},
    },
    rows: {
      type: Array,
      default: [],
    },
    table: {
      type: String,
      default: "",
    },
    columns: {
      type: Array,
      default: [],
    },
    table_schema: {
      type: String,
      default: "",
    },
    allow_edit: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      dropdown_data: {},
      button_list: [
        { name: "Close", type: "secondary" },
        { name: "Delete", type: "danger" },
        { name: "Save", type: "success" },
      ],
      currentObj: {},
      key_list: [],
    };
  },
  emits: ["reloadData"],
  methods: {
    async reloadData() {
      this.$emit("reloadData");
    },
    check_validation() {
      for (let i = 0; i < this.columns.length; i++) {
        if (this.columns[i]["required"] && check_is_null_or_blank(this.workingObj[this.columns[i]["key"]])) {
          show_message("error", "Please fill all required field: " + this.columns[i]["title"]);
          return false;
        }
        if (this.columns[i]["primary"]) {
          const check = [...this.rows].filter((e) => {
            if (!state.is_update) {
              return e[this.columns[i]["key"]] === this.workingObj[this.columns[i]["key"]];
            }
          });
          if (check.length > 0) {
            show_message("error", "Please Dupplicate value at: " + this.workingObj[this.columns[i]["key"]] + " on field: " + this.columns[i]["title"]);
            return false;
          }
        }
      }
      return true;
    },
    async clickSave() {
      if (!this.check_validation()) return;
      let data = this.workingObj;
      data["schema"] = this.table_schema;
      data["table"] = this.table;
      let resp = await request("/save", data);
      if(resp['success']) {
        let data = {
          schema: this.table_schema,
          sp_name: "sp_set_new_code",
          params: "()",
        };
        await request("/call", data);
      }
      this.reloadData();
    },
    async clickDelete() {
      let data = {};
      data["id_" + this.table] = this.workingObj["id_" + this.table];
      data["schema"] = this.table_schema;
      data["table"] = this.table;
      await request("/hard_delete", data);
      this.reloadData();
    },
    async clickClose() {
      this.reloadData();
    },
    async getDropdownValue() {
      this.key_list = [];
      this.dropdown_data = {};
      for (let i = 0; i < this.columns.length; i++) {
        if (this.columns[i]["type"].includes("dropdown")) {
          let data = {
            schema: this.columns[i]["dropdown_info"]["schema"],
            table: this.columns[i]["dropdown_info"]["table"],
            columns: [...new Set([...this.columns[i]["dropdown_info"]["field"].label, ...this.columns[i]["dropdown_info"]["field"].value])],
          };
          if (!check_is_null_or_blank(this.columns[i]["dropdown_info"]["conditions"])) {
            if (!check_is_null_or_blank(this.columns[i]["dropdown_info"]["conditions"]["related_field"])) {
              const fieldname = this.columns[i]["dropdown_info"]["conditions"]["related_field"];
              const check_field = [...this.columns].filter((e) => {
                return e["key"] === this.columns[i]["dropdown_info"]["conditions"]["related_field"];
              });
              if (check_field.length > 0) {
                const cond = {};
                cond[fieldname] = this.workingObj[fieldname];
                data["conditions"] = JSON.stringify(cond);
                let to_add_keylist = {};
                to_add_keylist["update"] = this.columns[i]["key"];
                to_add_keylist["watch"] = fieldname;
                this.key_list.push(to_add_keylist);
              }
            } else {
              const fieldname = Object.keys(this.columns[i]["dropdown_info"]["conditions"])[0];
              const val = this.columns[i]["dropdown_info"]["conditions"][fieldname];
              const cond = {};
              cond[fieldname] = val;
              data["conditions"] = JSON.stringify(cond);
            }
          }
          let resp = await request("/select", data, "get");
          const extractedData = resp.map((obj) => {
            let new_label = "";
            let new_value = "";
            for (let j = 0; j < this.columns[i]["dropdown_info"]["field"].label.length; j++) {
              new_label += obj[this.columns[i]["dropdown_info"]["field"].label[j]] + " - ";
            }
            for (let j = 0; j < this.columns[i]["dropdown_info"]["field"].value.length; j++) {
              new_value += obj[this.columns[i]["dropdown_info"]["field"].value[j]] + " - ";
            }
            new_label = new_label.replace(/ - $/, "");
            new_value = new_value.replace(/ - $/, "");
            return {
              label: new_label,
              value: new_value,
            };
          });
          this.dropdown_data[this.columns[i]["key"]] = extractedData;
        }
      }
    },
    async getDropdownValueOfKey(keyname) {
      let filter_list = [...this.columns].filter((e) => {
        return e["key"] === keyname;
      });
      if (filter_list.length === 0) return;
      let data = {
        schema: filter_list[0]["dropdown_info"]["schema"],
        table: filter_list[0]["dropdown_info"]["table"],
        columns: [...new Set([...filter_list[0]["dropdown_info"]["field"].label, ...filter_list[0]["dropdown_info"]["field"].value])],
      };
      if (!check_is_null_or_blank(filter_list[0]["dropdown_info"]["conditions"])) {
        const fieldname = filter_list[0]["dropdown_info"]["conditions"]["related_field"];
        const check_field = [...this.columns].filter((e) => {
          return e["key"] === filter_list[0]["dropdown_info"]["conditions"]["related_field"];
        });
        if (check_field.length > 0) {
          const cond = {};
          cond[fieldname] = this.workingObj[fieldname];
          data["conditions"] = JSON.stringify(cond);
        }
      }
      let resp = await request("/select", data, "get");
      const extractedData = resp.map((obj) => {
        let new_label = "";
        let new_value = "";
        for (let j = 0; j < filter_list[0]["dropdown_info"]["field"].label.length; j++) {
          new_label += obj[filter_list[0]["dropdown_info"]["field"].label[j]] + " - ";
        }
        for (let j = 0; j < filter_list[0]["dropdown_info"]["field"].value.length; j++) {
          new_value += obj[filter_list[0]["dropdown_info"]["field"].value[j]] + " - ";
        }
        new_label = new_label.replace(/ - $/, "");
        new_value = new_value.replace(/ - $/, "");
        return {
          label: new_label,
          value: new_value,
        };
      });
      this.dropdown_data[filter_list[0]["key"]] = extractedData;
    },
    async check_update_value(newVal, oldVal) {
      if (this.key_list.length === 0) return;
      for (let i = 0; i < this.key_list.length; i++) {
        if (newVal[this.key_list[i]["watch"]] !== oldVal[this.key_list[i]["watch"]]) {
          this.currentObj[this.key_list[i]["update"]] = "";
          await this.getDropdownValueOfKey(this.key_list[i]["update"]);
        }
      }
    },
  },
  async mounted() {
    this.keyList = [];
    this.currentObj = this.workingObj;
    await this.getDropdownValue();
  },
  computed: {
    clonedItems: function () {
      return JSON.parse(JSON.stringify(this.currentObj));
    },
  },
  watch: {
    workingObj() {
      this.currentObj = this.workingObj;
    },
    async "currentObj.matinh"() {
      if (!state.is_update) {
        let data = {
          schema: get_schema(),
          table: "fn_generate_makhachhang",
          variable: "('" + this.currentObj.matinh + "')"
        };
        let resp = await request("/select", data, "get");
        if(resp.length > 0) {
          this.currentObj.makhachhang = resp[0]["makhachhang"];
        }
      }
    },
    clonedItems: {
      handler(newVal, oldVal) {
        this.check_update_value(newVal, oldVal);
      },
      deep: true,
    },
  },
};
</script>
