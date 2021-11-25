<template>
<div>
    <el-form ref="form" :model="form" :rules="rules" label-width="150px" class="form-block">
        <el-row>
            <el-col :span="12">
                <el-form-item label="开启运费计算">
                    <el-radio-group v-model="radio">
                        <el-radio :label="3">开启</el-radio>
                        <el-radio :label="6">关闭</el-radio>
                    </el-radio-group>
                    <span class="form-block__tips">（选择免运费，代表所有订单均不收运费）</span>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="24">
                <el-form-item label="计费方式" prop="noticeTitle">
                    <el-radio-group v-model="radio">
                        <el-radio :label="3">按重量计费（g）</el-radio>
                    </el-radio-group>
                    <div>
                        <el-table :data="freightList" row-key="id">
                            <el-table-column prop="deptName" label="地区"></el-table-column>
                            <el-table-column prop="orderNum" label="首重(g)"></el-table-column>
                            <el-table-column prop="status" label="首重运费（元）" :formatter="statusFormat"></el-table-column>
                            <el-table-column prop="status" label="续重（g）" :formatter="statusFormat" ></el-table-column>
                            <el-table-column prop="status" label="续重运费（元）" :formatter="statusFormat"></el-table-column>
                            <el-table-column label="封顶金额" align="center" prop="createTime" width="200">
                                <!-- <template slot-scope="scope">
                                <span>{{ parseTime(scope.row.createTime) }}</span>
                                </template> -->
                            </el-table-column>
                            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                                <!-- <template slot-scope="{row}">
                                </template> -->
                            </el-table-column>
                        </el-table>
                    </div>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
                <el-form-item label="">
                <el-button type="primary" @click="onSave">保存更改</el-button>
                </el-form-item>
            </el-col>
        </el-row>
    </el-form>
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