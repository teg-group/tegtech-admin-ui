<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch">
      <el-form-item label="用户昵称/手机号" prop="noticeTitle">
        <el-input
          v-model="queryParams.searchValue"
          placeholder="请输入用户昵称/手机号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="检测日期">
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
      <el-form-item label="报告状态" prop="status">
        <el-select
          v-model="queryStatus.report"
          placeholder="报告状态"
          clearable
          size="small"
          style="width: 240px"
        >
          <el-option
            v-for="dict in reportStatusOptions"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="审核状态" prop="status">
        <el-select
          v-model="queryStatus.examine"
          placeholder="审核状态"
          clearable
          size="small"
          style="width: 240px"
        >
          <el-option
            v-for="dict in examineStatusOptions"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" :data="detectionList" >
      <el-table-column label="检测日期" align="center">
        <template slot-scope="{row}">
          <span>{{ parseTime(row.detectTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="nickName" label="用户昵称" align="center"/>
      <el-table-column prop="phone" label="手机号码" align="center"/>
      <el-table-column prop="petName" label="宠物名称" align="center"/>
      <el-table-column label="检测结果" align="center" >
        <template slot-scope="{row}">
          <span v-for="(item, index) in row.items" :key="item.item">{{ item.item }}：{{ item.value }}{{index === row.items.length - 1 ? '' : '，'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="检测照片" align="center">
        <template slot-scope="{row}">
          <img class="detection-table-img" @click="onPreviewReportImg(row.reportImg)" :src="row.reportImg" alt="" height="80">
        </template>
      </el-table-column>
      <el-table-column label="推荐商品" align="center">
        <template slot-scope="{row}">
          <p v-for="item in row.products" :key="item">{{ item }}</p>
        </template>
      </el-table-column>
      <el-table-column label="报告状态" align="center">
        <template slot-scope="{row}">
          <span>{{ row.status === 0 ? '未生成' : '已生成' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="审核状态" align="center">
        <template slot-scope="{row}">
          <div>
            <span>{{ row.status | examineStatusFilter }}
          </span>
          <el-tooltip v-if="row.status === 4" class="item" effect="dark" :content="row.reason || '无'" placement="top">
            <i class="el-icon-question" style="font-size: 14px;cursor: pointer;"></i>
          </el-tooltip>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" fixed="right" class-name="small-padding fixed-width" width="130">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.status === 0"
            type="text" 
            size="mini" 
            @click="$router.push(`/mini/detectionReport?id=${scope.row.id}`)"
          >生成检测报告</el-button>
          <el-button
            v-else
            type="text" 
            size="mini" 
            @click="$router.push(`/mini/detectionReport?id=${scope.row.id}`)"
          >查看检测报告</el-button>
          <el-button
            v-if="scope.row.status === 1"
            size="mini"
            type="text"
            @click="handleAuditSuccess(scope.row.id)"
          >审核通过</el-button>
          <el-button
          v-if="scope.row.status === 1"
            size="mini"
            type="text"
            @click="handleAuditFail(scope.row.id)"
          >审核不通过</el-button>
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
    <!-- 检测图片弹窗 -->
    <el-dialog :close-on-click-modal="false" :visible.sync="reportImgVisible" title="图片" width="780px" append-to-body>
      <img :src="reportImgUrl" alt="">
    </el-dialog>
    <!-- 审核不通过弹窗 -->
    <el-dialog :close-on-click-modal="false" title="不通过原因" :visible.sync="examineVisible" width="780px" append-to-body>
      <el-form ref="examineForm" :model="examineForm" :rules="examineRules" label-width="0px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="" prop="reason">
              <el-input type="textarea" v-model="examineForm.reason"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitExamineForm">确 定</el-button>
        <el-button @click="onCancelExamine">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getDetectionList, auditDetection } from "@/api/mini/detection";

export default {
  name: "Detection",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 检测日期
      dateRange: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        searchValue: null,
        status: null,
        beginTime: null,
        endTime: null
      },
      queryStatus: {
        report: null,
        examine: null
      },
      // 报告状态数据字典
      reportStatusOptions: [{
        value: 1,
        label: '未生成'
      }, {
        value: 2,
        label: '已生成'
      }],
      // 审核状态数据字典
      examineStatusOptions: [{
        value: 1,
        label: '未审核'
      }, {
        value: 2,
        label: '审核通过'
      }, {
        value: 3,
        label: '审核未通过'
      }],
      // 总条数
      total: 0,
      // 检测表格数据
      detectionList: [],
      // 是否显示审核不通过弹窗
      examineVisible: false,
      // 表单参数
      examineForm: {
        id: null,
        reason: null
      },
      // 表单校验
      examineRules: {
        reason: [
          { required: true, message: "不通过原因不能为空", trigger: "blur" }
        ]
      },
      // 是否显示图片弹窗
      reportImgVisible: false,
      // 图片弹窗显示的图片地址
      reportImgUrl: ''
    };
  },
  filters: {
    examineStatusFilter(val) {
      if(val === 3) return '审核通过';
      if(val === 4) return '审核未通过';
      return '未审核'
    }
  },
  created() {
    this.getList();
  },
  methods: {
    /**
     * @method handleAuditFail 审核不通过
     * @param {number} id
     */
    handleAuditFail(id) {
      this.examineForm.id = id;
      this.examineVisible = true;
    },
    /**
     * @method handleAuditSuccess 审核通过
     * @param {number} id
     */
    handleAuditSuccess(id) {
      this.$confirm('是否已确认检测报告无语，审核通过后将推送给用户！', "审核确认", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function() {
        return auditDetection({
          id: id,
          type: 1
        });
      }).then(() => {
        this.getList();
        this.msgSuccess("操作成功");
      })
    },
    /**
     * @method onPreviewReportImg 查看检测照片
     * @param {string} url 图片地址
     */
    onPreviewReportImg(url) {
      this.reportImgUrl = url;
      this.reportImgVisible = true;
    },
    /**
     * @method submitExamineForm 提交不通过原因表单
     */
    submitExamineForm: function() {
      this.$refs["examineForm"].validate(valid => {
        if (valid) {
          auditDetection({
            id: this.examineForm.id,
            type: 2,
            reason: this.examineForm.reason
          }).then(() => {
            this.getList();
            this.msgSuccess("操作成功");
          })
        }
      });
    },
    /**
     * @method onCancelExamine 不通过原因弹窗点击取消按钮
     */
    onCancelExamine() {
      this.examineVisible = false;
      this.resetExamine();
    },
    /**
     * @method resetExamine 重置不通过原因弹窗中的表单
     */
    resetExamine() {
      this.examineForm = {
        id: null,
        reason: null
      };
    },
    /**
     * @method getList 获取检测列表
     */
    getList() {
      this.loading = true;
      getDetectionList(this.queryParams).then(response => {
        this.detectionList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    /**
     * @method handleQuery 查询检测数据
     */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /**
     * @method resetQuery 重置查询表单
     */
    resetQuery() {
      this.queryParams = {
        ...this.queryParams,
        searchValue: null,
        beginTime: null,
        endTime: null,
        status: null
      };
      this.dateRange = [];
      this.handleQuery();
    },
  },
  watch: {
    dateRange() {
      let [ begin, end ] = this.dateRange && this.dateRange.length ? this.dateRange : [ null, null ];
      this.queryParams.beginTime = begin;
      this.queryParams.endTime = end;
    },
    queryStatus() {
      if(this.queryStatus.report === 1) {
        this.queryParams.status = 0;
      } else if(this.queryStatus.report === 2) {
        this.queryParams.status = this.queryStatus.examine;
      } else {
        this.queryParams.status = null;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.detection-table-img {
  cursor: pointer;
}
::v-deep {
    .el-dialog__body {
        text-align: center;
    }
}
</style>