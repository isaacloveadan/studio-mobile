<template>
<div id="TcPlayer"></div>
</template>


<script>

	export default {

		name: 'player',
		props:['room'],
		data() {

			return {
				
			}

		},
		components: {
		
		},
		methods: {

		},
		mounted(){

			this.$nextTick(function(){
				var self =this
				var width = document.body.offsetWidth
				document.getElementById('TcPlayer').style.height = width*9/16+'px'
				function callback(params) {
					var option={
							"m3u8": self.room.hls_downstream_address||"http://playertest.longtailvideo.com/adaptive/bipbop/gear4/prog_index.m3u8",
							"autoplay" : false,      //iOS下safari浏览器是不开放这个能力的
							"coverpic" : self.room.logo_url||"http://live.icloudinn.com/img3/logo.png",
							"width" :  width,//视频的显示宽度，请尽量使用视频分辨率宽度
							"height" : width*9/16//视频的显示高度，请尽量使用视频分辨率高度
						}
					var player = new TcPlayer('TcPlayer',option)
				}
				var head= document.getElementsByTagName('head')[0]; 
				var script= document.createElement('script'); 
				script.type= 'text/javascript'; 
				script.onreadystatechange= function () { 
				if (this.readyState == 'complete') 
					callback(); 
				} 
				script.onload= function(){ 
					callback(); 
				} 
				script.src= '//imgcache.qq.com/open/qcloud/video/vcplayer/TcPlayer.js'; 
				head.appendChild(script); 
				
			})
		}
	}
</script>

<style lang="less">
#TcPlayer{
	width: 100%;
	min-height: 200px;
}


</style>