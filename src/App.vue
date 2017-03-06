<template>
	<div id="wrap">
		<router-view></router-view>
		<loading v-if="isLoading.show" :text="isLoading.text" ></loading>
	</div>
</template>

<script>
	import loading from 'plugin/loading.vue'
	import store from 'store'
	export default {
		name: 'yunshang',
		store,
		data() {
			return {
				isLoading:store.getters.getLoading
			}
		},
		computed:{

		},
		methods: {
			
		},
		mounted() {
			$('#wrap').height($(window).height()-10)
			$('#wrap').css('overflow','hidden')
		},
		components:{
			loading
		}
	}
</script>

<style lang="less">
	@import './assets/app.less';
</style>