<template>
<div class="app-container">
    <div class="title">基本信息</div>
    <div class="basic-block">
        <el-form ref="form" :model="basicForm" :rules="basicRules" label-width="90px" class="basic-form">
            <el-row>
                <el-col :span="12">
                    <el-form-item label="商品编号" prop="code">
                        <el-input placeholder="输入商品编码，如：CA202011050001" size="small"/>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="品牌名称" prop="brand">
                        <el-input placeholder="输入商品品牌名称" size="small"/>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="商品名称" prop="name">
                        <el-input placeholder="输入商品中文名称" size="small"/>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="英文名称" prop="english">
                        <el-input placeholder="输入商品英文名称" size="small"/>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="成本价" prop="costPrice" title="输入商品的成本价，用于计算成本使用，单位元">
                        <el-input placeholder="输入商品的成本价，用于计算成本使用，单位元" size="small" style="width: 90%"/>
                        <span style="margin-left: 10px">元</span>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="售价" prop="sellingPrice">
                        <el-input placeholder="输入商品正常售价，单位元" size="small" style="width: 90%"/>
                        <span style="margin-left: 10px">元</span>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="优惠价" prop="discountPrice" title="输入商品优惠价，当输入优惠价时，用户端则会按优惠价结算">
                        <el-input placeholder="输入商品优惠价，当输入优惠价时，用户端则会按优惠价结算" size="small" style="width: 90%"/>
                        <span style="margin-left: 10px">元</span>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="商品标签" prop="label">
                        <el-input placeholder="输入商品标签，如：适合全部犬类使用/适合3-6个月‘贵宾’使用" size="small"/>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <!-- <div class="basic-state">7878</div> -->
    </div>
    <div class="title">商品属性</div>
    <el-form ref="form" :model="attrForm" :rules="attrRules" label-width="80px" class="basic-attribute">
        <el-form-item label="适用对象">
            <el-checkbox-group v-model="checklist">
                <el-checkbox label="狗"></el-checkbox>
            </el-checkbox-group>
        </el-form-item>
        <el-form-item label="商品规格" prop="noticeTitle">
            <el-input placeholder="请输入商品规格，如：5KG/袋" size="small"/>
        </el-form-item>
        <el-form-item label="宠物体型">
            <el-checkbox-group v-model="checklist">
                <el-checkbox label="迷你犬"></el-checkbox>
                <el-checkbox label="小型犬"></el-checkbox>
                <el-checkbox label="中型犬" disabled></el-checkbox>
                <el-checkbox label="大型犬"></el-checkbox>
                <el-checkbox label="巨型犬"></el-checkbox>
            </el-checkbox-group>
        </el-form-item>
        <el-form-item label="适用阶段">
            <el-checkbox-group v-model="checklist">
                <el-checkbox label="离乳期"></el-checkbox>
                <el-checkbox label="幼犬"></el-checkbox>
                <el-checkbox label="幼犬" disabled></el-checkbox>
                <el-checkbox label="老年犬"></el-checkbox>
                <el-checkbox label="繁育犬"></el-checkbox>
            </el-checkbox-group>
        </el-form-item>
        <el-form-item label="犬粮分类">
            <el-radio-group v-model="radio">
                <el-radio :label="3">常规粮</el-radio>
                <el-radio :label="6">定制粮</el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item label="适用犬种">
           <el-select v-model="canidae" multiple placeholder="请选择" clearable size="small">
                <el-option
                    v-for="item in canidaeOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                />
            </el-select>
        </el-form-item>
        <el-form-item label="保质期" prop="noticeTitle">
            <el-input placeholder="输入商品保质期，单位月" size="small" style="width: 90%"/>
            <span style="margin-left: 10px">月</span>
        </el-form-item>
        <el-form-item label="包装方式">
            <el-radio-group v-model="radio">
                <el-radio :label="3">袋装</el-radio>
                <el-radio :label="6">罐装</el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item label="积分抵扣">
            <el-radio-group v-model="radio">
                <el-radio :label="3">支持积分抵扣</el-radio>
                <el-radio :label="6">不支持积分抵扣</el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item label="是否推荐">
            <el-switch v-model="radio"></el-switch>
        </el-form-item>
    </el-form>
    <div class="title">商品展示</div>
    <el-form ref="form" :model="form" :rules="rules" label-width="80px" class="basic-show">
        <el-form-item label="商品图片" prop="noticeTitle" class="upload-form">
            <el-upload
            class="upload-block"
            action="#"
            list-type="picture-card"
            :auto-upload="false">
                <div slot="default" class="tips-block">
                    <i class="el-icon-plus"></i>
                    <span class="tips-block__msg">选择商品图片</span>
                </div>
                <div slot="file" slot-scope="{file}">
                <img
                    class="el-upload-list__item-thumbnail"
                    :src="file.url" alt=""
                >
                <span class="el-upload-list__item-actions">
                    <span
                    class="el-upload-list__item-preview"
                    @click="handlePictureCardPreview(file)"
                    >
                    <i class="el-icon-zoom-in"></i>
                    </span>
                    <span
                    v-if="!disabled"
                    class="el-upload-list__item-delete"
                    @click="handleRemove(file)"
                    >
                    <i class="el-icon-delete"></i>
                    </span>
                </span>
                </div>
            </el-upload>
        </el-form-item>
        <el-form-item label="">
            <el-radio-group v-model="radio" class="image-radio">
                <el-radio :label="3">设为主图</el-radio>
                <el-radio :label="6">设为主图</el-radio>
                <el-radio :label="7">设为主图</el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item label="商品介绍" prop="describe">
            <editor v-model="form.describe" :min-height="192"/>
        </el-form-item>
    </el-form>
    <div class="footer-block">
        <el-button size="mini">返 回</el-button>
        <el-button size="mini" type="primary">保存并关闭</el-button>
        <el-button size="mini" type="primary">保存并继续</el-button>
    </div>
    <el-dialog :visible.sync="dialogVisible">
        <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
