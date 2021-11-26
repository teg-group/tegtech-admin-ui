<template>
<div class="app-container">
  <el-form :model="queryParams" :inline="true" v-show="showSearch">
    <el-form-item label="商品编号/名称">
      <el-input
        v-model="queryParams.searchVal"
        placeholder="请输入商品编号/名称"
        clearable
        size="small"
        @keyup.enter.native="handleQuery"
      />
    </el-form-item>
    <el-form-item label="创建时间">
      <el-date-picker
        v-model="queryParams.dateRange"
        size="small"
        style="width: 240px"
        value-format="yyyy-MM-dd"
        type="daterange"
        range-separator="-"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      ></el-date-picker>
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
        @click="handleAdd"
        v-hasPermi="['system:notice:add']"
      >新增商品</el-button>
    </el-col>
    <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
  </el-row>

  <el-table v-loading="loading" :data="list" @selection-change="handleSelectionChange">
    <el-table-column align="center" prop="status" label="上架/下架">
      <template slot-scope="{row}">
        <el-switch :value="!row.status" @change="onChangeState($event, row)"/>
      </template>
    </el-table-column>
    <el-table-column prop="code" label="商品编号" align="center"/>
    <el-table-column prop="name" label="商品名称" align="center"/>
    <el-table-column prop="english" label="英文名称" align="center"/>
    <el-table-column prop="createTime" label="创建日期" align="center"/>
    <el-table-column prop="specification" label="商品规格" align="center"/>
    <el-table-column prop="brand" label="品牌" align="center"/>
    <el-table-column prop="shelfLife" label="保质期(月)" align="center"/>
    <el-table-column prop="packing" label="包装方式" align="center"/>
    <el-table-column prop="costPrice" label="成本价" align="center"/>
    <el-table-column prop="sellingPrice" label="售价" align="center"/>
    <el-table-column prop="discountPrice" label="优惠价" align="center"/>
    <el-table-column prop="selection" label="是否推荐" align="center">
      <template slot-scope="{row}">
        <span>{{ row.selection === 0 ? "是" : "否" }}</span>
      </template>
    </el-table-column>
    <el-table-column prop="status" label="商品状态" align="center">
      <template slot-scope="{row}">
        <span>{{ row.status === 0 ? "已上架" : "已下架" }}</span>
      </template>
    </el-table-column>
    <el-table-column label="操作" align="center" fixed="right" class-name="small-padding fixed-width" width="130">
      <template slot-scope="scope">
        <el-button 
          type="text" 
          size="mini" 
          @click="onLookDetail(scope.row)"
        >查看详情</el-button>
        <el-button
          size="mini"
          type="text"
          icon="el-icon-edit"
          @click="handleUpdate(scope.row)"
          v-hasPermi="['system:notice:edit']"
        >编辑</el-button>
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

  <el-dialog :close-on-click-modal="false" :title="showText.title" :visible.sync="visible.showTips" width="370px" append-to-body>
    <div class="dialog-content">{{showText.content}}</div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="confirm">确 定</el-button>
      <el-button @click="visible.showTips=false">取 消</el-button>
    </div>
  </el-dialog>
</div>
</template>

<script>
import { getProductList, productState } from "@/api/mini/material"
import listPage from "@/mixin/listPage"
export default {
  name: "GoodsMaterial",
  mixins: [listPage],
  data() {
    return {
      showSearch: true,
      list: [],
      title: "",
      queryParams: {
        searchVal: "",
        dateRange: [],
      },
      row: null,
      visible: {
        showTips: false
      },
    };
  },
  computed: {
    showText(){
      if(this.row) {
        return {
          title: this.row.status === 0 ? "下架确认" : "上架确认",
          content: this.row.status === 0 ? "确定要将当前商品下架吗？下架后用户将无法看到！" : "确定要将当前商品上架吗？上架后商品将展示给用户！"
        }
      }
      return {
        title: "",
        content: ""
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
        const {  searchVal, dateRange } = this.queryParams;
        console.log(this.queryParams, dateRange)
        const result = await getProductList({
          pageNum,
          pageSize,
          searchValue: searchVal,
          beginTime: dateRange && dateRange[0] || "",
          endTime: dateRange && dateRange[1] || "",
        })
        this.list = result.rows;
        this.listQuery.total = result.total;
        this.loading = false;
      }catch(error){}
    },
    onChangeState(val, row){
      this.row = {...row};
      this.visible.showTips = true;
    },
    /** 上下架*/
    async confirm(){
      try{
        await productState({
          id: this.row.id
        })
        this.$message.success("操作成功")
        this.visible.showTips = false;
        this.getList()
      }catch(error){}
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.listQuery.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.handleQuery();
    },
    /** 新增按钮操作 */
    handleAdd() {
     this.$router.push("/basic/operate")
    },
    /** 查看详情 */
    handleLook(row){

    },
    /** 修改按钮操作 */
    handleUpdate(row) {

    },
  }
};
</script>