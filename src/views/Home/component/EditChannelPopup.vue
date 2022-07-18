<template>
  <div>
    <van-popup
      v-model="isShow"
      position="bottom"
      :style="{ height: '90%' }"
      closeable
      close-icon-position="top-left"
    >
      <div class="popupMain">
        <div class="my-channel">
          <van-cell title="我的频道">
            <van-button size="small" round class="edit-btn"> 编辑 </van-button>
          </van-cell>
          <van-grid :border="false" gutter="10px">
            <van-grid-item
              :text="item.name"
              v-for="item in myChannels"
              :key="item.id"
            >
              <template #icon><van-icon name="close" /></template>
            </van-grid-item>
          </van-grid>
        </div>
        <div class="recommeng-channel">
          <van-cell title="推荐频道"> </van-cell>
          <van-grid :border="false" gutter="10px">
            <van-grid-item
              v-for="item in recommendChannels"
              :key="item.id"
              :text="item.name"
              icon="plus"
            ></van-grid-item>
          </van-grid>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { getAllChannelApi } from '@/api'
export default {
  name: 'HeimaModileEditChannelPopup',

  data() {
    return {
      isShow: true,
      allChannels: []
    }
  },
  created() {
    this.getAllChannel()
  },
  props: {
    myChannels: {
      type: Array,
      required: true
    }
  },
  mounted() {},
  computed: {
    recommendChannels() {
      return this.allChannels.filter((item) => {
        const result = this.myChannels.find((i) => i.id === item.id)
        if (result) {
          return false
        } else {
          return true
        }
      })
    }
  },
  methods: {
    async getAllChannel() {
      const { data } = await getAllChannelApi()
      this.allChannels = data.data.channels
      console.log(data)
    }
  }
}
</script>

<style lang="less" scoped>
.popupMain {
  padding-top: 100px;
  .edit-btn {
    color: red;
    padding: 0 30px;
    height: 48px;
    border: 0.02667rem solid red;
  }
}
.my-channel {
  :deep(.van-grid-item__content) {
    position: relative;
    background-color: #eee;
    .van-grid-item__icon-wrapper {
      position: absolute;
      top: -20px;
      right: -20px;

      .van-icon-cross {
        position: absolute;
        top: 0;
        right: 0;
        transform: translate(20%, -35%);
        border: 0.02667rem solid #000;
        border-radius: 50%;
        text-align: center;
        line-height: 0.32rem;
      }
    }
  }
}
// 推荐频道的样式
.recommend-channel {
  // 推荐频道加号样式
  :deep(.van-grid-item__content) {
    flex-direction: row;

    .van-grid-item__icon {
      font-size: 0.5rem;
    }

    .van-grid-item__text {
      margin-top: 0;
    }
  }
}
</style>
