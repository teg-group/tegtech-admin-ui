<template>
  <div>
    <el-form ref="form" :model="form" label-width="150px" class="form-block">
      <el-row>
        <el-col :span="12">
          <el-form-item label="开启运费计算">
            <el-radio-group v-model="radio" @change="changeStatus">
              <el-radio :label="0">开启</el-radio>
              <el-radio :label="1">关闭</el-radio>
            </el-radio-group>
            <span class="form-block__tips"
              >（选择免运费，代表所有订单均不收运费）</span
            >
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="计费方式" prop="noticeTitle">
            <el-radio-group v-model.number="radio">
              <el-radio :label="3">按重量计费（g）</el-radio>
            </el-radio-group>
            <div>
              <el-table :data="freightList" row-key="id">
                <el-table-column
                  v-for="(item, index) in tableColumn"
                  :key="index"
                  :prop="item.prop ? item.prop : undefined"
                  :label="item.label"
                  align="center"
                  :width="item.width"
                >
                  <template slot-scope="scope">
                    <el-input
                      v-if="item.type === 'input'"
                      :readonly="item.readonly"
                      v-model.number="scope.row[item.prop]"
                    ></el-input>
                    <el-select
                      v-else-if="item.type === 'select'"
                      :readonly="item.readonly"
                      v-model.number="scope.row[item.prop]"
                    >
                      <el-option
                        v-for="item in province"
                        :key="item.id"
                        :label="item.name"
                        :value="item.name"
                      ></el-option>
                    </el-select>
                    <div v-else-if="item.type === 'option'">
                      <!-- <el-button @click="editData(item, scope.row)">编辑</el-button> -->
                      <el-button
                        size="mini"
                        type="text"
                        @click="showDialog('showTips', scope.row)"
                        >保存</el-button
                      >
                      <el-button
                        size="mini"
                        type="text"
                        icon="el-icon-delete"
                        @click="showDialog('deleteShowTips', scope.row)"
                        >删除</el-button
                      >
                    </div>
                    <div v-else>{{ scope.row[item.prop] }}</div>
                  </template>
                </el-table-column>
              </el-table>
              <el-button @click="addData">添加</el-button>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-dialog
      :close-on-click-modal="false"
      title="保存确认"
      :visible.sync="visible.showTips"
      width="370px"
      append-to-body
    >
      <div class="dialog-content">
        确认要保存的当前信息吗？确认后新产生的数据将按照此规则执行，过往数据不做任何改变！
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('saveData')"
          >确 定</el-button
        >
        <el-button @click="cancel('showTips')">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      title="保存确认"
      :visible.sync="visible.deleteShowTips"
      width="370px"
      append-to-body
    >
      <div class="dialog-content">
        确定要删除该条运费计算模式吗？删除后系统计算可能会出问题！
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('deleteData')"
          >确 定</el-button
        >
        <el-button @click="cancel('deleteShowTips')">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getFreightStatus,
  changeFreightStatus,
  getFreight,
  getProvins,
  editFreight,
  addFreight,
  delFreight
} from "@/api/mini/platformSet";

const tableColumn = [
  { label: "地区", prop: "provinceName", type: "select" },
  { label: "首重(g)", prop: "firstWeight", type: "input" },
  { label: "首重运费（元）", prop: "firstWeightFee", type: "input" },
  { label: "续重（g）", prop: "additionalWeight", type: "input" },
  { label: "续重运费（元）", prop: "additionalWeightFee", type: "input" },
  { label: "封顶金额", prop: "capped", type: "input" },
  { label: "设置", prop: "option", type: "option" }
];
export default {
  data() {
    return {
      freightList: [],
      visible: {
        showTips: false,
        deleteShowTips: false
      },
      tableColumn,
      form: {},
      radio: "",
      province: [],
      optionData: {}
    };
  },
  mounted() {
    this.getStatus();
    this.getList();
    this.getProvince();
  },
  methods: {
    getStatus() {
      getFreightStatus().then(res => {
        if (res.code == 1000) {
          this.radio = res.data;
        }
      });
    },
    getProvince() {
      getProvins().then(res => {
        if (res.code == 1000) {
          this.province = res.data;
        }
      });
    },
    getList() {
      getFreight().then(res => {
        if (res.code == 1000) {
          this.freightList = res.rows;
        }
      });
    },
    changeStatus() {
      changeFreightStatus(this.radio).then(res => {
        if (res.code == 1000) {
          if (this.radio == 0) this.msgSuccess("成功开启运费计算");
          if (this.radio == 1) this.msgSuccess("成功关闭运费计算");
        }
      });
    },
    saveData() {
      this.optionData.provinceId = this.progressProvince(
        this.optionData.provinceName
      );
      if (this.optionData.id) {
        editFreight(this.optionData).then(res => {
          if (res.code == 1000) {
            this.msgSuccess("保存成功");
            this.getList();
            this.visible.showTips = false;
          }
        });
      } else {
        addFreight(this.optionData).then(res => {
          if (res.code == 1000) {
            this.msgSuccess("保存成功");
            this.getList();
            this.visible.showTips = false;
          }
        });
      }
    },
    progressProvince(provinceName) {
      let id = "";
      this.province.forEach(item => {
        if (item.name === provinceName) {
          console.log(item);
          id = item.id;
        }
      });
      return id;
    },
    showDialog(flag, row) {
      if (flag === "deleteShowTips") {
        return this.freightList.pop();
      }
      this.optionData = row;
      this.visible[flag] = true;
    },
    deleteData() {
      if (this.optionData.id) {
        delFreight(this.optionData.id).then(res => {
          if (res.code == 1000) {
            this.msgSuccess("删除成功");
            this.getList();
            this.visible.deleteShowTips = false;
          }
        });
      }
    },
    addData() {
      if (
        !this.freightList.length == 0 &&
        !this.freightList[this.freightList.length - 1].id
      ) {
        return this.msgError("请先保存上一条数据信息");
      }
      this.freightList.push({
        provinceName: "",
        firstWeight: "",
        firstWeightFee: "",
        additionalWeight: "",
        additionalWeightFee: "",
        capped: 999
      });
    },
    cancel(flag) {
      this.visible[flag] = false;
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
