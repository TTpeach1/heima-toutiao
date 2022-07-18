<template>
  <div>
    <van-pull-refresh
      v-model="refreshing"
      @refresh="loadNextPage"
      success-text="刷新成功"
    >
      <van-list
        @load="loadNextPage"
        offset="1"
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
      >
        <Articleitem
          v-for="item in articles"
          :key="item.art_id"
          :articleInfo="item"
        ></Articleitem>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getArticleListApi } from '@/api'
import Articleitem from './Articleitem.vue'
export default {
  name: 'HeimaModileArticleList',

  data() {
    return {
      articles: [],
      pre_timestamp: '',
      loading: false,
      finished: false,
      refreshing: false
    }
  },
  components: {
    Articleitem
  },
  props: {
    id: {
      type: [Number, String],
      require: true
    }
  },
  created() {
    this.getArticleList()
  },

  mounted() {},

  methods: {
    async getArticleList() {
      // const { data } = await getArticleListApi(this.id, +new Date())
      // this.articles = data.data.results
      // console.log(data)
      try {
        const { data } = await getArticleListApi(this.id, +new Date())
        this.pre_timestamp = data.data.pre_timestamp
        this.articles = data.data.results
        // console.log(data)
      } catch (error) {
        // 返回状态码
        // 507 数据库错误
        // 400 请求参数错误
        // 200 OK
        const stu = error.response.status
        if (stu === 400) {
          throw new Error(error.response.data.message)
        } else {
          this.$toast.fail('刷新重试')
        }
      }
    },
    async loadNextPage() {
      try {
        const { data } = await getArticleListApi(this.id, this.pre_timestamp)
        // console.log(data)
        if (!data.data.pre_timestamp) {
          this.finished = true
          this.$toast.fail('无数据')
        }
        if (this.refreshing) {
          this.articles.unshift(...data.data.results)
        } else {
          this.articles.push(...data.data.results)
        }
        this.pre_timestamp = data.data.pre_timestamp
      } catch (error) {
        console.log(error)
      } finally {
        this.loading = false
        this.refreshing = false
      }
    }
  }
}
</script>

<style lang="less" scoped>
// 头部固定的样式
</style>
