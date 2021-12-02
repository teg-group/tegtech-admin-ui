<template>
    <div class="app-container">
        <el-form class="basic-form" :model="reportForm" ref="reportForm" :rules="reportFormRules" label-width="110px" :hide-required-asterisk="true">
            <el-row>
                <el-col :span="24">
                    <el-form-item label="检测报告版本" prop="reportLang">
                        <el-radio-group v-model="reportForm.reportLang" size="medium" @change="detectionReportDetail">
                            <el-radio-button :label="0" :disabled="reportForm.reportLang!==0&&readonly">简体中文</el-radio-button>
                            <el-radio-button :label="1" :disabled="reportForm.reportLang!==1&&readonly">繁体中文</el-radio-button>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="解读报告编号">
                        <span>{{ reportForm.code }}</span>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="提交检测日期">
                        <span>{{ reportForm.detectTime }}</span>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="检测结果" prop="result">
                        <el-radio-group v-model="reportForm.result" size="medium">
                            <el-radio-button :label="1" :disabled="reportForm.result!==1&&readonly">健康异常</el-radio-button>
                            <el-radio-button :label="0" :disabled="reportForm.result!==0&&readonly">非常健康</el-radio-button>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <div class="title">主人资料</div>
        <div class="basic-block">
            <el-form class="basic-form-lengthen" label-width="110px">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="姓名">
                            <span>{{ owner.nickName }}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="联络电话">
                            <span>{{ owner.phone }}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <div class="title">宠物资料</div>
        <div class="basic-block">
            <el-form class="basic-form-lengthen" label-width="110px">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="姓名">
                            <span>{{ pet.name }}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="品种">
                            <span>{{ pet.breed }}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="性别">
                            <span>{{ pet.gender }}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="出生日期">
                            <span>{{ pet.birthday }}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="年龄">
                            <span>{{ pet.age }}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="是否已绝育">
                            <span>{{ pet.neuter }}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="身长">
                            <span>{{ pet.length }} cm</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="体重">
                            <span>{{ pet.weight }} kg</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="PBMI">
                            <span>{{ pet.pbmi }}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="每周运动小时数">
                            <span>{{ pet.exerciseHour }} 小时</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="过敏食物">
                            <span>{{ pet.allergicFood }}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="病症">
                            <span>{{ pet.disease }}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="主粮">
                            <span>{{ pet.stapleFood }}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <div class="title">基本检测结果</div>
        <div class="basic-block">
            <el-form class="basic-form" label-width="110px">
                <el-row>
                    <el-col v-for="(item) in detectItems" :key="item.id" :span="12">
                        <el-form-item :label="item.item">
                            <span>{{ item.value }}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <img class="report-urinalysis" :src="reportForm.urinalysisImg" alt="" @click="onPreviewReportImg(reportForm.urinalysisImg)">
        </div>
        <div class="title">检测解读</div>
        <div class="basic-block">
            <div class="basic-desc" v-for="(item, index) in detectItems" :key="item.id">
                <el-form class="basic-desc-form" :class="{view: readonly}" label-width="70px" :model="detectItems[index]" :ref="`detectItemForm${item.id}`" :rules="detectItemFormRules" :hide-required-asterisk="true">
                    <div class="basic-desc-title">{{ item.item }} {{ item.value }}</div>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="解读" prop="description">
                                <el-input :class="{view: !item.isEdit}" :readonly="!item.isEdit" type="textarea" :autosize="true" v-model="detectItems[index].description"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item label="戒食" prop="dietDesc">
                                <el-input :class="{view: !item.isEdit}" :readonly="!item.isEdit" type="textarea" :autosize="true" v-model="detectItems[index].dietDesc"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item label="多吃" prop="eatDesc">
                                <el-input :class="{view: !item.isEdit}" :readonly="!item.isEdit" type="textarea" :autosize="true" v-model="detectItems[index].eatDesc"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <template v-if="!readonly">
                        <el-button v-if="!item.isEdit" class="basic-desc-btn" @click="checkHasEditItem(index)">编辑</el-button>
                        <el-button v-else class="basic-desc-btn" @click="saveDetectItem(index)">保存</el-button>
                    </template>
                </el-form>
            </div>
        </div>
        <div class="title">营养师的话</div>
        <div class="basic-block">
            <!-- :hide-required-asterisk="true" -->
            <el-form class="basic-form" :model="dietForm" :rules="dietFormRules" ref="dietForm" label-width="110px">
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="主粮简评" prop="food">
                            <el-input :readonly="readonly" type="textarea" :autosize="{minRows:3}" v-model="dietForm.food"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="健康总评" prop="health">
                            <el-input :readonly="readonly" type="textarea" :autosize="{minRows:3}" v-model="dietForm.health"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="饮食建议" prop="dietary">
                            <el-input :readonly="readonly" type="textarea" :autosize="{minRows:3}" v-model="dietForm.dietary"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <div class="title">推荐粮食</div>
        <div class="basic-block">
            <div class="basic-form-lengthen">
                <template v-for="(item) in products">
                    <div class="report-product-block" :key="item.id">
                        <img class="left" :src="item.coverImg" alt="">
                        <div class="right">
                            <div class="name">{{ item.name }}</div>
                            <div class="spec">{{ item.specification }}</div>
                        </div>
                    </div>
                </template>
                <div v-if="!readonly" class="report-product-block" style="cursor: pointer;" @click="openProductsPop">
                    <div class="add">
                        <i class="el-icon-plus"></i>
                        <span>选择推荐粮食</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="footer-block" v-if="!readonly">
            <el-button size="mini" @click="handleBack">返 回</el-button>
            <el-button size="mini" type="primary" @click="createDetectReport">确认使用该报告</el-button>
        </div>
        <!-- 推荐商品弹窗 -->
        <el-dialog v-if="!readonly" :visible.sync="productsVisible">
            <div class="clearfix">
                <el-checkbox-group v-model="productCheckList">
                <template v-for="(item) in productList">
                    <div class="report-product-block half" :key="item.id">
                        <div class="checkbox">
                            <el-checkbox :label="item.id"></el-checkbox>
                        </div>
                        <img class="left" :src="item.coverImg" alt="">
                        <div class="right">
                            <div class="name">{{ item.name }}</div>
                            <div class="spec">{{ item.specification }}</div>
                        </div>
                    </div>
                </template>
                </el-checkbox-group>
            </div>
            <div slot="footer">
                <el-button @click="productsVisible = false">取 消</el-button>
                <el-button type="primary" @click="onConfirmSelectProduct">确认选择</el-button>
            </div>
        </el-dialog>
        <!-- 检测图片弹窗 -->
        <el-dialog :close-on-click-modal="false" :visible.sync="reportImgVisible" title="图片" width="780px" append-to-body>
            <img :src="reportImgUrl" alt="">
        </el-dialog>
    </div>
