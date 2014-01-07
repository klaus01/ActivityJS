/* 查看验证码


document.getElementById("img1");


*/


const C_VerificationCode 	= "5041"; 					//验证码
const C_GHDate 				= "2014-02-11"; 			//预约日期
const C_hosCard 			= "0001881321"; 			//就诊卡号

// 获取Url参数值
function getUrlParam(paramName) {
	var urlParamsStr = location.search.substring(1);
	var pararmArray = urlParamsStr.split("&");
	if (pararmArray != null)
		for (var i = 0; i < pararmArray.length; i++) {
			var p1Array = pararmArray[i].split("=");
			if (p1Array[0] == paramName)
				return decodeURI(p1Array[1]);
		}
	 return null;
}

const C_hosid  = getUrlParam("hosid");//医院ID
const C_deptid = getUrlParam("deptid");//科室名称
const C_docid  = getUrlParam("docid");//医生名称

var gWorkID = "";
var gCardInfoJson = null;
var gRefreshPBInterval = null;

// 取就诊卡信息
$.ajax({
    url: "Action/Valid_SC.ashx",
    data: {
        "d": new Date().getTime(),
        "hosNo": C_hosid,
        "hosCard": C_hosCard
    },
    success: function(htmlstr) {
        console.log("就诊卡信息获取完成" + htmlstr);
        gCardInfoJson = $.parseJSON(htmlstr);
    }
});

// 刷新医生排班信息
function RefreshPBInfo() {
    $.ajax({
        url: "Action/GetTheArrange.ashx",
        data: {
            "d": new Date().getTime(),
            "hosid": C_hosid,
            "deptid": C_deptid,
            "docid": C_docid
        },
        success: function(htmlstr) {
            //console.log(htmlstr);
            var regStr = '<a [^>]*id="a_' + C_hosid + '_([^"]*)[^>]*">' + C_GHDate;
            var reg = new RegExp(regStr);
            var r = htmlstr.match(reg);
            if (r != null) {
                gWorkID = r[1];
                console.log("找到日期了，workid=" + gWorkID);
                
                Registered();
                setInterval(function() {
                    Registered();
                },
                1000);
                
                window.clearInterval(gRefreshPBInterval);
            }
            else console.log("没找到指定日期" + regStr);
        }
    });
}
gRefreshPBInterval = setInterval(function() {
    RefreshPBInfo()
},
2000);

// 预约挂号
function Registered() {
    if (gCardInfoJson == null) {
        console.log("就诊卡信息为空");
        return;
    }
    $.ajax({
        url: "Action/Reg_SC.ashx",
        data: {
            "d": new Date().getTime(),
            "HosNo": C_hosid,
            "workId": gWorkID,
            "name": gCardInfoJson.UserName,
            "sex": gCardInfoJson.UserSex,
            "tel": gCardInfoJson.UserTel,
            "address": gCardInfoJson.UserAddress,
            "IdCard": gCardInfoJson.UserIdCard,
            "age": gCardInfoJson.UserAge,
            "HospitalCard": gCardInfoJson.UserCode,
            "SendPhone": gCardInfoJson.UserTel,
            "deptName": C_deptid,
            "doctorName": C_docid,
            "dutyDate": C_GHDate,
            "cardNo": 0,
            "dutyTime": 1,
            "rbTime": 0,
            "codevalue": C_VerificationCode,
            "excode": gCardInfoJson.code,
            "useridkey": gCardInfoJson.useridkey
        },
        success: function(htmlstr) {
            var jsons = $.parseJSON(htmlstr);
            if (jsons) {
                if (jsons.success == -1) {
                    console.log("验证码错误！");
                    return;
                }
                if (jsons.success == 1)
                	window.location.href = "success_SC.aspx?json=" + htmlstr;
                else
                	console.log('预约失败！' + jsons._errorMsg);
            }
        }
    });
}
