<template>
<div class="paybox" v-if="show">

<div class="express" >
	<!--<template v-if="true">-->
	<template v-if="addrList.length>0">
		<div class="empty" @click="isAddress=true">
			<ul class="express-detail">
				<li class="clearfix">
					<span class="name">
						收货人：{{defaultAddr.userName}}
					</span>
					<span class="tel">{{defaultAddr.userPhone}}</span>
				</li>
				<li class="address-detail">
					收货地址：{{defaultAddr.address}}
				</li>
			</ul>
		</div>
	</template>
	<template v-else>
		<div class="express-panel" >
			<div class="js-logistics-content logistics-content js-self-fetch">
				<div class="">
					<div class="selffetch-panel form no-user-select border-top-0 border-bottom-0">
						<div class="clearfix block-item">
							<label>收货人：</label>
							<input class="txt txt-black ellipsis js-name" v-model="orderInfo.userName" placeholder="请填写收货人姓名">
						</div>
						<div class="clearfix block-item">
							<label>手机号码：</label>
							<input type="text" class="txt txt-black ellipsis js-tel" v-model="orderInfo.phone" placeholder="请填写收货人手机号码">
						</div>
						<div class="clearfix block-item arrow">
							<label>收货地址：</label>
							<input type="text" class="txt txt-black ellipsis js-tel" v-model="orderInfo.addr" placeholder="请输入收货地址">
							<!--<span class="js-address c-gray-dark">
								请输入收货地址
								</span>-->

						</div>

					</div>
				</div>
			</div>
		</div>
	</template>

</div>
<div class="order_info block">
	<img class="thumb" :src="goodsInfo.goodsImg">
	<div class="detail">
		<div class="detail_row">
			<div class="right_col">
				<div class="price">{{goodsInfo.shopPrice}}</div>
			</div>
			<div class="left_col"><span class="name">{{goodsInfo.goodsName}}</span></div>
		</div>
		<div class="detail_row">
			<div class="right_col">
				<div class="number">x{{orderInfo.buyNum}}</div>
			</div>
		</div>
		<div class="detail_row"></div>
	</div>
</div>

<!--<div class="block-item">
	<span class="liuyan">买家留言：</span>
	<div class="input-wrapper">
		<textarea class="msg-container" placeholder="点击给商家留言"></textarea>
	</div>
</div>-->
<div class="block-item">
	<span class="heji">合计</span>
	<div class="pull_right total">￥{{total}}
	</div>
</div>

<div class="block-item youhui_box">
	<span class="heji">优惠</span>
	<div class="pull_right">无
	</div>
</div>

<div class="pay_bottom">
	<div class="pull_right ">
		<span class="tip">合计：</span>
		<span class="js_price">￥{{total}}</span>
		<span v-if="total>1" class="price_sub">.00</span>

		<button class="commit_btn"  ref="pay_btn" @click="getOrder()">提交订单</button>

	</div>
</div>


<div class="mask" @click="isAddress=false" v-show="isAddress"></div>
<div class="select_address_box" v-show="isAddress">
	<div class="address-ui address-list">
		<h4 class="address-title">选择收货地址</h4>
		<div class="cancel-img js-cancel" @click="isAddress=false"></div>

		<div class="js-address-container address-container block block-list border-top-0">

			<div :id="address.addressId" @click="checkAddress(address)" v-for="address in addrList" class="js-address-item block-item ">
				<div>

					<div v-if="isCheckId!=address.addressId" class="icon-check"></div>
					<div v-else class="icon-check icon-checked"></div>
					<p>
						<span class="address-name" style="margin-right: 5px;">{{address.userName}},</span>
						<span class="address-tel">{{address.userPhone}}</span>
					</p>
					<span class="address-str address-str-sf">收货地址：{{address.address}}</span>

					<div @click.stop="editAddress(address)" class="address-opt  js-edit-address ">

						<i class="icon-circle-info"></i>

					</div>
				</div>

			</div>
		</div>
		<div class="add-address js-add-address" @click="addAddress()">
			<span class="icon-add"></span>
			<a class="" href="javascript:;">新增地址</a>
			<span class="icon-arrow-right"></span>
		</div>
	</div>
