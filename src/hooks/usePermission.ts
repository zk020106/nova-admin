import { useAuthStore } from '@/store'
import { isArray, isString } from 'radash'

/** 权限判断 */
export function usePermission() {
  const authStore = useAuthStore()

  function hasPermission(
    permission: string,
  ) {
    if (!permission)
      return true

    if (!authStore.userInfo)
      return false
    const { role } = authStore.userInfo

    let has = role === 'super'
    if (!has) {
      if (isArray(permission))
        has = permission.includes(role)

      if (isString(permission))
        has = permission === role
    }
    return has
  }

  return {
    hasPermission,
  }
}
