<template>
  <div class="bottom-0 end-0" style="z-index: 999; position: fixed; margin-right: 5px; margin-bottom: 38px">
    <button type="button" class="button button-success" @click="clickButtonFloat()">
      <span>{{ name }}</span>
    </button>
  </div>
</template>
<script>
export default {
  props: {
    name: {
      type: String,
      default: "Button",
    },
  },
  emits: ["clickButtonFloat"],
  methods: {
    clickButtonFloat() {
      this.$emit("clickButtonFloat");
    },
  },
};
</script>
<style scoped>
.button {
  min-width: 120px;
  height: 40px;
  border: none;
  box-shadow: 3px 3px 5px #839192;
  border-radius: 2px;
  color: white;
  font-weight: 600;
  margin: 10px 5px;
  font-size: 14px;
}
.button i {
  margin-right: 5px;
  font-size: 14px;
}
.button-primary {
  background: #2e86c1;
}
.button-secondary {
  background: #808080;
}
.button-success {
  background: #3cb371;
}
.button-danger {
  background: #ff6347;
}
.button-warning {
  background: #ffa500;
}
.button-info {
  background: #87ceeb;
}
.button-light {
  background-color: #e9e9e9;
  color: #696969;
}
</style>
