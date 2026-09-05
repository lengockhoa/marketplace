<template>
  <!-- Navbar -->
  <nav class="main-header navbar navbar-expand navbar-white navbar-light">
    <!-- Left navbar links -->
    <ul class="navbar-nav">
      <li class="nav-item">
        <a class="nav-link" data-widget="pushmenu" href="#" role="button"><i class="fas fa-bars"></i></a>
      </li>
      <!-- <li class="nav-item d-none d-sm-inline-block">
        <a @click="$router.push('/')" class="nav-link">Home</a>
      </li> -->
    </ul>

    <ul class="navbar-nav ml-auto header-font">
      {{
        t(state.page_header).toUpperCase()
      }}
      <span v-if="get_schema() === 'qas'" style="color: red">&nbsp; &nbsp; (TESTING VERSION)</span>
    </ul>

    <!-- Right navbar links -->
    <ul class="navbar-nav ml-auto">
      <li class="nav-item">
        <a class="nav-link" data-widget="fullscreen" href="#" role="button">
          <i class="fas fa-expand-arrows-alt"></i>
        </a>
      </li>
      <li class="nav-item" style="padding-top: 8px">
        <span
          ><span :class="state.language === 'th' ? 'selected-lang' : 'not-selected-lang'" @click="set_lang('th')"
            >TH
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="15" height="15" viewBox="0 0 256 256" xml:space="preserve">
              <defs></defs>
              <g
                style="stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: none; fill-rule: nonzero; opacity: 1"
                transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)"
              >
                <path
                  d="M 0 45 c 0 19.592 12.524 36.25 30 42.429 c 4.685 1.657 9.723 2.567 14.975 2.57 h 0.051 c 5.252 -0.003 10.289 -0.914 14.974 -2.57 c 17.466 -6.175 29.985 -22.818 30 -42.396 v -0.068 C 89.985 25.389 77.466 8.745 60 2.571 C 55.307 0.911 50.261 0 45 0 c -5.261 0 -10.308 0.912 -15 2.571 C 12.524 8.75 0 25.408 0 45 z"
                  style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(243, 244, 245); fill-rule: nonzero; opacity: 1"
                  transform=" matrix(1 0 0 1 0 0) "
                  stroke-linecap="round"
                />
                <path
                  d="M 0 45 c 0 5.439 0.969 10.651 2.737 15.477 h 84.525 c 1.765 -4.816 2.734 -10.016 2.738 -15.443 v -0.068 c -0.004 -5.071 -0.853 -9.943 -2.404 -14.489 H 2.404 C 0.85 35.034 0 39.917 0 45 z"
                  style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0, 27, 154); fill-rule: nonzero; opacity: 1"
                  transform=" matrix(1 0 0 1 0 0) "
                  stroke-linecap="round"
                />
                <path
                  d="M 78.528 75 H 11.472 C 16.459 80.566 22.808 84.887 30 87.429 C 34.693 89.088 39.739 90 45 90 c 5.261 0 10.307 -0.911 15 -2.571 C 67.192 84.887 73.541 80.566 78.528 75 z"
                  style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(231, 0, 0); fill-rule: nonzero; opacity: 1"
                  transform=" matrix(1 0 0 1 0 0) "
                  stroke-linecap="round"
                />
                <path
                  d="M 30 2.571 c -7.394 2.614 -13.896 7.11 -18.944 12.906 h 67.889 C 73.897 9.681 67.395 5.185 60 2.571 c -4.584 -1.621 -9.506 -2.521 -14.635 -2.563 h -0.729 C 39.507 0.049 34.584 0.95 30 2.571 z"
                  style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(231, 0, 0); fill-rule: nonzero; opacity: 1"
                  transform=" matrix(1 0 0 1 0 0) "
                  stroke-linecap="round"
                />
              </g>
            </svg>
          </span>
          |
          <span :class="state.language === 'en' ? 'selected-lang' : 'not-selected-lang'" @click="set_lang('en')">
            EN
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="15" height="15" viewBox="0 0 256 256" xml:space="preserve">
              <defs></defs>
              <g
                style="stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: none; fill-rule: nonzero; opacity: 1"
                transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)"
              >
                <path
                  d="M 88.35 57.052 c 0.034 -0.123 0.076 -0.243 0.109 -0.367 l -0.004 -0.002 C 89.457 52.957 90 49.043 90 45 c 0 -4.033 -0.54 -7.938 -1.538 -11.657 l 0.004 -0.002 c -0.039 -0.146 -0.088 -0.289 -0.128 -0.434 c -0.137 -0.492 -0.28 -0.982 -0.434 -1.468 c -0.081 -0.257 -0.167 -0.512 -0.253 -0.768 c -0.073 -0.217 -0.139 -0.437 -0.215 -0.653 h -0.015 c -1.645 -4.653 -4.021 -8.96 -7.01 -12.768 L 59.997 27.458 V 2.57 c -4.368 -1.544 -9.046 -2.427 -13.915 -2.542 h -2.164 c -4.868 0.115 -9.545 0.998 -13.913 2.541 v 24.889 L 9.589 17.249 c -2.989 3.809 -5.366 8.116 -7.01 12.769 H 2.564 c -0.076 0.216 -0.143 0.436 -0.216 0.653 c -0.086 0.255 -0.172 0.509 -0.253 0.765 c -0.154 0.486 -0.297 0.977 -0.434 1.47 c -0.04 0.145 -0.089 0.287 -0.128 0.432 l 0.004 0.002 C 0.54 37.061 0 40.966 0 45 c 0 4.043 0.543 7.957 1.545 11.684 l -0.004 0.002 c 0.033 0.123 0.074 0.242 0.108 0.365 c 0.146 0.524 0.298 1.046 0.462 1.562 c 0.075 0.236 0.154 0.47 0.233 0.705 c 0.077 0.231 0.148 0.464 0.229 0.693 H 2.59 c 1.647 4.651 4.025 8.955 7.016 12.761 l 20.4 -10.2 v 24.86 C 34.697 89.089 39.741 90 45 90 c 5.26 0 10.305 -0.911 14.997 -2.57 V 62.572 l 20.398 10.199 c 2.991 -3.806 5.368 -8.11 7.015 -12.76 h 0.015 c 0.081 -0.229 0.152 -0.463 0.23 -0.694 c 0.079 -0.234 0.158 -0.468 0.233 -0.704 C 88.052 58.096 88.205 57.575 88.35 57.052 z"
                  style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(243, 244, 245); fill-rule: nonzero; opacity: 1"
                  transform=" matrix(1 0 0 1 0 0) "
                  stroke-linecap="round"
                />
                <path
                  d="M 53.999 0.902 c -2.565 -0.521 -5.213 -0.81 -7.917 -0.874 h -2.164 c -2.703 0.064 -5.35 0.354 -7.914 0.874 v 35.116 H 0.899 C 0.311 38.92 0 41.924 0 45 c 0 3.087 0.312 6.1 0.904 9.012 h 35.1 v 35.087 C 38.911 89.689 41.919 90 45 90 c 3.082 0 6.091 -0.311 8.999 -0.902 V 54.012 h 35.097 C 89.688 51.1 90 48.087 90 45 c 0 -3.076 -0.311 -6.08 -0.899 -8.983 H 53.999 V 0.902 z"
                  style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(204, 0, 0); fill-rule: nonzero; opacity: 1"
                  transform=" matrix(1 0 0 1 0 0) "
                  stroke-linecap="round"
                />
                <path
                  d="M 85.242 65.135 c 0.829 -1.653 1.56 -3.363 2.184 -5.125 H 74.993 L 85.242 65.135 z"
                  style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(204, 0, 0); fill-rule: nonzero; opacity: 1"
                  transform=" matrix(1 0 0 1 0 0) "
                  stroke-linecap="round"
                />
                <path
                  d="M 82.216 19.701 L 61.581 30.019 h 13.412 l 10.261 -5.131 C 84.353 23.088 83.341 21.354 82.216 19.701 z"
                  style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(204, 0, 0); fill-rule: nonzero; opacity: 1"
                  transform=" matrix(1 0 0 1 0 0) "
                  stroke-linecap="round"
                />
                <path
                  d="M 4.747 24.887 c -0.829 1.655 -1.559 3.368 -2.182 5.132 H 15.01 L 4.747 24.887 z"
                  style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(204, 0, 0); fill-rule: nonzero; opacity: 1"
                  transform=" matrix(1 0 0 1 0 0) "
                  stroke-linecap="round"
                />
                <path
                  d="M 7.8 70.321 L 28.422 60.01 H 15.01 L 4.758 65.136 C 5.661 66.936 6.674 68.67 7.8 70.321 z"
                  style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(204, 0, 0); fill-rule: nonzero; opacity: 1"
                  transform=" matrix(1 0 0 1 0 0) "
                  stroke-linecap="round"
                />
                <path
                  d="M 9.605 72.771"
                  style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0, 0, 102); fill-rule: nonzero; opacity: 1"
                  transform=" matrix(1 0 0 1 0 0) "
                  stroke-linecap="round"
                />
                <path
                  d="M 80.412 17.251"
                  style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0, 0, 102); fill-rule: nonzero; opacity: 1"
                  transform=" matrix(1 0 0 1 0 0) "
                  stroke-linecap="round"
                />
                <path
                  d="M 80.395 72.77"
                  style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0, 0, 102); fill-rule: nonzero; opacity: 1"
                  transform=" matrix(1 0 0 1 0 0) "
                  stroke-linecap="round"
                />
                <path
                  d="M 9.589 17.25"
                  style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0, 0, 102); fill-rule: nonzero; opacity: 1"
                  transform=" matrix(1 0 0 1 0 0) "
                  stroke-linecap="round"
                />
                <path
                  d="M 9.589 17.249 l 20.416 10.208 v -3.99 V 2.584 C 21.874 5.458 14.813 10.593 9.589 17.249 z"
                  style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0, 0, 102); fill-rule: nonzero; opacity: 1"
                  transform=" matrix(1 0 0 1 0 0) "
                  stroke-linecap="round"
                />
                <path
                  d="M 59.997 2.585 v 22.302 v 2.57 L 80.411 17.25 C 75.188 10.594 68.128 5.459 59.997 2.585 z"
                  style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0, 0, 102); fill-rule: nonzero; opacity: 1"
                  transform=" matrix(1 0 0 1 0 0) "
                  stroke-linecap="round"
                />
                <path
                  d="M 30.006 72.77 V 62.572 l -20.4 10.2 c 5.222 6.646 12.276 11.774 20.4 14.646 V 72.77 z"
                  style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0, 0, 102); fill-rule: nonzero; opacity: 1"
                  transform=" matrix(1 0 0 1 0 0) "
                  stroke-linecap="round"
                />
                <path
                  d="M 59.997 62.572 v 9.296 v 15.548 c 8.123 -2.872 15.176 -8 20.398 -14.646 L 59.997 62.572 z"
                  style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0, 0, 102); fill-rule: nonzero; opacity: 1"
                  transform=" matrix(1 0 0 1 0 0) "
                  stroke-linecap="round"
                />
              </g>
            </svg> </span
        ></span>
      </li>
      <li class="nav-item dropdown">
        <a class="nav-link full-name-show" data-toggle="dropdown" @click="show_menu_profile"> {{ state.fullname }} </a>
        <div class="dropdown-menu dropdown-menu-lg dropdown-menu-right profile-dropdown">
          <button @click="$router.push('/userinfo/profile')" class="btn btn-default btn-sm btn-block"><i class="fas fa-id-card"></i> {{ t("Profile") }}</button>
          <div class="dropdown-divider"></div>
          <button @click="log_out()" class="btn btn-default btn-sm btn-block"><i class="fas fa-sign-out-alt"></i> {{ t("Log out") }}</button>
        </div>
      </li>
    </ul>
  </nav>
  <!-- /.navbar -->
