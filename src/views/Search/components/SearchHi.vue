<template>
  <div>
    <van-cell-group>
      <van-cell title="搜索历史">
        <template #default>
          <div class="btns" v-if="isShow">
            <button @click="delAll">全部删除</button>
            <button @click="isShow = !isShow">完成</button>
          </div>
          <van-icon @click="isShow = !isShow" v-if="!isShow" name="delete-o" />
        </template>
      </van-cell>
      <van-cell
        v-for="(item, index) in hisName"
        :key="index"
        :title="item"
        value="内容"
        @click="getResult(index)"
      >
        <template #default>
          <van-icon @click="delHis(index)" v-if="isShow" name="close" />
        </template>
      </van-cell>
    </van-cell-group>
  </div>
</template>

<script>
import storage from '@/utils/storage'
export default {
  name: 'SearchHi',

  data() {
    return {
      hisName: storage.get('hisName') || [],
      isShow: false,
      resultP: ''
    }
  },
  created() {
    // this.getName()
  },
  mounted() {},
  methods: {
    // getName() {
    //   this.hisName = storage.get('hisName')
    // }
    delHis(index) {
      this.hisName.splice(index, 1)
      storage.set('hisName', this.hisName)
    },
    delAll() {
      this.hisName = []
      storage.set('hisName', this.hisName)
    },
    getResult(index) {
      // console.log(item)
      // console.log(this.keyWord)
      this.resultP = this.hisName[index]
      if (this.isShow) {
        return
      }
      this.$emit('getNew', this.resultP)
    }
  }
}
</script>

<style lang="less" scoped>
.btns {
  button {
    border: 0;
    background-color: #fff;
    color: #b197b3;
  }
}
</style>
