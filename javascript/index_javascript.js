var bOnlyRun = false;//单词循环bool变量
$(document).ready(function fcPageStartLoad(){
    loadCurriculumXML();
    setClassTime();
    setFooterTimeOutMain();
    setHighlightedCourses();
    setCurriculumMonth();
    setCurriculumDate();
});
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
    if (Number(anyNowHour) < 10) {
        anyNowHour = '0' + anyNowHour;
    }
    if (Number(anyNowMinute) < 10) {
        anyNowMinute = '0' + anyNowMinute;
    }
    if (Number(anyNowSecond) < 10) {
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
    var oStartDate = getSemesterTime().oStartDate;//学期起始时间
    var oCutDate = oNowDate - oStartDate;//实际日期差
    var iCutDay = Math.floor(oCutDate / (3600 * 24 * 1000));//转换天数
    var iCutWeeks = parseInt(iCutDay / 7) + 1;//计算差日期
    return iCutWeeks;
}
//获取学期日期
function getSemesterDate(){
    var oFirstSemesterStartDate = new Date(2019, 8, 02);//第一学期开始时间20190902
    var oFirstSemesterEndDate = new Date(2020, 0, 12);//第一学期结束时间20200112
    var oSecondSemesterStartDate = new Date(2020, 1, 3);//第二学期开始时间20200203
    var oSecondSemesterEndDate = new Date(2020, 5, 30);//第二学期结束时间20200630
    return { oFirstSemesterStartDate: oFirstSemesterStartDate, oFirstSemesterEndDate: oFirstSemesterEndDate, oSecondSemesterStartDate: oSecondSemesterStartDate, oSecondSemesterEndDate: oSecondSemesterEndDate };
}
//判断是否在学期内并返回学期期间
function getSemesterTime() {
    var oNowDate = new Date();
    var oFirstSemesterStartDate = new Date(2019, 8, 02);//第一学期开始时间20190902
    var oFirstSemesterEndDate = new Date(2020, 0, 12);//第一学期结束时间20200112
    var oSecondSemesterStartDate = new Date(2020, 1, 3);//第二学期开始时间20200203
    var oSecondSemesterEndDate = new Date(2020, 5, 30);//第二学期结束时间20200630
    
    if (oFirstSemesterStartDate <= oNowDate && oNowDate <= oFirstSemesterEndDate) {//当前时间在冬季时间
        var oReturnDateObject = { iSemester: 1, oStartDate: oFirstSemesterStartDate, oEndDate: oFirstSemesterEndDate };
        return oReturnDateObject;//返回第一学期时间
    } else if (oSecondSemesterStartDate <= oNowDate && oNowDate <= oSecondSemesterEndDate) {//当前在夏季时间
        var oReturnDateObject = { iSemester: 2, oStartDate: oSecondSemesterStartDate, oEndDate: oSecondSemesterEndDate };
        return oReturnDateObject;//返回第二学期时间
    } else {//不处于学期内
        var oReturnDateObject = { iSemester: null, StartDate: null, EndDate: null };
        return oReturnDateObject;
    }
}
//加载课程表
function loadCurriculumXML() {
    var ReSingleWeek = new RegExp('单');
    var ReDoubleWeek = new RegExp('双');
    var iCutWeeks = getStudyWeeks();
    if (iCutWeeks % 2 == 0) {
        bDoubleWeek = true;//双周
    } else {
        bDoubleWeek = false;//单周
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
                    var sClassName = $(this).text();//获取课程

                    if (sClassName != 'NULL') {//是否有课程
                        var iStartWeekNumber = $(this).attr('startWeek');//获取开始周次
                        var iEndWeekNumber = $(this).attr('endWeek');//获取结束周次
                        if (iStartWeekNumber <= iCutWeeks && iCutWeeks <= iEndWeekNumber) {//是否节次内
                            var sOoT = $(this).attr('OoT');//获取单双周或者全周
                            if ((bDoubleWeek == true && ReDoubleWeek.test(sOoT)) || (bDoubleWeek == false && ReSingleWeek.test(sOoT)) || sOoT === '周') {
                                var iClassNumber = $(this).attr('class');//获取节次
                                var sRoom = $(this).attr('room');//获取教室
                                var sWeek = getWeek(iWeekNumber);
                                var iClass = Number(iClassNumber) + 1;
                                var sClassTag = 'ul#' + sWeek + ' li:nth-child(' + iClass + ')';
                                var sTagString = $(sClassTag).html();
                                var sClassData = sTagString + sClassName + '</br>' + iStartWeekNumber + '-' + iEndWeekNumber + sOoT + '</br>' + '@' + sRoom;
                                $(sClassTag).html(sClassData);
                            }
                        }
                    }
                });
            });
        }
    });
}

