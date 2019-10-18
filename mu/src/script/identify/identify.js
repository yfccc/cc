var g_iPort = 1001; //端口号；USB = 1001 ~ 1016 ，COM端口 = 1~16
var g_strPHPath = "..\\"; //保存照片路径初始值，路径结尾需添加"\\"
var g_strBmpPHName = "_PhotoA.bmp"; //保存bmp照片名称
var g_strJpgPHName = "_PhotoB.jpg"; //保存jpg照片名称
var ReadCardInfo; // 记录读取身份证信息的数据, 以便判断是否是读取录入, 还是手工录入
var sfxxcjZpdz = ""; //身份证头像
var mzList;
var ReadCardInfoo;
var cardImg = "";
var gjArr = [];
var zjlxArr = [];
var mzDm = [];
var ryfl = [];
var cjcdList = [];
var xbList = [];
var strSAMID = ""; //设备编号
var active = {
    addDisable: function () {
        $("#sgrl").attr("disabled", "disabled").addClass('layui-btn-disabled');
        $("#dqedsfz").attr("disabled", "disabled").addClass('layui-btn-disabled');
        $("#xm").attr("disabled", "disabled").addClass('layui-btn-disabled');
        $("#zjlx").attr("disabled", "disabled").addClass('layui-btn-disabled');
        $("#zjhm").attr("disabled", "disabled").addClass('layui-btn-disabled');
        $("#xb").attr("disabled", "disabled").addClass('layui-btn-disabled');
        $("#csrq").attr("disabled", "disabled").addClass('layui-btn-disabled');
        $("#gj").attr("disabled", "disabled").addClass('layui-btn-disabled');
        $("#mz").attr("disabled", "disabled").addClass('layui-btn-disabled');
        $("#hjdz").attr("disabled", "disabled").addClass('layui-btn-disabled');
        $("#qfjg").attr("disabled", "disabled").addClass('layui-btn-disabled');
        $("#yxq").attr("disabled", "disabled").addClass('layui-btn-disabled');
        $("#sgrl").attr("disabled", "disabled").addClass('layui-btn-disabled');
        $("#zjyxqdate").attr("disabled", "disabled").addClass('layui-btn-disabled');
        $("#sgrl").css("background", "#E6E6E6");
        $("#dqedsfz").css("background", "#E6E6E6")

    },
    removeDisable: function () {
        // ("执行一次")
        $('#xm').removeAttr('disabled').removeClass('layui-btn-disabled');
        $('#zjlx').removeAttr('disabled').removeClass('layui-btn-disabled');
        $('#zjhm').removeAttr('disabled').removeClass('layui-btn-disabled');
        $('#xb').removeAttr('disabled').removeClass('layui-btn-disabled');
        $('#csrq').removeAttr('disabled').removeClass('layui-btn-disabled');
        $('#gj').removeAttr('disabled').removeClass('layui-btn-disabled');
        $('#mz').removeAttr('disabled').removeClass('layui-btn-disabled');
        $('#hjdz').removeAttr('disabled').removeClass('layui-btn-disabled');
        $('#qfjg').removeAttr('disabled').removeClass('layui-btn-disabled');
        $('#yxq').removeAttr('disabled').removeClass('layui-btn-disabled');
        $('#dqedsfz').removeAttr('disabled').removeClass('layui-btn-disabled');
        $('#sgrl').removeAttr('disabled').removeClass('layui-btn-disabled');
        $('#zjyxqdate').removeAttr('disabled').removeClass('layui-btn-disabled');
    },
    removeVal: function () {
        $('#xm').val("");
        $('#zjlx').val("");
        $('#zjhm').val("");
        $('#xb').val("");
        $('#csrq').val("");
        $('#gj').val("");
        $('#mz').val("");
        $('#hjdz').val("");
        $('#qfjg').val("");
        $('#yxq').val("");
        $('#zjyxqdate').val("");
        $('#zjyxq').val("");
        $("#sbjg-card-l").attr("src", "/img/card-img.png")
    },
    initLeftHtml: function () {
        return html = '<div   class="left_info_item">\
                        <div class="layui-form-item">\
                            <label class="layui-form-label label_width  first_label_width  cjbhBlock">采集编号：</label>\
                            <div class="layui-input-block marginLeft" id="sbjg-cjbh" style=" height: 36px; line-height: 36px;   border-bottom: 1px #d2d2d2 solid;"></div>\
                        </div>\
                        <div class="layui-form-item" >\
                            <label class="layui-form-label label_width   first_label_width  cjsjBlock">采集时间：</label>\
                            <div class="layui-input-block marginLeft" id="sbjg-cjsj" style=" height: 36px; line-height: 36px;   border-bottom: 1px #d2d2d2 solid;"></div>\
                        </div>\
                        <div class="layui-form-item" >\
                            <label class="layui-form-label label_width  first_label_width">采集人：</label>\
                            <div class="layui-input-block  marginLeft longText" id="sbjg-cjr" style="height: 36px; line-height: 36px;    border-bottom: 1px #d2d2d2 solid;"></div>\
                        </div>\
                        <div class="layui-form-item" >\
                            <label class="layui-form-label label_width  first_label_width">采集点：</label>\
                            <div class="layui-input-block marginLeft  longText" id="sbjg-cjd" style=" height: 36px; line-height: 36px;    border-bottom: 1px #d2d2d2 solid;"></div>\
                        </div>\
                        <div class="layui-form-item" >\
                            <label class="layui-form-label label_width  first_label_width">采集备注：</label>\
                            <div class="layui-input-block longText marginLeft" style="height: 36px; line-height: 36px; border-bottom: 1px #d2d2d2 solid;" id="sbjg-cjbz"></div>\
                        </div>\
                        </div>'
    },
    initCenterHtml: function () {
        return html = '<div class="layui-form-item" style="width:330px;margin-left: 125px">\
                            <div class="layui-input-block "   style="height:190px;margin-left:0px">\
                                <div   class="imgParpent"   style="float: left;height:190px;">\
                                    <img id="sbjg-card-r" src="/img/card-img.png" style="width: 152px; height: 190px;">\
                                </div>\
                                <div class="people_info_img_right">\
                                </div>\
                            </div>\
                        </div>\
                        <div id="show-form-1" style="margin-top:20px;">\
                            <div class="layui-form-item">\
                                <label class="layui-form-label label_width">姓名：</label>\
                                <div class="layui-input-block longText marginLeft" id="sbjg-bcjrxm" style=" height: 36px; line-height: 36px;  border-bottom: 1px #d2d2d2 solid;">\
                                </div>\
                            </div>\
                                <div class="layui-form-item" >\
                                <label class="layui-form-label label_width">证件类型：</label>\
                                <div class="layui-input-block marginLeft"  id="sbjg-zjlx" style="height: 36px; line-height: 36px;  border-bottom: 1px #d2d2d2 solid;">\
                                </div>\
                                <div style="display: none;" id="zjlxdm"></div>\
                            </div>\
                                <div class="layui-form-item" >\
                                <label class="layui-form-label label_width">证件号：</label>\
                                <div class="layui-input-block longText marginLeft"  id="sbjg-zjhm" style=" height: 36px; line-height: 36px;  border-bottom: 1px #d2d2d2 solid;"></div>\
                            </div>\
                            <div class="layui-form-item" >\
                                <label class="layui-form-label label_width">性别：</label>\
                                <div class="layui-input-block marginLeft " id="sbjg-xb" style=" height: 36px; line-height: 36px; border-bottom: 1px #d2d2d2 solid;">\
                                </div>\
                            </div>\
                            <div class="layui-form-item" >\
                                <label class="layui-form-label label_width">出生日期：</label>\
                                <div class="layui-input-block marginLeft" id="sbjg-csrq" style=" height: 36px; line-height: 36px;   border-bottom: 1px #d2d2d2 solid;">\
                                </div>\
                            </div>\
                            <div class="layui-form-item" >\
                                <label class="layui-form-label label_width">国籍：</label>\
                                <div class="layui-input-block marginLeft" id="sbjg-gj" style="height: 36px; line-height: 36px;  border-bottom: 1px #d2d2d2 solid;">\
                                </div>\
                            </div>\
                            <div class="layui-form-item" >\
                                <label class="layui-form-label label_width">民族：</label>\
                                <div class="layui-input-block marginLeft" id="sbjg-mz" style="height: 36px; line-height: 36px;  border-bottom: 1px #d2d2d2 solid;">\
                                </div>\
                            </div>\
                            <div class="layui-form-item" >\
                                <label class="layui-form-label label_width">户籍地址：</label>\
                                <div class="layui-input-block longText marginLeft"  id="sbjg-hjdz" style=" height: 36px; line-height: 36px; border-bottom: 1px #d2d2d2 solid;">\
                                </div>\
                            </div>\
                            <div class="layui-form-item" >\
                                <label class="layui-form-label label_width">证件签发机构：</label>\
                                <div class="layui-input-block longText marginLeft" id="sbjg-zjqfjg" style=" height: 36px; line-height: 36px;  border-bottom: 1px #d2d2d2 solid;">\
                                </div>\
                            </div>\
                            <div class="layui-form-item" >\
                                <label class="layui-form-label label_width">证件有效期：</label>\
                                <div class="layui-input-block marginLeft" id="sbjg-zjyxq" style=" height: 36px; line-height: 36px;   border-bottom: 1px #d2d2d2 solid;">\
                                </div>\
                            </div>\
                            <div class="layui-form-item" >\
                                <label class="layui-form-label label_width"> 手机号码：</label>\
                                <div class="layui-input-block marginLeft" id="sbjg-sjhm" style=" height: 36px; line-height: 36px;   border-bottom: 1px #d2d2d2 solid;">\
                                </div>\
                            </div>\
                            <div class="layui-form-item" >\
                                <label class="layui-form-label label_width"> 其他联系电话：</label>\
                                <div class="layui-input-block marginLeft" id ="sbjg-qtlxdh" style="height: 36px; line-height: 36px;  border-bottom: 1px #d2d2d2 solid;">\
                                </div>\
                            </div>\
                            <div class="layui-form-item" >\
                                <label class="layui-form-label label_width">人员分类：</label>\
                                <div class="layui-input-block   longText  marginLeft" id="ryfl" style="height: 36px; line-height: 36px;  border-bottom: 1px #d2d2d2 solid;">\
                                </div>\
                            </div>\
                            <div class="layui-form-item" >\
                                <label class="layui-form-label label_width">人员标签：</label>\
                                <div class="layui-input-block   longText  marginLeft" id="rybq" style="height: 36px; line-height: 36px;  border-bottom: 1px #d2d2d2 solid;">\
                            </div>\
                        </div>\
                        </div>'
    },
    formatDate: function (datetime) {
        // 获取年月日时分秒值  slice(-2)过滤掉大于10日期前面的0
        var year = datetime.getFullYear(),
            month = ("0" + (datetime.getMonth() + 1)).slice(-2),
            date = ("0" + datetime.getDate()).slice(-2),
            hour = ("0" + datetime.getHours()).slice(-2),
            minute = ("0" + datetime.getMinutes()).slice(-2),
            second = ("0" + datetime.getSeconds()).slice(-2);
        // 拼接
        var result = year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;
        // 返回
        return result;
    }
};
//  身份证号取出
function getBirthday(idCard) {
    var birthday = "";
    // if(isIE89()){
    //     $(".dateSpan").css("display","none")
    // }
    if (idCard != null && idCard != "") {
        if (idCard.length == 15) {
            birthday = "19" + idCard.substr(6, 6);
        } else if (idCard.length == 18) {
            birthday = idCard.substr(6, 8);
        }
        birthday = birthday.replace(/(.{4})(.{2})/, "$1-$2-");
    }
    return birthday;
}