</template>

<script>
import { detectionReportDetail, modifyDetectItem, createDetectReport, getProductsList } from '@/api/mini/detection';
export default {
    name: 'DetectionReport',
    data() {
        return {
            // 检测id
            detectId: null,
            // 报告信息
            reportForm: {
                status: null,
                reportLang: 0,
                code: null,
                detectTime: null,
                result: null,
                reportImg: null,
                urinalysisImg: null
            },
            reportFormRules: {
                reportLang: [
                    { required: true, message: "检测报告版本不能为空", trigger: "blur" }
                ],
                result: [
                    { required: true, message: "检测结果不能为空", trigger: "blur" }
                ]
            },
            // 主人资料
            owner: {},
            // 宠物资料
            pet: {},
            // 基本检测结果
            detectItems: [],
            // 基本检测结果校验
            detectItemFormRules: {
                description: [
                    { required: true, message: "解读不能为空", trigger: "blur" }
                ],
                dietDesc: [
                    { required: true, message: "戒食不能为空", trigger: "blur" }
                ],
                eatDesc: [
                    { required: true, message: "多吃不能为空", trigger: "blur" }
                ]
            },
            // 推荐商品
            products: [],
            // 营养师的话
            dietForm: {
                food: null,
                health: null,
                dietary: null
            },
            // 营养师的话校验
            dietFormRules: {
                food: [
                    { required: true, message: "主粮简评不能为空", trigger: "blur" }
                ],
                health: [
                    { required: true, message: "健康总评不能为空", trigger: "blur" }
                ],
                dietary: [
                    { required: true, message: "饮食建议不能为空", trigger: "blur" }
                ]
            },
            // 是否显示推荐商品弹窗
            productsVisible: false,
            // 推荐商品数据
            productList: [],
            // 推荐商品选择id集合
            productCheckList: [],
            // 正在编辑的基本检测结果项
            currentEditItemId: null,
            // 是否显示图片弹窗
            reportImgVisible: false,
            // 图片弹窗显示的图片地址
            reportImgUrl: ''
        };
    },
    computed: {
        readonly() {
            return this.reportForm.status !== 0;
        }
    },
    created() {
        this.detectId = this.$route.query.id;
        this.detectionReportDetail();
        this.getProductsList();
    },
    methods: {
        /**
         * @method onPreviewReportImg 查看检测照片
         * @param {string} url 图片地址
         */
        onPreviewReportImg(url) {
            this.reportImgUrl = url;
            this.reportImgVisible = true;
        },
        /**
         * @method createDetectReport 生成检测报告
         * 
         */
        async createDetectReport() {
            const reportForm = new Promise((resolve, reject) => {
                this.$refs['reportForm'].validate(valid => {
                    if(valid) resolve();
                });
            });
            const dietForm = new Promise((resolve, reject) => {
                this.$refs['dietForm'].validate(valid => {
                    if(valid) resolve();
                });
            });
            Promise.all([reportForm, dietForm]).then(()=>{
                console.log('验证通过,提交表单') 
                let params = {
                    id: this.detectId,
                    reportLang: this.reportForm.reportLang,
                    code: this.reportForm.code || '233344234342234',
                    result: this.reportForm.result,
                    food: this.dietForm.food,
                    health: this.dietForm.health,
                    dietary: this.dietForm.dietary,
                    productIds: this.products.map(t => t.id),
                    reportImg: this.reportForm.reportImg || ''
                }
                createDetectReport(params).then(res => {
                    this.$message.success('操作成功');
                })
            })
        },
        /**
         * @method openProductsPop 打开推荐商品弹窗
         */
        openProductsPop() {
            this.productCheckList = this.products.map(t => t.id);
            this.productsVisible = true;
        },
        /**
         * @method onConfirmSelectProduct 推荐商品弹窗 确认选择
         */
        onConfirmSelectProduct() {
            const selectProductIds = this.products.map(t => t.id);
            const allProductIds = this.productList.map(t => t.id);
            this.productCheckList.forEach(t => {
                if(!selectProductIds.includes(t)) {
                    const index = allProductIds.indexOf(t);
                    this.products.push(this.productList[index]);
                }
            })
            this.productsVisible = false;
            this.productCheckList = [];
        },
        /**
         * @method getProductsList 获取推荐商品数据
         */
        getProductsList() {
            getProductsList({
                pageNum: 1,
                pageSize: 9999
            }).then(res => {
                this.productList = res.rows;
            })
        },
        /**
         * @method saveDetectItem 保存基本检测结果
         * @param {number} 编辑数据的index
         */
        saveDetectItem(index) {
            const id = this.currentEditItemId || this.detectItems[index].id;
            if(!this.$refs[`detectItemForm${id}`]) return;
            this.$refs[`detectItemForm${id}`][0].validate(valid => {
                if(valid) {
                    modifyDetectItem({
                        detectId: this.detectId,
                        itemId: id,
                        description: this.detectItems[index].description,
                        dietDesc: this.detectItems[index].dietDesc,
                        eatDesc: this.detectItems[index].eatDesc,
                    }).then(() => {
                        this.$message.success('操作成功');
                        this.currentEditItemId = null;
                        this.detectItems[index].isEdit = false;
                        this.$forceUpdate()
                    })
                }
            })
        },
        /**
         * @method checkHasEditItem 检查是否有正在编辑的基本检测结果
         * @param {number} 编辑数据的index
         */
        checkHasEditItem(index) {
            if(this.currentEditItemId) {
                if(!this.$refs[`detectItemForm${this.currentEditItemId}`]) return;
                this.$refs[`detectItemForm${this.currentEditItemId}`][0].validate(valid => {
                    if(!valid) {
                        this.$message('还有正在编辑的检测解读');
                        return;
                    }
                    this.openDetectItemEdit(index);
                })
            } else {
                this.openDetectItemEdit(index);
            }
        },
        /**
         * @method openDetectItemEdit 打开基本检测结果的编辑
         * @param {number} 编辑数据的index
         */
        openDetectItemEdit(index) {
            this.currentEditItemId = this.detectItems[index].id;
            this.detectItems.map((t, i) => {
                t.isEdit = i === index ? true : false;
            })
            this.$forceUpdate();
        },
        /**
         * @method detectionReportDetail 获取检测报告详情
         */
        detectionReportDetail() {
            const id = this.detectId;
            if(!id) return;
            detectionReportDetail(id, { lang: this.reportForm.reportLang }).then(res => {
                this.pet = res.pet;
                this.owner = res.owner;
                this.reportForm = {
                    status: res.status,
                    reportLang: res.reportLang || 0,
                    code: res.code,
                    detectTime: res.detectTime,
                    result: res.result,
                    reportImg: res.reportImg,
                    urinalysisImg: res.urinalysisImg
                };
                this.detectItems = res.detectItems || [];
                this.products = res.products || [];
            })
        },
        handleBack(){
            this.$router.push("/mini/detection")
        }
    }
};
</script>

