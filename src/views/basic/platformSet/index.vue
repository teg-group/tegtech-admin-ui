<template>
<div class="app-container">
    <div class="tabs-block">
        <el-radio-group v-model="tabKey">
            <el-radio-button label="0">积分设置</el-radio-button>
            <el-radio-button label="1">运费设置</el-radio-button>
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
import integralSet from "./components/integralSet"
import freightSet from "./components/freightSet"
export default {
    name: "platformSet",
    components: {
        integralSet,
        freightSet
    },
    data() {
        return {
            tabKey: "1",
            componentsArr: ["integralSet", "freightSet"]
        }
    },
}
</script>
<style lang="scss" scoped>
.tabs-block {
    border-bottom: 1px solid #eee;
}
</style>