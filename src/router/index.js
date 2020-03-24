import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    mode:'history',
    routes: [
        {
            path: '/',
            redirect: '/adminmanage',
        },
        {
            path: '/',
            component: () => import(/* webpackChunkName: "home" */ '../components/common/Home.vue'),
            meta: { title: '自述文件' },
            children: [
                {
                    path: '/adminmanage',
                    component: () => import(/* webpackChunkName: "adminmanage" */ '../components/page/AdminManage.vue'),
                    meta: { title: '管理员管理' }
                },
                {
                    path: '/rolemanage',
                    component: () => import(/* webpackChunkName: "rolenmanage" */ '../components/page/RoleManage.vue'),
                    meta: { title: '角色管理' }
                },
                {
                    path: '/studentmanage',
                    component: () => import(/* webpackChunkName: "rolenmanage" */ '../components/page/StudentManage.vue'),
                    meta: { title: '学生管理' }
                },
                {
                    path: '/drivermanage',
                    component: () => import(/* webpackChunkName: "drivermanage" */ '../components/page/DriverManage.vue'),
                    meta: { title: '司机管理' }
                },
                {
                    path: '/carmanage',
                    component: () => import(/* webpackChunkName: "carmanage" */ '../components/page/CarManage.vue'),
                    meta: { title: '车辆管理' }
                },
                {
                    path: '/seatmanage',
                    component: () => import(/* webpackChunkName: "seatmanage" */ '../components/page/SeatManage.vue'),
                    meta: { title: '选座管理' }
                },
                {
                    path: '/travelmanage',
                    component: () => import(/* webpackChunkName: "travelmanage" */ '../components/page/TravelManage.vue'),
                    meta: { title: '行程管理' }
                },
                {
                    path: '/registermanage',
                    component: () => import(/* webpackChunkName: "registermanage" */ '../components/page/RegisterManage.vue'),
                    meta: { title: '签到管理' }
                },
                {
                    path: '/systemlogmanage',
                    component: () => import(/* webpackChunkName: "systemlogmanage" */ '../components/page/SystemLogManage.vue'),
                    meta: { title: '系统日志' }
                },
                {
                    // 权限页面
                    path: '/permission',
                    component: () => import(/* webpackChunkName: "permission" */ '../components/page/Permission.vue'),
                    meta: { title: '权限测试', permission: true }
                },
                {
                    path: '/404',
                    component: () => import(/* webpackChunkName: "404" */ '../components/page/404.vue'),
                    meta: { title: '404' }
                },
                {
                    path: '/403',
                    component: () => import(/* webpackChunkName: "403" */ '../components/page/403.vue'),
                    meta: { title: '403' }
                },
                
            ]
        },
        {
            path: '/login',
            component: () => import(/* webpackChunkName: "login" */ '../components/page/Login.vue'),
            meta: { title: '登录' }
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
});
