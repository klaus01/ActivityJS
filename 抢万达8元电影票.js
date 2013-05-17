/*
	抢万达电影票
	http://www.wandafilm.com/christmasSecondSkill.do?m=getPreSuccessUsers
	
	使用方法：
	1、打开万达网站http://www.wandafilm.com/，登录你的万达账号，登录时选中自动登录。
	2、设置好代码中的 抢票影院ID 和 抢票时间点。
	3、打开活动页面http://www.wandafilm.com/christmasSecondSkill.do?m=getPreSuccessUsers，运行代码，之后就不用管了，到点后自动抢票。
	注意：一个账号一天只能抢一次，不管你有没有抢到。
*/


/*
	财富广场店		= 305
	SM广场店		= 306
	锦华万达广场店	= 307
	金沙广场店		= 318
	红牌楼广场店	= 348
	新都和顺广场店	= 831
	金牛万达广场店	= 834
*/
const C_CINEMA_ID = 834;//<--根据上面的影院列表设置你要抢的影院ID
const C_BEGIN_HOURS = 12;//<--抢票时间点 小时（24小时制，现在有三个时间点10、12、14）
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
function GetServerTime() {
	var http = new XMLHttpRequest;
	http.open("HEAD", ".", false);
	http.send(null);
	return new Date(http.getResponseHeader("Date"));
}

var gBeginTime = new Date();
	gBeginTime.setHours(C_BEGIN_HOURS);
	gBeginTime.setMinutes(0);
	gBeginTime.setSeconds(0);
	gBeginTime.setTime(gBeginTime.getTime() - 7000);

var gBT = new Date();
var gServerTime = GetServerTime();
var gET = new Date();
	gServerTime.setTime(gServerTime.getTime() + (gET.getTime() - gBT.getTime()));

var vInterval = setInterval(function(){
	gServerTime.setTime(gServerTime.getTime() + 1000);
	if (gServerTime >= gBeginTime)
	{
		newQiangPiao();
		window.clearInterval(vInterval);
		console.log("时间到了");
	}
	else
		console.log("时间没到");
}, 1000);
