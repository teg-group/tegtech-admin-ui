<template>
<div class="app-container">
    <div class="title">基本信息</div>
    <div class="basic-block">
        <el-form ref="basicForm" :model="basicForm" label-width="90px" class="basic-form">
            <el-row>
                <el-col :span="12">
                    <el-form-item label="商品编号" prop="code">
                        <span>{{basicForm.code}}</span>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="品牌名称" prop="brand">
                        <span>{{basicForm.brand}}</span>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="商品名称" prop="name">
                        <span>{{basicForm.name}}</span>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="英文名称" prop="english">
                        <span>{{basicForm.english}}</span>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="成本价" prop="costPrice" title="输入商品的成本价，用于计算成本使用，单位元">
                        <span>{{basicForm.costPrice}}</span>
                        <span style="margin-left: 10px">元</span>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="售价" prop="sellingPrice">
                        <span>{{basicForm.sellingPrice}}</span>
                        <span style="margin-left: 10px">元</span>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="优惠价" prop="discountPrice" title="输入商品优惠价，当输入优惠价时，用户端则会按优惠价结算">
                        <span>{{basicForm.discountPrice}}</span>
                        <span style="margin-left: 10px">元</span>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="商品标签" prop="label">
                        <span>{{basicForm.label}}</span>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
    </div>
    <div class="title">商品属性</div>
    <el-form ref="attrForm" :model="attrForm" label-width="80px" class="basic-attribute">
        <el-form-item label="适用对象" prop="suitableGroup">
            <span>{{attrForm.suitableGroup.join(",")}}</span>
        </el-form-item>
        <el-form-item label="商品规格" prop="specification">
            <span>{{attrForm.specification}}</span>
        </el-form-item>
        <el-form-item label="宠物体型" prop="petSize">
            <span>{{attrForm.petSize.join(",")}}</span>
        </el-form-item>
        <el-form-item label="适用阶段" prop="suitableStage">
            <span>{{attrForm.suitableStage.join(",")}}</span>
        </el-form-item>
        <el-form-item label="犬粮分类" prop="category">
            <span>{{attrForm.category}}</span>
        </el-form-item>
        <el-form-item label="适用犬种" prop="dogBreed">
            <span>{{attrForm.dogBreed.join(",")}}</span>
        </el-form-item>
        <el-form-item label="保质期" prop="shelfLife">
            <span>{{attrForm.shelfLife}}</span>
            <span style="margin-left: 10px">月</span>
        </el-form-item>
        <el-form-item label="商品重量" prop="weight">
            <span>{{attrForm.weight}}</span>
            <span style="margin-left: 10px">g</span>
        </el-form-item>
        <el-form-item label="包装方式" prop="packing">
            <span>{{attrForm.packing}}</span>
        </el-form-item>
        <el-form-item label="积分抵扣" prop="deduction">
            <span>{{attrForm.deduction === "0" ? "支持积分抵扣" : "不支持积分抵扣"}}</span>
        </el-form-item>
        <!-- <el-form-item label="是否推荐" prop="recommend">
            <el-switch v-model="attrForm.recommend"></el-switch>
        </el-form-item> -->
    </el-form>
    <div class="title">商品展示</div>
    <el-form ref="picForm" :model="picForm" label-width="80px" class="basic-show">
        <el-form-item label="商品主图" prop="coverImg" class="upload-form" :inline="true">
            <div class="list-wrap">
                <div class="list-wrap__item">
                    <img class="list-wrap__item--thumbnail" :src="picForm.coverImg" alt=""/>
                    <span class="list-wrap__item--actions">
                        <span
                         class="list-wrap__item--preview"
                         @click="handlePictureCardPreview(picForm.coverImg)"
                        >
                            <i class="el-icon-zoom-in"></i>
                        </span>
                    </span>
                </div>
            </div>
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
                    </span>
                </div>
            </div>
        </el-form-item>
        <el-form-item label="商品介绍" prop="description">
            <editor v-model="picForm.description" :min-height="192" :readOnly="true"/>
        </el-form-item>
        <el-form-item label="">
            <div>
                <el-button
                    size="mini"
                    @click="handleBack"
                >返回</el-button>
            </div>
        </el-form-item>
    </el-form>
    <el-dialog :visible.sync="dialogVisible" title="查看大图">
        <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
</div>
</template>
<script>
import Editor from '@/components/Editor';
import { getProductInfo } from "@/api/mini/material"
import { getBreedList } from "@/api/mini/"
export default {
name: "Operate",
components: {
    Editor
},
data(){
    return {
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
        attrForm: {
            suitableGroup: [],
            specification: "",
            petSize: [],
            suitableStage: [],
            category: "",
            shelfLife: "",
            dogBreed: [],
            weight: "",
            packing: "",
            deduction: ""
        },
        picForm: {
            coverImg: "",
            pics: [],
            description: ""
        },
        canidaeOptions: [],
        dialogImageUrl: '',
        dialogVisible: false,
        id: this.$route.query.id || ""
    }
},
created() {
    this.init() 
},
methods: {
    async init(){
        this.canidaeOptions = await getBreedList()
        this.getProductInfo()
    },
    async getProductInfo(){
        let result = await getProductInfo({
            id: this.id
        })
        // 基本信息
        this.basicForm.code = result.code;
        this.basicForm.brand = result.brand;
        this.basicForm.name = result.name;
        this.basicForm.english = result.english;
        this.basicForm.costPrice = result.costPrice;
        this.basicForm.sellingPrice = result.sellingPrice;
        this.basicForm.discountPrice = result.discountPrice;
        this.basicForm.label = result.label;
       // 商品属性
       this.attrForm.suitableGroup = result.suitableGroup.split(",");
       this.attrForm.specification = result.specification;
       this.attrForm.petSize = result.petSize.split(",");
       this.attrForm.suitableStage = result.suitableStage.split(",");
       this.attrForm.category = result.category;
       const _dogBreed = result.dogBreed.split(",");
       let dogBreedNames = [];
       this.canidaeOptions.map( item => {
           if (_dogBreed.includes(String(item.id))) {
               dogBreedNames.push(item.name)
           }
       })
       console.log(dogBreedNames)
       this.attrForm.dogBreed = dogBreedNames;
       this.attrForm.shelfLife = result.shelfLife;
       this.attrForm.weight = result.weight;
       this.attrForm.packing = result.packing;
       this.attrForm.deduction = String(result.deduction);
       // 商品展示
        this.picForm.coverImg = result.coverImg;
        this.picForm.pics = result.pics.map(item => {
            return {
                name: "",
                url: item
            }
        });
        this.picForm.description = result.description;
    },
    handlePictureCardPreview(url) {
        this.dialogImageUrl = url;
        this.dialogVisible = true;
    },
    handleBack(){
        this.$router.push("/basic/goodsMaterial")
    },
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