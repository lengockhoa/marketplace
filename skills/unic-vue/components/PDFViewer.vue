<template>
  <object :data="pdfPath" type="application/pdf" width="100%" :height="screen_height"></object>
</template>

<script>
export default {
  name: "PDFViewer",
  props: {
    pdfPath: {
      type: String,
      required: true,
    },
  },
  data(){
    return {
      screen_height: '100px',
    }
  },
  mounted() {
    if (process.client) {
      this.screen_height = (window.innerHeight-100).toString()+"px";
    }
  },
};
</script>