var nIrisMode; // 采集标志 1 : 左眼, 2: 右眼, 3 : 双眼
var imageObj = null; // 虹膜图片信息类
var templateObj = null; // 虹膜特征信息类
var imageScoreObj = null; //虹膜采集质量分数
var active; // 方法
var sLeftJpegCache; // 抽取图像 JPEG 左眼图片缓存
var sRightJpegCache; // 抽取图像 JPEG 右眼图片缓存
var qzcjbz = '0'; // 强制采集标志 若通过设备无法正常采集，可进行强制采集，对强制采集的虹膜需标明， 1-强制，0-正常。必填。
var sbxh; // 设备型号
var cjtphs; //采集耗时 TODO 2019.07.02新增
var sbbb; //设备版本  TODO 2019.07.02新增
var sbbh; // 设备编号
var sbcsdm; //设备厂商代码
var isRun = false; // 标记是否正在进行业务
var isIdentify = false; // 标记是否正在识别
var isQZIsIdentify = false; // 标记是否正在强制采集
var driveManufacturerCode = ""; //s设备厂商代码
var deviceModeCode = ""; //设备型号
var leftCQcode, rightCQcode;
var mz = [];
var sfcjcgbz = 0; //是否采集成功状态
// layui 组件初始化
layui.use(['form', 'layer', "urlrelated"], function () {
    var $ = layui.$,
        form = layui.form,
        urlrelated = layui.urlrelated,
        index = parent.layer.getFrameIndex(window.name);
    var msgs; //用来判断弹窗上面是否弹出错误  然后发送请求判断设备是否可用
    function dowlodeQDhtml(msg) {
        var html = "";
        return html = '<div class="layui-card-body layui-text layadmin-text;"style="width:420px;text-align:center;overflow:hidden">' +
            '<div  style="width:100%;font-size:24px;font-weight: bold;margin-bottom:35px;">' +
            '<span  class="layui-icon layui-icon-tips" style="color:#FF9900;font-size:26px; vertical-align: middle"></span>' +
            '<span   style="margin-left:5px;font-size:16px; font-weight: normal; vertical-align: middle">' + msg + '</span>' +
            '</div>' +
            '<a href=' + localStorage.getItem("QDurl") + ' style="color:#3B98FE;font-size: 13px;font-weight: normal;display:block;width:100%">点击下载驱动</a>' +
            '</div>'
    }

    var cjhs = 0; //采集耗时 从设备调用成功到采集成功关闭弹窗
    // 渲染表单
    // form.render(null, 'identify-iris-form-filter');
    $("input").removeAttr("readonly")
    var data = {
        "platform": "1007",
        "appversion": "1.0.3",
        "apiversion": "1.0.2",
        "mac": "12345678",
        "ip": "xxx.xxx.xx.xx",
        "companyCode ": "1001",
        "token": localStorage.getItem("token"),
    }
    var datas = JSON.stringify(data),
        zjlxArr = [],
        gjArr = [];
    jQuery.support.cors = true;
    $.ajax({
        url: urlrelated.gatherGetCodeList,
        type: "post",
        data: datas,
        // async: false,
        contentType: "application/json",
        success: function (data) {
            var datass = data.data;
            if (data.status == 200) {
                $.each(datass.zjlxList, function (i, item) {
                    zjlxArr.push(item)
                })
                $.each(datass.mzList, function (i, item) {
                    mz.push(item)
                });
                $.each(datass.gjList, function (i, item) {
                    gjArr.push(item)
                })
            } else {
                layer.msg(data.message, {
                    icon: "5"
                })
            }
        },
        error: function (i) {
            //  alert(i)
        }
    })


    // 定义方法
    active = {
        // pop 提示框
        parentPopup: function (msg) {
            msgs = msg
            active.selectState("0") //设置select 和图片设备切换
            //$('#tishi').html(msg);
            var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
            var wiodeWidth = $(window).width()
            if (wiodeWidth > 700) {
                parent.layer.title('<div  style="margin:0px auto;"><div style="float: left"><span >虹膜识别</span></div><div style="align: center;margin-left: 250px;float: left;"><span style="color: red">' + msg + '</span></div></div>', index) //再改变当前层的标题
            } else {
                parent.layer.title('<div  style="margin:0px auto;"><div style="float: left"><span >虹膜识别</span></div><div style="align: center;margin-left: 140px;float: left;"><span style="color: red">' + msg + '</span></div></div>', index) //再改变当前层的标题
            } // top.layer.msg('Hi, man', {shade: 0.3})
        },
        selectState: function (state) {
            if (state == "1") { //传进来参数是1  是采集状态    上面的按钮是禁止点击状态
                $("#leftEye").attr('disabled', "disabled"); //设备调用成  下拉框禁止点击
                $("#rightEye").attr('disabled', "disabled");
                $(".OBJECTPrent").css("display", "block")
                $(".imgPrent").css("display", "none")
            } else {
                $("#leftEye").removeAttr('disabled', "disabled"); //设备调用成  下拉框禁止点击
                $("#rightEye").removeAttr('disabled', "disabled");
                $(".OBJECTPrent").css("display", "none")
                $(".imgPrent").css("display", "block")
            }
            form.render('select');
            $("input").removeAttr("readonly")
        },
        // 关闭窗口, 同时关闭设备
        close: function () {
            Biometrics.CloseEngine();
            parent.layer.close(index);
        },

        // 关闭E30设备
        closeE30: function () {
            // 采集: 打开识别功能, 标记为未识别
            active['identifyBtnOnOff'].call('', 1); // 打开识别功能
            isIdentify = false; // 未进行识别
            isRun = false; // 结束业务

            // 强制采集: 接触开始采集禁用
            if (qzcjbz == '1') {
                active['identifyBtnDisabled'].call('', 1);
            }

            Biometrics.CloseEngine();
        },

        // 初始化设备, 1: 采集 , 3 : 强制采集
        initE30: function (wokeModel) {
            // 清空所有提示
            active['parentPopup'].call("", "");
            var ie = false;
            var vRet = 0;
            if ((!!window.ActiveXObject || "ActiveXObject" in window)) {
                ie = true;
            }

            try {
                // 关闭设备声
                Biometrics.UIType = 1; //1 嵌入式，0 弹出式。
                vRet = Biometrics.InitEngine()
                Biometrics.SetPlaySound(false);
                // 判断设备能不能用
                if (msgs != "") {
                    return false
                } else {
                    var Sbbh = active.getSbbh()
                    var data = {
                        "platform": "1007",
                        "appversion": "1.0.3",
                        "apiversion": "1.0.2",
                        "mac": "12345678",
                        "ip": "xxx.xxx.xx.xx",
                        "companyCode ": "1001",
                        "token": localStorage.getItem("token"),
                        "data": {
                            deviceSn: Sbbh
                        }
                    }
                    var SBstatus, msgssss;
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
                                SBstatus = true
                            } else {
                                msgssss = dataList.message;
                                SBstatus = false
                            }
                        },
                        error: function (err) {
                            //console.log(err)
                        }
                    })
                    if (!SBstatus) {
                        active['close'].call();
                        parent.top.layer.msg(msgssss,{icon:5})
                        return false;
                    }
                }
                /*    Biometrics.UIType = 1;*/
                //   调用设备成功  切换元素  换成obj元素
                cjhs = new Date().getTime(); //设备调用成功时间戳
                active.selectState("1") //设置select 和图片设备切换

            } catch (e) {
                if (ie) {
                    top.layer.open({
                        type: 1,
                        title: "<span style='color: red;font-weight: bold'>提示</span>",
                        skin: 'layui-layer-demo', //样式类名
                        area: ['450px', '210px'],
                        anim: 2,
                        resize: false,
                        btn: "关闭",
                        shadeClose: false, //开启遮罩关闭
                        content: dowlodeQDhtml("请先安装驱动")
                    });
                } else {
                    top.layer.msg('请使用IE浏览器', {
                        icon: 5
                    });
                }
                return false;
            }

            if (0 != vRet) {
                /* alert("InitEngine Failed! Return value is :" + strRet);*/
                active['closeE30'].call();
                return false;
            }


            // 获取设备信息
            var isGetDeviceId = active['getDeviceID'].call();
            if (!isGetDeviceId) {
                return false;
            }

            // 清空设备返回信息
            imageObj = null; // 虹膜图片信息类
            /*  templateObj = null; // 虹膜特征信息类*/
            imageScoreObj = null; //虹膜采集质量分数

            // ....
            Biometrics.SetEnrollNum(3);
            Biometrics.UIType = 1; //1 嵌入式，0 弹出式。

            // 开始采集
            if (wokeModel == 1) {
                active['identifyBtnOnOff'].call('', 0); // 关闭识别功能
                /*         alert(nIrisMode)*/
                Biometrics.StartCapture(nIrisMode);
            }

            // 强制采集
            if (wokeModel == 3) {
                var r = Biometrics.ForceCapture(1000); // 强制采集, 参数
            }
            return true;
        },

        // 获取设备信息
        getDeviceID: function () {
            DeviceInfo = Biometrics.GetConnectedDeviceInfo();
            var infoArr = DeviceInfo.split("_");
            if (infoArr.length != 3) {
                active['closeE30'].call();
                return false;
            }

            sbbh = infoArr[0]; // 设备编号
            sbxh = infoArr[1]; // 设备型号
            sbcsdm = infoArr[2]; // 设备厂商代码
            driveManufacturerCode = sbcsdm
            deviceModeCode = sbxh
            //获取设备版本号
            GetVersionInfo = Biometrics.GetVersions();
            var infoArr1 = GetVersionInfo.split("_");
            var infoArr1 = GetVersionInfo.split("_");
            var sbbb1 = infoArr1[0];
            var sbbb2 = infoArr1[1];
            sbbb = sbbb2
            active['getVersion'].call();
            return true;
        },
        getSbbh: function () {
            DeviceInfo = Biometrics.GetConnectedDeviceInfo();
            var infoArr = DeviceInfo.split("_");
            if (infoArr.length != 3) {
                active['closeE30'].call();
                return false;
            }
            sbbh = infoArr[0]; // 设备编号
            return sbbh
        },
        getVersion: function () {
            var sbbh = active.getSbbh(); //设备sn
            var data1 = {
                "platform": "1007",
                "appversion": "1.0.3",
                "apiversion": "1.0.2",
                "mac": "12345678",
                "ip": "xxx.xxx.xx.xx",
                "companyCode ": "1001",
                "token": localStorage.getItem("token"),
                "data": {
                    "driveManufacturerCode": driveManufacturerCode,
                    "deviceTypeId": deviceModeCode,
                    "deviceSn": sbbh
                }
            }
            var data2 = "";
            var sbbbStatu, sbbbMsg;
            var Pindex = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
            //  获取设备最新版本    用来校验  提示用户
            jQuery.support.cors = true;
            $.ajax({
                url: urlrelated.gatherGetDriveVersion,
                type: "post",
                data: JSON.stringify(data1),
                dataType: "json",
                async: false,
                contentType: "application/json",
                success: function (data) {
                    if (data.status == 200) {
                        data2 = data.data.driveVerson;
                        sbbbStatu = true;
                    } else {
                        sbbbStatu = false;
                        cizt = "0"; //  是否采集成功状态
                        active['closeE30'].call();
                        parent.layer.msg(data.message, {
                            icon: 5
                        })
                        parent.layer.close(Pindex);
                        return false
                    }
                },
                error: function (i) {
                    layer.msg(i, {
                        icon: "5"
                    })
                }
            });
            //设备更新，后期做
            if (sbbbStatu) { //判断谁被的sn码能不能用
                if (sbbb != data2) { //設備版本號  最新版本號校驗
                    active['closeE30'].call();
                    top.layer.open({
                        type: 1,
                        title: '<span style="font-weight: bold">提示</span>',
                        skin: 'layui-layer-demo', //样式类名
                        area: ['450px', '210px'],
                        anim: 2,
                        resize: false,
                        btn: "关闭",
                        shadeClose: false, //开启遮罩关闭
                        content: dowlodeQDhtml("驱动版本旧，请更新驱动")
                    });
                    parent.layer.close(Pindex);
                }
            }
        },


        // 强制采集开关， 1 ：开 , 0 ：关
        qzcjOnOff: function (status) {
            if (status == 0) {
                $("#force-id").attr('disabled', 'disabled').addClass('layui-btn-disabled');
                return;
            }

            if (status == 1) {
                $("#force-id").removeAttr('disabled').removeClass('layui-btn-disabled');
                return;
            }
        },

        // 开始识别按钮开关 1 开 0 关
        identifyBtnOnOff: function (type) {
            if (type == 0) {
                // $('#identiry-start-id').attr('disabled', 'disabled').addClass('layui-btn-disabled');
                $('#identiry-start-id').html('停止采集');
                $('#left-eye-id').attr('disabled', 'disabled');
                $('#right-eye-id').attr('disabled', 'disabled');
                return;
            }
            if (type == 1) {
                // $('#identiry-start-id').removeAttr('disabled').removeClass('layui-btn-disabled');
                $('#identiry-start-id').html('开始采集');
                $('#left-eye-id').removeAttr('disabled');
                $('#right-eye-id').removeAttr('disabled');
                return;
            }
        },
        // 开始识别按钮禁用 1 开 0 关
        identifyBtnDisabled: function (type) {
            if (type == 0) {
                $('#identiry-start-id').attr('disabled', 'disabled').addClass('layui-btn-disabled');
                return;
            }
            if (type == 1) {
                $('#identiry-start-id').removeAttr('disabled').removeClass('layui-btn-disabled');
                return;
            }
        },

        fmtCjsj: function (date) {
            if (date.length < 14) {
                return false;
            }

            var yy = date.substring(0, 4);
            var MM = date.substring(4, 6);
            var dd = date.substring(6, 8);
            return yy + "-" + MM + '-' + dd + " " + HH + ":" + mm + ":" + ss;
        },

        vailRollback: function () {
            /*  alert(qzcjbz)*/
            /* alert(nIrisMode)*/
            /*   //console.log(imageObj.bRightEye,templateObj.bRightEye,imageScoreObj.QualityScoreL,imageScoreObj.QualityScoreR  )
               //console.log(imageObj.bLeftEye,templateObj.bLeftEye ,imageScoreObj.QualityScoreL,imageScoreObj.QualityScoreR  )*/
            var message = qzcjbz == '1' ? "强制采集失败" : "采集失败";
            // 1 验证图片是否正确
            if (nIrisMode == 3 && (imageObj.bLeftEye == false || imageObj.bRightEye == false)) {
                active['parentPopup'].call("", message);
                return false;
            }
            if (nIrisMode == 2 && imageObj.bLeftEye == false) {
                active['parentPopup'].call("", message);
                return false;
            }
            if (nIrisMode == 1 && imageObj.bRightEye == false) {
                active['parentPopup'].call("", message);
                return false;
            }
            /*
                        // 2 验证特征是否正确
                        if ( nIrisMode == 3 && (templateObj.bLeftEye == false || templateObj.bRightEye == false)){
                            active['parentPopup'].call("", message);
                            return false;
                        }
                        if ( nIrisMode == 2 && templateObj.bLeftEye == false){
                            active['parentPopup'].call("", message);
                            return false;
                        }
                        if ( nIrisMode == 1 && templateObj.bRightEye == false){
                            active['parentPopup'].call("", message);
                            return false;
                        }*/

            //3 验证分数是否正确
            if (nIrisMode == 3 && (imageScoreObj.QualityScoreL == 0 || imageScoreObj.QualityScoreR == 0)) {
                active['parentPopup'].call("", message);
                return false;
            }
            if (nIrisMode == 2 && imageScoreObj.QualityScoreL == 0) {
                active['parentPopup'].call("", message);
                return false;
            }
            if (nIrisMode == 1 && imageScoreObj.QualityScoreR == 0) {
                active['parentPopup'].call("", message);
                return false;
            }
            return true;
        },
        // 调用识别， 比对身份证
        identify: function () {
            if (imageObj != null && cjtphs != null && sbbb != null && imageScoreObj != null) {
                // 验证 三次回调的参数是否正确
                var isRoolBack = active['vailRollback'].call();
                if (!isRoolBack) { // 回调返回错误, 关闭设备
                    active.selectState("0") //设置select 和图片设备切换
                    active['closeE30'].call();
                    return false; // 终端流程
                }
                var dsycjbz = 0;
                if (nIrisMode == 1) {
                    dsycjbz = 1
                }
                if (nIrisMode == 2) {
                    dsycjbz = 2
                }
                if (nIrisMode == 3) {
                    dsycjbz = 3
                }
                // var  cjtphs = cjtphs+""
                // var   newcjtphs=cjtphs.Substring(0,5)
                var paramData = {
                    "hmcjSbcsdm": sbcsdm, //设备厂商代码
                    "hmcjSbxh": sbxh, //设备型号代码
                    "hmcjQzcjbz": qzcjbz, //  1-强制，0-正常。必填。
                    "hmcjZyydm": dsycjbz, // 单双眼采集标志 根据被采集人的实际情况，采集的可能是双眼、右眼、左眼，3; // 双眼采集 2; // 左眼采集 1; // 右眼采集。必填。
                    "hmcjCjhs": (imageObj.ulTimeStamp).toFixed(3), //  采集图片耗时，单位秒，保留到毫秒，例如 2.032秒。 虹膜的采集识别前端通过设备采集到用于注册和比对的图片的时间，10位字符串。必填。
                    "hmcjCjbh": "", //采集编号
                    "hmcjQsqkdmZy": leftCQcode, // 虹膜采集_缺失情况代码
                    "hmcjQsqkdmYy": rightCQcode, // 虹膜采集_缺失情况代码-
                    "hmcjSbbh": sbbh, // 设备编号 前端采集虹膜图片的设备的编号，50位字符串。必填
                    "hmcjZyzp": imageObj.strLeftTemplate,
                    "hmcjYyzp": imageObj.strRightTemplate,
                    // imageJson : imageObj,
                    "hmcjZytxzl": imageScoreObj.QualityScoreL,
                    "hmcjYytxzl": imageScoreObj.QualityScoreR,
                    // updVersion: sbbb,  //TODO 新增，虹膜驱动版本，2019.07.04
                    "hmcjCjsbwzXzb": "", // 虹膜采集_采集识别位置_X坐标
                    "hmcjCjsbwzYzb": "", // 虹膜采集_采集识别位置_y坐标
                    "hmcjCjsbddDzmc": "", // 虹膜采集_采集识别地点_地址名称-
                    "userId": localStorage.getItem("userId"), //登录用户信息_用户ID
                    "userPoliceId": localStorage.getItem("policeId"), //登录用户信息 警号
                    "jgxxJgid": localStorage.getItem("JGID"), //登录用户信息 机构ID
                    "jgxxGajgjgdm": localStorage.getItem("userJGDM"), //登录用户信息 机构代码
                    "userName": localStorage.getItem("userName"), //登录用户信息 登录名
                    "userRealname": localStorage.getItem("userRealname"), //登录用户信息 姓名
                    "userIdcard": localStorage.getItem("idCard") //身份证
                };
                var data1 = {
                    "platform": "1007",
                    "appversion": "1.0.3",
                    "apiversion": "1.0.2",
                    "mac": "12345678",
                    "ip": "xxx.xxx.xx.xx",
                    "companyCode ": "1001",
                    "token": localStorage.getItem("token"),
                    "userId": localStorage.getItem("userId"), //登录用户信息_用户ID
                    "data": paramData
                }
                var picInfo = {
                    "sLeftJpegCache": sLeftJpegCache,
                    "sRightJpegCache": sRightJpegCache,
                    "QualityScoreL": imageScoreObj.QualityScoreL,
                    "QualityScoreR": imageScoreObj.QualityScoreR,
                    "cjtphs": cjhs //采集图片耗时
                }
                sfcjcgbz = "1" //是个否采集成功状态
                localStorage.setItem("picInfo", JSON.stringify(picInfo))
                localStorage.setItem("identifyData", JSON.stringify(data1))
                active['close'].call();
                return false;
            }
        }
    };

    // 关闭识别窗口
    $('#identify-iris-close').on('click', function () {
        parent.layui.$(".layui-input-block").attr("title", "")
        $(".info").attr("display", "none")
        parent.layer.close(index);
    });


    //开始采集
    form.on('submit(identify-start-filter)', function (data) {
        // 发现正在识别， 那么它就是要停止识别
        if (qzcjbz == '0' && isIdentify) {
            active['qzcjOnOff'].call('', 1); // 开启强制采集
            active['closeE30'].call(); // 关闭设备， 打开开始识别按钮
            active.selectState("0") //设置select 和图片设备切换
            return false;
        }

        // 判断是否有业务在运行
        if (isRun) {
            return false;
        }

        // 发现正在识别， 那么它就是要停止识别
        if (isIdentify) {
            active['closeE30'].call(); // 关闭设备， 打开开始识别按钮
            active.selectState("0") //设置select 和图片设备切换
            return false;
        }

        active['qzcjOnOff'].call('', 0); // 关闭强制采集

        // 信息初始化
        qzcjbz = '0';
        var leftEye = data.field.leftEye; // 左眼 1
        var rightEye = data.field.rightEye; // 右眼 2


        // 模式判断 默认赋 0
        nIrisMode = 0;
        if (leftEye == "0" && rightEye == "0") {
            // 双眼采集状态
            rightCQcode = 0
            leftCQcode = 0
            nIrisMode = 3
        }
        if (leftEye == "0" && rightEye != "0") {
            rightCQcode = rightEye
            leftCQcode = 0
            // 左眼采集状态
            nIrisMode = 2
        }
        if (leftEye != "0" && rightEye == "0") {
            // 右眼采集状态
            leftCQcode = leftEye
            rightCQcode = 0
            nIrisMode = 1
        }

        if (nIrisMode == 0) {
            active['parentPopup'].call("", "请选择要识别的眼睛");
            /* active['closeE30'].call();*/
            return false;
        }

        // 开始采集
        var isInit = active['initE30'].call(this, 1);
        if (isInit) {
            isRun = true;
            isIdentify = true; // 标记为开始识别
        }
        return false;
    });

    //强制采集
    form.on('submit(identify-force-filter)', function (data) {
        // 判断是否有业务在运行
        if (isRun) {
            return false;
        }

        // 信息初始化
        qzcjbz = '1';
        var leftEye = data.field.leftEye; // 左眼 1
        var rightEye = data.field.rightEye; // 右眼 2

        // 模式判断 默认赋 0
        nIrisMode = 0;
        if (leftEye == "0" && rightEye == "0") {
            // 双眼采集状态
            rightCQcode = 0
            leftCQcode = 0
            nIrisMode = 3
        }
        if (leftEye == "0" && rightEye != "0") {
            rightCQcode = rightEye
            leftCQcode = 0
            // 左眼采集状态
            nIrisMode = 2
        }
        if (leftEye != "0" && rightEye == "0") {
            // 右眼采集状态
            leftCQcode = leftEye
            rightCQcode = 0
            nIrisMode = 1
        }

        if (nIrisMode == 0) {
            active['parentPopup'].call("", "请选择要识别的眼睛");
            /* active['closeE30'].call();*/
            return false;
        }

        // 禁用开始采集按钮
        active['identifyBtnDisabled'].call('', 0);

        // 开始采集
        var isInit = active['initE30'].call(this, 3);
        if (isInit) {
            isRun = true;
        }
        return false;
    });

    //  页面关闭和刷新时关闭设备
    window.onbeforeunload = function (event) {
        // event.returnValue = "即将离开此页面";

        try {
            parent.layui.$("#sfcjcgbz").val(sfcjcgbz) //当前窗口关闭    只有采集成功时为1
            $(".imgPrent").css("display","none");
            $(".OBJECTPrent").css("display","none");
            Biometrics.CloseEngine(); // 关闭设备
        } catch (e) {

        }

        //ie8下面手动关闭
        // if(isIE8pd()){
        //     $("#Biometrics").css("display","none")
        // }
    };
});

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
// ocx 部分
// 接收图片信息 , bmp base64 , jpeg base64
function OnNotifyImage(nWorkMode, nImageNum, ulTimeStamp, bLeftEye, bRightEye, strLetImage, strRightImage, strLeftImageJPG, strRightImageJPG) {

    var images = {
        nWorkMode: nWorkMode,
        nTemplateNum: nImageNum,
        ulTimeStamp: ulTimeStamp, //输入参数：图像的时间戳(采集图像时间)
        bLeftEye: bLeftEye,
        bRightEye: bRightEye,
        strRightTemplate: nIrisMode == 1 || nIrisMode == 3 ? strRightImage : null,
        strLeftTemplate: nIrisMode == 2 || nIrisMode == 3 ? strLetImage : null

    };
    /*   var template = {
           nWorkMode : nWorkMode,
           nTemplateNum : nImageNum,
           ulTimeStamp : ulTimeStamp,
           bLeftEye : bLeftEye,
           bRightEye : bRightEye,
           strRightTemplate : nIrisMode == 1  || nIrisMode == 3 ? strRightImage : null,
           strLeftTemplate : nIrisMode == 2  || nIrisMode == 3 ? strLetImage : null

       };
       templateObj = template;*/
    imageObj = images;
    sRightJpegCache = nIrisMode == 1 || nIrisMode == 3 ? strRightImageJPG : null;
    sLeftJpegCache = nIrisMode == 2 || nIrisMode == 3 ? strLeftImageJPG : null;
    active['identify'].call();
}

