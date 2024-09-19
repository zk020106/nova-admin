<script setup lang="ts">
import type { FormInst } from 'naive-ui'
import { getImageCaptcha } from '@/service/api/common/captcha'
import { useAuthStore, useTabStore } from '@/store'
import { local } from '@/utils'
import { encryptByRsa } from '@/utils/encrypt'

const emit = defineEmits(['update:modelValue'])

const authStore = useAuthStore()

function toOtherForm(type: any) {
  emit('update:modelValue', type)
}

const { t } = useI18n()
const rules = computed(() => {
  return {
    username: {
      required: true,
      trigger: 'blur',
      message: t('login.accountRuleTip'),
    },
    password: {
      required: true,
      trigger: 'blur',
      message: t('login.passwordRuleTip'),
    },
    captcha: {
      required: true,
      message: t('login.captchaRuleTip'),
    },
  }
})
const formValue = ref({
  username: 'admin',
  password: 'admin123',
  captcha: '',
  uuid: '',
  expired: false,
})
const isRemember = ref(false)
const isLoading = ref(false)

const formRef = ref<FormInst | null>(null)
const tabStore = useTabStore()
function handleLogin() {
  try {
    formRef.value?.validate(async (errors) => {
      if (errors)
        return

      isLoading.value = true
      const {
        username,
        password,
        captcha,
        uuid,
      } = formValue.value

      if (isRemember.value)
        local.set('loginAccount', { username, password })
      else local.remove('loginAccount')
      await authStore.login(username, encryptByRsa(password) || '', captcha, uuid)
      // 清空所有tab
      tabStore.clearAllTabs()

      isLoading.value = false
    })
  }
  // eslint-disable-next-line unused-imports/no-unused-vars
  catch (err) {
    getCaptcha()
    formValue.value.captcha = ''
  }
  finally {
    isLoading.value = false
  }
}

onMounted(() => {
  checkUserAccount()
})

function checkUserAccount() {
  const loginAccount = local.get('loginAccount')
  if (!loginAccount)
    return

  formValue.value = loginAccount
  isRemember.value = true
}

// 验证码过期定时器
let timer

function startTimer(expireTime: number) {
  if (timer) {
    clearTimeout(timer)
  }
  const remainingTime = expireTime - Date.now()
  if (remainingTime <= 0) {
    formValue.value.expired = true
    return
  }
  timer = setTimeout(() => {
    formValue.value.expired = true
  }, remainingTime)
}

// 组件销毁时清理定时器
onBeforeUnmount(() => {
  if (timer) {
    clearTimeout(timer)
  }
})
onMounted(() => {
  getCaptcha()
})
const captchaImgBase64 = ref()

// 获取验证码
async function getCaptcha() {
  const { uuid, img, expireTime } = await getImageCaptcha()
  formValue.value.uuid = uuid
  captchaImgBase64.value = img
  formValue.value.expired = false
  startTimer(expireTime)
}
</script>

<template>
  <div>
    <n-h2 depth="3" class="text-center">
      {{ $t('login.signInTitle') }}
    </n-h2>
    <n-form ref="formRef" :rules="rules" :model="formValue" :show-label="false" size="large">
      <n-form-item path="username">
        <n-input v-model:value="formValue.username" clearable :placeholder="$t('login.accountPlaceholder')" />
      </n-form-item>
      <n-form-item path="password">
        <n-input
          v-model:value="formValue.password" type="password" :placeholder="$t('login.passwordPlaceholder')"
          clearable show-password-on="click"
        >
          <template #password-invisible-icon>
            <icon-park-outline-preview-close-one />
          </template>
          <template #password-visible-icon>
            <icon-park-outline-preview-open />
          </template>
        </n-input>
      </n-form-item>
      <n-form-item path="captcha">
        <n-input
          v-model:value="formValue.captcha" placeholder="请输入验证码" :max-length="4" allow-clear
          style="flex: 1 1"
        />
        <div class="captcha-container" @click="getCaptcha">
          <img :src="captchaImgBase64" alt="验证码" class="captcha">
          <div v-if="formValue.expired" class="overlay">
            <p>已过期，请刷新</p>
          </div>
        </div>
      </n-form-item>
      <n-space vertical :size="20">
        <div class="flex-y-center justify-between">
          <n-checkbox v-model:checked="isRemember">
            {{ $t('login.rememberMe') }}
          </n-checkbox>
          <n-button type="primary" text @click="toOtherForm('resetPwd')">
            {{ $t('login.forgotPassword') }}
          </n-button>
        </div>
        <n-button block type="primary" size="large" :loading="isLoading" :disabled="isLoading" @click="handleLogin">
          {{ $t('login.signIn') }}
        </n-button>
        <n-flex>
          <n-text>{{ $t('login.noAccountText') }}</n-text>
          <n-button type="primary" text @click="toOtherForm('register')">
            {{ $t('login.signUp') }}
          </n-button>
        </n-flex>
      </n-space>
    </n-form>
    <n-divider>
      <span op-80>{{ $t('login.or') }}</span>
    </n-divider>
    <n-space justify="center">
      <n-button circle>
        <template #icon>
          <n-icon>
            <icon-park-outline-wechat />
          </n-icon>
        </template>
      </n-button>
      <n-button circle>
        <template #icon>
          <n-icon>
            <icon-park-outline-tencent-qq />
          </n-icon>
        </template>
      </n-button>
      <n-button circle>
        <template #icon>
          <n-icon>
            <icon-park-outline-github-one />
          </n-icon>
        </template>
      </n-button>
    </n-space>
  </div>
</template>

<style scoped></style>
