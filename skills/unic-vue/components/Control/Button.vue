<template>
  <button :loading="loading" :style="'min-width: 68px; background-color:' + color + ';'" type="button" :class="classes === '' ? 'button button-' + type : classes" @click.once="onClick()" :key="key">
    <span v-if="loading" class="spinner-border spinner-border-sm" role="status"></span><span v-if="!loading">{{ name }}</span>
  </button>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: "primary",
    },
    name: {
      type: String,
      default: "Button",
    },
    color: {
      type: String,
      default: "",
    },
    classes: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      key: 0,
      loading: false,
    };
  },
  methods: {
    updateKey() {
      let self = this;
      this.loading = true;
      setTimeout(() => {
        self.key += 1;
        self.loading = false;
      }, 1000);
    },
    onClick() {
      this.$emit("onClick");
      this.updateKey();
    },
  },
};
</script>
<style scoped>
.button {
  min-width: 120px;
  height: 40px;
  border: none;
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
.button-small {
  min-width: 100px;
  height: 30px;
  font-size: 12px;
  box-shadow: none;
  border-radius: none;
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