function yxqGetVal(status, yxq) { //证件为长期的时候两个元素来回切换  待优化
    $("#zjyxq").val("")
    $("#zjyxqdate").val("")
    if (status == "1") {
        $("#zjyxq").val(yxq)
        $("#zjyxq").removeClass("hiddens")
        $("#zjyxq").addClass("shows")
        $("#zjyxqdate").addClass("hiddens")
        $("#zjyxqdate").removeClass("shows")
        return
    }
    if (status == "0") {
        $("#zjyxqdate").val(yxq)
        $("#zjyxq").addClass("hiddens")
        $("#zjyxq").removeClass("shows")
        $("#zjyxqdate").removeClass("hiddens")
        $("#zjyxqdate").addClass("shows")
        return
    }
}
// 初始化身份证设备
function hxgc_OpenReaders() {
    var SBstatus;
    layui.use(["layer", "urlrelated", "extension"], function () {
        var layer = layui.layer;
        var urlrelated = layui.urlrelated;
        var extension = layui.extension;
        var iResult = objActiveX.hxgc_OpenReader(g_iPort); //打开设备
        if (iResult == 0) {
            strSAMID = objActiveX.hxgc_GetSamIdToStr(g_iPort); //获取SAMID
            // 校验设备能不能用
            var data = {
                "platform": "1007",
                "appversion": "1.0.3",
                "apiversion": "1.0.2",
                "mac": "12345678",
                "ip": "xxx.xxx.xx.xx",
                "companyCode ": "1001",
                "token": localStorage.getItem("token"),
                "userId": localStorage.getItem("userId"), //登录用户信息_用户ID
                "data": {
                    deviceSn: strSAMID
                }
            }
            jQuery.support.cors = true;
            $.ajax({
                url: urlrelated.gatherCheckDevice,
                type: "post",
                data: JSON.stringify(data),
                dataType: "json",
                async: false,
                contentType: "application/json",
                success: function (dataList) {
                    if (dataList.status == 200) {
                        SBstatus = true;
                    } else {
                        layer.msg(dataList.message, {
                            icon: "5"
                        })
                        SBstatus = false;
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    var status = XMLHttpRequest.status
                    if (textStatus == "error" && status == "401") {
                        extension.errorLogin()
                        return false
                    }
                    if (textStatus == "error" && status != "401") {
                        extension.error()
                    }
                }
            })
            // document.getElementById("text_result").value = "打开设备成功.\r\nSAMID = " + strSAMID + ".";
        } else {
            // document.getElementById("text_result").value = "打开设备失败，错误代码：" + iResult + ".";
            // layuiOpen('err','身份证读卡器连接异常，请检查！');
            layer.alert('身份证读卡器连接异常，请检查', {
                resize: false,
                title: '<span  style="color: red;font-weight: bold">提示</span>'
            });
            SBstatus = false;
        }
    })
    return SBstatus;
}
// 点击去取二代证
function hxgc_ReadIDCards() {

    var ie = false;
    if ((!!window.ActiveXObject || "ActiveXObject" in window)) {
        ie = true;
    }
    try {
        objActiveX.hxgc_CloseReader(g_iPort)
    } catch (e) {
        if (ie) {
            var soft_open = top.layer.open({
                type: 1,
                title: '<span  style="color: red;">提示</span>',
                skin: 'layui-layer-demo', //样式类名
                area: ['450px', '210px'],
                resize: false,
                anim: 2,
                resize: false,
                shadeClose: false, //开启遮罩关闭
                content: '<div class="layui-card-body layui-text layadmin-text;"style="width:420px;text-align:center;overflow:hidden">' +
                    '<div  style="width:100%;font-size:24px;font-weight: bold;margin-bottom:35px;">' +
                    '<span  class="layui-icon layui-icon-tips" style="color:#FF9900;font-size:26px; vertical-align: middle"></span>' +
                    '<span   style="margin-left:5px;font-size:16px; font-weight: normal; vertical-align: middle">请先安装驱动</span>' +
                    '</div>' +
                    '<a href=' + localStorage.getItem("SFZurl") + ' style="color:#3B98FE;font-size: 13px;font-weight: normal;display:block;width:100%">点击下载驱动</a>' +
                    '</div>'
            });
        } else {
            top.layer.msg('请使用IE浏览器', {
                icon: 5
            });
        }
        return false;
    }
    if (!hxgc_OpenReaders()) {
        return false;
    }
    var iResult = objActiveX.hxgc_ReadIDCard(g_iPort); //读二代证
    var strPhotoBase64 = "";
    if (iResult == 0) {
        var storage = window.localStorage;
        var startDate = objActiveX.hxgc_GetBeginPeriodOfValidity(); //有效日期起始
        var endDate = objActiveX.hxgc_GetEndPeriodOfValidity(); //有效日期截止
        var yxq = "";
        var yxqs = "";
        if (isNaN(parseInt(endDate))) { //证件为长期
            yxqs = startDate.slice(0, 4) + "-" + startDate.slice(4, 6) + "-" + startDate.slice(6, 8) + " ~ " + endDate;
            yxqGetVal("1", yxqs)
        } else { //证件非长期
            yxqs = startDate.slice(0, 4) + "-" + startDate.slice(4, 6) + "-" + startDate.slice(6, 8) + " ~ " + endDate.slice(0, 4) + "-" + endDate.slice(4, 6) + "-" + endDate.slice(6, 8);
            yxqGetVal("0", yxqs)
        }


        //将照片保存到指定位置，格式为BMP格式
        iResut = objActiveX.hxgc_SavePhAsJpg(g_strPHPath, g_strJpgPHName);
        if (0 == iResut) {
            //获得JPG图片的BASE64编码
            strPhotoBase64 = objActiveX.hxgc_MakeFileToBeas64(g_strPHPath, g_strJpgPHName);
            sfxxcjZpdz = strPhotoBase64
            // document.all("imageCard").src = //显示图片
            $("#sbjg-card-l").attr("src", "data:image/jpeg;base64," + strPhotoBase64);
            cardImg = "data:image/jpeg;base64," + strPhotoBase64
        } else {
            layer.msg('err证件照片获取失败！', {
                icon: "5"
            });
            return;
        }
        var objActiveXmz = objActiveX.hxgc_GetNation();
        var GetBirthDate = objActiveX.hxgc_GetBirthDate() + "";
        var hxgc_GetBirthDate = GetBirthDate.slice(0, 4) + "-" + GetBirthDate.slice(4, 6) + "-" + GetBirthDate.slice(6, 8);
        //   获取数据里面所有的option   循环出对应
        //   var mz = $("#bcjr_mz option[x='"+objActiveX.hxgc_GetNation()+"族']").val()
        // var brithday = dateTool.dateToString(dateTool.stringToDate(objActiveX.hxgc_GetBirthDate(), "yyyyMMdd"));
        layui.use(['form', 'laydate', "jquery", "extension"], function () {
            var $ = layui.jquery,
                laydate = layui.laydate,
                extension = layui.extension,
                form = layui.form;
            // 拿到民族 下拉框的内容
            var mzs;
            $.each(mzList, function (i, item) {
                if (item.codeName == objActiveXmz + "族") {
                    mzs = item.codeIndex;

                }
            });
            form.render("select");
            active.removeDisable()
            laydate.render()
            form.val('identify-form-filter', {
                "xm": objActiveX.hxgc_GetName(), // 姓名
                "xb": objActiveX.hxgc_GetSex() == "男" ? "1" : "2", //性别
                "zjlx": "111", // 证件类型
                // "zjyxq": yxq,
                "mz": mzs,
                "gj": "156", // 国籍
                "zjzp": strPhotoBase64,
                "csrq": hxgc_GetBirthDate, //出生日期
                "hjdz": objActiveX.hxgc_GetAddress(), //地址
                "zjhm": objActiveX.hxgc_GetIDCode(), //身份证号
                "qfjg": objActiveX.hxgc_GetIssuingAuthority() //签发机关
            });
            ReadCardInfoo = {
                "xm": objActiveX.hxgc_GetName(), // 姓名
                "xb": objActiveX.hxgc_GetSex() == "男" ? "1" : "2", //性别
                "zjlx": "111", // 证件类型
                "mz": mzs,
                "gj": "156", // 国籍
                "zjyxqdate": $("#zjyxqdate").val() != "" ? $("#zjyxqdate").val() : "", //证件有效期
                "zjzp": strPhotoBase64,
                "csrq": hxgc_GetBirthDate, //出生日期
                "hjdz": objActiveX.hxgc_GetAddress(), //地址
                "zjhm": objActiveX.hxgc_GetIDCode(), //身份证号
                "qfjg": objActiveX.hxgc_GetIssuingAuthority() //签发机关
            };
            $("#zjhm").removeAttr('disabled').removeClass('layui-btn-disabled');
        });
        ReadCardInfo = 1;
        layer.msg('读取成功', {
            icon: "1"
        });

        //  所有的请选择消失
         $(".inputSpan").css("display", "none")
    } else {
        layer.alert('请将身份证放到设备上', {
            resize: false,
            title: '<span style="color: red;font-weight:bold">提示</span>'
        });
        // <img src="'+basePath+'/iias/img/ie8/denger.png"  style="width:20px;height: 16px;vertical-align: middle">
    }
}
layui.use(["form", "layer", "laydate", "urlrelated", "extension"], function () {
    var form = layui.form,
        laydate = layui.laydate,
        urlrelated = layui.urlrelated,
        extension = layui.extension,
        layer = layui.layer;
    var selectUrl = urlrelated.gatherGetCodeList;
    $("#querytype").val(localStorage.getItem("querytypeItem"))
    var QXUserName = localStorage.getItem("userName")
    if (QXUserName == "admin") {
        $("#sumbitForm").attr("disabled", "disabled").addClass('layui-btn-disabled');
        $("#sumbitForm").css("background", "#FBFBFB")
    }

    // laydate渲染
    /* 日期选择 */
    laydate.render({
        elem: '#csrq',
        max: (new Date()).getTime(),
        type: 'date' //时间选择器类型：'year'(年)  'month'(年月)  'date'(//默认，可不填)  'time'(时间)  'datetime'(日期时间)
            ,
        trigger: 'click' //采用click弹出
            ,
        theme: '#2F4056' //设置主题颜色
            ,
        done: function (value, date, endDate) {
            if (extension.isIE89()) {
                if (value !== "") {
                    $(".chushengriqi").css("display", "none")
                }
                if (value == "") {
                    $(".chushengriqi").css("display", "block")
                }
            }

        }
    });
    laydate.render({
        elem: '#zjyxqdate',
        type: 'date' //默认，可不填
            ,
        range: '~', //或 range: '~' 来自定义分割字符，
        btns: ['clear', 'confirm'] //显示清除和确认
            // ,max:curDateTime
            ,
        trigger: "click",
        theme: '#2F4056' //设置主题颜色
            ,
        done: function (value, date, endDate) {
            if (extension.isIE89()) {
                if (value !== "") {
                    $(".youxiaqi").css("display", "none")
                }
                if (value == "") {
                    $(".youxiaqi").css("display", "block")
                }
            }
        }
    });
     function  setSelect(url) {
        // 循环检索项接口
        var data = {
            "platform": "1007",
            "appversion": "1.0.3",
            "apiversion": "1.0.2",
            "mac": "12345678",
            "ip": "xxx.xxx.xx.xx",
            "companyCode ": "1001",
            "token": localStorage.getItem("token"),
            "userId": localStorage.getItem("userId") //登录用户信息_用户ID
        };
        var datas = JSON.stringify(data);
        jQuery.support.cors = true;
        $.ajax({
            url: url,
            type: "post",
            dataType: "json",
            async: false,
            data: datas,
            contentType: "application/json",
            success: function (datasss) {
                if (datasss.status == 200) {
                    var dataList = datasss.data;
                    mzList = dataList.mzList;
                    // 采集地点
                    function  addArr(arr,newArr){
                        if(arr.length  != 0 && arr != null){
                            $.each(arr, function (i, item) {
                                newArr.push({
                                    "codeName": item.codeName,
                                    "codeIndex": item.codeIndex
                                })
                            })
                        }else{
                            return  false
                        }
                    }
                    addArr(dataList.cjcdList,cjcdList)
                    addArr(dataList.ryflList,ryfl)
                    addArr(dataList.xbList,xbList)
                    // 生成下拉框
                    function addOption(optionList, Html) {
                        if(addOption.length  != 0 && addOption != null){
                            $.each(optionList, function (i, item) {
                                var option = new Option(item.codeName, item.codeIndex)
                                option.innerText = item.codeName;
                                Html.append(option); // 下拉菜单里添加元素
                            })
                        }else{
                            return false
                        }
                    }
                    addOption(dataList.mzList, $("#mz"))
                    addOption(dataList.zjlxList, $("#zjlx"))
                    addOption(dataList.gjList, $("#gj"))
                    addOption(dataList.xbList, $("#xb"))
                    $.each(dataList.mzList, function (i, item) {
                        mzDm.push(item)
                    });
                    $.each(dataList.zjlxList, function (i, item) {
                        zjlxArr.push(item)
                    });
                    $.each(dataList.gjList, function (i, item) {
                        gjArr.push(item)
                    });
                } else {
                    layer.msg(datasss.message, {
                        icon: "5"
                    })
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                var status = XMLHttpRequest.status
                if (textStatus == "error" && status == "401") {
                    extension.errorLogin()
                    return false
                }
                if (textStatus == "error" && status != "401") {
                    extension.error()
                    return false
                }
            }
        })
    }
    setSelect(selectUrl);
    // 识别成功之后要生成的结构   别问我为什么写在父页面    子页面太卡
    var nameLen = 0;

    function setCenterHtml(data) {
        $.each(data, function (ii, item) {
            people_info_list_html += '<span class="people_info_item  longText  rybh"   rybh=' + item.rybh + '>' + item.xm + '</span>'
            nameLen++
            if (item.zjbz == 1) {
                HMCJ_WZJCJBZ_NAME = "<span style='color:#1ABCA9';font-weight: bold>有证</span>"
            } else {
                HMCJ_WZJCJBZ_NAME = "<span style='color:red; font-weight: bold'>无证</span>"
            }
            var cyzjCyzjdm = item.cyzjCyzjdm, //证件类型
                mzdm = item.mzdm,
                mzdmm, //民族
                cyzjCyzjdms, gj, gjdm = item.gjdm; //国籍

            $.each(gjArr, function (ii, itemm) {
                if (gjdm == itemm.codeIndex) {
                    gj = itemm.codeName
                }
            })
            $.each(zjlxArr, function (ii, itemm) {
                if (cyzjCyzjdm == itemm.codeIndex) {
                    cyzjCyzjdms = itemm.codeName
                }
            })

            $.each(mzDm, function (i, item) {

                if (mzdm == item.codeIndex) {
                    mzdmm = item.codeName //民族
                }
            })
            var ryfls;
            $.each(ryfl, function (i, items) {
                if (item.ryfl == items.codeIndex) {
                    ryfls = items.codeName
                }
            })
            var cardSrc = item.zpdz ? "data:image/jpeg;base64," + item.zpdz : "/img/card-img.png"
            var itemlx = $("#zjlx").find("option").val()
            specialNames = item.specialNames; //专题库
            var ztkShow = item.specialNames ? "block" : "none"; //判断装题库是否显示
            var xbdm;
            $(xbList).each(function (i, itemm) { //性别循环
                if (itemm.codeIndex == item.xbdm) {
                    xbdm = itemm.codeName;
                }
            })
            var hmxxcjd = item.hmxxcjd; //采集地点
            $(cjcdList).each(function (ii, itemm) {
                if (itemm.codeIndex == item.hmxxcjd) {
                    hmxxcjd = itemm.codeName;
                }
            })
            var hmxxcjsj = active.formatDate(new Date(item.hmxxcjsj)) //采集时间
            var markNames = item.markNames ? item.markNames : "-",
                hjdzDzmc = item.hjdzDzmc ? item.hjdzDzmc : "-",
                qfjgmc = item.qfjgmc ? item.qfjgmc : "-",
                yxqx = item.yxqx ? item.yxqx : "-",
                lxdh1 = item.lxdh1 ? item.lxdh1 : "-",
                hmxxcjbz = item.hmxxcjbz ? item.hmxxcjbz : "-",
                lxdh2 = item.lxdh2 ? item.lxdh2 : "-";
            var ztkmc = "";
            if (item.specialNames != null && item.specialNames != "" || item.bzly == 1 && item.ryfl == "020") {
                if (item.bzly == 1 && item.ryfl == "020") {
                    ztkmc = "人员分类："
                } else {
                    ztkmc = "专题库："
                }
            }
            // 国籍代码处理
            centerHtml += '<div class="center">\
                            <div class="layui-form-item" style="width:330px;margin-left: 125px">\
                            <div class="layui-input-block "   style="height:190px;margin-left:0px">\
                                <div   class="imgParpent" style="float: left;height:190px;">\
                                    <img id="sbjg-card-r" src=' + cardSrc + ' style="width: 152px; height: 190px;">\
                                </div>\
                                <span  class="yzwzbz bzbz"><i class="layui-icon layui-icon-ok"></i>比中</span>\
                                <span  class="yzwzbz wbzbz"><i class="layui-icon layui-icon-close"></i>未比中</span>\
                                <div class="people_info_img_right">\
                                    <span id="sbjg-zjbz">' + HMCJ_WZJCJBZ_NAME + '</span>\
                                    <span  style="display:' + ztkShow + '">' + ztkmc + '</span>\
                                    <span   class="addTitle"  style="display:' + ztkShow + ';color:red;font-weight:bold;"> ' + specialNames + ' </span>\
                                </div>\
                            </div>\
                        </div>\
                    <div id="show-form-1" style="margin-top:20px;">\
                        <div class="layui-form-item">\
                            <label class="layui-form-label label_width">姓名：</label>\
                            <div class="layui-input-block longText marginLeft  sfbzruxm  sbjg-bcjrxm   addTitle" id="sbjg-bcjrxm" style=" height: 36px; line-height: 36px;  border-bottom: 1px #d2d2d2 solid;">' + item.xm + '</div>\
                        </div>\
                        <div class="layui-form-item" >\
                            <label class="layui-form-label label_width">证件类型：</label>\
                            <div class="layui-input-block marginLeft addTitle  sbjg-zjlx"  id="sbjg-zjlx" style="height: 36px; line-height: 36px;  border-bottom: 1px #d2d2d2 solid;" addAttr=' + cyzjCyzjdm + '>' + cyzjCyzjdms + '</div>\
                       </div>\
                        <div class="layui-form-item" >\
                            <label class="layui-form-label label_width">证件号：</label>\
                            <div class="layui-input-block longText marginLeft sbjg-zjhm"  id="sbjg-zjhm" style=" height: 36px; line-height: 36px;  border-bottom: 1px #d2d2d2 solid;">' + item.cyzjZjhm + '</div>\
                        </div>\
                        <div class="layui-form-item" >\
                            <label class="layui-form-label label_width">性别：</label>\
                            <div class="layui-input-block marginLeft   sbjg-xb" id="sbjg-xb"  addAttr=' + item.xbdm + '   style=" height: 36px; line-height: 36px; border-bottom: 1px #d2d2d2 solid;">' + xbdm + '</div>\
                        </div>\
                        <div class="layui-form-item" >\
                            <label class="layui-form-label label_width">出生日期：</label>\
                            <div class="layui-input-block marginLeft sbjg-csrq" id="sbjg-csrq" style=" height: 36px; line-height: 36px;   border-bottom: 1px #d2d2d2 solid;">' + item.csrqStr + '</div>\
                        </div>\
                        <div class="layui-form-item" >\
                            <label class="layui-form-label label_width">国籍：</label>\
                            <div class="layui-input-block marginLeft  addTitle  sbjg-gj" id="sbjg-gj" style="height: 36px; line-height: 36px;  border-bottom: 1px #d2d2d2 solid;" addAttr=' + item.gjdm + '>' + gj + '</div>\
                        </div>\
                        <div class="layui-form-item" >\
                            <label class="layui-form-label label_width">民族：</label>\
                            <div class="layui-input-block marginLeft  sbjg-mz" id="sbjg-mz" style="height: 36px; line-height: 36px;  border-bottom: 1px #d2d2d2 solid;"  addAttr=' + item.mzdm + '>' + mzdmm + '</div>\
                        </div>\
                        <div class="layui-form-item" >\
                            <label class="layui-form-label label_width">户籍地址：</label>\
                            <div class="layui-input-block longText marginLeft   addTitle  sbjg-hjdz"  id="sbjg-hjdz" style=" height: 36px; line-height: 36px; border-bottom: 1px #d2d2d2 solid;">' + hjdzDzmc + '</div>\
                        </div>\
                        <div class="layui-form-item" >\
                            <label class="layui-form-label label_width">证件签发机构：</label>\
                            <div class="layui-input-block longText marginLeft  addTitle  sbjg-zjqfjg" id="sbjg-zjqfjg" style=" height: 36px; line-height: 36px;  border-bottom: 1px #d2d2d2 solid;">' + qfjgmc + '</div>\
                        </div>\
                        <div class="layui-form-item" >\
                            <label class="layui-form-label label_width">证件有效期：</label>\
                            <div class="layui-input-block marginLeft  sbjg-zjyxq" id="sbjg-zjyxq" style=" height: 36px; line-height: 36px;   border-bottom: 1px #d2d2d2 solid;">' + yxqx + '</div>\
                        </div>\
                        <div class="layui-form-item" >\
                            <label class="layui-form-label label_width"> 手机号码：</label>\
                            <div class="layui-input-block marginLeft  sbjg-sjhm" id="sbjg-sjhm" style=" height: 36px; line-height: 36px;   border-bottom: 1px #d2d2d2 solid;">' + lxdh1 + '</div>\
                        </div>\
                        <div class="layui-form-item" >\
                            <label class="layui-form-label label_width"> 其他联系电话：</label>\
                            <div class="layui-input-block marginLeft  sbjg-qtlxdh" id ="sbjg-qtlxdh" style="height: 36px; line-height: 36px;  border-bottom: 1px #d2d2d2 solid;">' + lxdh2 + '</div>\
                        </div>\
                        <div class="layui-form-item" >\
                            <label class="layui-form-label label_width">人员分类：</label>\
                            <div class="layui-input-block   longText  addTitle  marginLeft" id="ryfl" style="height: 36px; line-height: 36px;  border-bottom: 1px #d2d2d2 solid;">' + ryfls + '</div>\
                        </div>\
                        <div class="layui-form-item" >\
                            <label class="layui-form-label label_width">人员标签：</label>\
                            <div class="layui-input-block   longText addTitle   marginLeft" id="rybq" style="height: 36px; line-height: 36px;  border-bottom: 1px #d2d2d2 solid;">' + markNames + '</div>\
                        </div>\
                    </div>\
                </div>'
            //左侧编号之类的

            leftHtml += '<div   class="left_info_item">\
                    <div class="layui-form-item">\
                        <label class="layui-form-label label_width  first_label_width  cjbhBlock">采集编号：</label>\
                        <div class="layui-input-block marginLeft sbjg-cjbh"   id="sbjg-cjbh" style=" height: 36px; line-height: 36px;   border-bottom: 1px #d2d2d2 solid;" >' + item.hmxxcjbh + '</div>\
                    </div>\
                    <div class="layui-form-item" >\
                        <label class="layui-form-label label_width   first_label_width  cjsjBlock">采集时间：</label>\
                        <div class="layui-input-block marginLeft" id="sbjg-cjsj" style=" height: 36px; line-height: 36px;   border-bottom: 1px #d2d2d2 solid;">' + hmxxcjsj + '</div>\
                    </div>\
                    <div class="layui-form-item" >\
                        <label class="layui-form-label label_width  first_label_width">采集人：</label>\
                        <div class="layui-input-block  marginLeft longText  addTitle" id="sbjg-cjr" style="height: 36px; line-height: 36px;    border-bottom: 1px #d2d2d2 solid;">' + item.hmxxcjr + '</div>\
                    </div>\
                    <div class="layui-form-item" >\
                        <label class="layui-form-label label_width  first_label_width">采集点：</label>\
                        <div class="layui-input-block marginLeft addTitle longText" id="sbjg-cjd" style=" height: 36px; line-height: 36px;    border-bottom: 1px #d2d2d2 solid;">' + hmxxcjd + '</div>\
                    </div>\
                    <div class="layui-form-item" >\
                        <label class="layui-form-label label_width  first_label_width  addTitle">采集备注：</label>\
                        <div class="layui-input-block longText marginLeft  addTitle" style="height: 36px; line-height: 36px; border-bottom: 1px #d2d2d2 solid;" id="sbjg-cjbz">' + hmxxcjbz + '</div>\
                    </div>\
                    </div>'
        })
    }

    function removeRightVal() {
        form.val('identify-form-filter', {
            "xm": "", // 姓名
            "xb": "", //性别
            "mzright": "",
            "zjlx": "", // 证件类型
            "gj": "", // 国籍
            "zjzp": "",
            "csrq": "", //出生日期
            "hjdz": "", //地址
            "zjhm": "", //身份证号
            "qfjg": "" ,//签发机
            "mz":""
        });
        $("#zjyxq").val("")
        $("#zjyxqdate").val("")
        $("#zjyxq").addClass("hiddens")
        $("#zjyxq").removeClass("shows")
        $("#zjyxqdate").removeClass("hiddens")
        $("#zjyxqdate").removeClass("shows")
        if(extension.isIE89()){
            $(".inputSpan").css("display","block")
        }

    }
    //读取二代证
    $("#dqedsfz").click(function () {
        removeRightVal()
        hxgc_ReadIDCards();
    });
    //  手工输入
    $("#sgrl").on("click", function () {
        removeRightVal()
        active.removeDisable();
        active.removeVal()
        form.render()
        strSAMID = ""
    });
    // 开始采集
    var nameLen;
    var people_info_list_html = "",
        len = 0
    var leftHtml = "";
    var centerHtml = ""
    $("#identify-iris-ui").on("click", function () {
        //  表单  按钮的初始状态
        localStorage.removeItem("identifyData") //删除缓存
        people_info_list_html = ""
        leftHtml = "";
        centerHtml = "";
        localStorage.removeItem("picInfo")
        $("#centerHtml").html(active.initCenterHtml()) //页面回到最初状态
        $(".people_info_list").html("")
        $("#left_info").html(active.initLeftHtml())
        $(".zypf").html('左眼')
        $(".yypf").html('右眼')
        nameLen = 0
        var people_info_RS_htm = ""
        // $("#identify-record-ui").css("display","none")
        $(".info").css("display", "none")
        $("#sbjg-eye-r").attr("src", "/img/eye.png")
        $("#sbjg-eye-l").attr("src", "/img/eye.png")
        // 表单赋值
        form.val('identify-form-filter', {
            "xm": "", // 姓名
            "xb": "", //性别
            "zjlx": "", // 证件类型
            "gj": "", // 国籍
            "yxq": "", //证件有效期
            "zjzp": "",
            "csrq": "", //出生日期
            "hjdz": "", //地址
            "zjhm": "", //身份证号
            "qfjg": "" //签发机关
        });
        active.addDisable();
        active.removeVal();
        form.render();
        $("#sbjg-lsjl").css("display", "none")

        var iris_width, iris_height;
        var wiodeWidth = $(window).width();
        if (wiodeWidth < 1130) {
            iris_width = 520 + "px", iris_height = 370 + "px"
        } else {
            iris_width = 755 + "px", iris_height = 430 + "px"
        }
        layer.open({
            title: '虹膜采集',
            type: 2,
            move: false,
            area: [iris_width, iris_height],
            resize: false,
            content: ['/html/identify/identify_iris.html', "no"],
            success: function (layero) {

                var iframeWin = window[layero.find('iframe')[0]['name']],
                    Biometrics = iframeWin.document.getElementById("Biometrics"),
                    imgPrent = iframeWin.document.getElementById("imgPrent"),
                    BiometricsP = iframeWin.document.getElementById("OBJECTPrent"),
                    gather_start_id = iframeWin.document.getElementById("identiry-start-id"),
                    force_id = iframeWin.document.getElementById("force-id"),
                    reght_select = iframeWin.document.getElementById("reght_select"),
                    reght_lable = iframeWin.document.getElementById("reght_lable");
                if (iris_width <= 520 + "px") {
                    $(imgPrent).css({
                        "width": "505px",
                        "height": "180px",
                        "background": "url('/img/irisPicSmall.jpg')"
                    })
                    $(Biometrics).css({
                        "width": "505px",
                        "height": "179px",
                        "top": "42px"
                    })
                    $(BiometricsP).css({
                        "width": "505px",
                        "height": "175px",
                        "margin-top": "0px"
                    })
                    $(gather_start_id).css({
                        "margin-top": "5px"
                    })
                    $(force_id).css({
                        "margin-top": "5px"
                    })
                    $(reght_select).css({
                        "float": "right"
                    })
                    $(reght_lable).css({
                        "margin-left": "34px"
                    })
                } else {
                    $(BiometricsP).css({
                        "margin-top": "25px"
                    })
                    $(imgPrent).css({
                        "margin-top": "22px"
                    })
                }
            },
            end: function () {
                // 关闭弹窗时候判断是不是采集 
                var sfcjcgbz = $("#sfcjcgbz").val();
                if (sfcjcgbz == "1") { //采集成功   不管是强制采集还是正常采集都是成功赋值   采集状态都为1
                    var loadingIndex = layer.load(1, {
                        shade: 0.3
                    })
                    setTimeout(function () { //为什么按个定时器呢   因为ie8 速度太快取缓存取不到值
                        jQuery.support.cors = true;
                        $.ajax({
                            url: urlrelated.identify,
                            type: "post",
                            data: localStorage.getItem("identifyData"),
                            dataType: "json",
                            timeout: 120000,
                            contentType: "application/json",
                            success: function (data) {
                                var datas = data.data;
                                layer.close(loadingIndex)
                                if (data.status == 200) {
                                    if (datas == undefined || datas.length == 0) {
                                        layer.msg("该人员未做采集,请及时进行采集操作", {
                                            icon: "5"
                                        })
                                        return false;
                                    }
                                    var hmxxdbhs = datas[0].hmxxdbhs;
                                    var bjnr = [],
                                        bjnrs = "";
                                    $(datas).each(function (i, item) {
                                        if (item.specialNames != null && item.specialNames != "" || item.bzly == 1 && item.ryfl == "020") {
                                            var ztkmc = "";
                                            if (item.bzly == 1 && item.ryfl == "020") {
                                                ztkmc = "人员分类："
                                            } else {
                                                ztkmc = "专题库："
                                            }
                                            bjnr.push({
                                                "name": item.xm,
                                                "ryfl": item.specialNames,
                                                "ztkmc": ztkmc
                                            })
                                        }
                                    })
                                    // 弹窗高度设定
                                    var warginLen = 0;
                                    //   生成报警信息结构
                                    if (bjnr.length != 0) {
                                        $(bjnr).each(function (i, item) {
                                            warginLen++
                                            bjnrs += '<div style="height:140px;"  class="bjtc">' +
                                                '<span class="layer-content-span  addTitle  presonName"   style="display:block;height:40px;font-size:14px;text-indent:40px;line-height:40px;width:463px;white-space:nowrap; overflow:hidden;text-overflow:ellipsis;">姓名：' + item.name + '</span>' +
                                                '<div  style="color:red;text-indent:25px;font-weight: bold">' +
                                                '<span style="float:left">' + item.ztkmc + '</span>' +
                                                '<span  class="addTitle"   style="width:370px;float:left;text-indent:3px;max-height:100px;float:left;overflow:hidden">' + item.ryfl + '</span>' +
                                                '</div>' +
                                                '</div>'
                                        })
                                    }
                                    var layerHeight = 140,
                                        hideShow = "hidden",
                                        layerHeighta = 0;
                                    if (layerHeight != 0) {
                                        layerHeighta = parseInt(layerHeight) * parseInt(warginLen)
                                    }
                                    if (warginLen == 1) {
                                        hideShow = "hidden"
                                        layerHeighta = 140
                                    }
                                    if (warginLen >= 2) {
                                        layerHeighta = 280
                                        if (warginLen == 2) {
                                            hideShow = "hidden"
                                        }
                                        if (warginLen > 2) {
                                            hideShow = "scroll"
                                        }
                                    }

                                    // // 转图库报警信息人员弹出
                                    if (bjnr.length != 0) {
                                        layer.open({
                                            type: 1,
                                            resize: false,
                                            title: "<img src='/img/baojing.png'  style='height:30px;width:30px;float:left;margin-top:5px'/><div style='color:red;width:60px;float:left;font-size:16px;margin-left:10px'>告警</div>",
                                            btn: "确定",
                                            area: ["515px", layerHeighta],
                                            content: '<div   class="zjycz" style="height:' + layerHeighta + "px" + '; overflow-y:' + hideShow + ' ">' + bjnrs + '</div>',
                                            success: function () {
                                                if (warginLen == 1) {
                                                    $(".presonName").css("margin-top", "30px")
                                                } else {
                                                    $(".presonName").css("margin-top", "0px")
                                                }
                                                $(".addTitle").each(function (i, item) { //长度超出鼠标移入title
                                                    $(item).hover(function () {
                                                        var text = $(this).text()
                                                        $(this).attr("title", text)
                                                    })
                                                })
                                            }
                                        })
                                    }
                                    setCenterHtml(datas)
                                    var picInfo = JSON.parse(localStorage.getItem("picInfo"))
                                    var E30Cs = JSON.parse(localStorage.getItem("identifyData")) //e30参数
                                    // debugger
                                    if (picInfo.sLeftJpegCache != null) {
                                        $("#sbjg-eye-l").attr("src", "data:image/jpeg;base64," + picInfo.sLeftJpegCache) //眼睛
                                    }
                                    //  左右眼存进缓存   如果没有那么设备就是默认路径
                                    if (picInfo.sRightJpegCache != null) {
                                        $("#sbjg-eye-r").attr("src", "data:image/jpeg;base64," + picInfo.sRightJpegCache) //眼睛
                                    }
                                    // 父页面赋值
                                    $("#centerHtml").html(centerHtml)
                                    $(".zypf").html('左眼（' + picInfo.QualityScoreL + '）')
                                    $(".yypf").html('右眼（' + picInfo.QualityScoreR + '）')
                                    $("#left_info").html(leftHtml)
                                    $(".info").css("display", "block")
                                    $(".left_info_item").css("display", "none")
                                    $("#sbjg-lsjl").css("display", "block")
                                    $(".people_info_list").html(people_info_list_html)
                                    //动态算出要移动的元素的宽度 
                                    $(".people_info_list").css("width", Math.ceil(nameLen / 3) * 250)
                                    $(".len").val(nameLen)
                                    people_info_RS_html = '共' + nameLen + '人'
                                    $(".people_info_RS").html(people_info_RS_html)
                                    // 读取成功disable去掉
                                    $("#dqedsfz").removeAttr('disabled')
                                    $("#dqedsfz").removeClass('layui-btn-disabled');
                                    $("#dqedsfz").css("background-color", "#2F4056")
                                    $("#sgrl").removeAttr('disabled')
                                    $("#sgrl").removeClass('layui-btn-disabled');
                                    $("#sgrl").css("background-color", "#2F4056")
                                    $(".center").eq(0).css("display", "block");
                                    $(".people_info_item").eq(0).addClass("clickThis");
                                    $(".left_info_item").eq(0).css("display", "block");
                                    $("#sbjg-lsjl").css("display", "block")
                                    $("#sbjg-sbhs").html("对比耗时：" + hmxxdbhs + "秒") //采集耗时hmcjCjhs

                                    $(".addTitle").each(function (i, item) { //长度超出鼠标移入title
                                        $(item).hover(function () {
                                            var text = $(this).text()
                                            $(this).attr("title", text)
                                        })
                                    })
                                    len = parseInt($(".len").val())
                                    layer.close(loadingIndex) //关闭弹窗

                                } else {
                                    layer.msg(data.message, {
                                        icon: "5"
                                    })
                                    layer.close(loadingIndex)
                                }
                            },
                            error: function (XMLHttpRequest, textStatus, errorThrown) {
                                var status = XMLHttpRequest.status;
                                layer.close(loadingIndex)
                                if (textStatus == "error" && status == "401") {
                                    extension.errorLogin()
                                    return false
                                }
                                if (textStatus == "error" && status != "401") {
                                    layer.msg("采集失败", {
                                        icon: "5"
                                    })
                                }
                                if (textStatus == "timeout") {
                                    extension.timeOut()
                                }
                            }
                        });
                    }, 200)
                } else {
                    // layer.msg("关闭窗口")
                }
            }
        });
    });
    // 识别出的人名点击
    $(document).on("click", ".people_info_item", function () {
        $(".people_info_item").removeClass("clickThis");
        $(this).addClass("clickThis");
        var thisIndex = $(this).index();
        var centers = $(".center");
        var leftItems = $(".left_info_item");
        $(".left_info_item").css("display", "none")
        $.each(centers, function (i, item) {
            $(item).css("display", "none");
            if ($(item).index() == thisIndex) {
                $(item).css("display", "block");
                $(leftItems).eq(i).css("display", "block")
            }
        })
    });
    var n = 0;
    $(".people_info_prve").click(function () {
        // 限制点击上一页点出去
        if (n <= 0) {
            n = 0;
            return false
        } else {
            n--;
        }
        $(".people_info_list").css("left", -231 * n)
    });

    $(".people_info_next").click(function () {
        var arrLen = Math.floor((len - 1) / 3);
        if (n >= arrLen) {
            n = arrLen;
            return false;
        } else {
            n++
        }
        $(".people_info_list").css("left", -231 * n)
    });
    //   历史识别记录点击
    var windwWidth = $(window).width();
    $('#identify-record-ui').on('click', function () {
        // form.render(null, 'identify-form-filter');
        var historyWidth, historyHeight;
        if (windwWidth > 1200) {
            historyWidth = "690px";
            historyHeight = "560px"
        } else {
            historyWidth = "690px";
            historyHeight = "460px"
        }
        layer.open({
            title: '识别历史记录',
            type: 2,
            area: [historyWidth, historyHeight],
            resize: false,
            btn: "关闭",
            content: ['/html/identify/identify_history.html'],
            skin: 'mySkin',
            success: function () {
                // 当前选中的人员编号
                var rybh = $(".clickThis").attr("rybh")
                localStorage.setItem("rybh", rybh)
            }
        });

    });

    // 鼠标移入显示全部



    // 验证身份证格式
    var reg18 = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/; //18位身份证验证
    var reg15 = /^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}[0-9Xx]$/; //15位身份证验证
    var phone = /^[0-9]{0,20}$/; //0-20位数字  电话号码
    var bcjr_xm = /^[a-zA-Z\u4e00-\u9fa5]{0,50}$/; //50位字母和中文  姓名
    // 验证身份证号码    取出身份证号码
    function chenkBirth(num) {

        num = num.toUpperCase(); //身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X。
        var brithBz = -1;
        //下面分别分析出生日期
        var len, re;
        len = num.length;
        if (len == 15) {
            re = new RegExp(/^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/);
            var arrSplit = num.match(re); //检查生日日期是否正确
            var dtmBirth = new Date('19' + arrSplit[2] + '/' + arrSplit[3] + '/' + arrSplit[4]);
            var bGoodDay;
            bGoodDay = (dtmBirth.getYear() == Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) == Number(arrSplit[3])) && (dtmBirth.getDate() == Number(arrSplit[4]));
            if (bGoodDay) {
                brithBz = 0;
                return brithBz;
            }
        }
        if (len == 18) {
            re = new RegExp(/^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/);
            var arrSplit = num.match(re); //检查生日日期是否正确
            var dtmBirth = new Date(arrSplit[2] + "/" + arrSplit[3] + "/" + arrSplit[4]);
            var bGoodDay;
            bGoodDay = (dtmBirth.getFullYear() == Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) == Number(arrSplit[3])) && (dtmBirth.getDate() == Number(arrSplit[4]));
            if (bGoodDay) {
                brithBz = 0;
                return brithBz;
            }
        }
        return brithBz;
    }

    function sfnhmjy() {
        var zjhm = $("#zjhm").val();
        var val = $("#zjlx").next().find("input").val();
        //多一层身份证
        if (val == "身份证") {
            if (reg18.test(zjhm) === true || reg15.test(zjhm) === true) {
                if (chenkBirth(zjhm) == 0) {
                    var birthday = getBirthday(zjhm);
                    $("#csrq").val(birthday);
                    $('#zjhm').removeClass("layui-form-danger")
                    return false;
                }
            } else {
                layer.msg("身份证号码不正确", {
                    icon: 5
                })
                $('#zjhm').addClass("layui-form-danger")
                $("#csrq").val("");
                return false
            }
            // if(isIE8pd()){
            //     $(".dateSpan").css("display","block")
            // }
        }
    }
    // 身份证号码校验
    $("#zjhm").on("blur", function () {
        sfnhmjy()
    })

    form.on("select(zjlx)", function (obj) {
        var thisVal = obj.value
        var sfzVal = $("#zjhm").val();
        if (sfzVal != "") {
            sfnhmjy()
        }
        if (thisVal == "999") {
            $('#zjhm').val("")
            $("#zjhm").attr("disabled", "disabled").addClass('layui-btn-disabled');
        } else {
            $("#zjhm").attr("disabled", false).removeClass('layui-btn-disabled');
        }
    })




    //没有比中红框
    function hy(items, bb) {
        // 有的是拿证件代码过来对比的 
        items.each(function (i, item) {
            $(item).css("border-bottom", "1px  solid  #E6E6E6") //每次点击都要有一个初始状态
            var text = $(item).text()
            var t=bb.replace(/^\s+|\s+$/g, '')
            if ($(items).attr("addAttr")) { //判断是那字段来比较还是证件代码
                var attr = $(item).attr("addAttr");
                if (attr != t) {
                    $(item).css("border-bottom", "1px  solid red")
                    $(item).parents(".center").addClass("wbz")
                } else {
                    $(item).css("border-bottom", "none")
                    $(item).css("border-bottom", "1px  solid  #E6E6E6")
                }
            } else {
                if(text == "-"){
                    text = "";//处理无证件状态
                }
                if (text != t) {
                    $(item).css("border-bottom", "1px  solid red")
                    $(item).parents(".center").addClass("wbz")
                } else {
                    $(item).css("border-bottom", "none")
                    $(item).css("border-bottom", "1px  solid  #E6E6E6")
                }
            }

        })
    }

    $("#sumbitForm").click(function () {
        //   阻止不提示  直接进行input框校验
        var rSrc = $("#sbjg-eye-r").attr("src")
        var lSrc = $("#sbjg-eye-l").attr("src")
        if (rSrc == "/img/eye.png" && lSrc == "/img/eye.png") {
            layer.msg("请先识别虹膜", {
                icon: "5"
            })
            return false
        }
        if ($("#xm").hasClass("layui-btn-disabled")) {
            layer.msg("请先读取或录入核验信息", {
                icon: "5"
            })
            return false
        }
        var bcjr_zjlxdmVal = $("#zjlx").val()
        if (bcjr_zjlxdmVal == "999") { //无证件
            $("#zjhm").removeAttr("lay-verify") //无证件不校验非空
        }
        return
    })
    // 重置
    $("#reset").click(function () {
        window.location.reload()

    })

    //点击提交 
    form.on("submit", function (datas) {
        var field = datas.field;
        var indexl = layer.load(1, {
            shade: 0.3
        })
        $(".center").removeClass("wbz") //清空未比中标志
        //  提交时后  当前代码跟身份证信息读出来的不一致 就都是无证类型
        var  sfzzp;//身份证照片
        if (ReadCardInfoo) {
            if (ReadCardInfoo.xm != field.xm || ReadCardInfoo.xb != field.xb ||
                ReadCardInfoo.zjlx != field.zjlx || ReadCardInfoo.gj != field.gj || ReadCardInfoo.zjhm != field.zjhm ||
                ReadCardInfoo.csrq != field.csrq || ReadCardInfoo.mz != field.mz) {
                ReadCardInfo = 0;
                sfzzp = "";
            } else {
                ReadCardInfo = 1;
                sfzzp=sfxxcjZpdz;
            }
        } else {
            sfzzp = "";
            ReadCardInfo = 0;
        }
        var yxq = ""; //身份证有效期
        if ($("#zjyxqdate").is(".shows")) {
            yxq = $("#zjyxqdate").val()
        }
        if ($("#zjyxq").is(".shows")) {
            yxq = $("#zjyxq").val()
        }
        //  获取右侧内容
        var xm = field.xm,
            zjlx = field.zjlx,
            zjhm = field.zjhm,
            xb = field.xb,
            csrq = field.csrq,
            gj = field.gj,
            mz = field.mz,
            hjdz = field.hjdz,
            qfjg = field.qfjg;
        $(".wbzbz").css("display", "none")
        $(".bzbz").css("display", "none")
        // 证件核验   给未比中添加wbz   class    标红下划线效果
        hy($(".sbjg-zjlx"),zjlx)//证件类型核验
        hy($(".sbjg-zjhm"),zjhm)
        hy($(".sbjg-bcjrxm"), xm)
        hy($(".sbjg-xb"), xb)
        hy($(".sbjg-csrq"), csrq)
        hy($(".sbjg-gj"), gj)
        hy($(".sbjg-mz"), mz)
        // 获取人员信息数组
        var ryList = [];
        $(".people_info_item").each(function (i, item) {
            // if ($(item).hasClass("clickThis")) {
            var prensName = $(item).text() //当前选中人名
            var cjbh = $(".sbjg-cjbh").eq(i).text() //  当前人采集编号
            var rybh = $(".rybh").eq(i).attr("rybh") //当前人人员编号
            var sfbz;
            if ($(".center").eq(i).hasClass("wbz")) {
                sfbz = 2; //当前人是否比中
            } else {
                sfbz = 1; //当前人是否比中
            }
            ryList.push({
                "hmhyPpjgbdm": sfbz,
                "rybh": rybh == "null" ? "" : rybh,
                "hmxxcjbh": cjbh
            })
            // }
        })

        function setDate(date) {
            var dater = "",
                dates;
            if (extension.isIE89()) { //IE89截取时间日期方法要用斜杠区分
                date = date + "";
                dates = date.split("-").join("/")
            } else {
                dates = date;
            }
            dater = new Date(dates);
            dater = dater.getTime();
            return dater
        }
        var data1 = {
            "platform": "1007",
            "appversion": "1.0.3",
            "apiversion": "1.0.2",
            "mac": "12345678",
            "ip": "xxx.xxx.xx.xx",
            "companyCode ": "1001",
            "token": localStorage.getItem("token"),
            "userId": localStorage.getItem("userId"), //登录用户信息_用户ID
            "data": {
                "ryxxList": ryList,
                'sfxxcjXm': xm, // 采集对象姓名
                "sfxxcjXbdm": xb, // 身份信息采集_性别代码
                "sfxxcjGjdm": gj, // 身份信息采集_国籍代码
                "sfxxcjMzdm": mz, // 身份信息采集_民族代码   ----------------------------------- 民族代码
                "sfxxcjCsrq": setDate(csrq), // 出生日期
                "sfxxcjCyzjCyzjdm": zjlx,
                "hmcjSbbh": strSAMID, //身份证读卡器设备编号
                "sfxxcjCyzjZjhm": zjhm,
                "sfxxcjQfjg": qfjg, // 身份信息采集_签发机关
                "sfxxcjYxqx": yxq, // 证件有效期-开始日期
                "sfxxcjHjdzDzmc": hjdz, // 身份信息采集_户籍地址_地址名称
                "sfxxcjZjbz": ReadCardInfo, // 证件标志：1-有证，0-无证
                "sfxxcjCjbz": ReadCardInfo, // 采集录入标志位 1:读证录入 2:手工录入 3:警综录入
                "sfxxcjZpdz":sfzzp, // 身份证头像
                "userId": localStorage.getItem("userId"), //登录用户信息_用户ID
                "userPoliceId": localStorage.getItem("policeId"), //登录用户信息 警号
                "jgxxJgid": localStorage.getItem("JGID"), //登录用户信息 机构ID
                "jgxxGajgjgdm": localStorage.getItem("userJGDM"), //登录用户信息 机构代码
                "userName": localStorage.getItem("userName"), //登录用户信息 登录名
                "userRealname": localStorage.getItem("userRealname"), //登录用户信息 姓名
                "userPlaceCode": localStorage.getItem("userPlaceCode"), //采集地代码
                "userPlaceName": localStorage.getItem("userPlaceName") //采集地代码
            }
        }
        var adata2 = JSON.stringify(data1)
        jQuery.support.cors = true;
        $.ajax({
            url: urlrelated.collectionIdentifyCompare,
            type: "POST",
            data: adata2,
            dataType: "json",
            async: false,
            timeout: 120000,
            contentType: "application/json",
            success: function (data) {
                layer.close(indexl)
                if (data.status == 200) {
                    var wbzxm = "",
                        color, title, classd, warginLen = 0;
                    $(".center").each(function (i, item) {
                        var wbzName = $(item).find(".sfbzruxm").text() //人员姓名
                        if ($(item).hasClass("wbz")) {
                            color = "red"
                            title = "证件信息不一致"
                            $(item).find(".wbzbz").css("display", "block")
                            $(item).parent().prev().find(".people_info_item").eq(i).removeClass("bzcolor")
                            $(item).parent().prev().find(".people_info_item").eq(i).addClass("wbzcolor")
                        } else {
                            $(item).parent().prev().find(".people_info_item").eq(i).removeClass("bzcolor")
                            $(item).parent().prev().find(".people_info_item").eq(i).addClass("bzcolor")
                            $(item).find(".bzbz").css("display", "block")
                            color = "#1ABCBE"
                            title = "证件信息一致"
                        }
                        warginLen++
                        wbzxm += '<div style="height:80px;"  class="bjtc">' +
                            '<span class="layer-content-span  addTitle  preonName"   style="display:block;height:40px;font-size:14px;text-indent:40px;line-height:40px;width:463px;white-space:nowrap; overflow:hidden;text-overflow:ellipsis;">人员姓名：' + wbzName + '</span>' +
                            '<div  style="font-size:14px;color:red;text-indent:25px;line-height:18px;font-weight: bold">' +
                            '<span   style="width:370px;float:left;text-indent:3px;color:' + color + ';text-indent:110px;">' + title + '</span>' +
                            '</div>' +
                            '</div>'
                    })
                    var layerHeight = 140,
                        hideShow = "",
                        layerHeighta = 0;
                    if (warginLen != 0) {
                        layerHeighta = parseInt(layerHeight) * parseInt(warginLen)
                    }
                    if (warginLen == 1) {
                        hideShow = "hidden"
                        layerHeighta = 140
                    }
                    if (warginLen >= 2) {
                        layerHeighta = 160
                        if (warginLen == 2) {
                            hideShow = "hidden"
                        }
                        if (warginLen > 2) {
                            hideShow = "scroll"
                        }
                    }
                    layer.open({
                        type: "1",
                        title: "<span style='color:red; font-weight: bold'>提示</span>",
                        resize: false,
                        area: ["515px", layerHeighta],
                        btn: "确定",
                        content: '<div   class="zjycz" style="height:' + layerHeighta + "px" + '; overflow-y:' + hideShow + ' ">' + wbzxm + '</div>',
                        success: function () {
                            if (warginLen == 1) {
                                $(".preonName").css("margin-top", "30px")
                            } else {
                                $(".preonName").css("margin-top", "0px")
                            }
                            $(".addTitle").hover(function () {
                                var text = $(this).text()
                                $(this).attr("title", text)
                            })
                        }
                    })
                } else {
                    $(".center").removeClass("wbz") //清空未比中标志
                    $(".center").find(".layui-input-block").css("border-bottom", "1px  solid  #E6E6E6")
                    layer.msg(data.message, {
                        icon: "5"
                    })
                    layer.close(indexl)
                }

            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                var status = XMLHttpRequest.status;
                layer.close(indexl);
                if (textStatus == "error" && status == "401") {
                    extension.errorLogin();
                    return false;
                }
                if (textStatus == "error" && status != "401") {
                    extension.error();
                    return false
                }
                if (textStatus == "timeout") {
                    extension.timeOut();
                }
            }
        })
    })
    // 防止页面后退
    $(document).on("keydown",function(event){
        var ev = event || window.event; //获取event对象 
        var obj = ev.target || ev.srcElement; //获取事件源 
        var t = obj.type || obj.getAttribute('type'); //获取事件源类型 
        var code = event.keyCode|| event.which;
        if(code == 8 && t != "password" && t != "text" && t != "textarea"){
                return false
        } 
    })
    $(document).keydown(function(ev){
        if(ev.keyCode == 13){
            return false
        }
    })

    // 循环有plesholder属性的input兼容ie8
    $('input[placeholder],textarea[placeholder]').each(function (i, item) {
        if (extension.isIE89()) {
            $(item).parents(".layui-input-block").find(".inputSpan").css("display", "block")
        }
    });
     // 模拟下拉框的plesholder属性
     form.on("select", function (data) {
        if (extension.isIE89()) {
            // 利用返回值判断
            if (data.value == "") {
                $(this).parents(".layui-input-block").find(".inputSpan").css("display", "block")
                $(this).parents(".layui-input-block").find("input").val("")
                $(this).parents(".layui-input-block").find("select").val("")
            } else {
                $(this).parents(".layui-input-block").find(".inputSpan").css("display", "none")
            }
        }
    })
 // 点击请选择， 弹出控件    这个位置  记得block下面在IE8下面会有两个span结构   为了不遮挡功能 所以把事件加给两个span  正常浏览器下只有一个span
 $(".layui-input-block").find("span").on('click', function () {
    var spanParpent = $(this).parent()
    setTimeout(function () {
        spanParpent.find('input').click();
    }, 10);
});
})