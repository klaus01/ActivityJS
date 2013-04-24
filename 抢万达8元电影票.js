/*
	抢万达电影票
	http://www.wandafilm.com/christmasSecondSkill.do?m=getPreSuccessUsers
	
	使用方法：
	1、登录万达网站http://www.wandafilm.com/，登录时最好选中自动登录。
	2、设置好代码中的抢票影院ID。
	3、打开上面的活动页面，等抢票时间还有几秒中的时候执行下面的JS代码。

	财富广场店=305
	SM广场店=306
	锦华万达广场店=307
	金沙广场店=318
	红牌楼广场店=348
	新都和顺广场店=831
	金牛万达广场店=834
*/
var vCinemaId = 307;//<--根据上面的影院列表设置你要抢的影院ID
const C_SUCCESS_MSG = "00";
var vInterval = setInterval(function(){
	$.ajax({type:"POST", 
		url:basePath+"christmasSecondSkill.do?",
		data:"m=goSkill&cinemaId=" + vCinemaId + "&sid=" + Math.random(),
		dataType:"text",
		timeout:30000,
		error:function (XMLHttpRequest, textStatus, errorThrown) {},
		success:function (msg) {
			if (msg == C_SUCCESS_MSG)
			{
				window.clearInterval(vInterval);
				$("#cinema_wrapper2").children("#" + C_SUCCESS_MSG).show().siblings("div,ul").hide();
				$("#ts_tip").click();
			}
			else
				console.log($("#cinema_wrapper2").children("#" + msg).text());
		}, 
		complete:function (XMLHttpRequest, textStatus) {}
	});
}, 500);
