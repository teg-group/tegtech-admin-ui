<template>
<div class="app-container">
    <div class="title">基本信息</div>
    <div class="basic-block">
        <el-form ref="basicForm" :model="basicForm" :rules="basicRules" label-width="90px" class="basic-form">
            <el-row>
                <el-col :span="12">
                    <el-form-item label="商品编号" prop="code">
                        <el-input placeholder="输入商品编码，如：CA202011050001" size="small" v-model="basicForm.code"/>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="品牌名称" prop="brand">
                        <el-input placeholder="输入商品品牌名称" size="small" v-model="basicForm.brand"/>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="商品名称" prop="name">
                        <el-input placeholder="输入商品中文名称" size="small" v-model="basicForm.name"/>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="英文名称" prop="english">
                        <el-input placeholder="输入商品英文名称" size="small" v-model="basicForm.english"/>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="成本价" prop="costPrice" title="输入商品的成本价，用于计算成本使用，单位元">
                        <el-input placeholder="输入商品的成本价，用于计算成本使用，单位元" size="small" style="width: 90%" v-model="basicForm.costPrice"/>
                        <span style="margin-left: 10px">元</span>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="售价" prop="sellingPrice">
                        <el-input placeholder="输入商品正常售价，单位元" size="small" style="width: 90%" v-model="basicForm.sellingPrice"/>
                        <span style="margin-left: 10px">元</span>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="优惠价" prop="discountPrice" title="输入商品优惠价，当输入优惠价时，用户端则会按优惠价结算">
                        <el-input placeholder="输入商品优惠价，当输入优惠价时，用户端则会按优惠价结算" size="small" style="width: 90%" v-model="basicForm.discountPrice"/>
                        <span style="margin-left: 10px">元</span>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="商品标签" prop="label">
                        <el-input placeholder="输入商品标签，如：适合全部犬类使用/适合3-6个月‘贵宾’使用" size="small" v-model="basicForm.label"/>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <!-- <div class="basic-state">7878</div> -->
    </div>
    <div class="title">商品属性</div>
    <el-form ref="attrForm" :model="attrForm" :rules="attrRules" label-width="80px" class="basic-attribute">
        <el-form-item label="适用对象" prop="suitableGroup">
            <el-checkbox-group v-model="attrForm.suitableGroup">
                <el-checkbox label="狗"></el-checkbox>
                <el-checkbox label="猫"></el-checkbox>
            </el-checkbox-group>
        </el-form-item>
        <el-form-item label="商品规格" prop="specification">
            <el-input placeholder="请输入商品规格，如：5KG/袋" size="small" v-model="attrForm.specification"/>
        </el-form-item>
        <el-form-item label="宠物体型" prop="petSize">
            <el-checkbox-group v-model="attrForm.petSize">
                <el-checkbox label="迷你犬" value="迷你犬"></el-checkbox>
                <el-checkbox label="小型犬" value="小型犬"></el-checkbox>
                <el-checkbox label="中型犬" value="中型犬"></el-checkbox>
                <el-checkbox label="大型犬" value="大型犬"></el-checkbox>
                <el-checkbox label="巨型犬" value="巨型犬"></el-checkbox>
            </el-checkbox-group>
        </el-form-item>
        <el-form-item label="适用阶段" prop="suitableStage">
            <el-checkbox-group v-model="attrForm.suitableStage">
                <el-checkbox label="离乳期" value="离乳期"></el-checkbox>
                <el-checkbox label="幼犬" value="幼犬"></el-checkbox>
                <el-checkbox label="成犬" value="成犬"></el-checkbox>
                <el-checkbox label="老年犬" value="老年犬"></el-checkbox>
                <el-checkbox label="繁育犬" value="繁育犬"></el-checkbox>
            </el-checkbox-group>
        </el-form-item>
        <el-form-item label="犬粮分类" prop="category">
            <el-radio-group v-model="attrForm.category">
                <el-radio label="常规粮">常规粮</el-radio>
                <el-radio label="定制粮">定制粮</el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item label="适用犬种" prop="dogBreed">
           <el-select v-model="attrForm.dogBreed" filterable multiple placeholder="请选择" clearable size="small">
                <el-option
                    v-for="item in canidaeOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                />
            </el-select>
        </el-form-item>
        <el-form-item label="保质期" prop="shelfLife">
            <el-input v-model="attrForm.shelfLife" placeholder="输入商品保质期，单位月" size="small" style="width: 90%"/>
            <span style="margin-left: 10px">月</span>
        </el-form-item>
        <el-form-item label="商品重量" prop="weight">
            <el-input v-model="attrForm.weight" placeholder="输入商品包装的重量，单位（g)" size="small" style="width: 90%"/>
            <span style="margin-left: 10px">g</span>
        </el-form-item>
        <el-form-item label="包装方式" prop="packing">
            <el-radio-group v-model="attrForm.packing">
                <el-radio label="袋装">袋装</el-radio>
                <el-radio label="罐装">罐装</el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item label="积分抵扣" prop="deduction">
            <el-radio-group v-model="attrForm.deduction">
                <el-radio label="0">支持积分抵扣</el-radio>
                <el-radio label="1">不支持积分抵扣</el-radio>
            </el-radio-group>
        </el-form-item>
        <!-- <el-form-item label="是否推荐" prop="recommend">
            <el-switch v-model="attrForm.recommend"></el-switch>
        </el-form-item> -->
    </el-form>
    <div class="title">商品展示</div>
    <el-form ref="picForm" :model="picForm" :rules="picRules" label-width="80px" class="basic-show">
        <el-form-item label="商品主图" prop="coverImg" class="upload-form cover-item" :inline="true">
            <el-upload
            class="upload-block"
            action="#"
            list-type="picture-card"
            :limit="1"
            :show-file-list="false"
            :http-request="httpRequest">
                <div class="tips-block" v-if="!picForm.coverImg">
                    <i class="el-icon-plus"></i>
                    <span class="tips-block__msg">选择商品图片</span>
                </div>
                <div v-if="picForm.coverImg">
                    <img class="el-upload-list__item-thumbnail" :src="picForm.coverImg" alt=""/>
                </div>
            </el-upload>
           <el-button type="text" style="margin-left: 10px" v-if="picForm.coverImg" @click="handlePictureCardPreview(picForm.coverImg)">查看大图</el-button>
        </el-form-item>
        <el-form-item label="商品图集" prop="pics" class="upload-form">
            <div class="list-wrap">
                <div v-for="(item, index) in picForm.pics" :key="index" class="list-wrap__item">
                    <img class="list-wrap__item--thumbnail" :src="item.url" alt=""/>
                    <span class="list-wrap__item--actions">
                        <span
                         class="list-wrap__item--preview"
                         @click="handlePictureCardPreview(item.url)"
                        >
                            <i class="el-icon-zoom-in"></i>
                        </span>
                         <span
                         class="list-wrap__item--delete"
                         @click="handleRemove(item.url, index)"
                        >
                            <i class="el-icon-delete"></i>
                        </span>
                    </span>
                </div>
                <el-upload
                class="upload-block"
                action="#"
                list-type="picture-card"
                :show-file-list="false"
                :file-list="fileList"
                :http-request="httpRequestArr">
                    <div slot="default" class="tips-block">
                        <i class="el-icon-plus"></i>
                        <span class="tips-block__msg">选择商品图片</span>
                    </div>
                </el-upload>
            </div>

        </el-form-item>
        <el-form-item label="商品介绍" prop="description">
            <editor v-model="picForm.description" :min-height="192"/>
        </el-form-item>
    </el-form>
    <div>
         <el-button
            size="mini"
            @click="handleBack"
          >返回</el-button>
        <el-button
        type="primary"
        size="mini"
        @click="handleSave('close')"
      >保存并关闭</el-button>
       <el-button
        type="primary"
        size="mini"
        @click="handleSave('continue')"
      >保存并继续</el-button>
    </div>
    <el-dialog :visible.sync="dialogVisible" title="查看大图">
        <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