// 接收特征, template
/*function templates(nWorkMode, nTemplateNum, ulTimeStamp, bLeftEye, bRightEye, strLeftTemplate, strRightTemplate) {
    // alert("特征回调接口 , bLeftEye : " + bLeftEye + ", bRightEye : " + bRightEye);
    var template = {
        nWorkMode : nWorkMode,
        nTemplateNum : nTemplateNum,
        ulTimeStamp : ulTimeStamp,  //输入参数：图像的时间戳(采集图像时间)
        bLeftEye : bLeftEye,
        bRightEye : bRightEye,
        strLeftTemplate : irisModel == 1 || irisModel == 3 ? strLeftTemplate : null,
        strRightTemplate : irisModel == 2 || irisModel == 3  ? strRightTemplate : null
    };
    templateObj = template;
    active['identify'].call();
}*/

// 设备操作信息
function OnNofitfyStatusStr(param1) {

}

// 不知道
function OverTime() {}
//输出图像质量
function OnNotifyQualityScore(PercentVisibleL, QualityScoreL, PercentVisibleR, QualityScoreR) {
    // alert("分数回调接口 , QualityScoreL : " + QualityScoreL + ", QualityScoreR : " + QualityScoreR);
    // PercentVisibleL PercentVisibleR 左右眼虹膜采集质量质量分数
    // QualityScoreL QualityScoreR		图像质量分数
    var template = {
        PercentVisibleL: PercentVisibleL,
        QualityScoreL: QualityScoreL,
        PercentVisibleR: PercentVisibleR,
        QualityScoreR: QualityScoreR
    };
    imageScoreObj = template;
    active['identify'].call();
}

