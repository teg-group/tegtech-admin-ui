<template>
<div class="app-container">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:notice:add']"
        >新增banner</el-button>
      </el-col>
    </el-row>
    <el-table :data="freightList" row-key="id">
        <el-table-column prop="deptName" label="开关"></el-table-column>
        <el-table-column prop="orderNum" label="创建日期"></el-table-column>
        <el-table-column prop="status" label="banner图片" :formatter="statusFormat"></el-table-column>
        <el-table-column prop="status" label="关联链接" :formatter="statusFormat" ></el-table-column>
        <el-table-column prop="status" label="排序" :formatter="statusFormat"></el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <!-- <template slot-scope="{row}">
            </template> -->
        </el-table-column>
    </el-table>
    <el-dialog :close-on-click-modal="false" title="保存确认" :visible.sync="visible.showTips" width="370px" append-to-body>
        <div class="dialog-content">确认要保存的当前信息吗？确认后新产生的数据将按照此规则执行，过往数据不做任何改变！</div>
        <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
        </div>
    </el-dialog>
</div>
</template>
<script>
export default {
    data() {
        return {
            freightList: [],
            visible: {
                showTips: false
            }
        }
    },
    methods: {
         onSave(){
            this.visible.showTips = true;
        },
        submitForm(){

        },
        cancel(){
            this.visible.showTips = false;
        }
    },
}
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