</div>
</template>
<script>
import Editor from '@/components/Editor';
import { addProduct } from "@/api/mini/material"
import { getBreedList } from "@/api/mini/"
import OssUpload from "@/service/ossUpload"
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
            suitableGroup: [],
            specification: "",
            petSize: [],
            suitableStage: [],
            category: "",
            dogBreed: [],
            weight: "",
            packing: "",
            deduction: ""
        },
        attrRules: {
            suitableGroup: [{ required: true, message: '请选择适用对象', trigger: 'blur' }],
            specification: [{ required: true, message: '请输入商品规格', trigger: 'blur' }],
            petSize: [{ required: true, message: '请选择宠物体型', trigger: 'blur' }],
            suitableStage: [{ required: true, message: '请选择适用阶段', trigger: 'blur' }],
            category: [{ required: true, message: '请选择犬粮类型', trigger: 'blur' }],
            dogBreed: [{ required: true, message: '请选择适用犬种', trigger: 'blur' }],
            shelfLife: [{ required: true, message: '请输入商品保质期', trigger: 'blur' }],
            weight: [{ required: true, message: '请输入商品重量', trigger: 'blur' }],
            packing: [{ required: true, message: '请选择包装方式', trigger: 'blur' }],
            deduction: [{ required: true, message: '请选择是否支持积分抵扣', trigger: 'blur' }],
        },
        picForm: {
            coverImg: "",
            pics: [],
            description: ""
        },
        picRules: {
            coverImg: [{ required: true, message: '请上传商品主图', trigger: 'blur' }],
            pics: [{ required: true, message: '请上传商品图集', trigger: 'blur' }],
            description: [{ required: true, message: '请填写商品描述', trigger: 'blur' }],
        },
        checklist: [],
        radio: 3,
        canidaeOptions: [],
        canidae: [],
        dialogImageUrl: '',
        dialogVisible: false,
        disabled: false,
        fileList: []
    }
},
created() {
    this.getBreedList()
},
methods: {
    async getBreedList(){
        this.canidaeOptions = await getBreedList()
    },
    handleRemove(url, index) {
        this.fileList.splice(index, 1)
    },
    handlePictureCardPreview(url) {
        this.dialogImageUrl = url;
        this.dialogVisible = true;
    },
    async handleSave(type){
        const keyArr = ["basicForm", "attrForm", "picForm"];
        let flag = true;
        for(let key of keyArr){
            this.$refs[key].validate(valid => {
                if(!valid) {
                    flag = false;
                    return
                }
            })
        }
        // if (!flag) return;
        try{
            let params = Object.assign(this.basicForm, this.attrForm, this.picForm);
            params.suitableGroup = params.suitableGroup.join(",");
            params.petSize = params.petSize.join(",");
            params.suitableStage = params.suitableStage.join(",");
            params.dogBreed = params.dogBreed.join(",");
            params.pics = params.pics.filter(item => item.url);
            console.log(params)
            // await addProduct({
                
            // })
        }catch(error){
            console.log(error)
        }
    },
    handleBack(){},
    httpRequest(files){
        const ossUpload = new OssUpload(
            files.file, 
            "product", 
            (url) => {
                this.picForm.coverImg = url;
            }
        )
    },
    httpRequestArr(files){
        const ossUpload = new OssUpload(
            files.file, 
            "product", 
            (url) => {
                this.picForm.pics.push({
                    url,
                    name: ""
                })
            }
        )
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
        width: 166px;
        height: 150px;
        line-height: 150px;
        overflow: hidden;
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
    ::v-deep .el-upload-list__item-thumbnail {
        width: 166px;
        height: 150px;
    }
    ::v-deep .el-upload-list__item {
        width: 166px;
        height: 150px;
    }
}
.image-radio {
 ::v-deep .el-radio {
     margin-right: 50px;
 }
}
.upload-form {
    ::v-deep .el-form-item__content {
        line-height: 1;
    }
}
.cover-item {
    ::v-deep .el-form-item__content {
        display: flex;
        align-items: flex-end;
    }
}

// upload
.list-wrap {
    display: flex;
    &__item {
        display: inline-block;
        width: 166px;
        height: 150px;
        margin: 0 8px 8px 0;
        border: 1px solid #c0ccda;
        border-radius: 6px;
        overflow: hidden;
        position: relative;
        &--thumbnail {
            width: 100%;        
            height: 100%;
        }
        &--actions {
            position: absolute;
            width: 100%;
            height: 100%;
            left: 0;
            top: 0;
            cursor: default;
            text-align: center;
            color: #fff;
            opacity: 0;
            font-size: 20px;
            background-color: rgba(0,0,0,.5);
            transition: opacity .3s;
            display: flex;
            align-items: center;
            justify-content: center;
            &:hover {
                opacity: 1;
                span {
                    display: inline-block;
                }
            }
            span {
                cursor: pointer;
                display: none;
            }
            span+span{
                margin-left: 15px;
            }
        }
    }
}
</style>