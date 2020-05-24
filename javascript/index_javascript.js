var aSemesterDate = new Array();//学期数组
var fSemesterXML;

$(document).ready(function fcPageStartLoad(){
    setClassTime();
    setHighlightedCourses();
    setCurriculumMonth();
    setCurriculumDate();
    setHtmlHaderWeek();
    loadCurriculumXML();
    setFooterTimeOutMain();
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
function setHtmlHaderWeek() {
    iCutWeeks = getStudyWeeks();
    if(iCutWeeks < 0) {//假期中
        $('.week').text('假期ing');
    }else{//学期中
        $('.week').text('本学期第' + iCutWeeks + '周');
    }
}

//设置学期时间
function getSemesterTime() {
    var oStartDate = new Date(2020, 02 - 1, 17);//开学时间
    var oEndDate = new Date(2020, 07 - 1, 05);//结业时间
    return { 
        oStartDate: oStartDate, 
        oEndDate: oEndDate
    };
}

//获取当前学期周次
function getStudyWeeks() {
    var oNowDate = new Date();
    var oStartDate = getSemesterTime().oStartDate;//学期起始时间
    var oCutDate = oNowDate - oStartDate;//实际日期差
    var iCutDay = Math.floor(oCutDate / (3600 * 24 * 1000));//转换天数
    var iCutWeeks = parseInt(iCutDay / 7) + 1;//计算差日期
    return iCutWeeks;
}

//加载课程表
function loadCurriculumXML() {
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
            alert('!!!加载CurriculumXML文件出错!!!联系老公！！！');
        },
        success: function (xml) {//请求成功后的回调函数
            $(xml).find('Week').each(function (i) {//查找所有Week节点并遍历
                var iWeekNumber = $(this).attr('week');//获取周次
                $(this).find('lesson').each(function (j) {//查找当前周次所有class节点并遍历
                    //var class_id = $(this).children('class');//获得子节点
                    var sClassName = $(this).text();//获取课程

                    if (sClassName != 'NULL') {//是否有课程
                        var oCourse = new Course(
                            iWeekNumber,
                            $(this).attr('class'),
                            sClassName,
                            $(this).attr('startWeek'),
                            $(this).attr('endWeek'),
                            $(this).attr('OoT'),
                            $(this).attr('room'));
                        oCourse.setCurriculumHtml();
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
    aClassTime[0] = getClassTime(08, 00);//1
    aClassTime[1] = getClassTime(08, 40);
    aClassTime[2] = getClassTime(08, 50);//2
    aClassTime[3] = getClassTime(09, 30);
    aClassTime[4] = getClassTime(10, 10);//3
    aClassTime[5] = getClassTime(10, 50);
    aClassTime[6] = getClassTime(11, 00);//4
    aClassTime[7] = getClassTime(11, 40);
    aClassTime[8] = getClassTime(14, 20);//5
    aClassTime[9] = getClassTime(15, 05);
    aClassTime[10] = getClassTime(15, 15);//6
    aClassTime[11] = getClassTime(16, 00);
    aClassTime[12] = getClassTime(16, 10);//7
    aClassTime[13] = getClassTime(16, 55);
    aClassTime[14] = getClassTime(17, 05);//8
    aClassTime[15] = getClassTime(17, 50);
    aClassTime[16] = getClassTime(19, 00);//9
    aClassTime[17] = getClassTime(19, 40);
    aClassTime[18] = getClassTime(19, 55);//10
    aClassTime[19] = getClassTime(20, 30);
    var oNowDate = new Date();
    var iNowMonth = oNowDate.getMonth() + 1;
    if (5 <= iNowMonth && iNowMonth < 10) {
        aClassTime[8] = getClassTime(14, 40);//5
        aClassTime[9] = getClassTime(15, 20);
        aClassTime[10] = getClassTime(15, 30);//6
        aClassTime[11] = getClassTime(16, 10);
        aClassTime[12] = getClassTime(16, 50);//7
        aClassTime[13] = getClassTime(17, 30);
        aClassTime[14] = getClassTime(17, 40);//8
        aClassTime[15] = getClassTime(18, 20);
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
    var oDate = new Date();
    for(var iCount = 0; iCount <= 7; iCount++) {
        if(oDate.getDay() == 1) {
            break;
        }
        oDate = oDate.valueOf() - 86400000;
        oDate = new Date(oDate);
    }
    for(var iCount = 1; iCount <= 7; iCount++) {
        var iWeek = oDate.getDay();
        if (iWeek == 0) {
            iWeek = 7;
        }
        var sWeek = getWeek(iWeek);
        var sTag = '#' + sWeek + ' .tablehader p';
        $(sTag).text(oDate.getDate());
        oDate = oDate.valueOf() + 86400000;
        oDate = new Date(oDate);
    }
}

//课程数组
function getClassStateTimeArray() {
    var aClassTime = new Array();
    aClassTime[0] = getClassTime(08, 00);//一
    aClassTime[1] = getClassTime(09, 30);
    aClassTime[2] = getClassTime(10, 10);//二
    aClassTime[3] = getClassTime(11, 40);
    aClassTime[4] = getClassTime(14, 20);//三
    aClassTime[5] = getClassTime(16, 00);
    aClassTime[6] = getClassTime(16, 10);//四
    aClassTime[7] = getClassTime(17, 50);
    aClassTime[8] = getClassTime(19, 00);//五
    aClassTime[9] = getClassTime(20, 30);
    var oNowDate = new Date();
    var iNowMonth = oNowDate.getMonth() + 1;
    if (5 <= iNowMonth && iNowMonth < 10) {
        aClassTime[4] = getClassTime(14, 40);//三
        aClassTime[5] = getClassTime(16, 10);
        aClassTime[6] = getClassTime(16, 50);//四
        aClassTime[7] = getClassTime(18, 20);
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
        var sTag = 'ul#' + sWeekDay + ' li:nth-child(' + iClassNumber + ') .course_activity';
        $(sTag).css('height', sHeight);
    },.01);
}

//学期时间倒计时
function setFooterTimeOutMain() {
    var oNowDate = new Date();//当前时间
    var oSemesterDate = getSemesterTime();//获取学期时间
    var oSemesterDateCut = oSemesterDate.oEndDate - oSemesterDate.oStartDate;//计算结束学期时间差
    var oSemesterDateOvreCut = oSemesterDate.oEndDate - oNowDate;//计算当前离结束时间差
    var oSemesterDateStartCut = oNowDate - oSemesterDate.oStartDate;//计算当前离开始时间差
    var iSemesterCut = Math.round(oSemesterDateStartCut / oSemesterDateCut * 10000) / 100.00;//计算比值
    var iDay = Math.floor(oSemesterDateOvreCut / (3600 * 24 * 1000));//离结束时间差转换天数
    $('#timeout_text').text('离学期结束还有' + iDay + '天');
    $('#timeout_progressbar').progressbar({
        value: iSemesterCut
      });
    
}

//测试
function TestFunction() {
    
}

function TestsetCurriculumDate() {
    var oDate = new Date();
    for(var iCount = 0; iCount <= 7; iCount++) {
        if(oDate.getDay() == 1) {
            break;
        }
        oDate = oDate.valueOf() - 86400000;
        oDate = new Date(oDate);
    }
    for(var iCount = 1; iCount <= 7; iCount++) {
        var iWeek = oDate.getDay();
        if (iWeek == 0) {
            iWeek = 7;
        }
        var sWeek = getWeek(iWeek);
        var sTag = '#' + sWeek + ' .tablehader p';
        $(sTag).text(oDate.getDate());
    }
}

//定义课程类
class Course {
    //获取课程信息
    constructor(iWeekNumber, iClassNumber, sClassName, iStartWeekNumber, iEndWeekNumber, sOoT, sRoom) {
        this.iWeekNumber = iWeekNumber;
        this.iClassNumber = iClassNumber;
        this.sClassName = sClassName;
        this.iStartWeekNumber = iStartWeekNumber;
        this.iEndWeekNumber = iEndWeekNumber;
        this.sOoT = sOoT;
        this.sRoom = sRoom;
    }
    //获取Html标签
    getElementTag() {
        var sWeek = getWeek(this.iWeekNumber);
        var iClass = Number(this.iClassNumber) + 1;
        var sClassTag = 'ul#' + sWeek + ' li:nth-child(' + iClass + ')';
        return $(sClassTag);
    }
    //是否处于当前周次
    isInTheWeek() {
        if (this.iStartWeekNumber <= getStudyWeeks() && getStudyWeeks() <= this.iEndWeekNumber) {//是否节次内
            return true;
        } else {
            return false;
        }
    }
    //判断是否在单双周内
    isInOneOrTwoWeeek() {
        var ReSingleWeek = new RegExp('单');
        var ReDoubleWeek = new RegExp('双');
        if ((bDoubleWeek == true && ReDoubleWeek.test(this.sOoT)) || (bDoubleWeek == false && ReSingleWeek.test(this.sOoT)) || this.sOoT === '周') {
            return true;
        } else {
            return false;
        }
    }
    //设置课程
    setCurriculumHtml() {
        if (this.isInTheWeek() == true && this.isInOneOrTwoWeeek() == true) {
            var oEl = this.getElementTag();
            oEl.children('.course_data').css('opacity','0');
            oEl.children('.course_data').html(this.sClassName + '</br>' + this.iStartWeekNumber + '-' + this.iEndWeekNumber + this.sOoT + '</br>' + '@' + this.sRoom);
            oEl.children('.course_data').animate({opacity: 1}, 1000);
        }
    }
}
