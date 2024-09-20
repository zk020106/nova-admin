import { router } from '@/router'
import { accountLogin, getUserInfo } from '@/service/api/auth'
import { useRouteStore } from '@/store/router'
import { local } from '@/utils'
import { useTabStore } from './tab'

interface AuthStatus {
  userInfo: Api.Login.Info | null
  token: string
}

export const useAuthStore = defineStore('menu-store', {
  state: (): AuthStatus => {
    return {
      userInfo: local.get('userInfo'),
      token: local.get('accessToken') || '',
    }
  },
  getters: {
    /** 是否登录 */
    isLogin(state) {
      return Boolean(state.token)
    },
  },
  actions: {
    /* 登录退出，重置用户信息等 */
    async logout() {
      const route = unref(router.currentRoute)
      // 清除本地缓存
      this.clearAuthStorage()
      // 清空路由、菜单等数据
      const routeStore = useRouteStore()
      routeStore.resetRouteStore()
      // 清空标签栏数据
      const tabStore = useTabStore()
      tabStore.clearAllTabs()
      // 重置当前存储库
      this.$reset()
      // 重定向到登录页
      if (route.meta.requiresAuth) {
        router.push({
          name: 'login',
          query: {
            redirect: route.fullPath,
          },
        })
      }
    },
    clearAuthStorage() {
      local.remove('accessToken')
      local.remove('refreshToken')
      local.remove('userInfo')
    },

    /* 用户登录 */
    async login(username: string, password: string, captcha: string, uuid: string) {
      try {
        const { success, data } = await accountLogin({ username, password, captcha, uuid })
        if (!success) {
          return
        }
        // 设置token
        local.set('accessToken', data.token)
        // // 处理登录信息
        await this.handleLoginInfo()
        // await this.handleLoginInfo(data)
      }
      catch (e) {
        console.warn('[Login Error]:', e)
      }
    },

    /* 处理登录返回的数据 */
    async handleLoginInfo() {
      // 获取用户信息
      const { data } = await getUserInfo()
      // 将userInfo保存下来
      local.set('userInfo', data)
      // 获取路由
      const router = useRouter()
      const { redirect, ...othersQuery } = router.currentRoute.value.query

      // 添加路由和菜单
      const routeStore = useRouteStore()
      await routeStore.initAuthRoute()

      // 进行重定向跳转
      const route = unref(router.currentRoute)
      const query = route.query as { redirect: string }
      router.push({
        path: query.redirect || '/',
        query: {
          ...othersQuery,
        },
      })
    },
  },
})
