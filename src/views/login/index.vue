<template>
  <div>
    <van-nav-bar title="登陆" @click-left="backTo" class="navbar">
      <template #left>
        <van-icon name="cross" />
      </template>
    </van-nav-bar>
    <van-form @submit="login" class="form" ref="form">
      <van-field
        v-model="mobile"
        name="mobile"
        placeholder="请输入手机号"
        :rules="mobileRule"
      >
        <template #label>
          <span class="iconfont icon-shouji"></span>
        </template>
      </van-field>
      <van-field
        v-model="code"
        name="code"
        placeholder="请输入验证码"
        :rules="codeRule"
      >
        <template #label>
          <span class="iconfont icon-yanzhengma"></span>
        </template>
        <template #right-icon>
          <van-count-down
            v-if="toCountDown"
            :time="time"
            @finish="toCountDown = false"
            format="ss"
          />
          <van-button
            v-else
            round
            class="code-btn"
            size="mini"
            @click.prevent="timeBtn"
            >发送验证码</van-button
          >
        </template>
      </van-field>
      <div style="margin: 16px">
        <van-button round block type="info" native-type="submit"
          >登陆</van-button
        >
      </div>
    </van-form>
  </div>
</template>

<script>
import { login, timeBtnApi } from '@/api/user'
import { mobileRule, codeRule } from '@/views/login/rules.js'
export default {
  name: 'Login',

  data() {
    return {
      mobile: '',
      code: '',
      mobileRule,
      codeRule,
      time: 5 * 1000,
      toCountDown: false
    }
  },

  mounted() {},

  methods: {
    backTo() {
      this.$router.back()
    },
    async login() {
      this.$toast.loading({
        message: '慢慢来...不急',
        forbidClick: true
      })
      try {
        const res = await login(this.mobile, this.code)
        console.log(res)
        this.$store.commit('setUser', res.data.data)
        this.$router.push('/profile')
        this.$toast.success('成功')
      } catch (error) {
        // this.$toast.fail('失败')
        const status = error.response.status
        // switch (status) {
        //   case 400:
        //     this.$toast.fail(error.response.data.message)
        //     break
        //   case 507:
        //     this.$toast.fail('登录错误，刷新~')
        //     break
        //   default:
        //     this.$toast.fail('登录错误，刷新~')
        //     break
        // }
        let message = '登陆错误，请刷新~'
        if (status === 400) {
          message = error.response.data.message
        }
        this.$toast.fail(message)
      }
    },
    async timeBtn() {
      try {
        // 验证手机号
        await this.$refs.form.validate('mobile')
        // 发送请求，获取验证码
        await timeBtnApi(this.mobile)
        // 显示倒计时
        this.toCountDown = true
      } catch (error) {
        // 表单校验失败
        if (!error.response) {
          this.$toast.fail('手机号检验失败')
        } else {
          // 发送验证码后的失败
          const status = error.response.status
          if (status === 404 || status === 429) {
            this.$toast.fail(error.response.data.message)
          }
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.navbar {
  background-color: #3296fa;
  :deep(.van-nav-bar__title) {
    color: #fff;
  }
  :deep(.van-icon) {
    color: #fff;
  }
}
//form表单样式
.form {
  :deep(.van-field__label) {
    flex: 1;
  }
  :deep(.van-cell__value) {
    flex: 20;
  }
  .iconfont {
    font-size: 0.5625rem;
    color: black;
  }
  .code-btn {
    background-color: #eee;
    color: #666;
    padding: 0 20px;
  }
}
</style>
