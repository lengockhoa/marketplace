<!--  
Sample Usage:
<ControlBox title="This is new title" col="6" type="danger"> khoakhoakhoa the content of bođy will be adđe herre </ControlBox>
-->
<template>
  <div :class="`col-md-${col.toString()}  mb-1`">
    <div :class="`one-palette ${palette_type}`">
      <div class="palette-header" v-if="title !== ''">
        <div class="d-flex justify-content-between">
          <div>
            <h6 class="palette-title"><i class="fas fa-file"></i> {{ title }}</h6>
          </div>
          <div v-if="show_icon">
            <!-- <span title="3 New Messages" class="badge badge-primary">3</span> -->
            <!-- <button class="btn btn-tool"><i class="fas fa-comments"></i></button> -->
            <!-- <button class="btn btn-tool"><minus-outlined /></button> -->
            <!-- <button class="btn btn-tool"><close-outlined /></button> -->
          </div>
        </div>
      </div>
      <div class="palette-body"><slot /></div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: "",
    },
    show_icon: {
      type: Boolean,
      default: false,
    },
    col: {
      type: [Number, String],
      default: 12,
    },
    type: {
      type: String,
      default: "info",
    },
  },
  data() {
    return {
      palette_type: "",
    };
  },
  methods: {
    update_palette() {
      if (this.type == "success") {
        this.palette_type = "success-palette";
      } else if (this.type == "danger") {
        this.palette_type = "danger-palette";
      } else if (this.type == "info") {
        this.palette_type = "info-palette";
      } else if (this.type == "warning") {
        this.palette_type = "warning-palette";
      } else {
        this.palette_type = "";
      }
    },
  },
  created() {
    this.update_palette();
  },
  watch: {
    type() {
      this.update_palette();
    },
  },
};
</script>
<style>
.palette-box-wrapper {
  position: relative;
  display: flex;
  -ms-flex-direction: column;
  flex-direction: column;
  min-width: 0;
  word-wrap: break-word;
}
.one-palette {
  background-color: #fff;
  background-clip: border-box;
  margin-bottom: 1rem;
  width: 100%;
  border: 0 solid rgba(0, 0, 0, 0.125);
  border-radius: 0.25rem;
  box-shadow: 0 0 1px rgba(0, 0, 0, 0.125), 0 1px 3px rgba(0, 0, 0, 0.2);
}
.palette-header {
  background-color: transparent;
  border-bottom: 1px solid rgba(0, 0, 0, 0.125);
  padding: 0.75rem 1rem;
  position: relative;
  border-top-left-radius: 0.25rem;
  border-top-right-radius: 0.25rem;
}
.palette-body {
  flex: 1 1 auto;
  min-height: 1px;
  padding: 1rem;
}
.palette-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
}
.palette-body {
  font-size: 0.9rem;
}
.btn-tool {
  background-color: transparent;
  color: #adb5bd;
  font-size: 0.875rem;
  margin: -0.75rem 0;
  padding: 0.25rem 0.5rem;
}
.badge-primary {
  color: #fff;
  background-color: #007bff;
}
.success-palette {
  border-top: 4px solid #229954;
}
.danger-palette {
  border-top: 4px solid #e74c3c;
}
.info-palette {
  border-top: 4px solid #3498db;
}
.warning-palette {
  border-top: 4px solid #f1c40f;
}
</style>
