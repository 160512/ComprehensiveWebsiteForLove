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