</div>


<div class="mask-full" @click="isEditAddress=false" v-show="isEditAddress"></div>
<div class="select_address_box edit_address_box " v-show="isEditAddress">
	<div class="address-ui address-list">
		<h4 class="address-title">修改收货地址</h4>
		<div class="cancel-img js-cancel" @click="isEditAddress=false"></div>
		<div class="edit_address_container">

				<div class="edit_item">
					<label>收货人：</label>
					<input value="" placeholder="请填写收货人姓名"  v-model="isEditAddressInfo.userName" class="txt txt-black ellipsis js-name">
				</div>
				<div class="edit_item">
					<label>手机号码：</label>
					<input type="text" value="" v-model="isEditAddressInfo.userPhone" placeholder="请填写收货人手机号码" class="txt txt-black ellipsis js-tel">
				</div>
				<div class="edit_item">
					<label>收货地址：</label>
					<input type="text" value="" v-model="isEditAddressInfo.address" placeholder="请输入收货地址" class="txt txt-black ellipsis js-tel">
				</div>
				<div class="edit_item">
					<label>默认地址：</label>
					<div class="isdefault"><input v-model="isEditAddressInfo.isDefault" id="default" type="checkbox"   /><label for="default">设此地址为默认地址</label></div>
				</div>

			</div>
			<div class="action-container">
			<a class="js-address-save" @click="saveEditAddr()">保存</a>

				<a class="js-address-delete" @click="delAddr(isEditAddressInfo.addressId)">删除收货地址</a>

		</div>

	</div>
</div>

<div class="mask-full" @click="isAddAddress=false" v-show="isAddAddress"></div>
<div class="select_address_box edit_address_box " v-show="isAddAddress">
	<div class="address-ui address-list">
		<h4 class="address-title">新增收货地址</h4>
		<div class="cancel-img js-cancel" @click="isAddAddress=false"></div>
		<div class="edit_address_container">

				<div class="edit_item">
					<label>收货人：</label>
					<input value="" placeholder="请填写收货人姓名"  v-model="isAddressInfo.userName" class="txt txt-black ellipsis js-name">
				</div>
				<div class="edit_item">
					<label>手机号码：</label>
					<input type="text" value="" v-model="isAddressInfo.userPhone" placeholder="请填写收货人手机号码" class="txt txt-black ellipsis js-tel">
				</div>
				<div class="edit_item">
					<label>收货地址：</label>
					<input type="text" value="" v-model="isAddressInfo.address" placeholder="请输入收货地址" class="txt txt-black ellipsis js-tel">
				</div>
				<div class="edit_item">
					<label>默认地址：</label>
					<div class="isdefault"><input v-model="isAddressInfo.isDefault" id="default2" type="checkbox"   /><label for="default2">设此地址为默认地址</label></div>
				</div>

			</div>
			<div class="action-container">
			<a class="js-address-save" @click="saveAddAddr()">保存</a>

		</div>

	</div>
</div>

</div>
</template>
<style lang="less">

</style>
<script>

