// 获取Url参数值
function getUrlParam(a) {
    var b, c, d = location.search.substring(1), e = d.split("&");
    if (null != e) for (b = 0; b < e.length; b++) if (c = e[b].split("="), c[0] == a) return decodeURI(c[1]);
    return null;
}
// 显示日志
function myLog(a) {
    var b = new Date().toLocaleString();
    gLogObj.innerHTML = b + "  " + a + "\r\n" + gLogObj.innerHTML;
}
// 刷新医生排班信息
function RefreshPBInfo() {
    $.ajax({
        url:"Action/GetTheArrange.ashx",
        data:{
            d:new Date().getTime(),
            hosid:C_hosid,
            deptid:C_deptid,
            docid:C_docid
        },
        success:function(a) {
            var b = '<a [^>]*id="a_' + C_hosid + '_([^"]*)[^>]*">' + gGHDate.value, c = new RegExp(b), d = a.match(c);
            null != d ? (gWorkID = d[1], myLog("找到日期了，workid=" + gWorkID), Registered(), setInterval(function() {
                Registered();
            }, 1e3), window.clearInterval(gRefreshPBInterval)) :myLog("没找到指定日期" + b);
        }
    });
}
// 预约挂号
function Registered() {
    return null == gCardInfoJson ? (myLog("就诊卡信息为空"), void 0) :($.ajax({
        url:"Action/Reg_SC.ashx",
        data:{
            d:new Date().getTime(),
            HosNo:C_hosid,
            workId:gWorkID,
            name:gCardInfoJson.UserName,
            sex:gCardInfoJson.UserSex,
            tel:gCardInfoJson.UserTel,
            address:gCardInfoJson.UserAddress,
            IdCard:gCardInfoJson.UserIdCard,
            age:gCardInfoJson.UserAge,
            HospitalCard:gCardInfoJson.UserCode,
            SendPhone:gCardInfoJson.UserTel,
            deptName:C_deptid,
            doctorName:C_docid,
            dutyDate:gGHDate.value,
            cardNo:0,
            dutyTime:1,
            rbTime:0,
            codevalue:$.cookie('CheckRegCode'),
            excode:gCardInfoJson.code,
            useridkey:gCardInfoJson.useridkey
        },
        success:function(a) {
            var b = $.parseJSON(a);
            if (b) {
                if (-1 == b.success) return myLog("验证码错误！"), void 0;
                1 == b.success ? window.location.href = "success_SC.aspx?json=" + a :myLog("预约失败！" + b._errorMsg);
            }
        }
    }), void 0);
}

var gWorkID = "", gCardInfoJson = null, gRefreshPBInterval = null;
//医院ID、科室名称、医生名称
const C_hosid = getUrlParam("hosid"), C_deptid = getUrlParam("deptid"), C_docid = getUrlParam("docid");
//预约日期输入框
var gGHDate = document.createElement("input");
gGHDate.type = "text";
gGHDate.value = "2014-11-27";
document.body.appendChild(gGHDate);
//就诊卡号输入框。测试号：0001881318 张秀清
var gHosCard = document.createElement("input");
gHosCard.type = "text";
gHosCard.value = "0001881318";
document.body.appendChild(gHosCard);
//开始预约按钮
var gBtnExecJS = document.createElement("input");
gBtnExecJS.type = "button";
gBtnExecJS.value = "开始预约";
gBtnExecJS.onclick = function() {
    $.ajax({
        url:"Action/Valid_SC.ashx",
        data:{
            d:new Date().getTime(),
            hosNo:C_hosid,
            hosCard:gHosCard.value
        },
        success:function(a) {
            myLog("就诊卡信息获取完成" + a), gCardInfoJson = $.parseJSON(a);
        }
    }), gRefreshPBInterval = setInterval(function() {
        RefreshPBInfo();
    }, 5e3);
};
document.body.appendChild(gBtnExecJS);
//日志显示框
var gLogObj = document.createElement("textarea");
gLogObj.style.width = "700px", gLogObj.style.height = "300px", document.body.appendChild(gLogObj), 
scroll(0, document.body.scrollHeight);
