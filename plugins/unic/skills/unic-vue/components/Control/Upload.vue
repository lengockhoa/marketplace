<template>
  <a-upload-dragger v-model:fileList="fileList" name="file" :customRequest="uploadfiles" :max-count="3" :multiple="true" @change="handleChange" @drop="handleDrop">
    <p class="ant-upload-drag-icon">
      <i class="fas fa-upload" style="font-size: 30px;"></i>
    </p>
    <p class="ant-upload-text">{{ label }}<span v-if="required" style="color: red">*</span></p>
    <p class="ant-upload-hint">{{ hint }}</p>
  </a-upload-dragger>
</template>
<script>
export default {
  props: {
    modelValue: {
      type: Array,
      default: () => [],
    },
    required: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
      default: t("Click or drag file to this area to upload"),
    },
    hint: {
      type: String,
      default: t("Maximal 1 files and Maximal 10Mb/File"),
    },
  },
  data() {
    return {
      fileList: this.modelValue,
    };
  },
  methods: {
    uploadfiles({ file }) {
      this.$emit("uploadFinish", file);
    },
    async handleChange(info) {
      const status = info.file.status;
      if (status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (status === "done") {
        this.$emit("uploadFinish", info.file);
      } else if (status === "error") {
        console.log(`${info.file.name} file upload failed.`);
      }
    },

    handleDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  },
};
</script>
<style>
.ant-upload-list-item {
  display: none;
}
</style>