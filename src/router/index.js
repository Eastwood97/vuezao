import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Home from '@/components/Home'
import Log from '@/components/Log'
import Map from '@/components/Map'
import NumMana from '@/components/NumMana'
import UserMana from '@/components/UserMana'
import BlackList from  '@/components/BlackList'
import Chat from '@/components/chat/Chat'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: '登录',
      hidden: true,
      component: Login
    }, {
      path: '/home',
      name: '主页',
      component: Home,
      hidden: true,
      meta: {
        requireAuth: true
      },
      children: [
        {
          path: '/chat',
          name: '消息',
          component: Chat,
          hidden: true,
          meta: {
            keepAlive: false,
            requireAuth: true
          }
        }
      ]
    },  {
      path: '/home',
      component: Home,
      name: '定位展示',
      iconCls: 'fa fa-file-text-o',
      children: [
        {
          path: '/Map',
          name: '定位展示',
          iconCls: 'fa fa-map-marker',
          component: Map,
          meta: {
            keepAlive: true
          }
        }
      ]
    }, {
      path: '/home',
      iconCls: 'fa fa-search',
      component: Home,
      name: '数据管理',
      children: [
        {
          path: '/BasicData/Number',
          name: '取号查询',
          component: NumMana,
          meta: {
            keepAlive: true
          }
        },{
          path: '/DataQuery/BlackList',
          name: '布控名单',
          component: BlackList,
          meta: {
            keepAlive: true
          }
        },
    

      ]
    },{
      path: '/home',
      component: Home,
      name: '用户管理',
      children: [
        {
          path: '/userMana',
          iconCls: 'fa fa-user',
          name: '用户管理',
          component: UserMana,
        }
      ]
    },
    {
      path: '/home',
      component: Home,
      name: '日志查询',
      children: [
        {
          path: '/log',
          iconCls: 'fa fa-bookmark',
          name: '日志查询',
          component: Log
        }
      ]
    },
  ]
})
