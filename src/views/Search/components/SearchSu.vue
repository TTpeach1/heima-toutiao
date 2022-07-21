<template>
  <div>
    <van-cell
      v-for="(item, index) in highlightData"
      :key="index"
      icon="search"
      :title="item"
      @click="getResult(index)"
    >
      <template #title>
        <span v-html="item"></span>
      </template>
    </van-cell>
  </div>
</template>

<script>
import { getSearchSuggestionApi } from '@/api'
export default {
  name: 'SearchSu',

  data() {
    return {
      suggestion: [],
      resultP: ''
    }
  },
  props: {
    keyWord: {
      type: String,
      required: true
    }
  },
  mounted() {},
  watch: {
    // keyWord: 'getSearchSuggestion'
    keyWord: {
      handler() {
        this.getSearchSuggestion()
      },
      immediate: true
    }
  },
  computed: {
    highlightData() {
      const reg = new RegExp(this.keyWord, 'ig')
      return this.suggestion.map((str) =>
        str.replace(reg, (match) => `<span style="color:red">${match}</span>`)
      )
    }
  },
  methods: {
    async getSearchSuggestion() {
      try {
        const res = await getSearchSuggestionApi(this.keyWord)
        console.log(res)
        this.suggestion = res.data.data.options.filter(Boolean)
        // console.log(this.suggestion)
        if (this.suggestion.length === 0) {
          this.$toast.fail('没有搜索建议')
        }
      } catch (error) {
        console.log(error)
      }
    },
    getResult(index) {
      // console.log(item)
      // console.log(this.keyWord)
      this.resultP = this.suggestion[index]
      this.$emit('getNew', this.resultP)
    }
  }
}
</script>

<style lang="less" scoped></style>