<style lang="scss" scoped>
.title {
    background-color: #eee;
    height: 40px;
    line-height: 40px;
    padding-left: 20px;
    margin-bottom: 10px;
}
.basic-block {
    display: flex;
    flex-wrap: wrap;
}
.basic-form {
    width: 780px;
}
.basic-form-lengthen {
    width: 1170px;
}
.basic-desc {
    width: 50%;
    padding: 30px 60px 20px 20px;
    position: relative;
}
.basic-desc-form {
    width: 100%;
    padding-right: 80px;
    background-color: #eee;
    padding-top: 38px;
    position: relative;
    &.view {
        padding-right: 10px;
    }
}
.basic-desc-btn {
    width: 60px;
    height: 100%;
    position: absolute;
    top: 0;
    right: 0;
}
.basic-desc-title {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translate(calc(-50% - 30px), -50%);
    padding: 10px 30px;
    background: #fff;
    border: 1px solid #333;
}
.footer-block {
    width: 780px;
    text-align: center;
    padding: 20px 0 50px;
}
.report-product-block {
    width: calc(33.33% - 80px);
    height: 120px;
    display: flex;
    float: left;
    padding: 10px;
    background-color: #eee;
    margin-left: 20px;
    margin-right: 60px;
    box-sizing: border-box;
    margin-bottom: 10px;
    &.half {
        width: calc(50% - 30px);
        margin-left: 0;
        margin-right: 0;
        padding-left: 50px;
        position: relative;
        &:nth-child(2n-1) {
            margin-right: 60px;
        }
        .checkbox {
            position: absolute;
            top: 0;
            left: 0;
            width: 40px;
            height: 100%;
            background: #fff;
            border: 1px solid #ccc;
            box-sizing: border-box;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    }
    .left {
        width: 100px;
        height: 100px;
        margin-right: 10px;
    }
    .right {
        .name {
            font-size: 14px;
            height: 3em;
            line-height: 1.5;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp:2;
            -webkit-box-orient: vertical;
        }
        .spec {
            font-size: 14px;
            color: #999;
            margin-top: 20px;
        }
    }
    .add {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        cursor: pointer;
    }
}

.report-urinalysis {
    width: auto;
    height: 140px;
    max-width: 30%;
    cursor: pointer;
}

::v-deep {
    .el-textarea {
        &.view .el-textarea__inner {
            border: 0;
            background: none;
        }
    }
    .el-textarea__inner {
        resize: none;
        font-size: 14px;
    }

    .el-checkbox__label {
        display: none;
    }
    .el-checkbox__inner {
        width: 20px;
        height: 20px;
        &::after {
            height: 10px;
            width: 5px;
            left: 6px;
        }
    }
    .el-dialog__body {
        text-align: center;
    }
}
</style>