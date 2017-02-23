<template>
	<!-- 边看边聊栏目 -->
<div class="communit_box">
	<iframe v-if="roomInfo.load" id="communit_iframe"  name="communit" src="./static/communit_dev.html?v=2"  frameborder="0" scrolling="no"></iframe>
	<!--<div v-else>
		聊天框走丢了
	</div>-->
</div>
</template>

<script>
	import store from 'store'
	export default {
		name: 'communit',
		props:['room'],
		data() {

			return {
				roomInfo:store.getters.getRoom
			}

		},
		computed:{

		},
		components: {

		},
		methods: {

		},
		mounted(){
			//这行代码好重要。。。如果没有就不显示聊天框了
			if(!this.room.channel_id){
				roomInfo.load = false
			}
			window.channel_id =this.room.channel_id


		}
	}
</script>

<style lang="less">
.open_Communit_Box{
	width: 100%;
	padding: 10px;
	box-sizing: border-box;
	position: absolute;
	bottom: 0;
}
.open_Communit{
	font-size: 16px;
	width: 100%;
	height: 40px;
	line-height: 40px;
	color: white;
	background: #09bb07;
	border: 0;
	border-radius: 6px;
	/*box-sizing: border-box;*/
}
</style>
