<template>
	<div class="goods" v-if="show">
		<!--<div class="topbar"><i class="left" @click="$router.go(-1)"></i></div>-->
		<swiper ref="goodImgBox" :options="swiperOption" class="goodsImgBox" >
			<template v-if="goodsInfo.goodsImgs&&goodsInfo.goodsImgs.length>0">
				<swiper-slide v-for="(value,index) in goodsInfo.goodsImgs" :style="{backgroundImage: 'url(' + value.pic + ')'}"></swiper-slide>
			</template>
			<template v-else>
				<swiper-slide :style="{backgroundImage: 'url(' + goodsInfo.goodsImg + ')'}"></swiper-slide>
			</template>
		</swiper>

		<div class="info">
			<h3 class="name">{{goodsInfo.goodsName}}</h3>
			<div class="price">￥<span>{{goodsInfo.shopPrice}}</span></div>
			<!--<div class="clear"></div>-->
			<div class="stock-detail">
				<dl>
					<dt>运费:免运费</dt>
				</dl>
				<dl>
					<dt>销量</dt>
				</dl>
				<dl>
					<dt>产地</dt>
				</dl>
			</div>
		</div>

		<div class="more">
			<div class="detail btn" :class="{ active: isActive=='detail' }" @click="changeActive('detail')">产品详情</div>
			<!--<div class="order btn" :class="{ active: isActive=='order' }" @click="changeActive('order')">成交订单</div>-->
		</div>
		<div class="bottom">
			<button class="buy" @click="isBuy=true">立即购买</button>
		</div>
		<div class="container_detail" v-html="goodsInfo.goodsDesc"  v-show="isActive=='detail'">
			<!--<div id="J_DivItemDesc" class="content"><img align="absmiddle" src="https://img.alicdn.com/imgextra/i4/1640165576/TB2mCNuXjzyQeBjy1zdXXaInpXa_!!1640165576.jpg"></div>-->
		</div>
		<!--<div class="container_order" v-show="isActive=='order'">
			<table>
				<tr>
					<th>用户</th>
					<th>数量</th>
					<th>购买时间</th>
				</tr>
				<tr>
					<td>用户</td>
					<td>数量</td>
					<td>购买时间</td>
				</tr>
			</table>
		</div>-->
		<div class="mask" v-show="isBuy"></div>
		<div class="select_box" v-show="isBuy">
			<div class="select_info">
				<i class="close" @click="isBuy=false"></i>
				<img :src="goodsInfo.goodsImg">
				<h5 class="name">{{goodsInfo.goodsName}}</h5> <span class="price">￥{{goodsInfo.shopPrice}}</span>
			</div>

			<div class="select_number">
				<span class="tip">购买数量:</span>
				<div class="control">
					<button ref="minus" @click="buyNum--" class="minus"></button>
					<input type="text" v-model="buyNum" class="buyNum" />
					<button ref="plus" @click="buyNum++" class="plus"></button>

				</div>

				<p class="stock">剩余{{goodsInfo.goodsStock}}件</p>
			</div>

			<button @click="goPay()" class="pay">去支付</button>
		</div>

	</div>
</template>

<script>
	import {
		swiper,
		swiperSlide,
		swiperPlugins
	} from 'vue-awesome-swiper'
	import store from 'store'
	export default {

		name: 'goods',
		store,
		watch: {
			buyNum: function (n, o) {

				if (n == 1) {
					this.$refs.minus.disabled = true
				} else {
					this.$refs.minus.disabled = false
				}

				if (n == this.goodsInfo.goodsStock) {
					this.$refs.plus.disabled = true
				} else {
					this.$refs.plus.disabled = false
				}

			}
		},
		components:{
			swiper,
			swiperSlide,
			swiperPlugins
		},
		data() {

			return {
				buyNum: 1,
				isBuy: false,
				show: false,
				isActive: 'detail',
				goodsInfo: {},
				swiperOption: {
					// 如果你后续需要找到当前实例化后的swiper对象以对其进行一些操作的话，可以自定义配置一个名字
					name: 'currentSwiper',
					// // 所有配置均为可选（同Swiper配置）
					notNextTick: true,
					direction: 'vertical',
					height:300,//默认300
					// loop: true,
					autoplay: false
				},
			}

		},
		methods: {
			changeActive: function (current) {
				this.isActive = current
			},
			escape2Html:function(str) {
				var arrEntities={'lt':'<','gt':'>','nbsp':' ','amp':'&','quot':'"'};
				return str.replace(/&(lt|gt|nbsp|amp|quot);/ig,function(all,t){return arrEntities[t];});
			},
			goPay: function () {
				sessionStorage.setItem('buyNum', this.buyNum)
				sessionStorage.setItem('isActiveGoodsInfo',JSON.stringify(this.goodsInfo))
				this.$router.push('/pay')
				store.commit('openLoading')
			},
			init: function () {
				
				this.swiperOption.height = document.body.offsetWidth;
				
				var url ='shop=http://shop.icloudinn.com/index.php/Api/Goods/getGoodsDetails',
					goodsId = this.$route.params.goodsId

				if(isNaN(goodsId)){
					alert('商品信息有误')
					return
				}
				this.$http.post(url,{goodsId:goodsId}).then((response)=>{
					//这里是商品详情，还可能有商品的图片列表，但是这里默认都不上传多张图片
					this.goodsInfo =response.body.data.goodsDesc
					this.goodsInfo.goodsDesc = this.escape2Html(this.goodsInfo.goodsDesc)
					
					this.show =true
				},(response)=>{
					alert(response.body)
				})

				


			}
		},
		mounted() {

			store.commit('closeLoading')
			this.init()
			
			// for(var k in this.$refs){
				// console.log(this.$refs[k])
			// }
		}
	}
</script>
<style lang="less">
.swiper-slide{
	background-repeat: no-repeat;
	background-position: center;
	/*background-size: */
}
</style>