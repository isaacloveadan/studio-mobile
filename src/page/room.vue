<template>

	<div class="room" v-if="show">
		<template v-if="!cover">
			<Player-Box :room="roomObj"></Player-Box>
			<Advert-Box :room="roomObj"></Advert-Box>
			<Menu-Box :room="roomObj"></Menu-Box>
		</template>
		<template v-else>
			<div class="cover" @click="cover=false" :style="{backgroundImage: 'url(' + roomObj.cover_img_url + ')'}">
				<div class="mask_cover"></div>
				<div class="player_box">
					<h5>点击进入</h5><img src="~assets/player.png"></div>
			</div>
		</template>
	</div>

</template>

<script>
	import AdvertBox from 'plugin/advert.vue'
	import PlayerBox from 'plugin/player.vue'
	import MenuBox from 'plugin/menu.vue'
	import store from 'store'
	export default {

		name: 'room',
		data() {

			return {
				roomObj: null,
				show: false,
				cover: false,
			}

		},
		components: {
			PlayerBox,
			AdvertBox,
			MenuBox
		},
		methods: {
			getRoomInfo: function() {

				var url = 'mock=http://saas.icloudinn.com/api/v1/deals/room/' + sessionStorage.getItem('roomid')

				this.$http.get(url).then((response) => {
					console.log(response.body)
					this.roomObj = response.body.data
					document.title = this.roomObj.title

					if(this.roomObj.plugin != '') {
						this.roomObj.pluginObj = JSON.parse(this.roomObj.plugin)
					}

					if(sessionStorage.getItem('cover') != '1' && this.roomObj.cover_img_url != '') {
						this.cover = true
						sessionStorage.setItem('cover', 1)
					}

					//如果不是第一次登录就直接显示，如果是第一次登录就在登录后显示
					console.log('isLogin1');
					this.show = true
					var self = this
					var obj = {
						text: self.roomObj.titel,
						load: true
					}
					store.commit('setRoom', obj)
					// 删掉isopenlogin变量 下次登录时 还要经过一次微信跳转

				}, (response) => {

					//this.$router.push('notfound')
				})
			},
			//页面加载时响应这个函数
			setRoomId: function() {
				console.log('setRoomId');
				var roomid = this.$route.params.id;
				// 房间id是字符而且与现有不相同才替换
				if(roomid !== sessionStorage.getItem('roomid') || !sessionStorage.getItem('roomid')) {
					if(isNaN(parseInt(roomid))) {
						console.log('roomid 参数为非整数')
						return
					}
					sessionStorage.setItem('roomid', roomid)
				}
			},
			//页面加载时响应这个函数
			setUsrInfo: function() {
				console.log('setUsrInfo');
				// 如果isopenlogin没有就设置成1 并且跳转微信登录路由
				if(typeof(sessionStorage.isopenLogin) == 'undefined' || sessionStorage.isopenLogin != '1') {
					//记录是否打开过微信登录页面
					sessionStorage.setItem('isopenLogin', '1')
					if(window.danteng == 0) {
						//测试
						var openidUrl = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx59f95d5febc26d71&redirect_uri=http://test.icloudinn.com/' + sessionStorage.roomid + '&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect';
					} else {
						//正式
						var openidUrl = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx4a150a2811c36060&redirect_uri=http://tv.icloudinn.com/' + sessionStorage.roomid + '&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect';
					}
					location.href = openidUrl
					return false;
				}
				// 跳转为重定向 isopenlogin为1 执行这段
				if(sessionStorage.isopenLogin == '1') {
					// 第一次登录后，将登录的标记清除
					sessionStorage.setItem('isopenLogin', '0')
					// 用于用户直接在当前页面刷新 code会过期 如果sessionStorage有token就直接跳过拿token接口 直接访问getRoomInfo方法 从sessionStorage中拿取数据
					if(sessionStorage.token == null || sessionStorage.token == undefined || sessionStorage.token == '') {
						function getUrlParam(name) {
							var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)") //构造一个含有目标参数的正则表达式对象
							var r = window.location.search.substr(1).match(reg) //匹配目标参数
							if(r != null) return unescape(r[2])
							return null //返回参数值
						}
						var code = getUrlParam('code')
						this.$http.post('/deal/wxlogin', { code: code }).then((response) => {
							// alert(response.body)
							if(response.body.code != 100) {
								//this.$router.push('notfound')
								alert(JSON.stringify(response.body))
								console.log(JSON.stringify(response.body))
								return
							}
							sessionStorage.setItem('usrInfo', JSON.stringify(response.body.data))
							var result = response.body.data
							sessionStorage.setItem('token', result.accessToken)
							sessionStorage.setItem('account', result.account)
							sessionStorage.setItem('openid', result.openid)

							this.getRoomInfo()

							//修改登录的状态，但凡需要登录的操作都需要在这个后面执行
						}, (response) => {
							//this.$router.push('notfound')
						})

					} else if(sessionStorage.token != null & sessionStorage.token != undefined & sessionStorage.token != '') {
						this.getRoomInfo()
					} else {
						//this.$router.push('notfound')
					}

				}

				//

			}

		},
		mounted() {

			// alert(0)
			if(isNaN(this.$route.params.id)) {
				//this.$router.push('notfound')
			}
			this.setRoomId()
			//			this.getRoomInfo()
			console.log('开干吧 新地址')
			this.setUsrInfo()
		}
	}
</script>

<style lang="less">
	.room {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
	}
</style>