// import Loading from 'v-loading'
import store from 'store'
	export default {

		name: 'pay',
		watch: {

		},
		data() {

			return {
				disabled:false,
				isCheckId: null, //当前选中的地址id
				isAddAddress:false,
				isAddressInfo:{
					userName:null,
					userPhone:null,
					address:null,
					isDefault:false//默认不是收货地址
				},
				isEditAddress:false,
				isEditAddressInfo:{},//当前编辑的地址
				isAddress: false,
				goodsInfo: {},
				addrList: [],
				defaultAddr:{},
				total: null,
				show: false,
				orderInfo: {
					goodsId: null,
					buyNum: null,
					putAddrWay: null,
					addrId: null,
					userName: null,
					phone: null,
					addr: null
				}
			}

		},
		methods: {
			saveEditAddr:function(){
				if(this.isEmptyObject(this.isEditAddressInfo)||this.isEditAddressInfo.userName==null||this.isEditAddressInfo.userPhone==null||this.isEditAddressInfo.address==null){
					alert('收货地址信息有误')
					return
				}

				if(this.isEditAddressInfo.isDefault){
					this.isEditAddressInfo.isDefault = 1
				}else{
					this.isEditAddressInfo.isDefault = 0
				}

				this.isEditAddressInfo.addrid = this.isEditAddressInfo.addressId

				var url ="shop=http://shop.icloudinn.com/index.php/Api/UserAddress/edit"
				this.$http.post(url,this.isEditAddressInfo).then((response)=>{

					if(response.body.code ==100){


					for(var k=0;k<this.addrList.length;k++){
						if(k==this.isEditAddressInfo.addrid){
							this.addrList[k] = JSON.parse(JSON.stringify(this.isEditAddressInfo))
							break
						}
					}
					this.isEditAddressInfo={}
					this.isEditAddress =false


					}else{
						alert(response.body.msg)
					}


				},(response)=>{
					alert(response.body)
				})


			},
			saveAddAddr:function(){

				if(this.isAddressInfo.userName==null||this.isAddressInfo.userPhone==null||this.isAddressInfo.address==null){
					alert('收货地址信息有误')
					return
				}
				if(this.isAddressInfo.isDefault){
					this.isAddressInfo.isDefault = 1
				}else{
					this.isAddressInfo.isDefault = 0
				}
				var url ="shop=http://shop.icloudinn.com/index.php/Api/UserAddress/add"
				this.$http.post(url,this.isAddressInfo).then((response)=>{

					if(response.body.code ==100){
						this.addrList.push(response.body.data)
						//恢复配置
					this.isAddressInfo={
							userName:null,
							userPhone:null,
							address:null,
							isDefault:false//默认不是收货地址
						}
						this.isAddAddress =false

					}else{
						alert(response.body.msg)
					}


				},(response)=>{
					alert(response.body)
				})

			},
			delAddr:function(addrId){
				var url ="shop=http://shop.icloudinn.com/index.php/Api/UserAddress/del/addrid/"+addrId
				this.$http.get(url).then((response)=>{
					if(response.body.code ==100){
						this.isEditAddress =false
						this.isEditAddressInfo={}//清空正在编辑的对象，防止出错又显示出来了
						for(var k=0;k<this.addrList.length;k++){
							if(this.addrList[k].addressId == addrId){
								// console.log(k)
								this.addrList.splice(k,1)
								break
							}

						}

						if(this.addrList.length==0){
							this.defaultAddr = {}
							this.orderInfo.putAddrWay = 2
							this.orderInfo.addrId = null
						}
					}else{
						alert(response.body.msg)
					}
				},(response)=>{
					alert(response.body)
				})

			},
			addAddress:function(){
				this.isAddAddress=true
			},
			editAddress: function(item) {

				this.isEditAddressInfo =JSON.parse(JSON.stringify(item))

				if(item.isDefault=='1'){
					this.isEditAddressInfo.isDefault = true
				}else{
					this.isEditAddressInfo.isDefault = false
				}

				this.isEditAddress =true

			},
			checkAddress: function(checkAddress) {

				//修改显示
				this.defaultAddr = checkAddress

				//修改选中id
				this.isCheckId = checkAddress.addressId

				//修改订单信息
				this.orderInfo.putAddrWay = 1
				this.orderInfo.addrId = checkAddress.addressId

				//如果前面选择了1，同时提交下面三个参数会出错吗？
				this.orderInfo.addr = checkAddress.address
				this.orderInfo.phone = checkAddress.userPhone
				this.orderInfo.userName = checkAddress.userName
				this.isAddress = false


			},
			getOrder: function() {

				store.commit('openLoading','订单提交中')
				if(this.disabled){
					alert('请勿重复点击支付按钮')
					return
				}
				this.disabled =true
				//收货地址验证
				if(this.orderInfo.putAddrWay==1){
					if(isNaN(parseInt(this.orderInfo.addrId))){
						alert('收货地址未选择')
						return
					}
				}

				if(this.orderInfo.putAddrWay==2){
					// 包含了null、空字符串检测
					if(!this.orderInfo.addr||!this.orderInfo.phone||!this.orderInfo.userName){
						alert('请输入正确的收货信息')
						return
					}

				}
				//货款验证
				// if()
				var url = "shop=http://shop.icloudinn.com/index.php/Api/Orders/submitOrder"
				// 表单各种验证

				this.$http.post(url, this.orderInfo).then((response) => {

					this.getPayConfig(response.body.data.orderId)

				}, (response) => {
					alert(response.boday.msg)
				})
			},
			getPayConfig: function(orderId) {
				var payurl = 'shop=http://shop.icloudinn.com/index.php/Api/WxPay/wxpay',
					xhrObj = {
						openid: sessionStorage.getItem('openid'),
						trade_type: 'JSAPI',
						orderid: orderId
					}
				this.$http.post(payurl, xhrObj).then(function(response) {

					this.pay(response.body.data,orderId)
				}, function(response) {
					alert(response.boday.msg)
				})
			},

			pay: function(paras,orderId) {
				var self = this;

				//不管支付如何，都让按钮回复可以点击
				this.disabled=false
				store.commit('openLoading')

				WeixinJSBridge.invoke('getBrandWCPayRequest',paras,
					function(res) {

						store.commit('closeLoading')
						// alert(res.err_msg);
						//支付完了就跳转，按照常理是应该做一个“是否支付完成”的框，后续优化了
						if(res.err_msg == "get_brand_wcpay_request:ok" ) {
							alert('支付成功,将返回直播间');

							self.$router.push('/order/'+orderId)
							// document.write('1111')
						}     // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
					}
				);
			},
			isEmptyObject:function(e) {
				var t;
				for (t in e)
					return !1;
				return !0
			} ,
			init: function() {

				this.goodsInfo = JSON.parse(sessionStorage.getItem('isActiveGoodsInfo'))

				//初始化订单信息
				this.orderInfo.goodsId = this.goodsInfo.goodsId
				this.orderInfo.buyNum = sessionStorage.getItem('buyNum')

				// this.orderInfo.putAddrWay = 2 //先用2测试下
				// this.orderInfo.addr = '海南省海口市美兰区桂林洋高校区海南师范大学3507'
				// this.orderInfo.phone = 15607683921
				// this.orderInfo.userName = '汪君相'

				this.total = parseFloat(this.orderInfo.buyNum) * parseFloat(this.goodsInfo.shopPrice) //重要

				//收货地址
				var url = "shop=http://shop.icloudinn.com/index.php/Api/Users/getUserInfo"

				this.$http.get(url).then((response) => {
					var result = response.body.data.addrList
					// alert(JSON.stringify(result))
					this.addrList = result

					if(result.length>0){

						for(var k in result){
							if(result[k].isDefault=='1'){
								this.defaultAddr = result[k]
								break
							}
						}

						//如果长度大于0且无默认收货地址，则默认选第一个做默认收货地址
						if(this.isEmptyObject(this.defaultAddr)){

							this.defaultAddr = result[0]
						}
						//绑定已选中的id
						this.isCheckId = this.defaultAddr.addressId
					}

					//如果存在默认地址，则将默认地址的id写进订单
					if(!this.isEmptyObject(this.defaultAddr)){
						this.orderInfo.putAddrWay =1
						this.orderInfo.addrId = this.isCheckId
					}else{
						this.orderInfo.putAddrWay =2
					}
					// isDefault

					this.show = true
				}, (response) => {

				})

			}
		},
		components:{
			// Loading

		},
		mounted() {
			this.init()

			store.commit('closeLoading')


		}
	}
</script>
