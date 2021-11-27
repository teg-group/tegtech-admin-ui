<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch">
      <el-form-item label="宠物名称" prop="noticeTitle">
        <el-input
          v-model="queryParams.searchValue"
          placeholder="请输入宠物名称"
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
      <el-table-column prop="createTime" label="添加日期" align="center">
        <template slot-scope="{row}">
          <span>{{ parseTime(row.createTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="avatarUrl" label="宠物头像" align="center">
        <template slot-scope="{row}">
          <img :src="row.avatarUrl" :alt="row.name" style="width:40px;height:40px">
        </template>
      </el-table-column>
      <el-table-column prop="name" label="宠物名称" align="center"/>
      <el-table-column prop="gender" label="宠物性别" align="center"/>
      <el-table-column prop="breed" label="宠物品种" align="center"/>
      <el-table-column prop="birthday" label="宠物生日" align="center">
        <template slot-scope="{row}">
          <span>{{ parseTime(row.birthday, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
       <el-table-column prop="feedDate" label="到家时间" align="center">
        <template slot-scope="{row}">
          <span>{{ parseTime(row.feedDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="neuter" label="绝育状态" align="center">
         <template slot-scope="{row}">
          <span v-show="row.neuter === 1">未绝育</span>
          <span v-show="row.neuter === 2">已绝育</span>
          <span v-show="row.neuter === 3">不确定</span>
        </template>
      </el-table-column> 
      </el-table-column>
      <el-table-column prop="length" label="身长" align="center"/>
      <el-table-column prop="weight" label="体重" align="center"/>
      <el-table-column prop="exerciseHour" label="每周运动时数" align="center"/>
      <el-table-column prop="pbmi" label="PBMI" align="center"/>
      <el-table-column prop="allergicFood" label="过敏食物" align="center"/>
      <el-table-column prop="disease" label="病症" align="center"/>
      <el-table-column prop="stapleFood" label="当前主粮" align="center"/>
      <el-table-column prop="detectNum" label="检测次数" align="center"/>
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
import { listNotice, getNotice, delNotice, addNotice, updateNotice, exportNotice } from "@/api/system/notice";
import Editor from '@/components/Editor';
import { queryPetList } from "@/api/mini/accountManage"

export default {
  name: "Notice",
  components: {
    Editor
  },
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
      // 公告表格数据
      noticeList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 类型数据字典
      statusOptions: [],
      // 状态数据字典
      typeOptions: [],
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
    /** 查询公告列表 */
    getList() {
      this.loading = true;
      queryPetList(this.queryParams).then(response => {
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