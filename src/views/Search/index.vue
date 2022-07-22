<template>
  <div class="main">
    <form action="/">
      <van-search
        v-model="keyWord"
        show-action
        placeholder="请输入搜索关键词"
        @search="onSearch"
        @cancel="goBack"
        background="#3296fa"
        class="search"
        @focus="visibleSearchSuggestion"
      />
    </form>
    <!-- <SearchHi></SearchHi>
    <SearchRel></SearchRel>
    <SearchSu></SearchSu> -->
    <component
      :is="componentName"
      :keyWord="keyWord"
      @getNew="getNewKey"
      class="module"
    ></component>
  </div>
</template>

<script>
import SearchHi from './components/SearchHi.vue'
import SearchRel from './components/SearchRel.vue'
import SearchSu from './components/SearchSu.vue'
import storage from '@/utils/storage'
export default {
  name: 'HeimaModileIndex',

  data() {
    return {
      keyWord: '',
      isShowSearchResult: ''
    }
  },
  computed: {
    componentName() {
      if (this.keyWord.trim() === '') {
        return 'SearchHi'
      }
      if (this.isShowSearchResult) {
        return 'SearchRel'
      }
      return 'SearchSu'
    },
    hisName() {
      return storage.get('hisName') ? storage.get('hisName') : []
    }
  },
  components: {
    SearchHi,
    SearchRel,
    SearchSu
  },
  mounted() {},

  methods: {
    onSearch() {
      this.isShowSearchResult = true
      console.log('正在搜索')
      if (this.hisName.indexOf(this.keyWord) === -1) {
        this.hisName.unshift(this.keyWord)
      } else {
        this.hisName.splice(this.hisName.indexOf(this.keyWord), 1)
        this.hisName.unshift(this.keyWord)
      }
      storage.set('hisName', this.hisName)
      // console.log(this.hisName)
    },
    goBack() {
      this.$router.go(-1)
    },
    visibleSearchSuggestion() {
      this.isShowSearchResult = false
    },
    getNewKey(name) {
      this.keyWord = name
      this.onSearch()
    }
  }
}
</script>

<style lang="less" scoped>
.main {
  position: relative;
}
.search {
  position: fixed;
  z-index: 99;
  width: 100%;
  top: 0;
  left: 0;
  [role='button'] {
    color: #fff;
  }
}
.module {
  margin-top: 120px;
}
// .search {
//   [role='button'] {
//     color: #fff;
//   }
// }
</style>
