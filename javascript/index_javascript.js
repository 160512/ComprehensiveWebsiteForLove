var bOnlyRun = false;//单词循环bool变量
//循环函数
var fnCyclical = setTimeout(cyclicalFunction, 1000);//设定定时器，开始执行
function cyclicalFunction() {//循环函数
    clearTimeout(fnCyclical);//清除定时器
    var oNowDate = new Date();//获取当前时间
    setHtmlHaderTime(oNowDate);//设置顶部时间
    fnCyclical = setTimeout(cyclicalFunction, 1000);//设定定时器，循环执行
}
//设置顶部时间
function setHtmlHaderTime(oNowDate) {
    var iNowYear = oNowDate.getYear() + 1900;//获取年份
    var iNowMonth = oNowDate.getMonth() + 1;//获取月份
    var iNowDay = oNowDate.getDate();//获取日期
    var aWeekday = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];//创建星期数组
    var iNowWeek = oNowDate.getDay();//获取星期数
    var anyNowHour = oNowDate.getHours();//获取小时
    var anyNowMinute = oNowDate.getMinutes();//获取分钟
    var anyNowSecond = oNowDate.getSeconds();//获取秒

    //格式化时间
    if (anyNowHour < 10) {
        anyNowHour = '0' + anyNowHour;
    }
    if (anyNowMinute < 10) {
        anyNowMinute = '0' + anyNowHour;
    }
    if (anyNowSecond < 10) {
        anyNowSecond = '0' + anyNowSecond;
    }

    //输出信息
    $('.time').text('当前时间' + iNowYear + '年' + iNowMonth + '月' + iNowDay + '日' + aWeekday[iNowWeek] + ' ' + anyNowHour + ':' + anyNowMinute + ':' + anyNowSecond);
}
//设置当前周次
$(document).ready(function setHtmlHaderWeek() {
    iCutWeeks = getStudyWeeks();
    if(isNaN(iCutWeeks) == true) {
        $('.week').text('假期中');
    }else{
        $('.week').text('本学期第' + iCutWeeks + '周');
    }
});

//获取当前学期周次
function getStudyWeeks() {
    var oNowDate = new Date();
    var oStartDate = isTimeInTheSemester().oStartDate;//学期起始时间
    var oCutDate = oNowDate - oStartDate;//实际日期差
    var iCutDay = Math.floor(oCutDate / (3600 * 24 * 1000));//转换天数
    var iCutWeeks = parseInt(iCutDay / 7) + 1;//计算差日期
    return iCutWeeks;
}

