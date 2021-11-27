<template>
  <div class="app-container">
    <!-- 只有一个input时会触发form的默认时间 加@submit.native.prevent-->
    <el-form :model="queryParams" :inline="true" v-show="showSearch" @submit.native.prevent>
      <el-form-item label="商品编号/名称">
        <el-input
         v-model="queryParams.searchVal"
         placeholder="请输入商品编号/名称"
         clearable
         size="small"
         @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAddStock('batch')"
          :disabled="multiple"
        >批量增加库存</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>
    <el-table v-loading="loading" :data="list" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column prop="code" label="商品编号" align="center"/>
      <el-table-column prop="name" label="商品名称" align="center"/>
      <el-table-column prop="english" label="英文名称" align="center"/>
      <el-table-column prop="specification" label="商品规格" align="center"/>
      <el-table-column prop="brand" label="品牌" align="center"/>
      <el-table-column prop="shelfLife" label="保质期(月)" align="center"/>
      <el-table-column prop="packing" label="包装方式" align="center"/>
      <el-table-column prop="stock" label="库存数量(件)" align="center"/>
      <el-table-column label="操作" align="center" fixed="right" class-name="small-padding fixed-width" width="130">
        <template slot-scope="{row}">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(row)"
          >修改库存</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="listQuery.total>0"
      :total="listQuery.total"
      :page.sync="listQuery.pageNum"
      :limit.sync="listQuery.pageSize"
      @pagination="getList"
    />
    <div v-if="open">
      <el-dialog :close-on-click-modal="false" :title="title" :visible.sync="open" width="400px" append-to-body>
        <el-form ref="form" :model="form" :rules="rules" label-width="80px">
          <el-form-item label="增加数量" prop="stock">
            <el-input v-model.number="form.stock" placeholder="请输入增加数量"/>
          </el-form-item>
        </el-form>
        <div class="tips-block">
          <p>备注：</p>
          <p v-for="(tip, index) in tips" :key="index">{{`${index+1}、${tip}`}}</p>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" size="small" @click="submitForm">确 定</el-button>
          <el-button @click="cancel" size="small">取 消</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getProductManageList, batchUpdateStock, updateStock } from "@/api/mini/material"
import listPage from "@/mixin/listPage"
export default {
  name: "GoodsManage",
  mixins: [listPage],
  data() {
    const validStock = (rule, value, callback) => {
      if (value > 99999) {
        return callback(new Error('库存最大上限为99999'));
      } else {
        callback()
      }
    }
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 显示搜索条件
      showSearch: true,
      list: [],
      // 是否显示弹出层
      open: false,
      queryParams: {
        searchVal: "",
      },
      operate: "",
      // 表单参数
      form: {
        stock: ""
      },
      // 表单校验
      rules: {
        stock: [
          { required: true, message: "增加数量不能为空", trigger: "blur" },
          { type: 'number', message: '数量必须为数字值', trigger: "blur"},
          { validator: validStock, trigger: ['change', 'blur'] }
        ],
      },
    };
  },
  computed: {
    title(){
      return this.operate === "batch" ? "批量增加库存" : "增加库存"
    },
    multiple(){
      return !this.selectRows.length > 0
    },
    tips(){
      let arr = ["库存增加后，直接显示在用户端，可进行购买；", "库存最大上限为99999；", "输入‘-’数是指减少库存；"]
       if (this.operate === "batch") {
         return ["通过此功能，给所有未停用的商品增加库存；", ...arr, "若需要调整单个商品的库存，可通过商品的修改库存功能；"]
       } else {
         return arr
       }
    }
  },
  created() {
    this.getList();
  },
  methods: {
    async getList() {
      try{
        this.loading = true;
        const { pageNum, pageSize } = this.listQuery;
        const {  searchVal } = this.queryParams;
        const result = await getProductManageList({
          pageNum,
          pageSize,
          searchValue: searchVal,
        })
        this.list = result.rows;
        this.listQuery.total = result.total;
        this.loading = false;
      }catch(error){}
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.form.stock = "";
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.listQuery.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams.searchVal = "";
      this.handleQuery();
    },
    /** 新增按钮操作 */
    handleAddStock(type) {
      this.operate = type;
      this.open = true;
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.operate = "single";
      this.open = true;
      this.ids = [row.id]
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(async valid => {
        if (!valid) return;
        try{
          if (this.operate === "batch") {
            this.ids = this.selectRows.map(item => item.id)
            await batchUpdateStock({
              ids: this.ids,
              num: this.form.stock
            })
          } else {
            await updateStock({
              id: this.ids[0],
              num: this.form.stock
            })
          }
          this.cancel();
          this.msgSuccess("增加成功");
          this.getList();
        }catch(error){}
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.tips-block {
  font-size: 12px;
  color: #A8ADB8;
  line-height: 20px;
  p{
    margin: 0;
  }
}
</style>