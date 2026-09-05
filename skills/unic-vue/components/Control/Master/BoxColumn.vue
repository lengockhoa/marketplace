<template>
  <div class="col-md-12" v-if="item['position'].length === 1">
    <slot />
  </div>
  <div class="col-md-6" v-if="item['position'].length === 2">
    <slot />
  </div>
  <div class="col-md-4" v-if="item['position'].length === 3">
    <slot />
  </div>
  <div class="col-md-3" v-if="item['position'].length === 4">
    <slot />
  </div>
</template>
<script>
export default {
  props: {
    item: {
      type: Object,
      default: {},
    },
  },
};
</script>
