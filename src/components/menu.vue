<template>
	<div class="menuBox" v-if="menuListData.length>0">
		<!--此处为菜单栏的标题-->
		<div class="menuItemBox">
			<template v-for="(item,index) in menuListData">
				<!--意味着菜单名称不能一样了哥哥-->
				<div :class="{active:item.title==menu.title}" class="menuItem" @click="isActive(index,item)">{{item.title}}</div>
			</template>
		</div>
		<!--此处为菜单栏的内容-->
		<div class="content_box">
			<!--<div :is='menu2.type' :room='room' :propsMenu='menu2'></div>-->
			<!--<div :is="menu.type" :room="room" :propsMenu="menu" :key="menu.title"></div>-->
			<!-- 利用swiper动态切换菜单栏内容 用于解决切换不同栏目会让聊天组件重新加载的问题 -->
			<swiper :options='swiperOption' ref='mySwiperB'>
				<swiper-slide v-for='(item,index) in menuListData'>
					<div :is="item.type" :room="room" :propsMenu="item"></div>
				</swiper-slide>
			</swiper>
		</div>
	</div>
</template>

<script>
	import Communit from './menu/communit.vue'
	import Show from './menu/show.vue'
	import Goods from './menu/goods.vue'
	import store from 'store'
	 import {
	 	swiper,
	 	swiperSlide,
	 	swiperPlugins
	 } from 'vue-awesome-swiper'
	export default {

		name: 'menu',
		store,
		props: ['room'],
		data() {

			return {
				//菜单列表
				menuListData: [],
				 swiperOption:{
				 	notNextTick: true,
					loop : true,
					autoplay: 5000
				 }
			}

		},
		components: {
			Communit,
			Show,
			Goods,
			 swiper,
			 swiperSlide,
			 swiperPlugins
		},
		computed: {
			menu: function() {
				// 返回vuex的getMenu返回值
				return store.getters.getMenu
			},
			isLogin: function() {
				var isLogin = sessionStorage.getItem('isopenLogin')
				console.log(isLogin)
				if(isLogin == '1') {
					return true
				} else {
					return false
				}
			}
		},
		methods: {
			isActive: function(index, itemMenuInfo) {

				store.commit('setCurrentMenu', itemMenuInfo)
				this.$nextTick(function() {
					// this.$el.querySelector('.content_box').style.height=document.body.offsetHeight-this.$el.offsetTop-36+'px'
				})
			}
			// isActive: function(type) {
			// 	store.commit('setCurrentView',type)

			// 	this.$nextTick(function () {
			// 		// this.$el.querySelector('.content_box').style.height=document.body.offsetHeight-this.$el.offsetTop-36+'px'
			// 	})
			// }
		},
		mounted() {
			var tempArr = this.room.pluginObj.menu.map(function(x) {
				x.isActive = false
				return x
			})
			//这里将两个对象连接起来
			this.menuListData = [{ title: '边看边聊', type: 'communit', isActive: true }].concat(tempArr)
			console.log(this.menuListData)
			console.log(this.menuListData.length>0)
			this.$nextTick(function() {
				//margin-top 10
				document.querySelector('.content_box').style.height = document.body.offsetHeight - this.$el.offsetTop - 36 + 'px'
			})

		}
	}
</script>

<style lang="less">

</style>