function OnNotifyCaptureTime(param1) {
    cjtphs = param1;
    active['identify'].call();
}

// 设备返回状态
var isCloseE30ByStatus; // 判断那些状态是需要关闭设备并开启开始按钮的
function OnNotifyStatus(param1) {
    isCloseE30ByStatus = true;
    var message = "";
    switch (param1) {
        case -1001:
            message = "SDK初始化失败或者尚未初始化";
            break;
        case -1002:
            message = "在与Handle相关的函数中失败";
            break;
        case -1003:
            message = "设备状态异常";
            break;
        case -1004:
            message = "无效的授权";
            break; //
        case -1005:
            message = "读取设备ID出错";
            break;
        case -1006:
            message = "设备校验出错";
            break; //
        case -1007:
            message = "正在校验设备";
            isCloseE30ByStatus = false;
            break; //
        case -1008:
            message = "不支持的功能";
            break; //
        case -1009:
            message = "请翻转设备";
            break; //
        case -1010:
            message = "未找到设备";
            break; //
        case -1011:
            message = "设备数量小于2";
            break; //

            //与注册或识别算法逻辑相关的以21**开头
        case -2101:
            message = "虹膜特征获取失败";
            break; //
        case -2102:
            message = "调用停止获取虹膜特征信息函数时失败";
            break; //
        case -2103:
            message = "算法冲突，注册、识别、获取虹膜特征信息操作不能同时进行";
            break; //
        case -2104:
            message = "注册、获取虹膜特征信息时无效的输入";
            break; //
        case -2105:
            message = "识别时无效的输入";
            break; //
        case -2106:
            message = "比对时无效的输入";
            break; //
        case -2107:
            message = "识别超时";
            break; //
        case -2108:
            message = "识别时输入特征数目超过授权数目";
            break; //
        case -2109:
            message = "未获取到特征";
            break; //
        case -2110:
            message = "特征重复";
            break; //

            //与异步注册、识别函数调用相关
        case -2121:
            message = "异步调用失败";
            break; //
        case -2122:
            message = "异步任务正在执行";
            break; //

            //特别的，当人为调用停止注册、识别、获取虹膜特征信息函数时，之前调用的注册、识别、获取虹膜特征信息函数将返回1
        case 1:
            // message = "已调用";
            message = '';
            isCloseE30ByStatus = false;
            break;

            //与比对算法逻辑相关的以22**开头
        case -2201:
            message = "比对失败";
            break; //

            //与采图相关的以23**开头
        case -2301:
            message = "图像采集失败";
            break; //
        case -2302:
            message = "图像采集失败";
            break; //

            //与算法控制参数相关的以30**开头，
        case -3001:
            message = "无效的nIrisMode";
            break; //
        case -3002:
            message = "无效的注册时间或识别时间";
            break; //
        case -3003:
            message = "无效的FindMode";
            break; //
        case -3004:
            message = "无效的IfSpoofDetect";
            break; //
        case -3005:
            message = "无效的算法控制参数";
            break; //

            //与设备相关
        case -4001:
            message = "无效的采集器";
            break; //
        case -4002:
            message = "打开采集器失败";
            break; //

            //函数调用通用返回值
        case 0:
            // message = "调用成功";
            message = '';
            isCloseE30ByStatus = false;
            break; //函数调用成功，并且完成了函数功能
        case -8000:
            message = "参数错误";
            break; //函数调用缺省错误，一般为函数调用结果初始值，一般不可能返回该值

            //j2k图片添加头信息相关错误码
        case 7000:
            message = "j2k图片添加头信息相关错误码";
            break; //
        case 7001:
            message = "添加附加头结构错误";
            break; //

            //jas库相关错误码
        case -9000:
            message = "jas库相关错误码";
            break; //s
        case -9001:
            message = "jas库初始化错误";
            break; //
        case -9002:
            message = "输入流错误";
            break; //
        case -9003:
            message = "输出流错误";
            break; //
        default:
            message = "未知业务代码";
    }

    // alert(st);
    if (param1 == 0 || param1 == 1) {
        return;
    }

    // 返回任何错误码 关闭设备并变成开始采集
    active['parentPopup'].call("", message);
    if (isCloseE30ByStatus) {
        active['closeE30'].call();
    }

    // 如果发现是这三种状态, 开启强制采集
    if (param1 == -2101 || param1 == -2109 || param1 == 2301) {
        active['qzcjOnOff'].call('', 1); // 开启强制采集
    }
}