//判断是否在学期内并返回学期期间
function isTimeInTheSemester() {
    var oNowDate = new Date();
    var oFirstSemesterStartDate = new Date(2019, 7, 26);//第一学期开始时间20190826
    var oFirstSemesterEndDate = new Date(2020, 0, 5);//第一学期结束时间20200105
    var oSecondSemesterStartDate = new Date(2020, 1, 17);//第二学期开始时间20200217
    var oSecondSemesterEndDate = new Date(2020, 6, 5);//第二学期结束时间20200705
    
    if (oFirstSemesterStartDate <= oNowDate && oNowDate <= oFirstSemesterEndDate) {//当前时间在冬季时间
        var oReturnDateObject = { iSemester: 1, oStartDate: oFirstSemesterStartDate, oEndDate: oFirstSemesterEndDate };
        console.log(oReturnDateObject);
        return oReturnDateObject;//返回第一学期时间
    } else if (oSecondSemesterStartDate <= oNowDate && oNowDate <= oSecondSemesterEndDate) {//当前在夏季时间
        var oReturnDateObject = { iSemester: 2, oStartDate: oSecondSemesterStartDate, oEndDate: oSecondSemesterEndDate };
        console.log(oReturnDateObject);
        return oReturnDateObject;//返回第二学期时间
    } else {//不处于学期内
        var oReturnDateObject = { iSemester: null, StartDate: null, EndDate: null };
        console.log(oReturnDateObject);
        return oReturnDateObject;
    }
}
//加载课程表
$(document).ready(function loadCurriculumXML() {
    var iTimeFadeIn = 1000;
    var iCutWeeks = getStudyWeeks();
    if (iCutWeeks % 2 == 0) {
        bDoubleWeek = true;
    } else {
        bDoubleWeek = false;
    }
    $.ajax({
        url: 'https://160512.github.io/ComprehensiveWebsiteForLove/xml/Curriculum.xml',//发送请求的地址
        dataType: 'xml',//预期服务器返回的数据类型
        type: 'GET', //请求方式
        timeout: 2000,//设置请求超时时间
        error: function (xml) {//请求失败时调用此函数
            alert('!!!加载XML文件出错!!!联系老公！！！');
        },
        success: function (xml) {//请求成功后的回调函数
            $(xml).find('Week').each(function (i) {//查找所有Week节点并遍历
                var iWeekNumber = $(this).attr('week');//获取周次
                $(this).find('lesson').each(function (j) {//查找当前周次所有class节点并遍历
                    //var class_id = $(this).children('class');//获得子节点
                    var iClassNumber = $(this).attr('class');//获取节次
                    var iStartWeekNumber = $(this).attr('startWeek');//获取开始周次
                    var iEndWeekNumber = $(this).attr('endWeek');//获取结束周次
                    var sOoT = $(this).attr('OoT');//获取单双周或者全周
                    var sRoom = $(this).attr('room');//获取教室
                    var sClassName = $(this).text();//获取课程

                    if (iStartWeekNumber <= iCutWeeks && iCutWeeks <= iEndWeekNumber) {
                        var bDisplayWeek = true;//在周次中
                    } else {
                        var bDisplayWeek = false;//不在周次中
                    }
                    if ((bDoubleWeek == true && sOoT == '单周') || (bDoubleWeek == false && sOoT == '双周')) {
                        bDisplayWeek = false;
                    }
                    if (sClassName != 'NULL' && bDisplayWeek == true) {//显示有课程表格
                        var sClassDataTag = '#classdata' + iWeekNumber + iClassNumber;//制作标签
                        var sClassDataHtml = $(sClassDataTag).html();//获取标签html内容
                        //新增html内容
                        var sClassData = sClassDataHtml + '<div class="classdetails"><p>' + sClassName + '<span>' + iStartWeekNumber + '-' + iEndWeekNumber + '</span><span>' + sOoT + '</span></p><p>@' + sRoom + '</div></p>';
                        $(sClassDataTag).html(sClassData);//修改新增内容
                        console.log(sClassDataHtml);
                        $(sClassDataTag).children('.classdetails').css('display', 'none');
                        $(sClassDataTag).children('.classdetails').fadeIn(iTimeFadeIn);
                        iTimeFadeIn = iTimeFadeIn + 200;
                    }
                });
            });
        }
    });
});
//获取时间
function getClassTime(iHours, iMinutes) {
    var oClassTime = new Date();
    oClassTime = oClassTime.setHours(iHours, iMinutes);
    return oClassTime;
}
//课程数组
function getClassTimeArray() {
    var aClassTime = new Array();
    aClassTime[0] = getClassTime(07, 50);//1
    aClassTime[1] = getClassTime(08, 35);
    aClassTime[2] = getClassTime(08, 45);//2
    aClassTime[3] = getClassTime(09, 30);
    aClassTime[4] = getClassTime(09, 50);//3
    aClassTime[5] = getClassTime(10, 35);
    aClassTime[6] = getClassTime(10, 45);//4
    aClassTime[7] = getClassTime(11, 30);
    aClassTime[8] = getClassTime(14, 20);//5
    aClassTime[9] = getClassTime(15, 05);
    aClassTime[10] = getClassTime(15, 15);//6
    aClassTime[11] = getClassTime(16, 00);
    aClassTime[12] = getClassTime(16, 10);//7
    aClassTime[13] = getClassTime(16, 55);
    aClassTime[14] = getClassTime(17, 05);//8
    aClassTime[15] = getClassTime(17, 50);
    aClassTime[16] = getClassTime(19, 00);//9
    aClassTime[17] = getClassTime(19, 45);
    aClassTime[18] = getClassTime(19, 55);//10
    aClassTime[19] = getClassTime(20, 40);
    var oNowDate = new Date();
    var iNowMonth = oNowDate.getMonth() + 1;
    if (5 <= iNowMonth && iNowMonth < 10) {
        aClassTime[8] = getClassTime(14, 40);//5
        aClassTime[9] = getClassTime(15, 25);
        aClassTime[10] = getClassTime(15, 35);//6
        aClassTime[11] = getClassTime(16, 20);
        aClassTime[12] = getClassTime(16, 30);//7
        aClassTime[13] = getClassTime(17, 15);
        aClassTime[14] = getClassTime(17, 25);//8
        aClassTime[15] = getClassTime(18, 10);
    }
    return aClassTime;
}
//获取课程当前状态
function getClassState() {
    var oNowDate = new Date();
    var aClassTime = getClassTimeArray();
    var iCount = 0;
    var iHour = 0;
    var iMinute = 0;
    for (iHour = 7; iHour <= 21; iHour++) {
        for (iMinute = 0; iMinute <= 60; iMinute = iMinute + 10) {
            iNowDate=oNowDate.setHours(iHour, iMinute);
            for (iCount = 0; iCount <= 19; iCount++) {
                if (iNowDate <= aClassTime[iCount]) {
                    break;
                }
            }
            var oOnClass = { bOnClass: false, iCount: 0, oTime: oNowDate};
            if (iCount % 2 == 0) {
                oOnClass.bOnClass = false;
            } else {
                oOnClass.bOnClass = true;
            }
            oOnClass.iCount = iCount;
            console.log(oOnClass);
        }
    }
}

//突出显示当前课程以及下一节课课程
function setHighlightCourses() {

}