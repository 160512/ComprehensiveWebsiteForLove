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
    $('.week').text('本学期第' + iCutWeeks + '周');
});

//获取当前学期周次
function getStudyWeeks() {
    var oNowDate = new Date();
    var oStartDate = isTimeInTheSemester(oNowDate).StartDate;//学期起始时间
    var iMonth = oStartDate.getMonth() - 1;
    oStartDate.setMonth(iMonth);//月份差值-1
    var oCutDate = oNowDate - oStartDate;//实际日期差
    var iCutDay = Math.floor(oCutDate / (3600 * 24 * 1000));//转换天数
    var iCutWeeks = parseInt(iCutDay / 7) + 1;//计算差日期
    return iCutWeeks;
}

//判断是否在学期内并返回学期期间
function isTimeInTheSemester(oNowDate) {
    var oWinterStartDate = new Date(2019, 2, 18);//第二学期开始时间
    var oWinterEndDate = new Date(2019, 7, 7);//第二学期结束时间
    var oSummerStartDate = new Date(2019, 8, 27);//第一学期开始时间
    var oSummerEndDate = new Date(2019, 12, 31);//第一学期结束时间
    if (oWinterStartDate <= oNowDate && oNowDate <= oWinterEndDate) {//当前时间在冬季时间
        var oWinterDate = { fcbool: true, StartDate: oWinterStartDate, EndDate: oWinterEndDate };
        console.log(oWinterDate);
        return oWinterDate;//返回冬季作息时间
    } else if (oSummerStartDate <= oNowDate && oNowDate <= oSummerEndDate) {//当前在夏季时间
        var oSummerDate = { fcbool: true, StartDate: oSummerStartDate, EndDate: oSummerEndDate };
        console.log(oSummerDate);
        return oSummerDate;//返回夏季作息时间
    } else {//不处于学期内
        var oReturn = { fcbool: false, StartDate: null, EndDate: null };
        console.log(oReturn);
        return oReturn;
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
function getClassTime(iStartHours, iStartMinutes, iEndHours, iEndMinutes) {
    var oStartTime = new Date().setHours(iStartHours, iStartMinutes);
    var oEndTime = new Date().setHours(iEndHours, iEndMinutes);
    var oClassTime = { oStartTime: oStartTime, oEndTime: oEndTime };
    return oClassTime;
}
//突出显示当前课程以及下一节课课程
function setHighlightCourses() {
    var oNowTime = new Date().getTime();
    var oClassTime_1 = getClassTime(7, 50, 8, 35);//第一节课
    var oClassTime_2 = getClassTime(8, 45, 9, 30);//第二节课
    var oClassTime_3 = getClassTime(9, 50, 10, 35);//第三节课
    var oClassTime_4 = getClassTime(10, 45, 11, 30);//第四节课
    var oClassTime_5 = getClassTime(14, 20, 15, 5);//第五节课
    var oClassTime_6 = getClassTime(15, 15, 16, 00);//第六节课
    var oClassTime_7 = getClassTime(16, 10, 16, 55);//第七节课
    var oClassTime_8 = getClassTime(17, 5, 17, 50);//第八节课
    var oClassTime_9 = getClassTime(19, 00, 19, 45);//第九节课
    var oClassTime_10 = getClassTime(19, 55, 20, 40);//第十节课
    var oOnClass = { bOnClass: false, iClassNumber: 0 };

    if (oNowTime < oClassTime_1.oStartTime) {
        oOnClass.bOnClass = false;//没有上课
        oOnClass.iClassNumber = 0;
    } else if (oClassTime_1.oStartTime <= oNowTime && oNowTime < oClassTime_1.oEndTime) {
        oOnClass.bOnClass = true;//第1节课上课
        oOnClass.iClassNumber = 1;
    } else if (oClassTime_1.oEndTime <= oNowTime && oNowTime < oClassTime_2.oStartTime) {
        oOnClass.bOnClass = false;//第1节课下课
        oOnClass.iClassNumber = 1;
    } else if (oClassTime_2.oStartTime <= oNowTime && oNowTime < oClassTime_2.oEndTime) {
        oOnClass.bOnClass = true;//第2节课上课
        oOnClass.iClassNumber = 2;
    } else if (oClassTime_2.oEndTime <= oNowTime && oNowTime < oClassTime_3.oStartTime) {
        oOnClass.bOnClass = false;//第2节课下课
        oOnClass.iClassNumber = 2;
    } else if (oClassTime_3.oStartTime <= oNowTime && oNowTime < oClassTime_3.oEndTime) {
        oOnClass.bOnClass = true;//第3节课上课
        oOnClass.iClassNumber = 3;
    } else if (oClassTime_3.oEndTime <= oNowTime && oNowTime < oClassTime_4.oStartTime) {
        oOnClass.bOnClass = false;//第3节课下课
        oOnClass.iClassNumber = 3;
    } else if (oClassTime_4.oStartTime <= oNowTime && oNowTime < oClassTime_4.oEndTime) {
        oOnClass.bOnClass = true;//第4节课上课
        oOnClass.iClassNumber = 4;
    } else if (oClassTime_4.oEndTime <= oNowTime && oNowTime < oClassTime_5.oStartTime) {
        oOnClass.bOnClass = false;//第4节课下课
        oOnClass.iClassNumber = 4;
    } else if (oClassTime_5.oStartTime <= oNowTime && oNowTime < oClassTime_5.oEndTime) {
        oOnClass.bOnClass = true;//第5节课上课
        oOnClass.iClassNumber = 5;
    } else if (oClassTime_5.oEndTime <= oNowTime && oNowTime < oClassTime_6.oStartTime) {
        oOnClass.bOnClass = false;//第5节课下课
        oOnClass.iClassNumber = 5;
    } else if (oClassTime_6.oStartTime <= oNowTime && oNowTime < oClassTime_6.oEndTime) {
        oOnClass.bOnClass = true;//第6节课上课
        oOnClass.iClassNumber = 6;
    } else if (oClassTime_6.oEndTime <= oNowTime && oNowTime < oClassTime_7.oStartTime) {
        oOnClass.bOnClass = false;//第6节课下课
        oOnClass.iClassNumber = 6;
    } else if (oClassTime_7.oStartTime <= oNowTime && oNowTime < oClassTime_7.oEndTime) {
        oOnClass.bOnClass = true;//第7节课上课
        oOnClass.iClassNumber = 7;
    } else if (oClassTime_7.oEndTime <= oNowTime && oNowTime < oClassTime_8.oStartTime) {
        oOnClass.bOnClass = false;//第7节课下课
        oOnClass.iClassNumber = 7;
    } else if (oClassTime_8.oStartTime <= oNowTime && oNowTime < oClassTime_8.oEndTime) {
        oOnClass.bOnClass = true;//第8节课上课
        oOnClass.iClassNumber = 8;
    } else if (oClassTime_8.oEndTime <= oNowTime && oNowTime < oClassTime_9.oStartTime) {
        oOnClass.bOnClass = false;//第8节课下课
        oOnClass.iClassNumber = 8;
    } else if (oClassTime_9.oStartTime <= oNowTime && oNowTime < oClassTime_9.oEndTime) {
        oOnClass.bOnClass = true;//第9节课上课
        oOnClass.iClassNumber = 9;
    } else if (oClassTime_9.oEndTime <= oNowTime && oNowTime < oClassTime_10.oStartTime) {
        oOnClass.bOnClass = false;//第9节课下课
        oOnClass.iClassNumber = 9;
    } else if (oClassTime_10.oStartTime <= oNowTime && oNowTime < oClassTime_10.oEndTime) {
        oOnClass.bOnClass = true;//第10节课上课
        oOnClass.iClassNumber = 10;
    } else if (oClassTime_10.oEndTime <= oNowTime) {
        oOnClass.bOnClass = false;//第10节课下课
        oOnClass.iClassNumber = 10;
    }

    return oOnClass;
}