</template>

<script>
export default defineComponent({
  data() {
    return {
      menu_header_lst: [],
      isNavbarOpen: false,
      page_header: "",
    };
  },
  methods: {
    log_out() {
      clearSession();
      this.$router.push("/login");
    },
    async set_lang(lang) {
      if (state.language === lang) {
        return;
      }
      setSession("language", lang);
      state.language = lang;

      translate(lang, this.$route.path);
      let data = {
        schema: get_schema(),
        table: "user",
        username: state.username,
        language: lang,
        key_array: ["username"],
      };
      await request("/update", data);
      window.location.reload();
    },
    show_menu_profile() {
      $(".profile-dropdown").addClass("show");
    },
  },
  mounted() {
    $(document).ready(function () {
      $(document).on("click", function (event) {
        var clickover = $(event.target);
        var _opened = $(".profile-dropdown").hasClass("show");
        if (_opened === true && !clickover.hasClass("full-name-show")) {
          $(".profile-dropdown").removeClass("show");
        }
      });
    });
  },
  created() {
    state.username = getSession("username");
    if (check_is_null_or_blank(state.username)) {
      this.$router.push("/login");
    }
    state.fullname = getSession("fullname");
    state.language = getSession("language");
    state.usergroup = getSession("usergroup");
  },
  mounted() {
    menu().forEach((item) => {
      item.sub_menu.forEach((sub) => {
        if (this.$route.fullPath === sub.link) {
          state.page_header = sub.name;
        }
      });
    });
  },
  watch: {
    $route(to, from) {
      menu().forEach((item) => {
        item.sub_menu.forEach((sub) => {
          if (to.fullPath === sub.link) {
            state.page_header = sub.name;
          }
        });
      });
    },
  },
});
</script>
<style>
.header-font {
  font-size: 1.5em;
  font-weight: bold;
}
.selected-lang {
  font-weight: bold;
  color: rgb(27, 117, 243);
}
.not-selected-lang {
  cursor: pointer;
}
</style>
