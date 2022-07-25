<template>
  <div>
    <van-nav-bar title="个人信息" left-arrow @click-left="toMy" />
    <!-- 头像 -->
    <van-cell title="头像" is-link @click="$refs.file.click()" >
      <van-image
        width="40"
        height="40"
        round
        :src="this.userMess.photo"
      />
    </van-cell>
    <!-- <img :src="this.userMess.photo" alt="" /> -->
    <!-- 图片input框 -->
    <input type="file" ref="file" hidden accept=".png,.jpg" />
    <!-- 图片弹出层 -->
    <van-popup v-model="showPhoto">
      <UpdatePhoto :photo="photo" @setPhoto='setPhoto'></UpdatePhoto>
    </van-popup>
    <!-- 昵称 -->
    <van-cell
      title="昵称"
      is-link
      :value="message"
      @click="showName = true"
    ></van-cell>
    <van-popup v-model="showName" position="bottom" :style="{ height: '100%' }">
      <van-nav-bar
        class="van-nav-bar-name"
        title="更新昵称"
        left-text="取消"
        right-text="保存"
        @click-left="showName = false"
        @click-right="getName"
      />
      <van-field
        v-model="message"
        rows="2"
        autosize
        type="textarea"
        maxlength="7"
        placeholder="请输入新的昵称"
        show-word-limit
      />
    </van-popup>
    <!-- 性别 -->
    <van-cell title="性别" is-link :value="sex" @click="showSex = true" />
    <van-popup v-model="showSex" position="bottom" :style="{ height: '40%' }">
      <van-picker
        title="更新性别"
        show-toolbar
        :columns="sexList"
        @confirm="confirmSex"
        @cancel="showSex = false"
      />
    </van-popup>
    <!-- 生日 -->
    <van-cell
      title="生日"
      is-link
      :value="time"
      @click="showBar = true"
    ></van-cell>
    <van-popup v-model="showBar" position="bottom" :style="{ height: '40%' }">
      <van-datetime-picker
        v-model="currentDate"
        type="date"
        title="选择年月日"
        :min-date="minDate"
        :max-date="maxDate"
        @confirm="confirmBir"
      />
    </van-popup>
  </div>
</template>

<script>
import { compileUserApi, getUserApi } from '@/api'
import UpdatePhoto from './component/UpdatePhoto.vue'
// 如何拿到用户选择的图片?
// - 监听input的change事件
export default {
  name: 'HeimaToutiaoIndex',
  components: {
    UpdatePhoto
  },
  data() {
    return {
      showPhoto: false,
      photo: '',
      showName: false,
      showSex: false,
      showBar: false,
      minDate: new Date(1990, 0, 1),
      maxDate: new Date(),
      currentDate: new Date(1990, 0, 1),
      sexList: ['男', '女'],
      userMess: {}, // 获取的个人信息
      message: '', // 名字
      sex: '男', // 性别
      sexNum: '',
      time: '', // 生日
      intro: '' // 个人介绍
    }
  },
  created() {
    this.getUser()
  },
  mounted() {
    this.$refs.file.addEventListener('change', (e) => {
      // e.target 触发事件的元素
      // 图片的src能识别什么?
      //  - 图片相对/绝对路径
      //  - base64 DateUrl
      //  - file,blob对象的url
      const file = e.target.files[0]
      // file = URL.createObjectURL(file) // 将file对象转换成图片可识别的url
      const fr = new FileReader()
      fr.readAsDataURL(file)

      fr.onload = (e) => {
        this.photo = e.target.result
        this.showPhoto = true
      }
    })
  },

  methods: {
    toMy() {
      this.$router.back()
    },
    // 获取信息
    async getUser() {
      try {
        const res = await getUserApi()
        // console.log(res)
        this.userMess = res.data.data
        console.log(this.userMess)
        this.time = this.userMess.birthday
        this.message = this.userMess.name
        if (this.userMess.gender === 1) {
          this.sex = '女'
        } else {
          this.sex = '男'
        }
        this.mobile = this.userMess.mobile
        this.intro = this.userMess.intro || '你好'
      } catch (error) {
        console.log(error)
      }
    },
    // 提交信息
    async compileUser() {
      try {
        if (this.sex === '男') {
          this.sexNum = 0
        } else {
          this.sexNum = 1
        }
        const res = await compileUserApi(
          this.message,
          this.sexNum,
          this.time,
          this.intro
        )
        console.log(res)
      } catch (error) {
        console.log(error)
      }
    },
    // 修改昵称
    getName() {
      this.showName = false
      this.compileUser()
    },
    // 性别确认按钮
    confirmSex(index) {
      console.log(index)
      this.sex = index
      this.showSex = false
      this.compileUser()
    },
    // 生日确认按钮
    confirmBir(value) {
      console.log(value)
      const yy = new Date(value).getFullYear()
      const mm = new Date(value).getMonth() + 1
      const dd = new Date(value).getDate()
      this.time = yy + '-' + mm + '-' + dd
      this.showBar = false
      this.compileUser()
    },
    setPhoto(val) {
      this.userMess.photo = val
      this.showPhoto = false
    }
  }
}
</script>

<style lang="less" scoped>
.van-nav-bar {
  height: 92px;
  width: 100%;
  :deep(.van-icon-arrow-left) {
    color: #fff;
  }
  :deep(.van-nav-bar__text) {
    color: #fff;
  }
  :deep(.van-nav-bar__title) {
    color: #fff;
  }
  background-color: #3296fa;
}
.van-nav-bar-name {
  height: 92px;
  width: 100%;
  background-color: #fff;
  :deep(.van-nav-bar__title) {
    color: black;
  }
  :deep(.van-icon-arrow-left) {
    color: #3296fa;
  }
  :deep(.van-nav-bar__text) {
    color: #3296fa;
  }
}
img {
  position: absolute;
  top: 104px;
  right: 75px;
  z-index: 99;
  width: 64px;
  height: 64px;
  border-radius: 32px;
}
</style>
