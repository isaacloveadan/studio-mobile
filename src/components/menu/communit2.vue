<template>
<div class="communit_box">
	231231
	<div id="communit_iframe">
		
<!--聊天部分 start-->

		<div class="video-discuss">
			<ul class="video-sms-list" id="video_sms_list">


			</ul>
			<div class="video-discuss-pane">
				<div class="video-discuss-tool" id="video-discuss-tool">
					<!--<span class="like-icon zoomIn green"></span>-->
					<a href="javascript:void(0);" class="video-discuss-sms" onclick="smsPicClick()"></a>

					<a href="javascript:void(0);" class="video-discuss-like" onclick="sendGroupLoveMsg()"></a>
				</div>
				<div class="video-discuss-form" id="video-discuss-form" style="display: none">
					<input type="text" class="video-discuss-input" id="send_msg_text">
					<a href="javascript:void(0);" class="video-discuss-face" onclick="showEmotionDialog()"></a>
					<button class="video-discuss-button" onclick="onSendMsg()">发送</button>
				</div>
				<div class="video-discuss-emotion" id="video-discuss-emotion" style="display: none">
					<div class="video-emotion-pane">
						<ul id="emotionUL">
						</ul>
					</div>
				</div>
			</div>
		</div>

<!--聊天部分 end-->
	</div>
	
</div>
</template>

<script>

// 引入webim sdk
// require('static/js/jquery-2.1.4.min.js')
require('static/sdk/webim.js')
require('static/sdk/json2.js')
// webim demo js

