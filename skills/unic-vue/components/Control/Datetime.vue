<template>
  <div>
    <div><ControlLabel :required="required" :name="name" :classes="classes" /></div>
    <div>
      <a-date-picker 
        :disabled="disabled" 
        size="large" 
        style="width: 100%" 
        :class="classes" 
        :show-time="show_time" 
        :format="format" 
        v-model:value="value" 
        :picker="type"
        :disabled-date="disabledDate"
      />
    </div>
  </div>
</template>

<script>
import dayjs from "dayjs";
import { v4 as uuidv4 } from "uuid";

export default {
  props: {
    modelValue: {
      type: [String, Date],
      default: "",
    },
    name: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      default: "date",
    },
    show_time: {
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
    disabled: {
      type: Boolean,
      default: false,
    },
    minDate: {
      type: [String, Date],
      default: null,
    },
    maxDate: {
      type: [String, Date],
      default: null,
    },
  },
  data() {
    return {
      value: "",
      format: "DD-MM-YYYY",
    };
  },
  methods: {
    disabledDate(current) {
      if (!current) return false;
      
      const currentDate = dayjs(current).startOf('day');
      let isDisabled = false;

      if (this.minDate) {
        const minDate = dayjs(this.minDate).startOf('day');
        isDisabled = currentDate.isBefore(minDate);
      }

      if (this.maxDate && !isDisabled) {
        const maxDate = dayjs(this.maxDate).endOf('day');
        isDisabled = currentDate.isAfter(maxDate);
      }

      return isDisabled;
    },
    setFormat() {
      if (this.type === "date") {
        this.format = "DD-MM-YYYY";
      }
      if (this.type === "month") {
        this.format = "MM-YYYY";
      }
      if (this.type === "year") {
        this.format = "YYYY";
      }
    },
    set_value() {
      if (this.modelValue == null || this.modelValue == "") {
        this.value = null;
      } else {
        if (!check_is_null_or_blank(this.modelValue)) {
          if (this.modelValue.toLowerCase().includes("invalid")) {
            this.value = dayjs(dayjs(), "YYYY-MM-DD");
          } else {
            this.value = dayjs(this.modelValue, "YYYY-MM-DD");
          }
        } else {
          this.value = dayjs(dayjs(), "YYYY-MM-DD");
        }
      }
    },
  },
  mounted() {
    this.set_value();
    this.setFormat();
  },
  watch: {
    modelValue() {
      this.set_value();
    },
    value() {
      if (this.value == null) {
        this.$emit("update:modelValue", null);
      } else {
        this.$emit("update:modelValue", this.value.format("YYYY-MM-DD"));
      }
    },
    type() {
      this.setFormat();
    },
  },
};
</script>

<style>
.ant-picker-body table {
  box-shadow: none !important;
  border-radius: 0;
}
</style>
