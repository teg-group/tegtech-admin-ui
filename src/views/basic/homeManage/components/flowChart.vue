<template>
  <div>
    <my-upload>
      <template #slot="data">
        <image :src="data.image" width="200" height="150" />
      </template>
    </my-upload>
  </div>
</template>

<script>
import myUpload from "./myUpload.vue";
export default {
  components: {
    myUpload
  },
  data() {
    return {};
  },
  methods: {}
};
</script>

<style></style>
