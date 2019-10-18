var g_iPort = 1001; //端口号；USB = 1001 ~ 1016 ，COM端口 = 1~16
var g_strPHPath = "..\\"; //保存照片路径初始值，路径结尾需添加"\\"
var g_strBmpPHName = "_PhotoA.bmp"; //保存bmp照片名称
var g_strJpgPHName = "_PhotoB.jpg"; //保存jpg照片名称
var ReadCardInfo; // 记录读取身份证信息的数据, 以便判断是否是读取录入, 还是手工录入
var sfxxcjZpdz = ""; //身份证头像
var mzList;
var hmcjSbbhCard;
var ReadCardInfoo; //身份证读出的信息
var SBstatus;//记录读卡器是否可用状态
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

// 初始化身份证设备
function hxgc_OpenReaders() {
    layui.use(["layer", "urlrelated", "extension"], function () {
        var layer = layui.layer;
        var urlrelated = layui.urlrelated;
        var extension = layui.extension;
        var iResult = objActiveX.hxgc_OpenReader(g_iPort); //打开设备
        if (iResult == 0) {
            var strSAMID = objActiveX.hxgc_GetSamIdToStr(g_iPort); //获取SAMID
            hmcjSbbhCard = strSAMID;
            //   验证设备是否能用 
            var data = {
                "platform": "1007",
                "appversion": "1.0.3",
                "apiversion": "1.0.2",
                "mac": "12345678",
                "ip": "xxx.xxx.xx.xx",
                "companyCode ": "1001",
                "userId": localStorage.getItem("userId"), //登录用户信息_用户ID
                "token": localStorage.getItem("token"),
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
                asnyc: false,
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
                error: function (XMLHttpRequest) {
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
        } else {
            layer.alert('身份证读卡器连接异常，请检查', {
                resize: false,
                title: '<span  style="color: red;font-weight: bold">提示</span>'
            });
            SBstatus = false;
        }
    })
}

// 点击去取二代证
function hxgc_ReadIDCards(){
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
                title: '<span  style="color: red;font-weight: bold">提示</span>',
                skin: 'layui-layer-demo', //样式类名
                area: ['450px', '210px'],
                anim: 2,
                resize: false,
                btn: "关闭",
                shadeClose: false, //开启遮罩关闭
                content: '<div class="layui-card-body layui-text layadmin-text;"style="width:420px;text-align:center;overflow:hidden">' +
                    '<div  style="width:100%;font-size:24px;font-weight: bold;margin-bottom:35px;">' +
                    '<span  class="layui-icon layui-icon-tips" style="color:#FF9900;font-size:26px; vertical-align: middle"></span>' +
                    '<span   style="margin-left:5px;font-size:16px; font-weight: normal; vertical-align: middle">请先下载驱动</span>' +
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
    hxgc_OpenReaders()
    setTimeout(function(){
        if(!SBstatus){
            return false
        }
        var iResult = objActiveX.hxgc_ReadIDCard(g_iPort); //读二代证
        var strPhotoBase64 = "";
        if (iResult == 0) {
            var storage = window.localStorage;
            var startDate = objActiveX.hxgc_GetBeginPeriodOfValidity(); //有效日期起始
            var endDate = objActiveX.hxgc_GetEndPeriodOfValidity(); //有效日期截止
            //  设置身份证有效期为长期情况下
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
                document.all("imageCard").src = "data:image/jpeg;base64," + strPhotoBase64; //显示图片
                sfxxcjZpdz = strPhotoBase64
            } else {
                layer.msg('err证件照片获取失败！');
                return;
            }
            var objActiveXmz = objActiveX.hxgc_GetNation()
            var GetBirthDate = objActiveX.hxgc_GetBirthDate() + ""
            var hxgc_GetBirthDate = GetBirthDate.slice(0, 4) + "-" + GetBirthDate.slice(4, 6) + "-" + GetBirthDate.slice(6, 8)
            //   获取数据里面所有的option   循环出对应
            //   var mz = $("#bcjr_mz option[x='"+objActiveX.hxgc_GetNation()+"族']").val()
            // var brithday = dateTool.dateToString(dateTool.stringToDate(objActiveX.hxgc_GetBirthDate(), "yyyyMMdd"));
            layui.use(['form', 'laydate', "urlrelated", "extension"], function () {
                var $ = layui.$,
                    layer = layui.layer,
                    urlrelated = layui.urlrelated,
                    extension = layui.extension,
                    form = layui.form;
    
                //  为了拿到民族 下拉框的内容
                var data = {
                    "platform": "1007",
                    "appversion": "1.0.3",
                    "apiversion": "1.0.2",
                    "mac": "12345678",
                    "ip": "xxx.xxx.xx.xx",
                    "companyCode ": "1001",
                    "userId": localStorage.getItem("userId"), //登录用户信息_用户ID
                    "token": localStorage.getItem("token")
                }
                var mzs;
                var datas = JSON.stringify(data)
                jQuery.support.cors = true;
                $.ajax({
                    url: urlrelated.gatherGetCodeList,
                    type: "post",
                    dataType: "json",
                    data: datas,
                    asnyc: false,
                    contentType: "application/json",
                    success: function (datasss) {
                        if (datasss.status == 200) {
                            $("#bcjr_mz").html("")
                            dataList = datasss.data;
                            $.each(dataList.mzList, function (i, item) {
                                // 必须要从新渲染一遍才能默认选中
                                var option = new Option(item.codeName, item.codeIndex)
                                option.innerText = item.codeName;
                                $("#bcjr_mz").append(option)
                                if (item.codeName == objActiveXmz + "族") {
                                    $("#bcjr_mz").val(item.codeIndex);
                                    return
                                }
                            })
                            form.render()
                        } else {
                            layer.msg(datasss.message, {
                                icon: 5
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
                        }
                    }
                })
                // 表单赋值
                form.val('component-form-element', {
                    "bcjr_xm": objActiveX.hxgc_GetName(), // 姓名
                    "bcjr_xb": objActiveX.hxgc_GetSex() == "男" ? "1" : "2", //性别
                    "bcjr_zjlxdm": "111", // 证件类型
                    "bcjr_gj": "156", // 国籍
                    // "bcjr_yxqx": yxq, //证件有效期
                    // "bcjr_yxqx_date":$("#bcjr_yxqx_date"),
                    "zjzp": strPhotoBase64,
                    "bcjr_csrq": hxgc_GetBirthDate, //出生日期
                    "bcjr_hjdz": objActiveX.hxgc_GetAddress(), //地址
                    "bcjr_zjhm": objActiveX.hxgc_GetIDCode(), //身份证号
                    "bcjr_qfjg": objActiveX.hxgc_GetIssuingAuthority() //签发机关
                });
                ReadCardInfoo = {
                    "bcjr_xm": objActiveX.hxgc_GetName(), // 姓名
                    "bcjr_xb": objActiveX.hxgc_GetSex() == "男" ? "1" : "2", //性别
                    "bcjr_zjlxdm": "111", // 证件类型
                    "bcjr_gj": "156", // 国籍
                    "bcjr_yxqx_date": $("#bcjr_yxqx_date").val() != "" ? $("#bcjr_yxqx_date").val() : "",
                    "bcjr_csrq": hxgc_GetBirthDate, //出生日期
                    "bcjr_hjdz": objActiveX.hxgc_GetAddress(), //地址
                    "bcjr_zjhm": objActiveX.hxgc_GetIDCode(), //身份证号
                    "bcjr_qfjg": objActiveX.hxgc_GetIssuingAuthority() //签发机关
                };
                $("#bcjr_zjhm").removeAttr('disabled').removeClass('layui-btn-disabled');
            });
            layer.msg('读取成功', {
                icon: 1
            });
            //  所有的请选择消失
            $(".inputSpan").css("display", "none")
            $(".cardInputSpan").css("display", "block")
        } else {
            layer.alert('请将身份证放到设备上', {
                resize: false,
                title: '<span style="color: red;font-weight: bold">提示</span>'
            });
            // <img src="'+basePath+'/iias/img/ie8/denger.png"  style="width:20px;height: 16px;vertical-align: middle">&nbsp;&nbsp;&nbsp
        }
    },200)
}
function yxqGetVal(status, yxq) {//证件有效期 关于长期证件不符合插件格式校验
    if (status == "1") {
        $("#bcjr_yxqx").val(yxq)
        $("#bcjr_yxqx").removeClass("hiddens")
        $("#bcjr_yxqx").addClass("shows")
        $("#bcjr_yxqx_date").addClass("hiddens")
        $("#bcjr_yxqx_date").removeClass("shows")
        return
    }
    if (status == "0") {
        $("#bcjr_yxqx_date").val(yxq)
        $("#bcjr_yxqx").addClass("hiddens")
        $("#bcjr_yxqx").removeClass("shows")
        $("#bcjr_yxqx_date").removeClass("hiddens")
        $("#bcjr_yxqx_date").addClass("shows")
        return
    }
}
function clearVal() {
    $("#bcjr_zjlxdm").val("");
    $("#bcjr_zjhm").val("");
    $("#imageCard").attr("src", "/img/card-img.png");
    $("#bixuan").html("");
    $('#bcjr_xb').val("");
    $("#bcjr_gj").val("");
    $("#bcjr_mz").val("");
    $("#bcjr_csrq").val("");
    $("#bcjr_hjdz").val("");
    $("#bcjr_qfjg").val("");
    $("#bcjr_yxqx").val("");
    $("#bcjr_jzdz").val("");
    $("#bcjr_sjhm1").val("");
    $("#bcjr_ryfl").val("");
    $("#bcjr_xm").val("");
    $("#bcjr_sjhm2").val("");
    $("#bcjr_csrq").val("");
    $("#cjbz").val("");
    $("#bcjr_yxqx_date").val("");
    $("#bcjr_sjhm2").val("");
    $("#rightEye").attr("src", "/img/eye.png");
    $("#leftEye").attr("src", "/img/eye.png");
    $(".add_lable_contet").html("")
}

layui.use(["form", 'laydate', "layer", "jquery", "urlrelated", "extension"], function () {
    var form = layui.form;
    layer = layui.layer,
        $ = layui.jquery,
        urlrelated = layui.urlrelated,
        extension = layui.extension,
        laydate = layui.laydate;
    var defaultEyeImg = "/img/eye.png" //眼睛图片默认路径 
    var leftEyebes64; //虹膜左眼64
    var rightEyebes64; //虹膜右眼64
    form.render();
    clearVal()
    $("#querytype").val(localStorage.getItem("querytypeItem"))
    var QXUserName = localStorage.getItem("userName")
    if (QXUserName == "admin") {
        $("#sumbitForm").attr("disabled", "disabled").addClass('layui-btn-disabled');
        $("#sumbitForm").css("background", "#FBFBFB")
    }

    $("#querytype").val(localStorage.getItem("querytypeItem"))
    // laydate渲染
    laydate.render({
        elem: '#bcjr_csrq' //,type: 'date' //默认，可不填
            ,
        btns: ['clear', 'confirm'] //显示清除和确认
            ,
        trigger: 'click' //采用click弹出
            ,
        max: (new Date()).getTime(),
        theme: '#2F4056' //设置主题颜色
            ,
        done: function (value, date, endDate) {
            //有证无证状态
            if (ReadCardInfo == 1) {
                ReadCardInfo = 2
            }
            if (extension.isIE89()) {
                if (value !== "") {
                    $(".dateSpan").css("display", "none")
                }
                if (value == "") {
                    $(".dateSpan").css("display", "block")
                }
            }
        }

    });
    laydate.render({
        elem: '#bcjr_yxqx_date',
        type: 'date' //时间选择器类型：'year'(年)  'month'(年月)  'date'(//默认，可不填)  'time'(时间)  'datetime'(日期时间)
            ,
        range: '~' //或 range: '~' 来自定义分割字符
            ,
        trigger: 'click' //采用click弹出
            ,
        theme: '#2F4056' //设置主题颜色
            ,
        done: function (value, date, endDate) {
            //时间空间里面
            if (extension.isIE89()) {
                if (value !== "") {
                    $(".yxqPlesholder").css("display", "none")
                }
                if (value == "") {
                    $(".yxqPlesholder").css("display", "block")
                }
            }
        }
    });
    //鼠标移入添加标签不完整的标签显示文字完全气泡
    $(document).on("hover", ".imId", function () {
        var thisText = $(this).text()
        $(this).attr("title", thisText)
    })
    // 循环检索项接口
    var data = {
        "platform": "1007",
        "appversion": "1.0.3",
        "apiversion": "1.0.2",
        "mac": "12345678",
        "ip": "xxx.xxx.xx.xx",
        "companyCode ": "1001",
        "userId": localStorage.getItem("userId"), //登录用户信息_用户ID
        "token": localStorage.getItem("token")
    }
    var datas = JSON.stringify(data)
    jQuery.support.cors = true;
    $.ajax({
        url: urlrelated.gatherGetCodeList,
        type: "post",
        dataType: "json",
        data: datas,
        contentType: "application/json",
        success: function (datasss) {
            if (datasss.status == 200) {
                var dataList = datasss.data;
                mzList = dataList.mzList;

                function addOption(optionList, Html) {
                    if (optionList.length != 0) {
                        $.each(optionList, function (i, item) {
                            var option = new Option(item.codeName, item.codeIndex)
                            option.innerText = item.codeName;
                            Html.append(option); // 下拉菜单里添加元素
                        })
                    }
                }
                addOption(dataList.ryflList, $("#bcjr_ryfl"))
                addOption(dataList.mzList, $("#bcjr_mz"))
                addOption(dataList.zjlxList, $("#bcjr_zjlxdm"))
                addOption(dataList.gjList, $("#bcjr_gj"))
                addOption(dataList.xbList, $("#bcjr_xb"))
                addOption(dataList.wfcjList, $("#wfcj"))
                addOption(dataList.cjcdList, $("#cjcd"))
                form.render()
            } else {
                layer.msg(datasss.message, {
                    icon: 5
                })
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            var status = XMLHttpRequest.status;
            if (textStatus == "error" && status == "401") {
                extension.errorLogin()
                return false
            }
            if (textStatus == "error" && status != "401") {
                extension.error()
            }
        }
    })
    //读取二代证
    $("#readCard").click(function () {
        hxgc_ReadIDCards();
    })

    // 点击更多
    $(".more").click(function () {
        $(".layui-form-item-hied").each(function (i, item) {
            if ($(item).is(".hied")) {
                $(".more").find("i").removeClass("layui-icon-down")
                $(".more").find("i").addClass("layui-icon-up")
                $(item).removeClass("hied")
            } else {
                $(item).addClass("hied")
                $(".more").find("i").removeClass("layui-icon-up")
                $(".more").find("i").addClass("layui-icon-down")
            }
        })
    })


    //  删除人员标签的时候
    $(document).on("click", ".layui-icon-close", function () {
        // $(this).parents(".people_lable_item").remove()
        $(this).parents(".people_lable_item").remove()
    })

    $(".add_lable").on("click", function () {
        var lenss;
        layer.open({
            title: '选择标签',
            type: 2,
            move: false,
            area: ["755px", "430px"],
            resize: false,
            btn: ["确定", "取消"],
            yes: function (index, layero) {
                var iframeWin = window[layero.find('iframe')[0]['name']]; //得到iframe页的窗口对象，执行iframe页的方法：iframeWin.method();
                // 调用子页面方法生成结构
                $(".add_lable_contet").html(iframeWin.sethtml())
                layer.close(index)
            },
            content: ['/html/gather/add_lable.html', "no"],
            success: function (layero, index) {
                // 获取当前页面选择的各种项
                var add_lable_arr = []; //储存当前的存在条数
                $(".people_lable_item").each(function (i, item) {
                    var itemAttr = $(item).find(".imId").attr("imId")
                    if (itemAttr) {
                        add_lable_arr.push(itemAttr)
                    }
                })
                //  弹层里面赋值
                var firmeBody = layer.getChildFrame('body', index);
                jQuery.support.cors = true;
                $.ajax({
                    url: urlrelated.gatherGetMarkList,
                    type: "post",
                    dataType: "json",
                    async: false,
                    data: JSON.stringify(data),
                    contentType: "application/json",
                    success: function (datasss) {
                        var data = datasss.data;
                        if (data.length == 0) {
                            layer.msg("暂无数据",{icon:5})
                            return false
                        }
                        var n = 0;
                        var lefrHtml = "",
                            rightHtml = "",
                            leftArr = [];
                        if (add_lable_arr.length == 0 || add_lable_arr == null) {
                            $(data).each(function (i, item) {
                                lefrHtml += '<li><span   class="firstContent"  imid=' + item.imId + '>' + item.imName + '</span><span  class="add">+添加</span></li>'
                            })
                        } else {
                            $(data).each(function (i, item) {
                                var add_lable_arr_str = add_lable_arr + "";
                                if (add_lable_arr_str.indexOf(item.imId) != -1) {
                                    rightHtml += '<li><span   class="rigth_item  firstContent"   imId=' + data[i].imId + '>' + data[i].imName + '</span><span  class="del">删除</span></li> '
                                } else {
                                    lefrHtml += '<li><span     class="firstContent"  imId=' + data[i].imId + '>' + data[i].imName + '</span><span  class="add">+添加</span></li>'
                                }
                            })
                        }
                        localStorage.removeItem("add_lable_arr_len")
                        var lens = add_lable_arr.length;
                        lenss = lens ? lens : 0;
                        localStorage.setItem("add_lable_arr_len", lenss)
                        firmeBody.find(".left").html('<li class="title">选择标签</li>' + lefrHtml)
                        firmeBody.find(".right").html('<li class="title  clear"><span id="length">已选(' + lens + ')，最多可添加5条</span><strong style="display:none">清空</strong></li>' + rightHtml)
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
                });
            },
            done: function () {
                lenss = 0
            }
        });
    })
    // 开始采集
    $("#kscj").on("click", function () {
        //    弹窗大小
        var iris_width, iris_height;
        var wiodeWidth = $(window).width()
        if (wiodeWidth < 1130) {
            iris_width = 520 + "px", iris_height = 370 + "px"
        } else {
            iris_width = 755 + "px", iris_height = 430 + "px"
        }
        cleanIris()
        layer.open({
            title: '虹膜采集',
            type: 2,
            move: false,
            area: [iris_width, iris_height],
            resize: false,
            content: ['/html/gather/gather_iris.html', "no"],
            success: function (layero, index) {
                $("#cjztCheckbox").prop("checked", false)
                $("#wfcjParpent").css("display", "none")
                $("#wfcj").val("")
                form.render("checkbox")
                var iframeWin = window[layero.find('iframe')[0]['name']],
                    Biometrics = iframeWin.document.getElementById("Biometrics"),
                    imgPrent = iframeWin.document.getElementById("imgPrent"),
                    BiometricsP = iframeWin.document.getElementById("BiometricsP"),
                    gather_start_id = iframeWin.document.getElementById("gather-start-id"),
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
                        "margin-top": "24px"
                    })
                    $(imgPrent).css({
                        "margin-top": "22px"
                    })
                }
                // $(objbiaoqian).height(169)
                // //erorr提示框宽度
                // var  tishi =  iframeWin.document.getElementById("tishi")
                // $(tishi).width(480)
                // var  Biometrics =  iframeWin.document.getElementById("Biometrics")
                // $(Biometrics).css("margin-top",0)
            },
            end: function () {
                var cizt = localStorage.getItem("cizt") //手法采集成功到了赋值那一步
                if (cizt == "0") {
                    return false
                } else {
                    var qzcjbz = localStorage.getItem("qzcjbz")
                    var cjtphs = localStorage.getItem("cjtphs") //采集图片耗时
                    var sbxh = localStorage.getItem("sbxh") //设备型号
                    var sbbh = localStorage.getItem("sbbh") //设备编号
                    var updVersion = localStorage.getItem("updVersion") //TODO 新增，虹膜驱动版本，2019.07.04
                    var sbcsdm = localStorage.getItem("sbcsdm") //设备厂商代码 新添
                    var zy_xxzlpf = localStorage.getItem("zy_xxzlpf") //左眼虹膜照片信息质量评分。3位数值型字符串。必填  新添
                    var yy_xxzlpf = localStorage.getItem("yy_xxzlpf") //右眼虹膜照片信息质量评分。3位数值型字符串。必填  新添
                    var leftCQcode = localStorage.getItem("leftCQcode")
                    var rightCQcode = localStorage.getItem("rightCQcode")
                    var dsycjbz = localStorage.getItem("dsycjbz")
                    var imageJson = localStorage.getItem("imageJson")
                    leftEyebes64 = localStorage.getItem("leftEyebes64") //虹膜左眼64
                    rightEyebes64 = localStorage.getItem("rightEyebes64") //虹膜右眼64
                    yy_xxzlpfs = yy_xxzlpf ? '右眼分数(' + yy_xxzlpf + ')' : "右眼"
                    zy_xxzlpfs = zy_xxzlpf ? '左眼分数(' + zy_xxzlpf + ')' : "左眼"

                    $("#rightEyepf").html(yy_xxzlpfs)
                    $("#leftEyepf").html(zy_xxzlpfs)
                    $("#leftEye").attr("src", leftEyebes64 ? leftEyebes64 : defaultEyeImg)
                    $("#rightEye").attr("src", rightEyebes64 ? rightEyebes64 : defaultEyeImg)
                    $("#qzcjbz").val(qzcjbz ? qzcjbz : "");
                    $("#cjtphs").val(cjtphs ? cjtphs : ""); //采集图片耗时
                    $("#sbxh").val(sbxh ? sbxh : ""); //设备型号
                    $("#sbbh").val(sbbh ? sbbh : ""); //设备编号
                    $('#cjzt').val("0");
                    $('#updVersion').val(updVersion ? updVersion : ""); //TODO 新增，虹膜驱动版本，2019.07.04
                    $("#sbcsdm").val(sbcsdm ? sbcsdm : ""); //设备厂商代码 新添
                    $("#zy_xxzlpf").val(zy_xxzlpf ? zy_xxzlpf : ""); //左眼虹膜照片信息质量评分。3位数值型字符串。必填  新添
                    $("#yy_xxzlpf").val(yy_xxzlpf ? yy_xxzlpf : ""); //右眼虹膜照片信息质量评分。3位数值型字符串。必填  新添
                    $("#leftCQcode").val(leftCQcode ? leftCQcode : "");
                    $("#rightCQcode").val(rightCQcode ? rightCQcode : "");
                    $("#dsycjbz").val(dsycjbz ? dsycjbz : "");
                    $("#imageJson").val(imageJson ? imageJson : "");
                }

            }
        });
    })



    $("#reset").click(function () {
        window.location.reload()
    })

    // 清空虹膜
    function cleanIris() {
        var localStorage = window.localStorage;
        localStorage.removeItem("qzcjbz")
        localStorage.removeItem("cjtphs") //采集图片耗时
        localStorage.removeItem("sbxh") //设备型号
        localStorage.removeItem("sbbh") //设备编号
        localStorage.removeItem("updVersion") //TODO 新增，虹膜驱动版本，2019.07.04
        localStorage.removeItem("sbcsdm") //设备厂商代码 新添
        localStorage.removeItem("zy_xxzlpf") //左眼虹膜照片信息质量评分。3位数值型字符串。必填  新添
        localStorage.removeItem("yy_xxzlpf") //右眼虹膜照片信息质量评分。3位数值型字符串。必填  新添
        localStorage.removeItem("leftCQcode")
        localStorage.removeItem("rightCQcode")
        localStorage.removeItem("dsycjbz")
        localStorage.removeItem("imageJson")
        localStorage.removeItem("leftEyebes64")
        localStorage.removeItem("rightEyebes64")
        localStorage.removeItem("leftEyebes64H")
        localStorage.removeItem("rightEyebes64H")
        $("#rightEye").attr('src', defaultEyeImg); // 右眼图片
        $("#leftEye").attr('src', defaultEyeImg); // 右眼图片
        $("#qzcjbz").val("");
        $("#cjtphs").val(""); //采集图片耗时
        $("#sbxh").val(""); //设备型号
        $("#sbbh").val(""); //设备编号
        // $('#cjzt').val("0");
        $('#updVersion').val(""); //TODO 新增，虹膜驱动版本，2019.07.04
        $("#sbcsdm").val(""); //设备厂商代码 新添
        $("#zy_xxzlpf").val(""); //左眼虹膜照片信息质量评分。3位数值型字符串。必填  新添
        $("#yy_xxzlpf").val(""); //右眼虹膜照片信息质量评分。3位数值型字符串。必填  新添
        $("#leftCQcode").val("");
        $("#rightCQcode").val("");
        $("#dsycjbz").val("");
        $("#imageJson").val("");
        $("#rightEyepf").html("右眼")
        $("#leftEyepf").html("左眼")
    }
    // 无法采集, 监听
    form.on('checkbox(cjzt)', function (data) {
        //初始状态
        $("#wfcjParpent").find("select").val("");
        $("#wfcjParpent").find("input").val("");
        var isChecked = data.elem.checked;
        if (isChecked) {
            $('.wfcj').css("display", "block")
            // $('#cjzt').val("1");
            cleanIris();
        } else {
            var selects = document.querySelectorAll("select")
            form.render('selects');
            $('.wfcj').css("display", "none")
            // $('#cjzt').val("0");
        }
    });
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
    form.on("select(bcjr_zjlxdm)", function (obj) {
        var thisVal = obj.value
        var sfzVal = $("#bcjr_zjhm").val();
        if (sfzVal != "") {
            sfnhmjy()
        }
        if (thisVal == "999") {
            $('#bcjr_zjhm').val("")
            if ($('#bcjr_zjhm').is(".layui-form-danger")) {
                $('#bcjr_zjhm').removeClass("layui-form-danger") // 如果报错
            }
            $("#bcjr_zjhm").attr("disabled", "disabled").addClass('layui-btn-disabled');
        } else {
            $("#bcjr_zjhm").attr("disabled", false).removeClass('layui-btn-disabled');
        }
    })

    // 身份证号码校验
    function sfnhmjy() {
        var zjhm = $("#bcjr_zjhm").val();
        var val = $("#bcjr_zjlxdm").next().find("input").val();
        //多一层身份证
        if (val == "身份证") {
            if (reg18.test(zjhm) === true || reg15.test(zjhm) === true) {
                if (chenkBirth(zjhm) == 0) {
                    var birthday = getBirthday(zjhm);
                    $("#bcjr_csrq").val(birthday);
                    $('#bcjr_zjhm').removeClass("layui-form-danger")
                    return false;
                }
            } else {
                layer.msg("身份证号码不正确", {
                    icon: 5
                })
                $('#bcjr_zjhm').addClass("layui-form-danger")
                $("#bcjr_csrq").val("");
                return false
            }
            // if(isIE8pd()){
            //     $(".dateSpan").css("display","block")
            // }
        }
    }
    //手动输入身份证号  校验出出生日期 
    $('#bcjr_zjhm').on("blur", function () {
        sfnhmjy()
    });
    $("#sumbitForm").on("click", function () {
        var bcjr_zjlxdmVal = $("#bcjr_zjlxdm").val()
        if (bcjr_zjlxdmVal == "999") { //无证件
            $("#bcjr_zjhm").removeAttr("lay-verify") //无证件不校验非空
        }
        var numb = $("#bcjr_sjhm1").val()
        form.verify({
            bcjr_sjhm1: function (value) {
                if (value != "" && value != null) {
                    if (numb != "" && !/^1[3456789]\d{9}$/.test(numb)) {
                        return "手机号码不正确，请输入正确的手机号码";
                    }
                }
            }
        })
    })
    // 点击提交
    form.on('submit(component-form-demo1)', function (data) {
        var fildes = data.field;
        var hmcjWfcjbz = 2;
        if ($("#imageJson").val() == "" && $("#cjztCheckbox").attr("checked") != "checked") {
            cjzt = "0"
            layer.msg("请采集虹膜", {
                time: 2000,
                icon: "5"
            })
            return false;
        }
        // 无法采集
        if ($("#cjztCheckbox").attr("checked") == "checked" && $("#wfcj").val() == "") {
            layer.msg("请选择无法采集原因", {
                time: 2000,
                icon: 5
            })
            $("#wfcj").addClass("layui-form-danger")
            return false;
        } else {
            $("#wfcj").removeClass("layui-form-danger")
        }
        var loadingIndex = layer.load(1, { //loading
            shade: 0.3
        })
        // 无法采集代码状态设置
        if ($("#cjztCheckbox").attr("checked") == "checked" && $("#wfcj").val() != "") {
            hmcjWfcjbz = "1"
        }
        var csrqDate = fildes.bcjr_csrq; //被采集人出生日期
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
        // 判断有证无证状态
        if (ReadCardInfoo) {
            //  提交时后  当前代码跟身份证信息读出来的不一致 就都是无证类型\
            if (ReadCardInfoo.bcjr_xm != fildes.bcjr_xm || ReadCardInfoo.bcjr_xb != fildes.bcjr_xb ||
                ReadCardInfoo.bcjr_zjlxdm != fildes.bcjr_zjlxdm || ReadCardInfoo.bcjr_gj != fildes.bcjr_gj ||
                ReadCardInfoo.bcjr_yxqx_date != fildes.bcjr_yxqx_date || ReadCardInfoo.bcjr_csrq != fildes.bcjr_csrq ||
                ReadCardInfoo.bcjr_hjdz != fildes.bcjr_hjdz || ReadCardInfoo.bcjr_zjhm != fildes.bcjr_zjhm || ReadCardInfoo.bcjr_qfjg != fildes.bcjr_qfjg) {
                ReadCardInfo = 0
                sfxxcjZpdz = ""
                hmcjSbbhCard = ""
            } else {
                ReadCardInfo = 1
            }
        } else {
            ReadCardInfo = 0
            sfxxcjZpdz = ""
        }
        // 人员标签后台
        var imList = []
        if ($(".people_lable_item")) {
            $(".people_lable_item").each(function (i, item) {
                var imName = $(item).find("span:first").text()
                var imId = $(item).find("span:first").attr("imId")
                imList.push({
                    "imName": imName,
                    "imId": imId
                })
            })
        } else {
            imList = []
        }
        var yxq = ""; //身份证有效期
        if ($("#bcjr_yxqx_date").is(".shows")) {
            yxq = $("#bcjr_yxqx_date").val()
        }
        if ($("#bcjr_yxqx").is(".shows")) {
            yxq = $("#bcjr_yxqx").val()
        }
        var data1 = {
            "platform": "1007",
            "appversion": "1.0.3",
            "apiversion": "1.0.2",
            "mac": "12345678",
            "ip": "xxx.xxx.xx.xx",
            "companyCode ": "1001",
            "userId": localStorage.getItem("userId"), //登录用户信息_用户ID
            "token": localStorage.getItem("token"),
            "data": {
                "sfxxcjXm": fildes.bcjr_xm,
                "sfxxcjXbdm": fildes.bcjr_xb,
                "sfxxcjGjdm": fildes.bcjr_gj,
                "sfxxcjMzdm": fildes.bcjr_mz,
                "sfxxcjCsrq": setDate(csrqDate),
                "sfxxcjCyzjCyzjdm": fildes.bcjr_zjlxdm,
                "sfxxcjCyzjZjhm": fildes.bcjr_zjhm,
                "sfxxcjYxqx": yxq, //身份证有效期时间
                "hmcjSbbhCard": hmcjSbbhCard, //身份证读卡器sn号
                "sfxxcjQfjg": fildes.bcjr_qfjg,
                "sfxxcjHjdzDzmc": fildes.bcjr_hjdz,
                "sfxxcjXzzDzmc": fildes.bcjr_jzdz,
                "sfxxcjLxdh1": fildes.bcjr_sjhm1 ? fildes.bcjr_sjhm1 : "",
                "sfxxcjLxdh2": fildes.bcjr_sjhm2 ? fildes.bcjr_sjhm2 : "",
                "sfxxcjRyfl": fildes.bcjr_ryfl,
                "sfxxcjZjbz": ReadCardInfo, //有证无证标志
                "sfxxcjCjbz": ReadCardInfo, //虹膜采集_身份信息获取方式:未录入1:二代证读取2:手工录入3:警综获取)--------------------------------------------------------212121221
                "sfxxcjZpdz": sfxxcjZpdz, //身份证头像
                "hmcjSbcsdm": fildes.sbcsdm ? fildes.sbcsdm : "", //设备厂商
                "hmcjSbxh": fildes.sbxh ? fildes.sbxh : "", //设备型号
                "hmcjSbbh": fildes.sbbh ? fildes.sbbh : "", //设备编号
                "hmcjCjbh": fildes.cjbh ? fildes.cjbh : "", //采集编号
                "hmcjZyydm": fildes.dsycjbz ? fildes.dsycjbz : "",
                "hmcjQsqkdmZy": fildes.leftCQcode ? fildes.leftCQcode : "",
                "hmcjQsqkdmYy": fildes.rightCQcode ? fildes.rightCQcode : "",
                "hmcjQzcjbz": fildes.qzcjbz,
                "hmcjCjhs": fildes.cjtphs ? fildes.cjtphs : "",
                "hmcjZyzp": localStorage.getItem("leftEyebes64H"),
                "hmcjYyzp": localStorage.getItem("rightEyebes64H"),
                "hmcjZytxzl": fildes.zy_xxzlpf ? fildes.zy_xxzlpf : "",
                "hmcjYytxzl": fildes.yy_xxzlpf ? fildes.yy_xxzlpf : "",
                "hmcjWfcjbz": hmcjWfcjbz, //暂时写死的是否无法采集
                "hmcjWfcjyydm": fildes.wfcj,
                "hmcjCjbz": fildes.cjbz ? fildes.cjbz : "",
                "imList": imList,
                "userId": localStorage.getItem("userId"), //登录用户信息_用户ID
                "userPoliceId": localStorage.getItem("policeId"), //登录用户信息 警号
                "jgxxJgid": localStorage.getItem("JGID"), //登录用户信息 机构ID
                "jgxxGajgjgdm": localStorage.getItem("userJGDM"), //登录用户信息 机构代码
                "userName": localStorage.getItem("userName"), //登录用户信息 登录名
                "userRealname": localStorage.getItem("userRealname"), //登录用户信息 姓名   
                "userIdcard": localStorage.getItem("idCard"), //身份证
                "userPlaceCode": localStorage.getItem("userPlaceCode"), //采集地代码
                "userPlaceName": localStorage.getItem("userPlaceName") //采集地代码
            }
        }
        jQuery.support.cors = true;
        $.ajax({
            url: urlrelated.gatherIrisRegister,
            type: "post",
            data: JSON.stringify(data1),
            dataType: "json",
            timeout: 120000,
            contentType: "application/json",
            success: function (dataList) {
                if (dataList.status == 200) {
                    var msgType = dataList.data.msgType; //返回类型
                    var res = dataList.data; //
                    var setLayerHeight = 0,
                        firstDivHeight = 0,
                        ryyzc = false,
                        zjycz = false,
                        cjcg = false; //记录弹窗一共需要多高
                    // 判断 有没有报警
                    function certHtml() {
                        var html = "";
                        if (res.specialFlag == 1) {
                            $.each(res.specialList, function (i, item) {
                                setLayerHeight = setLayerHeight + 1
                                html += '<div style="height:150px;font-size:20px;line-height:40px;color:#FF2424;text-indent:40px;" >' +
                                    '<span  class="layui-icon layui-icon-tips" style="font-size:24px;margin-top:2px;margin-right: 5px;"></span>' +
                                    '<span>告警信息</span>' +
                                    '<span class="layer-content-span  addTitle"   style="color:black;display:block;height:26px;font-size:14px;text-indent:48px;line-height:26px;width:463px;white-space:nowrap; overflow:hidden;text-overflow:ellipsis;">姓名：' + item.name + '</span>' +
                                    '<div  style="font-size:16px;color:#FE2423;line-height:18px;font-weight: bold;max-height:200px;font-size:14px">' +
                                    '<span   style="float:left;text-indent:20px;width:90px;text-align:right">专题库：</span>' +
                                    '<span    class="addTitle"  style="width:370px;float:left;color:#FE2423;text-indent:0px;text-align:left; overflow:hidden;overflow:ellipsis;max-height:70px;font-size:14px;">' + item.msg + '</span>' +
                                    '</div>' +
                                    '</div>'
                            })
                        }
                        if (res.xzFlag == 1) {
                            $.each(res.xzList, function (i, item) {
                                setLayerHeight = setLayerHeight + 1
                                html += '<div style="height:150px;font-size:20px;line-height:40px;color:#FF2424;text-indent:40px;" >' +
                                    '<span  class="layui-icon layui-icon-tips" style="font-size:24px;margin-top:2px;margin-right: 5px;"></span>' +
                                    '<span>告警信息</span>' +
                                    '<span class="layer-content-span  addTitle"   style="color:black;display:block;height:26px;font-size:14px;text-indent:48px;line-height:26px;width:463px;white-space:nowrap; overflow:hidden;text-overflow:ellipsis;">姓名：' + item.name + '</span>' +
                                    '<div  style="font-size:16px;color:#FE2423;line-height:18px;font-weight: bold;max-height:200px;font-size:14px">' +
                                    '<span   style="float:left;text-indent:20px;width:100px;text-align:right">人员类型：</span>' +
                                    '<span    class="addTitle"  style="width:370px;float:left;color:#FE2423;text-indent:0px;text-align:left; overflow:hidden;overflow:ellipsis;max-height:70px;font-size:14px;">' + item.msg + '</span>' +
                                    '</div>' +
                                    '</div>'
                            })
                        }
                        if (res.xzFlag == 0 && res.specialFlag == 0) {
                            html = ""
                        }
                        return html
                    }
                    var layerContent;
                    if (msgType == 1) { //注册成功
                        // setLayerHeight = setLayerHeight + 1
                        cjcg = true
                        firstDivHeight = 140
                        layerContent = '<div  class="ssuccess" style="height:140px;width:100%;text-align:center;font-size:20px;line-height:140px;color:green">\
                                            <span  class="layui-icon layui-icon-face-smile-fine" style="font-size:24px;margin-top:2px;color:green;font-weight:bold"></span>\
                                            <span>注册成功</span>\
                                        </div>' + certHtml()
                    } else if (msgType == 2) { //  人员已经存在  判断是不是报警人员 或者邢专报警人员
                        // setLayerHeight = setLayerHeight + 1
                        firstDivHeight = 80
                        ryyzc = true
                        layerContent = '<div  class="ryyzc"  style="height:80px;width:100%;text-align:left;font-size:20px;line-height:80px;color:#FE2423;text-indent:40px">\
                                         <span  class="layui-icon layui-icon-tips" style="font-size:24px;"></span>\
                                         <span>人员已注册</span>\
                                        </div>' + certHtml()
                    } else if (msgType == 3) {
                        var msgs = dataList.data.irisResponseMsg
                        var msgss = msgs.split("#")
                        // setLayerHeight = setLayerHeight + 1
                        firstDivHeight = 120
                        if (msgss.length == 3) {
                            layerContent = '<div  style="height:120px;width:100%;font-size:20px;line-height:50px;color:#FE2423;text-indent:40px;">\
                                                    <span  class="layui-icon layui-icon-tips" style="font-size:24px;margin-top:2px;"></span>\
                                                    <span>证件信息不一致</span>\
                                                    <div style="margin-left:60px;font-size:14px;text-indent:0px;line-height:20px;width:400px;color:black">' + msgss[0] + '</div>\
                                                    <div   class="addTitle" style="margin-left:60px;font-size:14px;text-indent:0px;line-height:20px;width:400px;color:black;white-space:nowrap; overflow:hidden;text-overflow:ellipsis;width:340px">' + msgss[1] + '</div>\
                                                    <div style="margin-left:60px;font-size:14px;text-indent:0px;line-height:20px;width:400px;color:black">' + msgss[2] + '</div>\
                                            </div>' + certHtml()
                        }
                        if (msgss.length == 4) {
                            firstDivHeight = 140
                            layerContent = '<div  style="height:140px;width:100%;font-size:20px;line-height:50px;color:#FE2423;text-indent:40px;">\
                                                <span  class="layui-icon layui-icon-tips" style="font-size:24px;margin-top:2px;"></span>\
                                                <span>证件信息不一致</span>\
                                                <div style="margin-left:60px;font-size:14px;text-indent:0px;line-height:20px;width:400px;color:black">' + msgss[0] + '</div>\
                                                <div   class="addTitle" style="margin-left:60px;font-size:14px;text-indent:0px;line-height:20px;width:400px;color:black;white-space:nowrap; overflow:hidden;text-overflow:ellipsis;width:340px">' + msgss[1] + '</div>\
                                                <div style="margin-left:60px;font-size:14px;text-indent:0px;line-height:20px;width:400px;color:black">' + msgss[2] + '</div>\
                                                <div style="margin-left:60px;font-size:14px;text-indent:0px;line-height:20px;width:400px;color:black">' + msgss[3] + '</div>\
                                            </div>' + certHtml()
                        }
                    } else if (msgType == 4) {
                        // setLayerHeight = setLayerHeight + 1
                        firstDivHeight = 140
                        zjycz = true
                        layerContent = '<div  class="zjycz"  style="height:80px;width:100%;text-align:left;padding-top:30px;line-height:30px;text-indent:40px">\
                                            <span  class="layui-icon layui-icon-tips" style="font-size:24px;color:#FE2423;"></span>\
                                            <span  style="font-size:20px;color:#FE2423;">证件已存在，虹膜不一致</span>\
                                            <span  style="display:block">该证件已存在，但虹膜信息与采集时不一致(虹膜信息不存在)</span>\
                                        </div>' + certHtml()
                    }
                    // 判断当前有几项报警   高度加上 
                    var layerHeight = 140 * parseInt(setLayerHeight) + parseInt(firstDivHeight) //根据报警计算出弹窗高度
                    var title = "";
                    if (setLayerHeight >= 1 && setLayerHeight != 0) {
                        title = "<img src='/img/baojing.png'  style='height:30px;width:30px;float:left;margin-top:5px'/><div style='color:red; font-weight: bold'>告警</div>"
                    } else {
                        title = "<div style='color:red;font-weight: bold'>提示</div>"
                    }
                    var hideShow;
                    if (setLayerHeight >= 2) {
                        hideShow = "scroll"
                        layerHeight = 340
                    } else {
                        hideShow = "hidden"
                    }
                    layer.open({
                        type: 1,
                        title: title,
                        area: ["515px", layerHeight],
                        content: '<div   class="zjycz" style="height:' + layerHeight + "px" + '; overflow-y:' + hideShow + ' ">' + layerContent + '</div>',
                        btn: "确定",
                        resize: false,
                        btn1: function () {
                            cleanIris()
                            clearVal()
                            form.render()
                            layer.closeAll()
                            window.location.reload()
                        },
                        success: function () {
                            if (setLayerHeight == 0 && ryyzc) { //只有证件已注册  没有报警时候
                                $(".ryyzc").css({
                                    "line-height": "80px",
                                    "text-indent": "0px",
                                    "text-align": "center"
                                })
                            }
                            if (setLayerHeight == 0 && cjcg) {
                                $(".ssuccess").css({
                                    "line-height": "140px",
                                    "text-indent": "0px",
                                    "text-align": "center"
                                })
                            } else {
                                $(".ssuccess").css({
                                    "line-height": "80px",
                                    "text-indent": "40px",
                                    "text-align": "left",
                                    "height": "80px"
                                })
                            }
                            if (setLayerHeight == 0 && zjycz) {
                                $(".zjycz").css({
                                    "line-height": "30px",
                                    "text-indent": "0px",
                                    "text-align": "center"
                                })
                            }
                            $(".addTitle").hover(function () {
                                var thistext = $(this).text()
                                $(this).attr("title", thistext)
                            })
                            layer.close(loadingIndex) //關閉loading
                        },
                        end: function () {
                            cleanIris()
                            clearVal()
                            form.render()
                            layer.closeAll()
                            window.location.reload()
                        }
                    })
                    // 成功之后清除数据
                } else {
                    layer.close(loadingIndex)
                    layer.msg(dataList.message, {
                        time: 2000,
                        icon: "5"
                    })
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                layer.close(loadingIndex)
                layer.closeAll()
                var status = XMLHttpRequest.status
                if (textStatus == "error" && status == "401") {
                    extension.errorLogin()
                    return false
                }
                if (textStatus == "error" && status != "401") {
                    extension.error()
                }
                if (textStatus == "timeout") {
                    extension.timeOut()
                }
            }
        })
    });
    $(document).keydown(function (ev) {
        if (ev.keyCode == 13) {
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
    //文本框点击
    $(".textareaSpan").on("click", function () {
        var thet = $(this)
        var spanParpents = thet.parent()
        spanParpents.find('textarea').trigger("focus")
        spanParpents.find('textarea').blur(function () {
            if ($(this).val() == "") {
                thet.css("display", "block")
            }
            if ($(this).val() != "") {
                thet.css("display", "none");
            }
        })
    })
    $("#cjbz").focus(function () {
        if (extension.isIE89()) {
            $(".textareaSpan").css("display", "none")
        }
    })
    $("#cjbz").blur(function () {
        if (extension.isIE89()) {
            if ($(this).val() == "") {
                $(".textareaSpan").css("display", "block")
            } else {
                $(".textareaSpan").css("display", "none")
            }
        }
    })
    $(document).on("keydown",function(event){
        var ev = event || window.event; //获取event对象 
        var obj = ev.target || ev.srcElement; //获取事件源 
        var t = obj.type || obj.getAttribute('type'); //获取事件源类型 
        var code = event.keyCode|| event.which;
        if(code == 8 && t != "password" && t != "text" && t != "textarea"){
                return false
        } 
    })
})