</div>
</template>
<script>
import Editor from '@/components/Editor';
export default {
components: {
    Editor
},
data(){
    return {
        form: {},
        basicForm: {
            code: "",
            brand: "",
            name: "",
            english: "",
            costPrice: "",
            sellingPrice: "",
            discountPrice: "",
            label: "",
        },
        basicRules: {
            code: [{ required: true, message: '请输入商品编码', trigger: 'blur' }],
            brand: [{ required: true, message: '请输入商品品牌名称', trigger: 'blur' }],
            name: [{ required: true, message: '请输入商品中文名称', trigger: 'blur' }],
            english: [{ required: true, message: '请输入商品英文名称', trigger: 'blur' }],
            costPrice: [{ required: true, message: '请输入商品成本价', trigger: 'blur' }],
            sellingPrice: [{ required: true, message: '请输入商品售价', trigger: 'blur' }],
            discountPrice: [{ required: true, message: '请输入商品优惠价', trigger: 'blur' }],
            label: [{ required: true, message: '请输入商品标签', trigger: 'blur' }],
            
        },
        attrForm: {

        },
        attrRules: {

        },
        checklist: [],
        radio: 3,
        canidaeOptions: [{
            id: "1",
            name: "A犬"
        },
        {
            id: "2",
            name: "B犬"
        }],
        canidae: [],
        dialogImageUrl: '',
        dialogVisible: false,
        disabled: false
    }
},
methods: {
     handleRemove(file) {
        console.log(file);
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      }
}
}
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
}
.basic-form {
    width: 780px;
}
.basic-attribute {
    width: 375px;
}
.basic-show {
    width: 600px;
}
.upload-block {
    ::v-deep .el-upload {
        width: 120px;
        height: 120px;
        line-height: 120px;
    }
    .tips-block{
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        &__msg{
            font-size: 12px;
            color: #A8ADB8;
            line-height: 20px;
        }
    }
    ::v-deep .el-upload-list__item {
        width: 120px;
        height: 120px;
    }
}
.image-radio {
 ::v-deep .el-radio {
     margin-right: 50px;
 }
}
.footer-block {
    width: 780px;
    text-align: center;
    padding: 20px 0 50px;
}
.upload-form {
    ::v-deep .el-form-item__content {
        line-height: 1;
    }
}
</style>