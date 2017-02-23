<template>
	<!-- 游玩路线栏目和景区介绍 -->
<div class="show_box" v-html="propsMenu.show">

</div>
</template>

<script>

	export default {
		name: 'show',
		props:['propsMenu'],
		data() {

			return {

			}

		},
		components: {

		},
		methods: {

		},
		mounted(){

		}
	}
</script>

<style lang="less">

</style>
