<template>
<div class="app-container">
    <div class="tabs-block">
        <el-radio-group v-model="tabKey">
            <el-radio-button label="0">banner管理</el-radio-button>
            <el-radio-button label="1">验尿卡宣传图</el-radio-button>
            <el-radio-button label="2">定制流程</el-radio-button>
        </el-radio-group>
    </div>
    <div>
        <keep-alive>
            <component :is="componentsArr[tabKey]"></component>
        </keep-alive>
    </div>
</div>
</template>
<script>
import cardAdvert from "./components/cardAdvert"
import bannerSet from "./components/bannerSet"
import flowChart from "./components/flowChart"
export default {
    name: "platformSet",
    components: {
        cardAdvert,
        bannerSet,
        flowChart
    },
    data() {
        return {
            tabKey: "0",
            componentsArr: ["bannerSet", "cardAdvert", "flowChart"]
        }
    },
}
</script>
<style lang="scss" scoped>
.tabs-block {
    border-bottom: 1px solid #eee;
}
</style>