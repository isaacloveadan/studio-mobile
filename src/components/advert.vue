<template>
	<swiper :options="swiperOption" id="advertBox" class="advertBox" v-if="advertListData.length>0">
		<swiper-slide  v-for="(value,index) in advertListData" @click="open(value.link)" :style="{backgroundImage: 'url(' + value.pic + ')'}"></swiper-slide>
	</swiper>
</template>

<script>
	import {
		swiper,
		swiperSlide,
		swiperPlugins
	} from 'vue-awesome-swiper'
	export default {
		name: 'advert',
		props:['room'],
		data() {

			return {
				advertListData: [],
				swiperOption: {
					// 如果你后续需要找到当前实例化后的swiper对象以对其进行一些操作的话，可以自定义配置一个名字
					name: 'currentSwiper',
					// // 所有配置均为可选（同Swiper配置）
					notNextTick: true,
					loop : true,
					autoplay: 5000
				},
			}

		},
		components: {
			swiper,
			swiperSlide,
			swiperPlugins
		},
		methods: {
			open:function(url){
				location.href = url
			}
		},
		mounted(){
			this.$nextTick(function(){
				document.getElementById('advertBox').style.height = document.body.clientWidth*0.2+'px'
			})
			this.advertListData = this.room.pluginObj.advert
		}
	}
</script>

<style lang="less">
    
</style>