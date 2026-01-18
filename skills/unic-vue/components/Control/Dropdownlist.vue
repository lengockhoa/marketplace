<template>
  <div>
    <ControlLabel :icon="icon" :required="required" :name="name" :classes="classes" />
    <client-only>
      <a-select
        :disabled="disabled"
        v-if="multiple"
        size="large"
        v-model:value="value"
        :id="id"
        :dropdownStyle="{ zIndex: 10000 }"
        mode="multiple"
        remove-icon=" X"
        show-search
        :filter-option="filterOption"
        :options="option_list"
        :placeholder="placeholder"
        style="width: 100%"
        allow-clear></a-select>
      <a-select :disabled="disabled" v-if="!multiple" size="large" v-model:value="value" :dropdownStyle="{ zIndex: 10000 }" show-search :filter-option="filterOption" :options="option_list" :placeholder="placeholder" style="width: 100%" allow-clear></a-select>
    </client-only>
  </div>
</template>
<script>
// list shoud have value and label { value: 'jack', label: 'Jack' }
import { v4 as uuidv4 } from "uuid";
export default {
  setup() {
    const filterOption = (input, option) => {
      return option.label.toLowerCase().trim().includes(input.toLowerCase().trim()) || option.value.toLowerCase().trim().includes(input.toLowerCase().trim());
    };
    return {
      filterOption,
    };
  },
  props: {
    modelValue: {
      type: [String, Array, Number],
      default: "",
    },
    name: {
      type: String,
      default: "",
    },
    show_key: {
      type: Boolean,
      default: false,
    },
    required: {
      type: Boolean,
      default: false,
    },
    id: {
      type: String,
      default: () => {
        return uuidv4();
      },
    },
    classes: {
      type: String,
      default: "",
    },
    placeholder: {
      type: String,
      default: "",
    },
    icon: {
      type: String,
      default: "",
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    list: {
      type: Array,
      default: () => {
        return [];
      },
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    value: {
      get() {
        if (this.multiple) {
          if (this.modelValue === "") {
            return [];
          }
          if (typeof this.modelValue === "string") {
            if (this.modelValue.charAt(0) === "[") {
              return JSON.parse(this.modelValue);
            } else {
              return [this.modelValue];
            }
          }
          if (typeof this.modelValue === "object") {
            return this.modelValue;
          }
        } else {
          return this.modelValue;
        }
      },
      set(value) {
        this.$emit("update:modelValue", value);
      },
    },
  },
  data() {
    return {
      option_list: [{ value: "jack", label: "Jack" }],
    };
  },
  methods: {
    set_value() {
      if (this.show_key) {
        this.option_list = this.list.map((item) => {
          return {
            value: item.value,
            label: item.value + " - " + item.label,
          };
        });
      } else {
        this.option_list = this.list;
      }
    },
  },
  mounted() {
    this.set_value();
  },
  watch: {
    value() {
      this.$emit("update:modelValue", this.value);
    },
    list() {
      this.set_value();
    },
    show_key() {
      this.set_value();
    },
  },
};
</script>
<style>
.ant-select-disabled > .ant-select-selector {
  color: black !important;
}
label {
  margin-bottom: 2px;
  margin-top: 2px;
  font-weight: 600;
}
</style>
