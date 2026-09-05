<template>
  <table class="table table-striped">
    <thead>
      <tr>
        <th v-for="col in columns" :key="JSON.stringify(col)">
          {{ col["caption"] }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="row in rows" :key="JSON.stringify(row)">
        <td v-for="col in columns" :key="JSON.stringify(col)">{{ row[col["field"]] }}</td>
      </tr>
    </tbody>
  </table>
</template>
<script>
export default {
  props: {
    rows: {
      type: Array,
      default: () => {
        return [];
      },
    },
    columns: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {
      loading: false,
      key: 0,
    };
  },
};
</script>
