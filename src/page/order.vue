<template>
<div>
    感谢支付
    {{$route.params.orderId}}
</div>
</template>

<script>
export default {
	name: 'order',
	data() {

		return {

		}

	},
	methods: {
		init:function(){
			// var url = ''
			// this.$http.get()
			
		}
	},
	mounted(){
		this.init()
	}
}
</script>

<style lang="less">

</style>