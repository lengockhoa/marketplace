<template>
  <!-- Main Sidebar Container -->
  <aside class="main-sidebar elevation-4 sidebar-light-olive">
    <!-- Brand Logo -->
    <span class="brand-link" @click="$router.push(state.homepage)" style="cursor: pointer">
      <img :src="'/static/img/logo_duraone.png'" alt="Logo" class="brand-image" style="opacity: 1" />
    </span>

    <!-- Sidebar -->
    <div class="sidebar">
      <!-- Sidebar Menu -->
      <nav class="mt-2">
        <ul class="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
          <li class="nav-item" @click="click_main_menu(item.link)" :class="item.link" v-for="item in menu()">
            <a class="nav-link active">
              <i class="nav-icon" :class="item.icon"></i>
              <p>
                {{ t(item.name) }}
                <i class="right fas fa-angle-left"></i>
              </p>
            </a>
            <ul class="nav nav-treeview">
              <li @click="click_sub_menu(sub.link)" class="nav-item" v-for="(sub, index) in item.sub_menu">
                <a class="nav-link" :class="current_path === sub.link ? 'active' : ''">
                  <i class="nav-icon" :class="sub.icon"></i>
                  <p>{{ index + 1 }}. {{ t(sub.name) }}</p>
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
      <!-- /.sidebar-menu -->
      <div class="sidebar-footer logout-button" @click="logout()">
        <a class="btn btn-block btn-outline-danger" style="display: inline-block">{{ t("Log out") }}</a>
      </div>
    </div>
    <!-- /.sidebar -->
  </aside>
</template>
<script>
export default defineComponent({
  computed: {
    current_path() {
      return this.$route.fullPath;
    },
  },
  data() {
    return {};
  },
  methods: {
    click_main_menu(menu) {
      $(".nav-item").removeClass("menu-open");
      $("." + menu).addClass("menu-open");
    },
    click_sub_menu(menu) {
      this.$router.replace(menu);
    },
    logout() {
      clearSession();
      this.$router.push("/login");
    },
    authorize_sub_menu() {
      const usergroup = getSession("usergroup");
      menu().forEach((item) => {
        item.sub_menu.forEach((sub) => {
          if(!check_is_null_or_blank(sub.authorize)) {
            if (!usergroup.some(role => sub.authorize.includes(role))) {
              // remove sub from item.sub_menu
              item.sub_menu.splice(item.sub_menu.indexOf(sub), 1);
            }
          }
        });
      });
    },
  },
  mounted() {
    this.authorize_sub_menu();
    menu().forEach((item) => {
      item.sub_menu.forEach((sub) => {
        if (this.$route.fullPath === sub.link) {
          this.click_main_menu(item.link);
        }
      });
    });
  },
  watch: {
    $route(to, from) {
      menu().forEach((item) => {
        item.sub_menu.forEach((sub) => {
          if (to.fullPath === sub.link) {
            this.click_main_menu(item.link);
          }
        });
      });
    },
  },
});
</script>
<style scoped>
.brand-link {
  display: flex;
  justify-content: center;
}
.sidebar-collapse .brand-link .brand-image {
  width: 60px; /* adjust the size according to your needs */
  height: auto; /* maintain aspect ratio */
}

.logout-button {
  position: absolute;
  bottom: 20px;
  width: 80%;
  left: 22px;
}

.sidebar-collapse .logout-button {
  left: 0px;
  width: 100%;
  margin-bottom: 20px;
}
</style>
