<template>
  <div>
    <router-view></router-view>
    <van-tabbar route>
      <van-tabbar-item icon="home-o" to='/ '>
        <template #icon>
          <i class="iconfont icon-shouye"></i>
          <span class="text">首页</span>
        </template>
      </van-tabbar-item>

      <van-tabbar-item icon="home-o" to='/video'>
        <template #icon>
          <i class="iconfont icon-shipin"></i>
          <span class="text">视频</span>
        </template>
      </van-tabbar-item>

      <van-tabbar-item icon="home-o" to='/qa'>
        <template #icon>
          <i class="iconfont icon-wenda"></i>
          <span class="text">问答</span>
        </template>
      </van-tabbar-item>

      <van-tabbar-item icon="home-o" to='/profile'>
        <template #icon>
          <i class="iconfont icon-wode"></i>
          <span class="text">我的</span>
        </template>
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  data() {
    return {
    }
  }
}
</script>

<style scoped>
:deep(.van-tabbar-item__icon) {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  height: 100%;
}
.iconfont {
  font-size: .55rem;
}
.text {
    font-size: 0.44rem;
  }
</style>
