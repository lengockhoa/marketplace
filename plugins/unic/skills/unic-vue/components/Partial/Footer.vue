<template>
  <footer class="main-footer">
    <div class="float-right d-none d-sm-inline">Developed for SCG</div>
    <img :src="'/static/img/logo_unic.png'" alt="Logo" height="16px" class="d-sm-inline" style="opacity: 1; margin-right: 10px" /><strong>&copy; 2024.</strong>
    <span class="footer-center">
      <img @click="open_link('ios')" src="/static/img/apple_icon.jpg" alt="apple icon" style="max-height: 28px; margin-right: 20px" />
      <img @click="open_link('android')" src="/static/img/android_icon.jpg" alt="android icon" style="max-height: 28px" />
    </span>
  </footer>
</template>
<script>
export default {
  methods: {
    open_link(type) {
      if (type == "ios") {
        window.open(baseurl() + "duraone_m/ios/store.html", "_blank");
      } else {
        window.open(baseurl() + "duraone_m/android/store.html", "_blank");
      }
    },
  },
};
</script>
