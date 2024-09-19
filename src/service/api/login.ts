import { request } from '../http'

interface Login {
  username: string
  password: string
  captcha: string
  uuid: string
}

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

export function fetchUserRoutes(params: { id: number }) {
  return request.Get<Service.ResponseResult<AppRoute.RowRoute[]> >('/getUserRoutes', { params })
}
