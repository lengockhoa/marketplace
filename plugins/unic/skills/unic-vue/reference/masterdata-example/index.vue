<template>
    <div>
      <ClientOnly>
        <GridAG
          id="gridag"
          ref="gridag"
          :columns="columns"
          :rows="rows"
          @onClickDetail="onClickDetail"
          @onAdd="onAdd"
          @reloadData="get_data"
          :can_add="true"
          :can_edit="true"
          :can_delete="true"
          :can_sync="false"
          :can_upload="false"
          :height="screen_height() - 125"
          :table_schema="get_schema()"
          :table="table"
        />
      </ClientOnly>
    </div>
  </template>
  <script>
  export default {
    data() {
      return {
        columns: [
          {"key": "name", "title": t('Name'),},
          {"key": "modern_trade", "title": t('Modern Trade'),},
        ],
        rows: [],
        table: "branch",
        id_field_name: "id_branch",
      };
    },
    methods: {
      async onClickDetail(obj) {
        this.$router.push({ path: "/master/branch/" + obj[this.id_field_name] });
      },
      async onAdd() {
        this.$router.push({ path: "/master/branch/add" });
      },
      async get_data() {
        let data = {
          schema: get_schema(),
          table: this.table,
        };
        this.rows = await request("/select", data, "get");
      },
  
    },
    async created() {
      this.get_data();
    },
  };
  </script>
  