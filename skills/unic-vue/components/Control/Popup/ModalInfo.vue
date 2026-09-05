<template>
  <!-- Modal -->
  <div class="modal fade" id="ControlPopupModalInfo" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ t(title) }}</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div>
            <ClientOnly>
              <GridAG
                id="gridagmodal"
                ref="gridagmodal"
                :columns="columns"
                :rows="rows"
                :can_add="false"
                :can_edit="false"
                :can_delete="false"
                :can_sync="false"
                :can_upload="false"
                :height="screen_height() - 125"
              />
            </ClientOnly>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ["rows", "columns", "title"],
};
</script>
