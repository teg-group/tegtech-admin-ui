import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'
import ParentView from '@/components/ParentView';

/**
 * Note: 路由配置项
 *
 * hidden: true                   // 当设置 true 的时候该路由不会再侧边栏出现 如401，login等页面，或者如一些编辑页面/edit/1
 * alwaysShow: true               // 当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式--如组件页面
 *                                // 只有一个时，会将那个子路由当做根路由显示在侧边栏--如引导页面
 *                                // 若你想不管路由下面的 children 声明的个数都显示你的根路由
 *                                // 你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由
 * redirect: noRedirect           // 当设置 noRedirect 的时候该路由在面包屑导航中不可被点击
 * name:'router-name'             // 设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
 * meta : {
    noCache: true                // 如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
    title: 'title'               // 设置该路由在侧边栏和面包屑中展示的名字
    icon: 'svg-name'             // 设置该路由的图标，对应路径src/assets/icons/svg
    breadcrumb: false            // 如果设置为false，则不会在breadcrumb面包屑中显示
  }
 */

// 公共路由
export const constantRoutes = [{
        path: '/redirect',
        component: Layout,
        hidden: true,
        children: [{
            path: '/redirect/:path(.*)',
            component: (resolve) => require(['@/views/redirect'], resolve)
        }]
    },
    {
        path: '/login',
        component: (resolve) => require(['@/views/login'], resolve),
        hidden: true
    },
    {
        path: '/404',
        component: (resolve) => require(['@/views/error/404'], resolve),
        hidden: true
    },
    {
        path: '/401',
        component: (resolve) => require(['@/views/error/401'], resolve),
        hidden: true
    },
    {
        path: '',
        component: Layout,
        redirect: 'index',
        children: [{
            path: 'index',
            component: (resolve) => require(['@/views/index'], resolve),
            name: '首页',
            meta: { title: '首页', icon: 'dashboard', noCache: true, affix: true }
        }]
    },
    {
        path: '/user',
        component: Layout,
        hidden: true,
        redirect: 'noredirect',
        children: [{
            path: 'profile',
            component: (resolve) => require(['@/views/system/user/profile/index'], resolve),
            name: 'Profile',
            meta: { title: '个人中心', icon: 'user' }
        }]
    },
    {
        path: '/dict',
        component: Layout,
        hidden: true,
        children: [{
            path: 'type/data/:dictId(\\d+)',
            component: (resolve) => require(['@/views/system/dict/data'], resolve),
            name: 'Data',
            meta: { title: '字典数据', icon: '' }
        }]
    },
    {
        path: '/job',
        component: Layout,
        hidden: true,
        children: [{
            path: 'log',
            component: (resolve) => require(['@/views/monitor/job/log'], resolve),
            name: 'JobLog',
            meta: { title: '调度日志' }
        }]
    },
    {
        path: '/gen',
        component: Layout,
        hidden: true,
        children: [{
            path: 'edit/:tableId(\\d+)',
            component: (resolve) => require(['@/views/tool/gen/editTable'], resolve),
            name: 'GenEdit',
            meta: { title: '修改生成配置' }
        }]
    },
    {
        path: '/basic',
        component: Layout,
        redirect: '/goodsMaterial',
        alwaysShow: true,
        name: 'Basic',
        meta: { title: '基础信息', icon: 'user' },
        children: [{
                path: 'goodsMaterial',
                name: 'GoodsMaterial',
                component: () =>
                    import ('@/views/basic/goodsMaterial'),
                meta: { title: '商品资料', icon: 'table' }
            },
            {
                path: 'goodsManage',
                name: 'GoodsManage',
                component: () =>
                    import ('@/views/basic/goodsManage'),
                meta: { title: '商品管理', icon: 'table' }
            },
            {
                path: 'operate',
                name: 'AddGoods',
                hidden: true,
                component: () =>
                    import ('@/views/basic/goodsMaterial/addGoods'),
                meta: { title: '新增商品', activeMenu: "/basic/goodsMaterial" }
            },
            {
                path: 'platformSet',
                name: 'PlatformSet',
                component: () =>
                    import ('@/views/basic/platformSet'),
                meta: { title: '平台设置', icon: 'table' }
            },
            {
                path: 'homeManage',
                name: 'HomeManage',
                component: () =>
                    import ('@/views/basic/homeManage'),
                meta: { title: '首页管理', icon: 'table' }
            },
        ]
    },
    {
        path: '/mini',
        component: Layout,
        alwaysShow: true,
        name: 'Mini',
        meta: { title: '用户管理', icon: 'user' },
        children: [{
            path: 'account',
            name: 'Account',
            component: () =>
                import ('@/views/mini/account'),
            meta: { title: '账号管理', icon: 'table' }
        },{
            path: 'petInfo',
            name: 'PetInfo',
            component: () =>
                import ('@/views/mini/petInfo'),
            meta: { title: '宠物资料', icon: 'table' }
        },{
            path: 'receiveCard',
            name: 'ReceiveCard',
            component: () =>
                import ('@/views/mini/receiveCard'),
            meta: { title: '领卡管理', icon: 'table' }
        },{
            path: 'detection',
            name: 'Detection',
            component: () =>
                import ('@/views/mini/detection'),
            meta: { title: '检测管理', icon: 'table' }
        },{
            path: 'order',
            name: 'Order',
            component: () =>
                import ('@/views/mini/order'),
            meta: { title: '订单管理', icon: 'table' }
        }]
    }
]

export default new Router({
    mode: 'history', // 去掉url中的#
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
})