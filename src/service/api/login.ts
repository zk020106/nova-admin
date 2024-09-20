import { request } from '../http'

interface Login {
  username: string
  password: string
  captcha: string
  uuid: string
}
// todo 后续替换掉
export function fetchLogin(data: Login) {
  return request.Post<Api.Login.LoginInfo>('/auth/account', data)
}
export function fetchUpdateToken(data: any) {
  const method = request.Post<Service.ResponseResult<Api.Login.Info>>('/updateToken', data)
  method.meta = {
    authRole: 'refreshToken',
  }
  return method
}
