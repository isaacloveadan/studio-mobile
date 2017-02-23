<template>
	<!-- 景区特色栏目 -->
<div class="goods_box" >
	<template  v-for="(item,index) in goodsList"  v-if="show">
		<div class="goods_item" @click="goods(item)">
			<div class="goods_thumb" :style="{backgroundImage: 'url(' + item.goodsImg + ')'}"></div>
			<div class="goods_info">
				<h3 class="title">{{item.goodsName}}</h3>
				<span class="price">￥{{item.shopPrice}}</span><span class="saleCount">{{item.saleCount}}人付款</span>
				<button class="quickBuy">立即购买</button>
			</div>
		</div>
		<div class="clear"></div>
	</template>
</div>
</template>

<script>
	import store from 'store'
	export default {
		name: 'goods',
		props:['propsMenu'],
		data() {

			return {
				goodsList:[],
				show:false
			}

		},
		components: {

		},
		methods: {
			goods:function(itemInfo){
				if(!itemInfo.goodsId){
					alert('商品信息有误')
					return
				}
				sessionStorage.isActiveGoodsId = itemInfo.goodsId
				this.$router.push('/goods/'+itemInfo.goodsId)

				store.commit('openLoading')

			},
			getGoodsInfo:function(){

				//拿到的是商品的id组成的数组,需要换回来商品信息
				var url = "shop=http://shop.icloudinn.com/index.php/Api/Goods/findMerchantGoodsListByIds"
				//我实在不敢看下面这行又黑又脆弱的代码
				var data={ids:'['+this.propsMenu.goods.toString()+']'}
				this.$http.post(url,data).then((response)=>{
					if(response.body.code!=100){alert('商品信息错误')}
					this.goodsList = response.body.data
					this.show=true
				},(response)=>{

				})
			}
		},
		mounted(){
			this.getGoodsInfo()
		}
	}
</script>

<style lang="less">

</style>
