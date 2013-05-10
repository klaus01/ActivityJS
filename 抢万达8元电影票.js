/*
	抢万达电影票
	http://www.wandafilm.com/christmasSecondSkill.do?m=getPreSuccessUsers
	
	使用方法：
	1、校对本机时间与北京时间一致。http://open.baidu.com/special/time/
	2、登录万达网站http://www.wandafilm.com/，登录时最好选中自动登录。
	3、设置好代码中的 抢票影院ID 和 抢票时间点。
	4、打开活动页面http://www.wandafilm.com/christmasSecondSkill.do?m=getPreSuccessUsers，运行代码。

	财富广场店		= 305
	SM广场店		= 306
	锦华万达广场店	= 307
	金沙广场店		= 318
	红牌楼广场店	= 348
	新都和顺广场店	= 831
	金牛万达广场店	= 834
*/
const C_CINEMA_ID = 307;//<--根据上面的影院列表设置你要抢的影院ID
const C_BEGIN_HOURS = 10;//<--抢票时间点 小时（24小时制）
const C_SUCCESS_MSG = "00";
const C_ERROR_NOTLOGIN = "05"
function newQiangPiao() {
	$("#sel_cinema").text($("#" + C_CINEMA_ID).text());
	selCityCode = "4905168908";
	var qp_success = false;
	$.ajax({type:"POST", 
		url:basePath+"christmasSecondSkill.do?",
		data:"m=goSkill&cinemaId=" + C_CINEMA_ID + "&sid=" + Math.random(),
		dataType:"text",
		timeout:10000,
		error:function (XMLHttpRequest, textStatus, errorThrown) {},
		success:function (msg) {
			if (msg == C_SUCCESS_MSG)
			{
				$("#cinema_wrapper2").children("#" + C_SUCCESS_MSG).show().siblings("div,ul").hide();
				$("#ts_tip").click();
			}
			else if (msg == C_ERROR_NOTLOGIN)
				alert("没登录，快点去登录");
			else
			{
				console.log($("#cinema_wrapper2").children("#" + msg).text());
				newQiangPiao();
			}
		}, 
		complete:function (XMLHttpRequest, textStatus) {}
	});
}

var vInterval = setInterval(function(){
	var d1 = new Date();
	var d2 = new Date();
	d2.setHours(C_BEGIN_HOURS);
	d2.setMinutes(0);
	d2.setSeconds(0);
	d2.setTime(d2.getTime() - 2000);
	if (d1 > d2)
	{
		window.clearInterval(vInterval);
		console.log("时间到了");
		newQiangPiao();
	}
	else
		console.log("时间没到");
}, 1000);
