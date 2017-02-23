<?php

	header("Content-type:text/html;charset=utf-8");
	$appid = "wx7c5d202b6c5c830f";
	$secret = "eb1cb2dcb4f6d7628c12cf261a8bd7de";
	$code = $_GET["code"];
	
	$url = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=$appid&secret=$secret";
	$token = getJson($url);
	
	//第二步:取得openid
	$oauth2Url = "https://api.weixin.qq.com/sns/oauth2/access_token?appid=$appid&secret=$secret&code=$code&grant_type=authorization_code";
	$oauth2 = getJson($oauth2Url);

	//第三步:根据全局access_token和openid查询用户信息
	$access_token = $token["access_token"];
	$openid = $oauth2['openid'];

	$get_user_info_url = "https://api.weixin.qq.com/cgi-bin/user/info?access_token=$access_token&openid=$openid&lang=zh_CN";
	$userinfo = getJson($get_user_info_url);
	
	//打印用户信息
	echo json_encode($userinfo);
	
	function getJson($url) {
		$ch = curl_init();
		curl_setopt($ch, CURLOPT_URL, $url);
		curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);
		curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, FALSE);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
		$output = curl_exec($ch);
		curl_close($ch);
		return json_decode($output, true);
	}
	
	function replace_emoji($str) {
		$tmpStr = json_encode($str);
		//暴露出unicode
		$tmpStr = preg_replace("#(\ue[0-9a-f]{3})#ie", "", $tmpStr);
		//将emoji的unicode留下，其他不动
		$new_str = json_decode($tmpStr);
		return $new_str;
	}
	
	function filterEmoji($str) {
		$str = preg_replace_callback('/./u', function(array $match) {
			return strlen($match[0]) >= 4 ? '' : $match[0];
		}, $str);
	
		$tmpStr = json_encode($str);
		//暴露出unicode
		$str = json_decode($tmpStr);
		return $str;
	}
	
	function zifu($str) {
		$tmpStr = json_encode($str);
		//暴露出unicode
		$new_str = json_decode($tmpStr);
		return $new_str;
	}
	
	function zifu2($str) {
		$tmpStr = json_encode($str);
		//暴露出unicode
		$new_str = json_decode($tmpStr);
		return $new_str;
	}
	
	function wx_get_token() {
		$token = S('access_token');
		if (!$token) {
			$res = file_get_contents('https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=' . '你的AppID' . '&secret=' . '你的AppSecret');
			$res = json_decode($res, true);
			$token = $res['access_token'];
			// 注意：这里需要将获取到的token缓存起来（或写到数据库中）
			// 不能频繁的访问https://api.weixin.qq.com/cgi-bin/token，每日有次数限制
			// 通过此接口返回的token的有效期目前为2小时。令牌失效后，JS-SDK也就不能用了。
			// 因此，这里将token值缓存1小时，比2小时小。缓存失效后，再从接口获取新的token，这样
			// 就可以避免token失效。
			// S()是ThinkPhp的缓存函数，如果使用的是不ThinkPhp框架，可以使用你的缓存函数，或使用数据库来保存。
			S('access_token', $token, 3600);
		}
		return $token;
	}
?>