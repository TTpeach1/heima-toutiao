<template>
  <div>
    <!-- 搜索栏 -->
    <div class="header">
      <van-nav-bar title="黑马头条" left-arrow @click-left="toHome" />
    </div>
    <!-- 主体内容 -->
    <div class="main">
      <div class="head">
        <h1>{{ contentList.title }}</h1>
      </div>
      <div class="user">
        <div class="user-left">
          <img :src="contentList.aut_photo" alt="" />
          <div>
            <p>{{ contentList.aut_name }}</p>
            <p>{{ contentList.pubdate | timeFormat }}</p>
          </div>
        </div>
        <div class="user-right">
          <button @click="attention" v-if="!isBtn">
            <van-icon name="plus" /> 关注
          </button>
          <button @click="attention" v-if="isBtn" class="btn">已关注</button>
        </div>
      </div>
      <div class="content">
        <!-- <article v-html="htmlText" class="markdown-body"></article> -->
        <article v-html="contentList.content" class="markdown-body"></article>
      </div>
      <div class="sold">
        <van-divider
          :style="{
            color: '#777',
            borderColor: '#ccc',
            padding: '0 16px'
          }"
        >
          正文结束
        </van-divider>
      </div>
      <!-- :immediate-check="false" -->
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <div
          class="comment"
          v-for="(item, index) in this.commentList"
          :key="index"
        >
          <div class="comment-left">
            <div class="pic">
              <img :src="item.aut_photo" alt="" />
            </div>
            <div class="text">
              <p>{{ item.aut_name }}</p>
              <p>{{ item.content }}</p>
              <div class="text-btn">
                <p>{{ item.pubdate | timeFormat }}</p>
                <button @click="replyBtn(index)">
                  回复{{ item.reply_count || 0 }}
                </button>
              </div>
            </div>
          </div>
          <div class="comment-right">
            <van-icon name="good-job-o" />
            <span>1</span>
          </div>
        </div>
      </van-list>
      <van-popup
        v-model="replyShow"
        position="bottom"
        :style="{ height: '100%' }"
      >
        <van-nav-bar
          title="暂无回复"
          left-arrow
          @click-left="replyShow = false"
        />
        <div class="box"></div>
        <div class="comment">
          <div class="comment-left">
            <div class="pic">
              <img :src="replyCommentList.aut_photo" alt="" />
            </div>
            <div class="text">
              <p>{{ replyCommentList.aut_name }}</p>
              <p>{{ replyCommentList.content }}</p>
              <div class="text-btn">
                <p>{{ replyCommentList.pubdate | timeFormat }}</p>
                <button>回复{{ replyCommentList.reply_count || 0 }}</button>
              </div>
            </div>
          </div>
          <div class="comment-right">
            <van-icon name="good-job-o" />
            <span>赞</span>
          </div>
        </div>
        <van-nav-bar class="van-nav-bar-two" left-text="全部回复" />
        <div class="box"></div>
        <div
          class="comment"
          v-for="(item, index) in this.replyCommentReplylist"
          :key="index"
        >
          <div class="comment-left">
            <div class="pic">
              <img :src="item.aut_photo" alt="" />
            </div>
            <div class="text">
              <p>{{ item.aut_name }}</p>
              <p>{{ item.content }}</p>
              <div class="text-btn">
                <p>{{ item.pubdate | timeFormat }}</p>
                <button @click="replyBtn(index)">
                  回复{{ item.reply_count || 0 }}
                </button>
              </div>
            </div>
          </div>
          <div class="comment-right">
            <van-icon name="good-job-o" />
            <span>1</span>
          </div>
        </div>
        <button class="replyBtn" @click="writeReply">评论</button>
        <van-popup
          v-model="reShow"
          position="bottom"
          :style="{ height: '18%' }"
        >
          <div class="popup">
            <van-field
              v-model="replyMessage"
              rows="2"
              autosize
              type="textarea"
              maxlength="50"
              placeholder="请输入留言"
              show-word-limit
            >
            </van-field>
            <div class="sendBtn">
              <button @click="replyComBtn">发送</button>
            </div>
          </div>
        </van-popup>
      </van-popup>
    </div>
    <!-- 底部导航栏 -->
    <div class="foot">
      <button @click="write">写评论</button>
      <div class="foot-num">{{ commentNum || 0 }}</div>
      <van-icon name="comment-o" />
      <van-icon @click="collect" v-if="!isShow" name="star-o" />
      <van-icon @click="collect" v-if="isShow" name="star" color="#3296fa" />
      <van-icon @click="point" v-if="!isPoint" name="good-job-o" />
      <van-icon @click="point" v-if="isPoint" name="good-job" color="hotpink" />
      <van-icon name="share" @click="showShare = true" />
      <!-- 评论弹出框 -->
      <van-popup v-model="show" position="bottom" :style="{ height: '18%' }">
        <div class="popup">
          <van-field
            v-model="message"
            rows="2"
            autosize
            type="textarea"
            maxlength="50"
            placeholder="请输入留言"
            show-word-limit
          >
          </van-field>
          <div class="sendBtn">
            <button @click="setComment">发送</button>
          </div>
        </div>
      </van-popup>
      <van-share-sheet
        v-model="showShare"
        title="立即分享给好友"
        :options="options"
      />
    </div>
  </div>