require('static/js/demo_base.js')
require('static/js/demo_group_notice.js')

	export default {
		name: 'communit',
		props:['propsMenu','room'],
		data() {

			return {
			
			}

		},
		computed:{
			
		},
		components: {
			
		},
		methods: {
			init:function(){

				// console.log(webim)
				//当前用户身份
				window.loginInfo = {
					'sdkAppID': null, //用户所属应用id,必填
					'appIDAt3rd': null, //用户所属应用id，必填
					'accountType': null, //用户所属应用帐号类型，必填
					'identifier': null, //当前用户ID,必须是否字符串类型，选填
					'identifierNick': JSON.parse(sessionStorage.getItem('usrInfo')).username||'89757', //当前用户昵称，选填
					'userSig': null, //当前用户身份凭证，必须是字符串类型，选填
					'headurl': 'img/2016.gif' //当前用户默认头像，选填
				};

				//监听事件
				var listeners = {
					"onConnNotify": onConnNotify, //选填
					"jsonpCallback": jsonpCallback, //IE9(含)以下浏览器用到的jsonp回调函数,移动端可不填，pc端必填
					"onBigGroupMsgNotify": onBigGroupMsgNotify, //监听新消息(大群)事件，必填
					"onMsgNotify": onMsgNotify, //监听新消息(私聊(包括普通消息和全员推送消息)，普通群(非直播聊天室)消息)事件，必填
					"onGroupSystemNotifys": onGroupSystemNotifys, //监听（多终端同步）群系统消息事件，必填
					"onGroupInfoChangeNotify": onGroupInfoChangeNotify//监听群资料变化事件，选填
				};

				//监听连接状态回调变化事件
				var onConnNotify = function(resp) {
					switch(resp.ErrorCode) {
						case webim.CONNECTION_STATUS.ON:
							//webim.Log.warn('连接状态正常...');
							break;
						case webim.CONNECTION_STATUS.OFF:
							webim.Log.warn('连接已断开，无法收到新消息，请检查下你的网络是否正常');
							break;
						default:
							webim.Log.error('未知连接状态,status=' + resp.ErrorCode);
							break;
					}
				};

				//监听大群新消息（普通，点赞，提示，红包）
				function onBigGroupMsgNotify(msgList) {
					for (var i = msgList.length - 1; i >= 0; i--) {//遍历消息，按照时间从后往前
						var msg = msgList[i];
						webim.Log.warn('receive a new group msg: ' + msg.getFromAccountNick());
						//显示收到的消息
						showMsg(msg);
					}
				}

				//监听新消息(私聊(包括普通消息、全员推送消息)，普通群(非直播聊天室)消息)事件
				//newMsgList 为新消息数组，结构为[Msg]
				function onMsgNotify(newMsgList) {
					var newMsg;
					for (var j in newMsgList) {//遍历新消息
						newMsg = newMsgList[j];
						handlderMsg(newMsg);//处理新消息
					}
				}

				function handlderMsg(msg) {
					var fromAccount, fromAccountNick, sessType, subType,contentHtml;

					fromAccount = msg.getFromAccount();
					if (!fromAccount) {
						fromAccount = '';
					}
					fromAccountNick = msg.getFromAccountNick();
					if (!fromAccountNick) {
						fromAccountNick = fromAccount;
					}

					//解析消息
					//获取会话类型
					//webim.SESSION_TYPE.GROUP-群聊，
					//webim.SESSION_TYPE.C2C-私聊，
					sessType = msg.getSession().type();
					//获取消息子类型
					//会话类型为群聊时，子类型为：webim.GROUP_MSG_SUB_TYPE
					//会话类型为私聊时，子类型为：webim.C2C_MSG_SUB_TYPE
					subType = msg.getSubType();

					switch (sessType) {
						case webim.SESSION_TYPE.C2C://私聊消息
							switch (subType) {
								case webim.C2C_MSG_SUB_TYPE.COMMON://c2c普通消息
									//业务可以根据发送者帐号fromAccount是否为app管理员帐号，来判断c2c消息是否为全员推送消息，还是普通好友消息
									//或者业务在发送全员推送消息时，发送自定义类型(webim.MSG_ELEMENT_TYPE.CUSTOM,即TIMCustomElem)的消息，在里面增加一个字段来标识消息是否为推送消息
									contentHtml = convertMsgtoHtml(msg);
									webim.Log.warn('receive a new c2c msg: fromAccountNick=' + fromAccountNick+", content="+contentHtml);
									//c2c消息一定要调用已读上报接口
									var opts={
										'To_Account':fromAccount,//好友帐号
										'LastedMsgTime':msg.getTime()//消息时间戳
									};
									webim.c2CMsgReaded(opts);
									alert('收到一条c2c消息(好友消息或者全员推送消息): 发送人=' + fromAccountNick+", 内容="+contentHtml);
									break;
							}
							break;
						case webim.SESSION_TYPE.GROUP://普通群消息，对于直播聊天室场景，不需要作处理
							break;
					}
				}

				//监听（多终端同步）群系统消息方法，方法都定义在demo_group_notice.js文件中
				//注意每个数字代表的含义，比如，
				//1表示监听申请加群消息，2表示监听申请加群被同意消息，3表示监听申请加群被拒绝消息等
				window.onGroupSystemNotifys = {
					//"1": onApplyJoinGroupRequestNotify, //申请加群请求（只有管理员会收到,暂不支持）
					//"2": onApplyJoinGroupAcceptNotify, //申请加群被同意（只有申请人能够收到,暂不支持）
					//"3": onApplyJoinGroupRefuseNotify, //申请加群被拒绝（只有申请人能够收到,暂不支持）
					//"4": onKickedGroupNotify, //被管理员踢出群(只有被踢者接收到,暂不支持)
					"5": onDestoryGroupNotify, //群被解散(全员接收)
					//"6": onCreateGroupNotify, //创建群(创建者接收,暂不支持)
					//"7": onInvitedJoinGroupNotify, //邀请加群(被邀请者接收,暂不支持)
					//"8": onQuitGroupNotify, //主动退群(主动退出者接收,暂不支持)
					//"9": onSetedGroupAdminNotify, //设置管理员(被设置者接收,暂不支持)
					//"10": onCanceledGroupAdminNotify, //取消管理员(被取消者接收,暂不支持)
					"11": onRevokeGroupNotify, //群已被回收(全员接收)
					"255": onCustomGroupNotify//用户自定义通知(默认全员接收)
				};

				//监听 群资料变化 群提示消息
				function onGroupInfoChangeNotify(groupInfo) {
					webim.Log.warn("执行 群资料变化 回调： " + JSON.stringify(groupInfo));
					var groupId = groupInfo.GroupId;
					var newFaceUrl = groupInfo.GroupFaceUrl;//新群组图标, 为空，则表示没有变化
					var newName = groupInfo.GroupName;//新群名称, 为空，则表示没有变化
					var newOwner = groupInfo.OwnerAccount;//新的群主id, 为空，则表示没有变化
					var newNotification = groupInfo.GroupNotification;//新的群公告, 为空，则表示没有变化
					var newIntroduction = groupInfo.GroupIntroduction;//新的群简介, 为空，则表示没有变化

					if (newName) {
						//更新群组列表的群名称
						//To do
						webim.Log.warn("群id=" + groupId + "的新名称为：" + newName);
					}
				}

				//从commnuite.vue中获取winodw.channel_Id
				var avChatRoomId = channel_id; //默认房间群ID，群类型必须是直播聊天室（AVChatRoom），这个为官方测试ID(托管模式)
				var selType = webim.SESSION_TYPE.GROUP;
				var selToID = avChatRoomId; //当前选中聊天id（当聊天类型为私聊时，该值为好友帐号，否则为群号）
				var selSess = null; //当前聊天会话
			
				// //默认群组头像(选填)
				var selSessHeadUrl = 'img/2017.jpg'

				//其他对象，选填
				window.options = {}
			
				window.curPlayAudio = null; //当前正在播放的audio对象
				window.openEmotionFlag = false; //是否打开过表情
			
				
				

				var identifier = JSON.parse(sessionStorage.getItem('usrInfo')).username||parent.sessionStorage.getItem('account');
				var url = "http://saas.icloudinn.com/api/v1/consumer/imsig?access-token="+parent.sessionStorage.getItem('token');

				//未获取userSig则获取,分多个存，如果哪个变量被我手贱弄烂了。这样就会提示了，如果统一用一个字符串，会太坑爹了
					if(!sessionStorage.getItem('userSig')||!sessionStorage.getItem('sdkAppID')||!sessionStorage.getItem('appIDAt3rd')||!sessionStorage.getItem('accountType')||!sessionStorage.getItem('identifier')){
						
						this.$http.post(url,{account:identifier}).then((response)=>{
							if(response.body.code!=100||response.body.msg!='success')return
							if(!response.body.data.imsig){
								alert('获取im签名失败');
								return
							}
							loginInfo.sdkAppID = response.body.data.sdkAppID
							loginInfo.appIDAt3rd = response.body.data.sdkAppID
							loginInfo.accountType = response.body.data.accountType
							loginInfo.userSig = response.body.data.imsig
							loginInfo.identifier =identifier
							
							sessionStorage.setItem('userSig', response.body.data.imsig)//备用
							sessionStorage.setItem('sdkAppID', response.body.data.sdkAppID)//备用
							sessionStorage.setItem('appIDAt3rd',response.body.data.sdkAppID)//备用
							sessionStorage.setItem('accountType', response.body.data.accountType)//备用
							sdkLogin()	
						},(response)=>{
							alert(response.body)
						})
						
					}else{
						loginInfo.sdkAppID = sessionStorage.getItem('sdkAppID')
						loginInfo.appIDAt3rd = sessionStorage.getItem('sdkAppID')
						loginInfo.accountType = sessionStorage.getItem('accountType')
						loginInfo.userSig = sessionStorage.getItem('userSig')
						loginInfo.identifier =identifier
						sdkLogin()

					}
			}
		},
		mounted(){
			window.channel_id =this.room.channel_id
			this.init()
			
			
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