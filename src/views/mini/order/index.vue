<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch">
      <el-form-item label="用户昵称/手机号" prop="searchValue">
        <el-input
          v-model="queryParams.searchValue"
          placeholder="请输入用户昵称/手机号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
     <el-form-item label="下单日期" props="dateRange">
        <el-date-picker
          v-model="dateRange"
          size="small"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="签收状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="物流状态"
          clearable
          size="small"
          style="width: 240px"
        >
          <el-option
            v-for="dict in statusOptions"
            :key="dict.title"
            :label="dict.title"
            :value="dict.key"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" :data="noticeList">
       <el-table-column prop="orderTime" label="下单时间" align="center">
        <template slot-scope="{row}">
          <span>{{ parseTime(row.orderTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="nickName" label="用户昵称" align="center"/>
      <el-table-column prop="phone" label="手机号码" align="center"/>
      <el-table-column prop="quantity" label="订单编号" align="center"/>
      <el-table-column prop="name" label="商品明细" align="center">
        <template slot-scope="{row}">
          <span>{{row.name}}，{{row.specification}}，共{{row.quantity}}袋</span>
        </template>
      </el-table-column>
      <el-table-column prop="subtotal" label="实付金额" align="center"/>
      <el-table-column prop="subtotal" label="付款说明" align="center">
          <template slot-scope="{row}">
            <span>总金额{{row.subtotal}}元 | 运费 {{row.freight}}元 | 积分抵扣{{row.integralDeductionFee}}元</span>
          </template>
      </el-table-column>
      <el-table-column prop="recipientAddress" label="收货地址" align="center">
         <template slot-scope="{row}">
          <span>{{row.recipientAddress}} {{row.recipientName}} {{row.recipientPhone}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="物流状态" align="center">
        <template slot-scope="{row}">
          <span v-show="row.status === 1">代发货</span>
          <span v-show="row.status === 2">待收货</span>
          <span v-show="row.status === 3">已收货</span>
        </template>
      </el-table-column>
      <el-table-column prop="expressNo" label="物流信息" align="center">
        <template slot-scope="{row}">
          <span>{{row.expressCompany}}{{row.expressNo}}</span>
        </template>
      </el-table-column>
      </el-table-column>
      <el-table-column label="操作" align="center" fixed="right" class-name="small-padding fixed-width" width="130">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:notice:edit']"
          >填写物流信息</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
    <!-- 添加或修改公告对话框 -->
    <el-dialog :close-on-click-modal="false" :title="title" :visible.sync="open" width="450px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
            <el-form-item label="物流公司" prop="expressCompany">
              <el-select v-model="form.expressCompany" placeholder="请选择物流公司" style="width:330px">
                <el-option :label="item.title" :value="item.title" :key="item.key" v-for="item in expressCompanyList"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="物流单号" prop="expressNo">
              <el-input v-model="form.expressNo" placeholder="请输入公告标题" />
            </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Editor from '@/components/Editor';
import { queryOrderList, modifyOrder } from "@/api/mini/accountManage"

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
      // 表格数据
      noticeList: [],
      // 弹出层标题
      title: "物流信息",
      // 是否显示弹出层
      open: false,
      // 类型数据字典
      statusOptions: [
        {
          title:'全部',
          key:0
        },{
          title:'代发货',
          key:1
        },{
          title:'待收货',
          key:2
        },{
          title:'已收货',
          key:3
        }
      ],
      expressCompanyList:[
        {
          title:'顺丰快递',
          key:'shunfeng'
        }, {
          title:'圆通快递',
          key:'yuantong'
        }, {
          title:'中通快递',
          key:'zhongtong'
        }, {
          title:'申通快递',
          key:'shentong'
        }, {
          title:'韵达快递',
          key:'yunda'
        }
      ],
      statusOptions1:[],
      // 状态数据字典
      typeOptions: [],
      // 查询参数
      dateRange: [],
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        searchValue: undefined,
        status: undefined,
        beginTime:undefined,
        endTime:undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        expressCompany: [
          { required: true, message: "请选择物流公司", trigger: "change" }
        ],
        expressNo: [
          { required: true, message: "物流单号不能为空", trigger: "change" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询列表 */
    getList() {
      this.loading = true;
      console.log(this.dateRange)
      if(this.dateRange.length === 2){
        this.queryParams.beginTime = this.dateRange[0];
        this.queryParams.endTime = this.dateRange[1];
      }
      queryOrderList(this.queryParams).then(response => {
        this.noticeList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },

    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        expressCompany: undefined,
        expressNo: undefined,
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.dateRange = ''
      this.queryParams.beginTime =''
      this.queryParams.endTime =''
      this.handleQuery();
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.form.id = Number(row.id)
      console.log(this.form)
      this.open = true;
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          console.log(this.form)
          modifyOrder(this.form).then(response => {
            this.msgSuccess("修改成功");
            this.open = false;
            this.getList();
          });
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