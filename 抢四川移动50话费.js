/*
	移动抢50话费活动地址
	http://www.sc.10086.cn/giveMoeny.do?dispatch=index
	
	方法：Firefox打开上面的网址，登录，登录后回到活动页面在浏览器Firebug插件中执行此脚本所有代码。之后只需要不停的输入验证码及可。
*/

// 保持登录状态代码
setInterval(function(){
	$.get("http://www.sc.10086.cn/pageViewAction.do?dispatch=businessPvUv&businessName=5000&url=scMobile");
}, 30000);

// 验证码文本框自动提交代码
document.getElementById("fakecode").onkeyup = function(){
	var fakecodeObj = document.getElementById("fakecode");
	if (fakecodeObj.value.length != 4) return;
	$.post("/giveMoeny.do?dispatch=insUser",{fakecode: fakecodeObj.value,value:'网厅缴费最优惠'},function(text){
		show(document.getElementById('txtVcode'));
		document.getElementById("value").value = text;
		console.log(text);
		if(text=="6000"){
			console.log("尊敬的用户,请输入正确的验证!");
			return;
		}if(text=="ture"){
			console.log("尊敬的用户,活动尚未开始!");
			return;
		}else if(text.indexOf('false')!=-1){
			console.log("尊敬的用户,已经抢购完!");
			document.getElementById("msText").innerHTML="已抢完...";
			return;
		}if(text=="notLogin"){
			if(confirm("尊敬的客户,您还没有登录,是否立即登录!")){
				top.location.href='/service/index.jsp?type=334'
			}
			return;
		}else if(text=="5000"){
			console.log("尊敬的用户,幸运码输入有误!");
			return;
		}else if(text=="week"){
			console.log("尊敬的用户,节假日活动未开展!");
			return;
		}else if(text=="day"||text=="notTime"){
			console.log("尊敬的用户,活动尚未开始!");
			return;
		}else if(text.indexOf("notNum")!=-1){
			var strArr = /(.*[^\d])(\d+)$/.exec(text);
			document.getElementById("msText").innerHTML="活动进行中...";
			console.log("很抱歉，您未能抢到话费，请继续加油哦！");
			return;
		}else if(text.indexOf("yeah")!=-1){
			alert("抢到了");
			return;
		}else if(text=="error"){
			console.log("尊敬的用户,未抢购成功!");
			return;
		}else if(text=="no"){
			console.log('尊敬的用户,未抢购成功!');
			return;
		}else if(text=="repeat"){
			console.log("很抱歉,活动期间,每个手机号码只能参加一次该活动!");
			return;
		}
	});
	document.getElementById('fakecode').value="";
};
