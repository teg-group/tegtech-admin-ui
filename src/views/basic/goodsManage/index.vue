<template>
  <div class="app-container">
    <el-form ref="queryForm" :inline="true" v-show="showSearch">
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
          @click="handleAdd"
          v-hasPermi="['system:notice:add']"
        >批量增加库存</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:notice:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:notice:remove']"
        >删除</el-button>
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
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:notice:edit']"
          >修改库存</el-button>
          <!-- <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:notice:remove']"
          >删除</el-button> -->
        </template>
      </el-table-column>

      <!-- <el-table-column
        label="公告类型"
        align="center"
        prop="noticeType"
        :formatter="typeFormat"
        width="100"
      /> -->
      <!-- <el-table-column
        label="状态"
        align="center"
        prop="status"
        :formatter="statusFormat"
        width="100"
      /> -->
    </el-table>

    <pagination
      v-show="listQuery.total>0"
      :total="listQuery.total"
      :page.sync="listQuery.pageNum"
      :limit.sync="listQuery.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改公告对话框 -->
    <el-dialog :close-on-click-modal="false" :title="title" :visible.sync="open" width="400px" append-to-body>
        <el-form ref="form" :model="form" :rules="rules" label-width="80px">
            <el-form-item label="增加数量" prop="noticeTitle">
                <el-input v-model="form.noticeTitle" placeholder="请输入增加数量" />
            </el-form-item>
        </el-form>
        <div class="tips-block">
            <p>备注：</p>
            <p>1、通过此功能，给所有未停用的商品增加库存；</p>
            <p>2、库存增加后，直接显示在用户端，可进行购买；</p>
            <p>3、库存最大上限为99999；</p>
            <p>4、若需要调整单个商品的库存，可通过商品的修改库存功能；</p>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" size="small" @click="submitForm">确 定</el-button>
            <el-button @click="cancel" size="small">取 消</el-button>
        </div>
        </el-dialog>
    </div>
</template>

<script>
import { listNotice, getNotice, delNotice, addNotice, updateNotice, exportNotice } from "@/api/system/notice";
import Editor from '@/components/Editor';

import { getProductManageList } from "@/api/mini/material"
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
      list: [],
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
      queryParams: {
        searchVal: "",
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        noticeTitle: [
          { required: true, message: "公告标题不能为空", trigger: "blur" }
        ],
        noticeType: [
          { required: true, message: "公告类型不能为空", trigger: "change" }
        ]
      },
      listQuery: {
        total: 0,
        pageNum: 1,
        pageSize: 10,
      },
    };
  },
  created() {
    this.getList();


    this.getDicts("sys_notice_status").then(response => {
      this.statusOptions = response.data;
    });
    this.getDicts("sys_notice_type").then(response => {
      this.typeOptions = response.data;
    });
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
    // 公告状态字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status);
    },
    // 公告状态字典翻译
    typeFormat(row, column) {
      return this.selectDictLabel(this.typeOptions, row.noticeType);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        noticeId: undefined,
        noticeTitle: undefined,
        noticeType: undefined,
        noticeContent: undefined,
        status: "0"
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.listQuery.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.noticeId)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加公告";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const noticeId = row.noticeId || this.ids
      getNotice(noticeId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改公告";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.noticeId != undefined) {
            updateNotice(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addNotice(this.form).then(response => {
              this.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const noticeIds = row.noticeId || this.ids
      this.$confirm('是否确认删除公告编号为"' + noticeIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delNotice(noticeIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
    }
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