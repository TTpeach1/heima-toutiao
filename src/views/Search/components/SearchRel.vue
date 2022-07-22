<template>
  <div>
    <!-- <van-cell
      v-for="(item, index) in newResult"
      :key="index"
      icon="search"
      :title="item.title"
    >
    </van-cell> -->
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <van-cell
        v-for="(item, index) in newResult"
        :key="index"
        :title="item.title"
      />
    </van-list>
  </div>
</template>

<script>
import { getSearchResultApi } from '@/api'
export default {
  name: 'SearchRel',

  data() {
    return {
      newResult: [],
      loading: false,
      finished: false,
      page: 1,
      limit: 10
    }
  },
  props: {
    keyWord: {
      type: String,
      required: true
    }
  },
  created() {
    this.getResult()
  },
  mounted() {},

  methods: {
    async getResult() {
      try {
        const res = await getSearchResultApi(
          this.page,
          this.limit,
          this.keyWord
        )
        // console.log(res)
        this.loading = false
        this.newResult = res.data.data.results
        console.log(this.newResult)
      } catch (error) {
        console.log(error)
      }
    },
    onLoad() {
      this.timer = setTimeout(async () => {
        try {
          this.page++
          const res = await getSearchResultApi(
            this.page,
            this.limit,
            this.keyWord
          )
          this.newResult.push(...res.data.data.results)
          console.log(this.newResult)
          this.loading = false
          if (res.data.data.results.length === 0) {
            this.finished = true
          }
        } catch (error) {
          console.log(error)
        }
      }, 1000)
    }
  }
}
</script>

<style lang="less" scoped></style>
