<template>
<el-dialog :close-on-click-modal="false" title="编辑参数" :visible.sync="isShow" width="500px" append-to-body :before-close="cancel">
  <el-form ref="form" :model="form" label-width="80px">
    <el-form-item label="检测项目">
      <el-input :disabled="true" v-model="form.item"></el-input>
    </el-form-item>
    <el-form-item label="检测结果">
      <el-input :disabled="true" v-model="form.value"></el-input>
    </el-form-item>
    <el-form-item label="文字解读">
      <el-input type="textarea" v-model="form.description" rows="4"></el-input>
    </el-form-item>
    <el-form-item label="戒食">
      <el-input type="textarea" v-model="form.dietDesc" rows="2"></el-input>
    </el-form-item>
    <el-form-item label="多吃">
      <el-input type="textarea" v-model="form.eatDesc" rows="2"></el-input>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button type="primary" size="small" @click="submitForm">确 定</el-button>
    <el-button @click="cancel" size="small">取 消</el-button>
  </div>
</el-dialog>
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
    submitForm() {
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
    cancel() {
      this.$emit("onCancel");
    }
  }
};
</script>