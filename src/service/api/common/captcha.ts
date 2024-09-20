import type * as T from '@/typings/api/common/type'
import { request } from '@/service/http'

export type * from '@/typings/api/common/type'

const BASE_URL = '/captcha'

/** @desc 获取图片验证码 */
export function getImageCaptcha() {
  return request.Get<Service.ResponseResult<T.ImageCaptchaResp>>(`${BASE_URL}/image`)
}

/** @desc 获取短信验证码 */
// export function getSmsCaptcha(query: { phone: string }) {
//   return request.Get<boolean>(`${BASE_URL}/sms`, query)
// }

/** @desc 获取邮箱验证码 */
// export function getEmailCaptcha(query: { email: string }) {
//   return request.Get<boolean>(`${BASE_URL}/mail`, query)
// }

/** @desc 获取行为验证码 */
export function getBehaviorCaptcha(req: any) {
  return request.Get<T.BehaviorCaptchaResp>(`${BASE_URL}/behavior`, req)
}

/** @desc 校验行为验证码 */
export function checkBehaviorCaptcha(req: any) {
  return request.Post<T.CheckBehaviorCaptchaResp>(`${BASE_URL}/behavior`, req)
}
