<template>
  <el-card class="box-card" v-show="isShow">
    <div slot="header" class="clearfix">
      <span>编辑参数设置</span>
    </div>
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="检测项目">
        <el-input :disabled="true" v-model="form.item"></el-input>
      </el-form-item>
      <el-form-item label="检测结果">
        <el-input :disabled="true" v-model="form.value"></el-input>
      </el-form-item>
      <el-form-item label="文字解读">
        <el-input type="textarea" v-model="form.description"></el-input>
      </el-form-item>
      <el-form-item label="戒食">
        <el-input type="textarea" v-model="form.dietDesc"></el-input>
      </el-form-item>
      <el-form-item label="多吃">
        <el-input type="textarea" v-model="form.eatDesc"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">保存</el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script>
export default {
  props: ["isShow"],
  data() {
    return {
      form: {
        item: "",
        value: "",
        description: "",
        dietDesc: "",
        eatDesc: ""
      },
      id: 0
    };
  },
  methods: {
    onSubmit() {
      let params = {
        id: this.id,
        description: this.form.description,
        dietDesc: this.form.dietDesc,
        eatDesc: this.form.eatDesc
      };
      this.$emit("onSubmit", params);
    },
    giveValue(obj) {
      this.form.item = obj.item;
      this.form.value = obj.value;
      this.form.description = obj.description;
      this.form.dietDesc = obj.dietDesc;
      this.form.eatDesc = obj.eatDesc;
      this.id = obj.id;
    },
    onCancel() {
      console.log("cancel");

      this.$emit("onCancel", false);
    }
  }
};
</script>