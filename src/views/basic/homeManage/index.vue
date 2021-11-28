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
          <div v-else-if="item.type === 'imgType'">
            {{ scope.row[item.prop] | typeFilter }}
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
          <el-upload
            class="upload-block"
            action="#"
            list-type="picture-card"
            :show-file-list="false"
            :http-request="httpRequest">
                <div class="tips-block" v-if="!bannerForm.img">
                    <i class="el-icon-plus"></i>
                    <span class="tips-block__msg">选择banner图片</span>
                </div>
                <div v-if="bannerForm.img">
                    <img class="el-upload-list__item-thumbnail" :src="bannerForm.img" alt=""/>
                </div>
            </el-upload>
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
        <el-form-item label="类型" prop="type">
          <el-select v-model="bannerForm.type" placeholder="请选择类型">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
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
import OssUpload from "@/service/ossUpload"
const tableColumn = [
  { label: "开关", prop: "status", type: "switch" },
  { label: "创建日期", prop: "createTime", type: "text" },
  { label: "类型", prop: "type", type: "imgType" },
  { label: "banner图片", prop: "img", type: "img", width: 250 },
  { label: "关联链接", prop: "link", type: "input" },
  { label: "排序", prop: "sort", type: "input" },
  { label: "操作", prop: "option", type: "option" }
];
export default {
  data() {
    return {
      freightList: [],
      visible: {
        submitTip: false,
        editTips: false
      },
      tableColumn,
      dialogType: "",
      bannerForm: {
        img: '',
        type: '1'
      },
      bannerList: [],
      bannerRule: {
        img: [{ required: true, message: "请上传图片", trigger: "change" }],
        link: [{ required: true, message: "请输入跳转链接", trigger: "blur" }],
        sort: [{ required: true, message: "请输入排序序号", trigger: "blur" }],
        type: [{ required: true, message: "请选择类型", trigger: "change" }],
      },
      options: [{
        value: 1,
        label:'banner',
      },{
        value: 2,
        label: "验尿卡宣传图"
      },{
        value: 3,
        label: "定制流程图"
      }]
    };
  },
  filters: {
    typeFilter(val) {
      switch(String(val)) {
        case "1": 
          return "banner";
        case "2":
          return "验尿卡宣传图";
        case "3":
          return "定制流程图";
        default:
          return '';
      }
    }
  },
  mounted() {
    this.getList();
  },
  methods: {
    httpRequest(files){
        const ossUpload = new OssUpload(
            files.file, 
            "banner", 
            (url) => {
                this.bannerForm.img = url;
                this.$forceUpdate()
            }
        )
    },
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
      this.$refs.bannerRef.validate(valid => {
        if(valid) {
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
        }
      })
      
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
      this.$refs.bannerRef.resetFields()
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
.upload-block {
    ::v-deep .el-upload {
        width: 166px;
        height: 150px;
        line-height: 150px;
        overflow: hidden;
    }
    .tips-block{
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        &__msg{
            font-size: 12px;
            color: #A8ADB8;
            line-height: 20px;
        }
    }
    ::v-deep .el-upload-list__item-thumbnail {
        width: 166px;
        height: 150px;
    }
    ::v-deep .el-upload-list__item {
        width: 166px;
        height: 150px;
    }
}
</style>
