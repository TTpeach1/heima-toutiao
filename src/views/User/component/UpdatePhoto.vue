<template>
  <div>
    <img :src="photo" alt="" ref="img" />

    <button class="btn" @click="confirm">完成</button>
  </div>
</template>

<script>
import Cropper from 'cropperjs'
import 'cropperjs/dist/cropper.css'
import { getPhotoApi } from '@/api/user'
export default {
  data() {
    return {
      photoUrl: ''
    }
  },
  props: ['photo'],
  mounted() {
    const img = this.$refs.img

    this.myCropper = new Cropper(img, {
      aspectRatio: 1 / 1, // 默认比例
      preview: '.previewImg', // 预览视图
      guides: false, // 裁剪框的虚线(九宫格)
      autoCropArea: 0.3, // 0-1之间的数值，定义自动剪裁区域的大小，默认0.8
      // movable: false, // 是否允许移动图片
      dragCrop: true, // 是否允许移除当前的剪裁框，并通过拖动来新建一个剪裁框区域
      movable: true, // 是否允许移动剪裁框
      resizable: true, // 是否允许改变裁剪框的大小
      scalable: false, // 是否可以缩放图片
      zoomable: true, // 是否允许缩放图片大小
      mouseWheelZoom: false, // 是否允许通过鼠标滚轮来缩放图片
      touchDragZoom: false, // 是否允许通过触摸移动来缩放图片
      rotatable: true // 是否允许旋转图片
    })
  },
  methods: {
    // multipart/form-data
    confirm() {
      const fm = new FormData()
      this.myCropper.getCroppedCanvas().toBlob(async (blob) => {
        fm.append('this.photo', blob)
        const res = await getPhotoApi(blob)
        console.log(res)
        this.photoUrl = res.data.data.photo
        this.$emit('setPhoto', this.photoUrl)
      })
    }
  }
}
</script>

<style scoped>
.btn {
  position: fixed;
  top: 50%;
  left: 50%;
  z-index: 99;
}
</style>
