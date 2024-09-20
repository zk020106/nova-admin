import type * as T from './type'
import { request } from '@/service/http'

export type * from './type'

const BASE_URL = '/auth'

/** @desc 账号登录 */
export function accountLogin(req: T.AccountLoginReq) {
  return request.Post<Service.ResponseResult<T.LoginResp>>(`${BASE_URL}/account`, req)
}

/** @desc 手机号登录 */
export function phoneLogin(req: T.PhoneLoginReq) {
  return request.Post<T.LoginResp>(`${BASE_URL}/phone`, req)
}

/** @desc 邮箱登录 */
export function emailLogin(req: T.EmailLoginReq) {
  return request.Post<T.LoginResp>(`${BASE_URL}/email`, req)
}

/** @desc 三方账号登录 */
export function socialLogin(source: string, req: any) {
  return request.Post<T.LoginResp>(`/oauth/${source}`, req)
}

/** @desc 三方账号登录授权 */
export function socialAuth(source: string) {
  return request.Get<T.SocialAuthAuthorizeResp>(`/oauth/${source}`)
}

/** @desc 退出登录 */
export function logout() {
  return request.Post(`${BASE_URL}/logout`)
}

/** @desc 获取用户信息 */
export function getUserInfo() {
  return request.Get<Service.ResponseResult<T.UserInfo>>(`${BASE_URL}/user/info`)
}

/** @desc 获取路由信息 */
export function getUserRoute() {
  return request.Get<Service.ResponseResult<T.RouteItem[]>>(`${BASE_URL}/route`)
}
