<template>
    <div class="modal" @click.self="close" v-show="visible">
        <div class="control-bar">
            <a @click="rightRotation"><i class="iconfont icon-right"></i></a>
            <a @click="leftRotation"><i class="iconfont icon-left"></i></a>
            <a @click="handleClose"><i class="iconfont icon-close"></i></a>
        </div>
        
        <div class="large-picture">
            <img :src="imgSrc" ref="bigImg">
        </div>
    </div>
</template>

<script>
	let top
	export default {
	  name: 'base-modal',
	  props: {
	    showClose: {
	      type: Boolean,
	      default: true
	    },
	    visible: {
	      type: Boolean,
	      default: false
	    },
	    easyToClose: {
	      type: Boolean,
	      default: false
	    },
	    imgSrc: {
	      type: String
	    }
	  },
	  data () {
	    return {
	      rotate: 0,
	      pictureName: ''
	    }
	  },
	  created () {
	    this.pictureName = `${Date.now()}.png`
	  },
	  methods: {
	    close (e) {
	      this.handleClose(e)
	    },
	    handleClose (e) {
	      this.$emit('close', e)
	      this.$emit('update:visible', false)
	    },
	    leftRotation () {
	      this.rotate -= 90
	      this.$refs.bigImg.style.transform = 'rotate(' + this.rotate + 'deg)'
	    },
	    rightRotation () {
	      this.rotate += 90
	      this.$refs.bigImg.style.transform = 'rotate(' + this.rotate + 'deg)'
	    },
	    downloadImg () {
	      window.open(this.imgSrc, '_blank')
	    }
	  },
	  watch: {
	    visible: {
	      deep: true,
	      immediate: true,
	      handler: (newVal) => {
	        if (newVal) {
	          top = document.body.scrollTop
	          document.body.style.overflow = 'hidden'
	        } else {
	          document.body.scrollTop = top
	          document.body.style = ''
	        }
	      }
	    }
	  }
	}
</script>

<style lang="less" scoped>
	.modal {
		z-index: 3000;
		position: fixed;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		background-color: rgba(0, 0, 0, .6);
		.control-bar {
			position: absolute;
			right: 30px;
			top: 30px;
			a {
				color: white;
				margin: 0 20px;
				i {
					font-size: 30px;
				}
			}
		}
	}

	.large-picture {
		width: 50vw;
		height: 60vh;
		display: flex;
		justify-content: center;
		align-items: center;
		position: absolute; top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		
		img {
			max-width: 100%;
			max-height: 100%;
		}
	}

	.rotate90 {
		transform: rotate(90deg);
	}
</style>
