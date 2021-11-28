<template>
  <div>
    <el-upload
      class="upload-block"
      action="#"
      list-type="picture-card"
      :limit="1"
      :show-file-list="false"
      :http-request="httpRequest"
    >
      <div class="tips-block" v-if="!picForm.coverImg">
        <i class="el-icon-plus"></i>
        <span class="tips-block__msg">选择商品图片</span>
      </div>
      <div v-if="picForm.coverImg">
        <slot :image="image"></slot>
      </div>
    </el-upload>
  </div>
</template>

<script>
export default {
  data() {
    return {
      image: ""
    };
  },
  props: {
    apiName: {
      type: String
    }
  },
  methods: {
    beforeUpload(file) {
      console.log(file);
      const form = new FormData();
      form.append("file", file);
      // 这里写接口
      if (apiName === "") {
        api().then(res => {
          if (res === 1000) {
            this.image = res.data;
          }
        });
      } else {
        api().then(res => {
          if (res === 1000) {
            this.image = res.data;
          }
        });
      }

      return false;
    }
  }
};
</script>

<style></style>
