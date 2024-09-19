/// <reference path="../global.d.ts"/>

namespace Api {
  namespace Login {
    /* 登录返回的用户字段, 该数据是根据用户表扩展而来, 部分字段可能需要覆盖，例如id */
    interface Info extends Entity.User {
      /** 用户id，可能需要覆盖 */
      id?: number
      /** 用户角色类型 */
      role?: Entity.RoleType
    }

    interface LoginInfo {
      /** 访问token */
      token: string
      /** 刷新token */
      refreshToken?: string
    }
  }
}
