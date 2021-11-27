<template>
  <div>
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-width="150px"
      class="form-block"
    >
      <!-- <el-row>
        <el-col :span="12">
            <el-form-item label="开启积分功能">
                <el-radio-group v-model="radio">
                    <el-radio :label="3">开启</el-radio>
                    <el-radio :label="6">关闭</el-radio>
                </el-radio-group>
            </el-form-item>
        </el-col>
    </el-row> -->
      <el-row>
        <el-col :span="12">
          <el-form-item label="订单积分折现比例" prop="discountFactor">
            <el-input
              placeholder=""
              v-model.number="form.discountFactor"
              size="small"
              style="width: 180px"
            />
            <span class="form-block__tips">多少积分可以折现1元人民币</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="订单积分使用比例" prop="orderFactor">
            <el-input
              placeholder=""
              v-model.number="form.orderFactor"
              size="small"
              style="width: 180px"
            />
            <span class="form-block__tips">（%）单个订单折现最大百分比</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="订单积分奖励比例" prop="rewardFactor">
            <el-input
              placeholder=""
              size="small"
              v-model.number="form.rewardFactor"
              style="width: 180px"
            />
            <span class="form-block__tips">订单多少人民币奖励1个积分</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="订单抵扣最小额度" prop="minOrderFee">
            <el-input
              placeholder=""
              size="small"
              v-model.number="form.minOrderFee"
              style="width: 180px"
            />
            <span class="form-block__tips">订单达到多少金额才能抵扣</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="新用户奖励积分" prop="inviteAwardGrade">
            <el-input
              placeholder=""
              size="small"
              v-model.number="form.inviteAwardGrade"
              style="width: 180px"
            />
            <span class="form-block__tips"
              >每成功邀请一个新用户奖励积分数量</span
            >
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item>
            <el-button type="primary" @click="onSave">保存更改</el-button>
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
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getIntegral, saveIntegral } from "@/api/mini/platformSet";
export default {
  data() {
    return {
      visible: {
        showTips: false
      },
      form: {},
      rules: {
        discountFactor: [
          {
            required: true,
            message: "请输入订单积分折现比例"
          },
          {
            type: "number",
            min: 0,
            message: "请输入大于0的数字"
          }
        ],
        orderFactor: [
          { required: true, message: "请输入订单积分使用比例" },
          {
            type: "number",
            min: 0,
            message: "请输入0-100之间的数字"
          }
        ],
        rewardFactor: [
          { required: true, message: "请输入订单积分奖励比例" },
          {
            type: "number",
            min: 0,
            message: "请输入大于0的数字"
          }
        ],
        minOrderFee: [
          { required: true, message: "请输入订单抵扣最小额度" },
          {
            type: "number",
            min: 0,
            message: "请输入大于0的数字"
          }
        ],
        inviteAwardGrade: [
          { required: true, message: "请输入新用户奖励积分数量" },
          {
            type: "number",
            min: 0,
            message: "请输入大于0的数字"
          }
        ]
      }
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      getIntegral().then(res => {
        if (res.code == 1000) {
          this.form = res.data;
        } else {
          this.msgError("积分数据获取失败");
        }
      });
    },
    onSave() {
      this.visible.showTips = true;
    },
    submitForm() {
      saveIntegral(this.form).then(res => {
        if (res.code == 1000) {
          this.msgSuccess("保存成功");
          this.getData();
          this.visible.showTips = false;
        }
      });
    },
    cancel() {
      this.visible.showTips = false;
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
.dialog-content {
  text-align: center;
}
</style>