//获取星期
function getWeek(iWeekNumber) {
    var aWeekday = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    return aWeekday[iWeekNumber - 1];
}

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

//设置课程表月份
function setCurriculumMonth() {
    var oNowDate = new Date();
    var iNowMonth = oNowDate.getMonth() + 1;
    $('#segments .tablehader').text(iNowMonth + '月');
}

//设置课程表日期
function setCurriculumDate() {
    var oNowDate = new Date();
    var iNowDate = oNowDate.getDate();
    var iNowWeek = oNowDate.getDay();
    if (iNowWeek == 0) {
        iNowWeek = 7;
    }
    for (iNowWeek; iNowWeek != 1; iNowWeek--) {
        iNowDate--;
    }
    for (iNowWeek; iNowWeek <= 7; iNowWeek++) {
        var sWeek = getWeek(iNowWeek);
        var sTag = '#' + sWeek + ' .tablehader p';
        $(sTag).text(iNowDate);
        console.log(iNowDate);
        iNowDate++;
    }
}

//课程数组
function getClassStateTimeArray() {
    var aClassTime = new Array();
    aClassTime[0] = getClassTime(07, 50);//一
    aClassTime[1] = getClassTime(09, 30);
    aClassTime[2] = getClassTime(09, 50);//二
    aClassTime[3] = getClassTime(11, 30);
    aClassTime[4] = getClassTime(14, 20);//三
    aClassTime[5] = getClassTime(16, 00);
    aClassTime[6] = getClassTime(16, 10);//四
    aClassTime[7] = getClassTime(17, 50);
    aClassTime[8] = getClassTime(19, 00);//五
    aClassTime[9] = getClassTime(20, 40);
    var oNowDate = new Date();
    var iNowMonth = oNowDate.getMonth() + 1;
    if (5 <= iNowMonth && iNowMonth < 10) {
        aClassTime[4] = getClassTime(14, 40);//三
        aClassTime[5] = getClassTime(16, 20);
        aClassTime[6] = getClassTime(16, 30);//四
        aClassTime[7] = getClassTime(18, 10);
    }
    return aClassTime;
}

//设置课程时间
function setClassTime() {
    var aClassTime = getClassTimeArray();//获取时间数组
    for (var iCount = 0; iCount <= 19; iCount = iCount + 2) {
        var sStartTime = getStringTime(new Date(aClassTime[iCount]));//上课时间
        var sEndTime = getStringTime(new Date(aClassTime[iCount + 1]));//下课时间
        var iLocationNumber = (iCount / 2) + 2;//计算节次
        var sTime = sStartTime + '</br>\|</br>' + sEndTime;//时间内容
        var sTag = 'ul#time li:nth-child(' + iLocationNumber + ')';//标签
        $(sTag).html(sTime);//输出时间
    }
}

//获取时间文本
function getStringTime(oDate) {
    var anyHour = oDate.getHours();//获取小时
    var anyMinute = oDate.getMinutes();//获取分钟
    if (anyHour < 10) {//格式化小时
        anyHour = '0' + anyHour;
    }
    if (anyMinute < 10) {//格式化分钟
        anyMinute = '0' + anyMinute;
    }
    var sTime = anyHour + ':' + anyMinute//格式化时间
    return sTime;//返回时间文本
}

//获取当前课程
function getNowClass() {
    var oNowDate = new Date();
    var aClassTime = getClassStateTimeArray();
    var iCount = 0;
    for (iCount = 0; iCount <= 9; iCount++) {
        if (oNowDate <= aClassTime[iCount]) {
            break;
        }
    }
    var oOnClass = { bOnClass: false, iCount: 0, oTime: oNowDate };
    if (iCount % 2 == 0) {
        oOnClass.bOnClass = false;
    } else {
        oOnClass.bOnClass = true;
    }
    oOnClass.iCount = Math.ceil(iCount / 2);
    console.log(oOnClass);
    return oOnClass;
}