</template>

<script>
// html适配
// import showdown from 'showdown'
import '../../../node_modules/github-markdown-css/github-markdown.css'
// import dayjs from '@/utils/dayjs'
// 引入接口 内容、评论，添加收藏
import {
  getContentApi,
  getCommentApi,
  setCollectApi,
  getCollectApi,
  attentionApi,
  noattentionApi,
  setPointApi,
  getPointApi,
  setCommentApi
} from '@/api'
import storage from '@/utils/storage'

export default {
  name: 'Index',

  data() {
    return {
      loading: false, // list表单
      finished: false, // list表单
      page: 1, // list表单
      limit: 10, // list表单
      offset: '', // list表单
      contentList: [], // 内容列表
      commentList: [], // 评论列表
      // htmlText: '',
      show: false, // 评论输入弹出层显示
      reShow: false, // 评论回复输入弹出层显示
      replyShow: false, // 评论回复输入框显示
      replyCommentList: {}, // 评论index
      replyCommentReplylist: [], // 评论的回复列表
      // replyIndex: '',
      message: '', // 评论输入弹出层内容
      replyMessage: '', // 评论回复输入弹出层内容
      id: storage.get('id'), // 文章id
      userId: '', // 用户id
      showShare: false, // 分享弹出层显示
      isShow: '', // 收藏显示
      isBtn: '', // 关注显示
      isPoint: '', // 点赞显示
      commentNum: '', // 评论数量
      options: [
        [
          { name: '微信', icon: 'wechat' },
          { name: '朋友圈', icon: 'wechat-moments' },
          { name: '微博', icon: 'weibo' },
          { name: 'QQ', icon: 'qq' }
        ],
        [
          { name: '复制链接', icon: 'link' },
          { name: '分享海报', icon: 'poster' },
          { name: '二维码', icon: 'qrcode' },
          { name: '小程序码', icon: 'weapp-qrcode' }
        ]
      ]
    }
  },
  created() {},
  mounted() {
    this.getContent(this.getId)
    this.getComment()
  },
  // 存取获得的id，防止刷新params取不到
  computed: {
    getId() {
      if (this.$route.params.id) {
        storage.set('id', this.$route.params.id)
        return storage.get('id')
      } else {
        return storage.get('id')
      }
    }
  },
  methods: {
    // 返回上个页面
    toHome() {
      this.$router.back()
    },
    // 获取文章内容数据
    async getContent(id) {
      try {
        const res = await getContentApi(id)
        // console.log(res)
        this.contentList = res.data.data
        console.log(this.contentList)
        this.isShow = res.data.data.is_collected
        this.isBtn = res.data.data.is_followed
        this.userId = res.data.data.aut_id
        if (res.data.data.attitude > 0) {
          this.isPoint = true
        } else {
          this.isPoint = false
        }
        // this.getTime()
        // const converter = new showdown.Converter()
        // converter.setOption('tables', true)
        // const text = this.contentList.content
        // this.htmlText = converter.markHtml(text)
      } catch (error) {
        console.log(error)
      }
    },
    // 评论弹出层
    write() {
      this.show = true
    },
    writeReply() {
      this.reShow = true
    },
    // 请求评论数据
    async getComment() {
      try {
        // this.id = storage.get('id')
        // console.log(this.id)
        console.log(this.offset)
        const res = await getCommentApi('a', this.id, this.offset, this.limit)
        console.log(res)
        this.commentList = res.data.data.results
        this.commentNum = res.data.data.total_count
        this.offset = res.data.data.last_id
        console.log(this.commentList)
      } catch (error) {
        console.log(error)
      }
    },
    // 评论懒加载
    onLoad() {
      this.timer = setTimeout(async () => {
        try {
          console.log(this.offset)
          const res = await getCommentApi('a', this.id, this.offset, this.limit)
          this.offset = res.data.data.last_id
          this.commentList.push(...res.data.data.results)
          console.log(this.commentList)
          this.loading = false
          console.log(res)
          if (res.data.data.last_id === null) {
            this.finished = true
          }
        } catch (error) {
          console.log(error)
        }
      }, 1000)
    },
    // 收藏按钮
    collect() {
      // 取反isShow，实现样式点击切换
      this.isShow = !this.isShow
      if (this.isShow) {
        const id = `${this.id}`
        // console.log(this.id, id)
        const res = setCollectApi(id)
        this.$toast.success('收藏成功')
        console.log(res)
      } else {
        const id = `${this.id}`
        // console.log(this.id, id)
        const res = getCollectApi(id)
        this.$toast.success('取消收藏成功')
        console.log(res)
      }
    },
    // 关注按钮
    attention() {
      // 取反
      this.isBtn = !this.isBtn
      if (this.isBtn) {
        // const id = `${this.userId}`
        // console.log(this.userId, id)
        const res = attentionApi(this.userId)
        this.$toast.success('关注成功')
        console.log(res)
      } else {
        // const id = `${this.userId}`
        // console.log(this.userId, id)
        const res = noattentionApi(this.userId)
        this.$toast.success('取关成功')
        console.log(res)
      }
    },
    // 点赞按钮
    point() {
      this.isPoint = !this.isPoint
      if (this.isPoint) {
        // this.id = String(this.id)
        console.log(String(this.id))
        const res = setPointApi(String(this.id))
        this.$toast.success('点赞成功')
        console.log(res)
      } else {
        const res = getPointApi(this.id)
        this.$toast.success('取消点赞成功')
        console.log(res)
      }
    },
    // 发布评论
    async setComment() {
      try {
        const id = String(this.id)
        const res = await setCommentApi(id, this.message)
        console.log(res)
        this.getComment()
        this.onLoad()
        this.message = ''
        this.show = false
      } catch (error) {
        console.log(error)
      }
    },
    // 回复按钮
    async replyBtn(index) {
      this.replyShow = true
      this.replyIndex = index
      this.replyCommentList = this.commentList[index]
      console.log(this.replyIndex)
      console.log(this.replyCommentList)
      const res = await getCommentApi('c', this.replyCommentList.com_id, '', 10)
      console.log(res)
      this.replyCommentReplylist = res.data.data.results
      // replyCommentReplylist
    },
    async replyComBtn() {
      try {
        const res = await setCommentApi(
          this.replyCommentList.com_id,
          this.replyMessage,
          this.id
        )
        console.log(res)
        this.replyMessage = ''
        this.reShow = false
        const res1 = await getCommentApi('c', this.replyCommentList.com_id, '', 10)
        console.log(res)
        this.replyCommentReplylist = res1.data.data.results
        // this.replyShow = false
        // this.getComment()
        // this.replyBtn()
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.main {
  padding: 90px 30px 130px;
}
.head {
  h1 {
    font-size: 40px;
    padding: 50px 0px;
    margin: 0;
  }
}
.user {
  position: relative;
  display: flex;
  .user-left {
    display: flex;
    font-size: 24px;

    img {
      width: 70px;
      height: 70px;
      border-radius: 35px;
    }
    p {
      margin: 7px 15px;
    }
  }
  .user-right {
    position: absolute;
    right: 0;
    top: 5px;
    button {
      width: 170px;
      height: 60px;
      font-size: 28px;
      background-color: #3296fa;
      color: #fff;
      border: 0;
      border-radius: 30px;
    }
    .btn {
      color: black;
      background-color: #fff;
      border: 1px solid #ccc;
    }
  }
}
.markdown-body {
  padding: 56px 36px 0px;
  font-size: 24px;
}
body {
  position: relative;
  padding-bottom: 50px;
  .van-nav-bar {
    position: fixed;
    width: 100%;
    :deep(.van-icon-arrow-left) {
      color: #fff;
    }
    :deep(.van-nav-bar__title) {
      color: #fff;
    }
    background-color: #3296fa;
  }
  .foot {
    position: fixed;
    display: flex;
    align-items: center;
    justify-content: space-around;
    bottom: 0;
    width: 100%;
    height: 90px;
    background-color: #fff;
    .foot-num {
      position: absolute;
      top: 12px;
      left: 388px;
      text-align: center;
      line-height: 30px;
      width: 40px;
      height: 30px;
      background-color: red;
      color: #fff;
      border-radius: 15px;
      font-size: 24px;
      z-index: 99;
    }
    button {
      border: 1px solid #ccc;
      border-radius: 23px;
      font-size: 30px;
      width: 280px;
      color: #777777;
      background-color: #fff;
    }
    .van-icon {
      color: #777777;
    }
  }
}
.popup {
  display: flex;
  align-items: center;
  height: 160px;
  padding: 38px 0 38px 30px;
  .van-cell {
    background-color: #f5f7f9;
  }
  .sendBtn {
    width: 120px;
    text-align: center;
    button {
      border: 0;
      font-size: 28px;
      color: #6ba3d8;
      background-color: #fff;
      width: 56px;
      padding: 0 0 15px;
    }
  }
}
.comment {
  display: flex;
  position: relative;
  padding-bottom: 25px;
  .comment-left {
    display: flex;
    .pic {
      width: 72px;
      height: 72px;
      img {
        width: 100%;
        height: 100%;
        border-radius: 36px;
      }
    }
    .text {
      p:nth-child(1) {
        margin: 5px 30px;
        font-size: 26px;
      }
      p:nth-child(2) {
        font-size: 32px;
        margin: 25px 30px;
      }
      .text-btn {
        display: flex;
        button {
          width: 130px;
          height: 48px;
          font-size: 26px;
          border-radius: 24px;
          border: 1px solid #ccc;
          background-color: #fff;
        }
      }
    }
  }
  .comment-right {
    position: absolute;
    top: 0;
    right: 0;
    font-size: 30px;
  }
}
//回复评论内容
.van-popup--bottom {
  // .van-nav-bar__content {
  //   padding-bottom: 92px;
  // }
  .box {
    height: 92px;
  }
  .comment {
    display: flex;
    position: relative;
    padding: 25px 30px 25px;
    .comment-left {
      display: flex;
      .pic {
        width: 72px;
        height: 72px;
        img {
          width: 100%;
          height: 100%;
          border-radius: 36px;
        }
      }
      .text {
        p:nth-child(1) {
          margin: 5px 30px;
          font-size: 26px;
        }
        p:nth-child(2) {
          font-size: 32px;
          margin: 25px 30px;
        }
        .text-btn {
          display: flex;
          button {
            width: 130px;
            height: 48px;
            font-size: 26px;
            border-radius: 24px;
            border: 1px solid #ccc;
            background-color: #fff;
          }
        }
      }
    }
    .comment-right {
      position: absolute;
      top: 122px;
      right: 30px;
      font-size: 30px;
    }
  }
  .van-nav-bar-two {
    background-color: #fff;
    :deep(.van-nav-bar__text) {
      color: black;
    }
  }
  .replyBtn {
    height: 100px;
    width: 80%;
    position: fixed;
    top: 1233px;
    left: 75px;
    border: 5px solid hotpink;
    background-color: #fff;
    border-radius: 50px;
  }
}
</style>
