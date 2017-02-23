import Vue from 'vue'

import VueRouter from 'vue-router'
Vue.use(VueRouter)

const routes = [
{
	path: '/pay',//需要把这个规则写在前面，不然会被/:id拦截
	name:'pay',
	component: function(resolve) {
		require(['./page/pay.vue'], resolve)
	}
},{
	path: '/:id',
	name:'room',
	component: function(resolve) {
		require(['./page/room.vue'], resolve)
	}
},{
	path: '/goods/:goodsId',
	name:'goods',
	component: function(resolve) {
		require(['./page/goods.vue'], resolve)
	}
},{
	path: '/order/:orderId',
	name:'order',
	component: function(resolve) {
		require(['./page/order.vue'], resolve)
	}
},
{
	path: '*',
	name:'notfound',
	component: function(resolve) {
		require(['./page/404.vue'], resolve)
	}
}
]

const router = new VueRouter({
	mode: 'history',
	routes
})


import VueResource from 'vue-resource'
Vue.use(VueResource)

Vue.http.options.emulateJSON = true
// Vue.http.options.emulateHTTP = true
//这里是全局vue-resource的拦截器 用于在请求发起前和发起后做一些事情
Vue.http.interceptors.push((request, next) => {
	//请求发起前
	var url = 'http://saas.icloudinn.com/api/v1'
	var token = '?access-token=' + sessionStorage.getItem('token')

	if(request.url.indexOf('shop=') == 0) {
		console.log('shop');

		request.url = request.url.substr(5)+token
	} else if(request.url.indexOf('mock=') == 0){
		//针对没有token的接口
		console.log('mock');
		request.url = request.url.substr(5)
	}else{
		console.log('else');
		request.url = url + request.url + token
		console.log(request.url)
	}

	next((response) => {
		//请求发送后
		//这里针对token过期 重新跳转微信拿到code用于换取token
		if(response.body.code==101){
			sessionStorage.removeItem('isopenLogin')
			sessionStorage.setItem('isopenLogin', '1')
			if(window.danteng==0){
				//测试
			var openidUrl = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx058722867fec4f54&redirect_uri=http://test.icloudinn.com/'+sessionStorage.roomid+'&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect';
			}else{
				//正式
			var openidUrl = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx4a150a2811c36060&redirect_uri=http://tv.icloudinn.com/'+sessionStorage.roomid+'&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect';
			}
			location.href = openidUrl
		}
		return response
	})

})


import Vuex from 'vuex'
Vue.use(Vuex)
//处理一些公共的配置

import App from './app.vue'


new Vue({
	el:'#app',
	router,
	render: h => h(App)
})
