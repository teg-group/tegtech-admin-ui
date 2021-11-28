<template>
  <div class="app-container">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="showDialog('editTips', {}, 'add')"
          >新增banner</el-button
        >
      </el-col>
    </el-row>
    <el-table :data="bannerList" row-key="id">
      <el-table-column
        v-for="(item, index) in tableColumn"
        :key="index"
        :prop="item.prop ? item.prop : undefined"
        :label="item.label"
        align="center"
        :width="item.width"
      >
        <template slot-scope="scope">
          <div v-if="item.type === 'switch'">
            <el-switch
              v-model="scope.row[item.prop]"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="
                showDialog(
                  'submitTip',
                  scope.row,
                  scope.row[item.prop] ? 'open' : 'close'
                )
              "
            >
            </el-switch>
          </div>
          <div v-else-if="item.type === 'img'">
            <img :src="scope.row[item.prop]" width="250" height="150" />
          </div>
          <div v-else-if="item.type === 'option'">
            <el-button
              size="mini"
              type="text"
              @click="showDialog('editTips', scope.row, 'edit')"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="showDialog('submitTip', scope.row, 'delete')"
              >删除</el-button
            >
          </div>
          <div v-else>{{ scope.row[item.prop] }}</div>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      :close-on-click-modal="false"
      :title="
        dialogType == 'open'
          ? '开启确认'
          : dialogType == 'close'
          ? '关闭确认'
          : '删除确认'
      "
      :visible.sync="visible.submitTip"
      width="370px"
      append-to-body
    >
      <div class="dialog-content">
        {{
          `确定要${
            dialogType == "open"
              ? "开启"
              : dialogType == "close"
              ? "关闭"
              : "删除"
          }banner吗？${
            dialogType == "open"
              ? "开启"
              : dialogType == "close"
              ? "关闭"
              : "删除"
          }后${dialogType == "open" ? "将展示在用户端！" : "无法查看！"}`
        }}
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          @click="
            submitForm(
              dialogType == 'open' || dialogType == 'close'
                ? 'changeStatus'
                : 'delBanner'
            )
          "
          >确 定</el-button
        >
        <el-button @click="cancel('submitTip')">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog
      :close-on-click-modal="false"
      :title="(dialogType == 'add' ? '添加' : '编辑') + 'banner'"
      :visible.sync="visible.editTips"
      width="500px"
      append-to-body
    >
      <el-form
        :model="bannerForm"
        :rules="bannerRule"
        ref="bannerRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="上传图片" prop="img">
          <my-upload>
            <template #slot="data">
              <img
                class="el-upload-list__item-thumbnail"
                :src="data.coverImg"
                alt=""
              />
            </template>
          </my-upload>
        </el-form-item>
        <el-form-item label="跳转链接" prop="link">
          <el-input
            v-model="bannerForm.link"
            placeholder="输入banner要跳转页面的链接"
          ></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input
            v-model="bannerForm.sort"
            placeholder="输入排序序号，需为1，2，3，4，5此类型序号"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveForm">确 定</el-button>
        <el-button @click="cancel('editTips')">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getBannerList,
  getBannerDetail,
  addBanner,
  editBanner,
  delBanner,
  changeBanner
} from "@/api/mini/homeManage";
import myUpload from "./myUpload.vue";
const tableColumn = [
  { label: "开关", prop: "status", type: "switch" },
  { label: "创建日期", prop: "createTime", type: "text" },
  { label: "banner图片", prop: "img", type: "img", width: 250 },
  { label: "关联链接", prop: "link", type: "input" },
  { label: "排序", prop: "sort", type: "input" },
  { label: "操作", prop: "option", type: "option" }
];
export default {
  components: {
    myUpload
  },
  data() {
    return {
      freightList: [],
      visible: {
        submitTip: false,
        editTips: false
      },
      tableColumn,
      dialogType: "",
      bannerForm: {},
      bannerList: [],
      bannerRule: {
        img: [{ required: true, message: "请上传图片", trigger: "change" }],
        link: [{ required: true, message: "请输入跳转链接", trigger: "blur" }],
        sort: [{ required: true, message: "请输入排序序号", trigger: "blur" }]
      }
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    getList() {
      getBannerList().then(res => {
        if (res.code == 1000) {
          this.bannerList = res.rows;
        }
      });
    },
    changeStatus() {
      changeBanner(this.bannerForm.id, { status: this.bannerForm.status }).then(
        res => {
          if (res.code == 1000) {
            if (!this.bannerForm.status) this.msgSuccess("成功关闭banner");
            if (this.bannerForm.status) this.msgSuccess("成功开启banner");
            this.visible.submitTip = false;
            this.bannerForm = {};
          }
        }
      );
    },
    saveForm() {
      if (this.bannerForm.id) {
        editBanner(this.bannerForm).then(res => {
          if (res.code == 1000) {
            this.msgSuccess("编辑成功");
            this.getList();
            this.visible.editTips = false;
          }
        });
      } else {
        addBanner(this.bannerForm).then(res => {
          if (res.code == 1000) {
            this.msgSuccess("添加成功");
            this.getList();
            this.visible.editTips = false;
          }
        });
      }
    },
    showDialog(flag, row, titleType) {
      this.dialogType = titleType;
      this.bannerForm = row;
      this.visible[flag] = true;
    },
    delBanner() {
      if (this.bannerForm.id) {
        delBanner(this.bannerForm.id).then(res => {
          if (res.code == 1000) {
            this.msgSuccess("删除成功");
            this.getList();
            this.visible.submitTip = false;
            this.bannerForm = {};
          }
        });
      }
    },
    cancel(flag) {
      this.visible[flag] = false;
      this.getList();
      this.bannerForm = {};
    },
    submitForm(flag) {
      this[flag]();
    }
  }
};
</script>
<style lang="scss" scoped>
.form-block {
  &__tips {
    font-size: 12px;
    color: #97a8be;
    margin-left: 15px;
  }
}
</style>
