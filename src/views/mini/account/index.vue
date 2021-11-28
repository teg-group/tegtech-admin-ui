<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" @submit.native.prevent>
      <el-form-item label="微信昵称/手机号" prop="noticeTitle">
        <el-input
          v-model="queryParams.searchValue"
          placeholder="请输入微信昵称/手机号"
          clearable
          size="small"
          @clear="resetQuery"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" :data="noticeList">
      <el-table-column prop="nickName" label="微信昵称" align="center"/>
      <el-table-column prop="phone" label="手机号" align="center"/>
      <el-table-column prop="gender" label="性别" align="center">
        <template slot-scope="{row}">
          <span v-show="row.gender === 0">未知</span>
          <span v-show="row.gender === 1">男</span>
          <span v-show="row.gender === 2">女</span>
        </template>
      </el-table-column>
      <el-table-column prop="registTime" label="注册日期" align="center">
        <template slot-scope="{row}">
          <span>{{ parseTime(row.registTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="petNum" label="宠物数量" align="center"/>
      <el-table-column prop="urinalysisNum" label="领取验尿卡数量" align="center"/>
      <el-table-column prop="reportNum" label="获取检测报告数量" align="center"/>
      <el-table-column prop="buyFoodNum" label="购买食物数量（袋）" align="center"/>
      <el-table-column prop="inviteNum" label="拉新数量" align="center"/>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
    </div>
</template>

<script>
import { queryAccountManage } from "@/api/mini/accountManage"

export default {
  name: "Account",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 表格数据
      noticeList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      dateRange: [],
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        searchValue: undefined,
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询账户列表 */
    getList() {
      this.loading = true;
      queryAccountManage(this.queryParams).then(response => {
        this.noticeList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams.searchValue = ''
      this.handleQuery();
    },
  }
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