//高亮课表
function setHighlightedCourses() {
    var oNowDate = new Date();
    var oIsOnClass = getNowClass();
    var iWeekDays = oNowDate.getDay();
    var aWeekday = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    if (oIsOnClass.iCount == 0) {

    } else {
        var iCount = 1;
        var fcCoursesHeightAnimation = setInterval(function(){
            if (iCount <= oIsOnClass.iCount) {//判断内
                if (oIsOnClass.bOnClass == false) {//下课状态
                    setClassActivity(aWeekday[iWeekDays], iCount, 100);
                } else {//上课状态
                    if(iCount != oIsOnClass.iCount) {
                        setClassActivity(aWeekday[iWeekDays], iCount, 100);
                    } else {
                        var aClassTimeArray = getClassStateTimeArray();
                        var iClassTime = aClassTimeArray[1] - aClassTimeArray[0];
                        var iCountCut = (iCount - 1) * 2;
                        var iClassTimeCut = oNowDate - aClassTimeArray [iCountCut];
                        var iCut = Math.round(iClassTimeCut / iClassTime * 10000) / 100.00;//计算比值
                        setClassActivity(aWeekday[iWeekDays], iCount, iCut);
                    }
                }
                iCount++;
            }
            else {
                clearInterval(fcCoursesHeightAnimation);
            }
        },5000);
    }
}

//渐变时间显示
function setClassActivity(sWeekDay, iCount, iHeightVal) {
    var iClassNumber = iCount + 1;
    var iStartHeight = 0;
    var fcHeightAnimation = setInterval(function(){//宽度渐变
        iStartHeight = iStartHeight + 0.1;
        if(iStartHeight > iHeightVal){
            iStartHeight = iHeightVal;
            clearInterval(fcHeightAnimation);  
        }
        sHeight = iStartHeight + '%';
        var sTag = 'ul#' + sWeekDay + ' li:nth-child(' + iClassNumber + ') .class_activity';
        $(sTag).css('height', sHeight);
    },.01);
}

//学期时间倒计时
function setFooterTimeOutMain() {
    var oNowDate = new Date();//当前时间
    var oSemesterDate = getSemesterTime();//获取学期时间
    var oSemesterDateCut = oSemesterDate.oEndDate - oSemesterDate.oStartDate;//计算学期时间差
    var oSemesterDateCutNowDate = oNowDate - oSemesterDate.oStartDate;//计算当前时间差
    var iSemesterCut = Math.round(oSemesterDateCutNowDate / oSemesterDateCut * 10000) / 100.00;//计算比值
    var oSemesterDateLastDate = oSemesterDate.oEndDate - oNowDate;//离结束的时间差
    var iCutDay = Math.floor(oSemesterDateLastDate / (3600 * 24 * 1000));//转换天数
    var iStartWidth = 0;//初始化宽度
    var iStartCutDay = 0;//初始化天数差
    var fcWidthAnimation = setInterval(function(){//宽度渐变
        iStartWidth = iStartWidth + 0.05;
        if(iStartWidth > iSemesterCut){
            iStartWidth = iSemesterCut;
            clearInterval(fcWidthAnimation);  
        }
        sTimeMainWidth = iStartWidth + '%';
        $('.timeout_use').css('width',sTimeMainWidth);
    },.5);
    var fcDayAnimation = setInterval(function(){//时间渐变
        iStartCutDay = iStartCutDay + 1;
        if(iStartCutDay > iCutDay){
            iStartCutDay = iCutDay;
            clearInterval(fcDayAnimation);
        }
        $('#timeout_str').text('离学期结束还有' + iStartCutDay + '天');
    setFooterTimeOutString()
    },20);
}

//设置倒计时时间显示
function setFooterTimeOutString() {
    var iTimeOutMainWidth = $('div.timeout_use').width();
    var iTimeOutStringWidth = $('#timeout_str').width();
    if (iTimeOutStringWidth > iTimeOutMainWidth) {
        iTimeOutWidth = -1 * iTimeOutStringWidth;
        $('#timeout_str').css('margin-right', iTimeOutWidth);
    }else {
        $('#timeout_str').css('margin-right', '0px');
    }
}

//测试
function getTestClassState() {
    var oNowDate = new Date();
    var aClassTime = getClassStateTimeArray();
    var iCount = 0;
    var iHour = 0;
    var iMinute = 0;
    for (iHour = 7; iHour <= 21; iHour++) {
        for (iMinute = 0; iMinute <= 60; iMinute = iMinute + 10) {
            iMinute++;
            iNowDate=oNowDate.setHours(iHour, iMinute);
            for (iCount = 0; iCount <= 9; iCount++) {
                if (iNowDate <= aClassTime[iCount]) {
                    break;
                }
            }
            var oOnClass = { bOnClass: false, iCount: 0, oTime: oNowDate };
            if (iCount % 2 == 0) {
                oOnClass.bOnClass = false;
            } else {
                oOnClass.bOnClass = true;
            }
            oOnClass.iCount = Math.ceil(iCount / 2);
            console.log(oOnClass);
        }
    }
}
