<template>
  <div class="app-container">
    <el-tabs type="card">
      <el-tab-pane label="参数设置">
        <el-table :data="tableData" :span-method="spanMethod" border style="width: 100%">
          <el-table-column prop="item" label="检测项目" width="180"></el-table-column>
          <el-table-column prop="value" label="检测结果" width="180"></el-table-column>
          <el-table-column prop="description" label="文字解读"></el-table-column>
          <el-table-column prop="dietDesc" label="戒食"></el-table-column>
          <el-table-column prop="eatDesc" label="多吃"></el-table-column>
          <el-table-column fixed="right" label="操作" width="100">
            <template slot-scope="scope">
              <el-button @click="handleClick(scope.row)" type="text" size="small">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
        <settingForm
          class="setting-form"
          ref="settingForm"
          :isShow="isOpen"
          @onSubmit="onSubmit"
          @onCancel="onCancel"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import {
  getParamsSettingList,
  modifyParamsSetting
} from "../../../api/mini/paramsSetting";
import settingForm from "./settingForm";
export default {
  name: "ParamsSetting",
  components: { settingForm },
  created() {
    this.getList();
  },
  data() {
    return {
      isOpen: false,
      tableData: [],
      transData: []
    };
  },
  methods: {
    handleClick(row) {
      console.log(row);
      this.$refs.settingForm.giveValue(row);
      this.isOpen = true;
    },
    getList() {
      getParamsSettingList().then(res => {
        this.tableData = res;
        this.setrowspans();
      });
    },
    onCancel(data) {
      this.isOpen = data;
    },
    onSubmit(data) {
      modifyParamsSetting(data).then(() => {
        this.$message({
          message: "保存成功！",
          type: "success"
        });
        this.getList();
        this.isOpen = false;
      });
    },
    spanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        return {
          rowspan: row.rowspan,
          colspan: 1
        };
      }
      console.log(row, column, rowIndex, columnIndex);
    },
    setrowspans() {
      // 先给所有的数据都加一个v.rowspan = 1
      this.tableData.forEach(v => {
        v.rowspan = 1;
      });
      // 双层循环
      for (let i = 0; i < this.tableData.length; i++) {
        // 内层循环，上面已经给所有的行都加了v.rowspan = 1
        // 这里进行判断
        // 如果当前行的id和下一行的id相等
        // 就把当前v.rowspan + 1
        // 下一行的v.rowspan - 1
        for (let j = i + 1; j < this.tableData.length; j++) {
          //此处可根据相同字段进行合并，此处是根据的id
          if (this.tableData[i].category === this.tableData[j].category) {
            this.tableData[i].rowspan++;
            this.tableData[j].rowspan--;
          }
        }
        // 这里跳过已经重复的数据
        i = i + this.tableData[i].rowspan - 1;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.setting-form {
  position: fixed;
  left: 47%;
  top: 300px;
  width: 350px;
}
</style>