<!-- 
    Example:
    <ControlMobilePagingBar :page="page" :total_records="total_records" :page_count="page_count" @setPage="setPage" /> 
-->
<template>
  <div class="row mt-3 p-0">
    <div class="col-12 mb-2 d-flex justify-content-center">
      <nav aria-label="Page navigation example">
        <ul class="pagination">
          <li class="page-item" :class="page === 1 ? 'disabled' : ''">
            <a class="page-link" @click="setPage(1)" :aria-disabled="page === 1"><<</a>
          </li>
          <li class="page-item" :class="page === 1 ? 'disabled' : ''">
            <a
              class="page-link"
              @click="
                if (page > 1) {
                  setPage(page - 1);
                }
              "
              :aria-disabled="page === 1"
              ><</a
            >
          </li>
          <template v-if="max_page <= 3">
            <li v-for="n in max_page" @click="setPage(n)" class="page-item" :class="page === n ? 'disabled' : ''">
              <a class="page-link">{{ n }}</a>
            </li>
          </template>
          <template v-if="max_page > 3">
            <li v-if="page > 2" @click="setPage(page - 2)" class="page-item">
              <a class="page-link">{{ page - 2 }}</a>
            </li>
            <li v-if="page > 1" @click="setPage(page - 1)" class="page-item">
              <a class="page-link">{{ page - 1 }}</a>
            </li>
            <li @click="setPage(page)" class="page-item disabled">
              <a style="font-size: 1.1; font-weight: bold; color: red;" class="page-link">{{ page }}</a>
            </li>
            <li v-if="page < max_page" @click="setPage(page + 1)" class="page-item" :class="page === max_page ? 'disabled' : ''">
              <a class="page-link">{{ page + 1 }}</a>
            </li>
            <li v-if="page < max_page - 1" @click="setPage(page + 2)" class="page-item" :class="page === max_page ? 'disabled' : ''">
              <a class="page-link">{{ page + 2 }}</a>
            </li>
          </template>
          <li
            class="page-item"
            @click="
              if (page < max_page) {
                setPage(page + 1);
              }
            "
            :class="page === max_page ? 'disabled' : ''"
          >
            <a class="page-link" href="#">></a>
          </li>
          <li class="page-item" @click="setPage(max_page)" :class="page === max_page ? 'disabled' : ''">
            <a class="page-link" href="#">>></a>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    page: {
      type: Number,
      default: 1,
    },
    total_records: {
      type: Number,
      default: 1,
    },
    page_count: {
      type: Number,
      default: 3,
    },
  },
  computed: {
    max_page() {
      const max_page = Math.ceil(this.total_records / this.page_count);
      return max_page;
    },
  },
  data() {
    return {
      working_page: 1,
    };
  },
  methods: {
    setPage(pageNum) {
      this.working_page = pageNum;
      this.$emit("setPage", pageNum);
    },
  },
  mounted() {
    this.working_page = this.page;
  },
  watch: {
    page() {
      this.working_page = this.page;
    },
  },
};
</script>
