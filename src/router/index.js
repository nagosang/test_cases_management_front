import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '主页', icon: 'dashboard' }
    }]
  },

  {
    path: '/groupManage',
    component: Layout,
    redirect: '/groupManage',
    children: [{
      path: 'groupManage',
      name: 'GroupManage',
      component: () => import('@/views/groupManage/index'),
      meta: { title: '测试组管理', icon: 'el-icon-s-help' }
    }]
  },

  {
    path: '/projectManage',
    component: Layout,
    redirect: '/projectManage',
    children: [{
      path: 'projectManage',
      name: 'ProjectManage',
      component: () => import('@/views/projectManage/index'),
      meta: { title: '项目管理', icon: 'el-icon-s-help' }
    }]
  },

  {
    path: '/testCaseManage',
    component: Layout,
    redirect: '/testCaseManage',
    children: [{
      path: 'testCaseManage',
      name: 'TestCaseManage',
      component: () => import('@/views/testCaseManage/index'),
      meta: { title: '测试用例管理', icon: 'el-icon-s-help' }
    }]
  },

  {
    path: '/autoTest',
    component: Layout,
    redirect: '/autoTest/autoTest',
    name: 'AutoTest',
    meta: {
      title: '自动测试', icon: 'el-icon-s-help'
    },
    children: [
      {
        path: 'autoTest',
        name: 'AutoTest',
        component: () => import('@/views/autoTest/autoTest/index'),
        meta: { title: '自动测试' }
      },
      {
        path: 'testResult',
        name: 'TestResult',
        component: () => import('@/views/autoTest/testResult/index'),
        meta: { title: '测试结果' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
