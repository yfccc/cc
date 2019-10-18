var nIrisMode; // 采集标志 1 : 左眼, 2: 右眼, 3 : 双眼
var imageObj = null; // 虹膜图片信息类
var templateObj = null; // 虹膜特征信息类
var imageScoreObj = null; //虹膜采集质量分数
var active; // 方法
var sLeftJpegCache; // 抽取图像 JPEG 左眼图片缓存
var sRightJpegCache; // 抽取图像 JPEG 右眼图片缓存
var qzcjbz = '0'; // 强制采集标志 若通过设备无法正常采集，可进行强制采集，对强制采集的虹膜需标明， 1-强制，0-正常。必填。
var sbxh; // 设备型号
var sbbh; // 设备编号
var sbcsdm; //设备厂商代码
var sbbb; //设备最新版本 TODO 2019.07.02新增
var cjtphs; //采集耗时 TODO 2019.07.02新增
var isRun = false; // 标记是否正在进行业务
var isIdentify = false; // 标记是否正在识别
var isQZIsIdentify = false; // 标记是否正在强制采集
var driveManufacturerCode = ""; //s设备厂商代码
var deviceModeCode = ""; //设备型号
var rightCQcode, leftCQcode;
var cizt = "0";
layui.use(['form', 'layer', "jquery","urlrelated","extension"], function () {
    var form = layui.form,
        extension=layui.extension,
        index = parent.layer.getFrameIndex(window.name);
        layer = layui.layer,
        urlrelated= layui.urlrelated,
        $ = layui.jquery;
    form.render();
    $("input").removeAttr("readonly")
    var msgs; //用来判断弹窗上面是否弹出错误  然后发送请求判断设备是否可用
    //  下载驱动弹窗
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
    // // 方法
    active = {
        // pop 提示框
        parentPopup: function (msg) {
            //$('#tishi').html(msg);
            active.selectState("0") //设置select 和图片设备切换
            msgs = msg
            var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
            var wiodeWidth = $(window).width();
            if (wiodeWidth > 700) {
                parent.layer.title('<div  style="margin:0px auto;"><div style="float: left;display:block"><span >虹膜采集</span></div><div style="align: center;margin-left: 250px;float: left;"><span style="color: red">' + msg + '</span></div></div>', index) //再改变当前层的标题
            } else {
                parent.layer.title('<div  style="margin:0px auto;"><div style="float: left;display:block"><span >虹膜采集</span></div><div style="align: center;margin-left: 140px;float: left;"><span style="color: red">' + msg + '</span></div></div>', index) //再改变当前层的标题
            }
        },
        // 关闭窗口, 同时关闭设备
        close: function () {
            Biometrics.CloseEngine();
            setTimeout(function(){
            parent.layer.close(index);
            },200)
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
        // 初始化设备, 1: 采集 , 3 : 强制采集
        initE30: function (nWorkMode) {
            // 清空所有提示
            active['parentPopup'].call("", "");
            var ie = false;
            var vRet = 0;
            if ((!!window.ActiveXObject || "ActiveXObject" in window)) {
                ie = true;
            }

            try {
                // 关闭设备声音
                //  初始化成功
                /* Biometrics.UIType = 1;*/
                vRet = Biometrics.InitEngine();
                Biometrics.SetPlaySound(false);
                // 如果设备准备未就绪 弹窗上方给提示   如果就绪  发送请求 校验设备是否能用
                if (msgs != "") {
                    return false
                } else {
                    var Sbbh = active.getSbbh()
                    // 校验设备是否可用
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
                            deviceSn: Sbbh
                        }
                    }
                    // 验证设备是否可用
                    var SBstatus,msgssss="";
                    jQuery.support.cors = true;
                    $.ajax({
                        url:urlrelated.gatherCheckDevice,
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
                        }
                    })
                    if (!SBstatus) {
                        active['close'].call();
                        parent.top.layer.msg(msgssss,{icon:5})
                        return false;
                    }
                }
                active.selectState("1") //设置select 和图片设备切换
                /*    Biometrics.UIType = 1;  //1 嵌入式，0 弹出式。
                    vRet = Biometrics.InitEngine();*/
            } catch (e) {
                if (ie) {
                    //弹窗  相对于父级窗定位
                    top.layer.open({
                        type: 1,
                        title: '<span style="color: red;font-weight: bold">提示</span>',
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
                active['closeE30'].call();
                return false;
            }

            var isGetDeviceId = active['getDeviceID'].call();
            if (!isGetDeviceId) {
                return false;
            }

            /*var GetVersionInfo = active['getVersionInfo'].call();
            if (!GetVersionInfo){
                return false;
            }
*/
            // 清空设备返回信息
            imageObj = null; // 虹膜图片信息类
            /* templateObj = null; // 虹膜特征信息类*/
            imageScoreObj = null; //虹膜采集质量分数*/

            // ....
            Biometrics.SetEnrollNum(3);
            Biometrics.UIType = 1; //1 嵌入式，0 弹出式。

            // 开始采集
            if (nWorkMode == 1) {
                active['identifyBtnOnOff'].call('', 0); // 关闭识别功能
                Biometrics.StartCapture(nIrisMode);
            } else if (nWorkMode == 3) { // 强制采集
                Biometrics.ForceCapture(1000); // 强制采集, 参数
            }
            return true;
        },
        getDeviceID: function () {
            var DeviceInfo = "";
            DeviceInfo = Biometrics.GetConnectedDeviceInfo();
            var infoArr = DeviceInfo.split("_");
            if (infoArr.length != 3) {
                active['closeE30'].call();
                return false;
            }

            sbbh = infoArr[0]; // 设备编号
            sbxh = infoArr[1]; // 设备型号
            sbcsdm = infoArr[2]; // 设备厂商代码'
            driveManufacturerCode = sbcsdm;
            deviceModeCode = sbxh;
            //获取设备版本号
            GetVersionInfo = Biometrics.GetVersions();
            var infoArr1 = GetVersionInfo.split("_");
            var sbbb1 = infoArr1[0];
            var sbbb2 = infoArr1[1];
            sbbb = sbbb2;
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
            var  sbbh =active.getSbbh();//设备sn
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
                    "driveManufacturerCode": driveManufacturerCode,
                    "deviceTypeId": deviceModeCode,
                    "deviceSn":sbbh
                }
            };
            var data2 = "";
            var sbbbStatu,sbbbMsg;
            var Pindex = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
            //  获取设备最新版本    用来校验  提示用户
            jQuery.support.cors = true;
            $.ajax({
                url:urlrelated.gatherGetDriveVersion,
                type: "POST",
                data: JSON.stringify(data1),
                dataType: "json",
                async: false,
                contentType: "application/json",
                success: function (data) {
                    if (data.status == 200) {  
                        data2 = data.data.driveVerson;     
                        sbbbStatu=true;
                    } else {
                        sbbbStatu=false;
                        active['closeE30'].call();
                        cizt = "0"
                        parent.layer.msg(data.message,{icon: 5,time:3000});
                        parent.layer.close(Pindex);
                        return false
                    }
                }
            });
            if(sbbbStatu){//判断设备的sn码能不能用
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

            }
        },

        // 开始采集按钮 1 开 0 关
        identifyBtnOnOff: function (type) {
            if (type == 0) {
                // $('#identiry-start-id').attr('disabled', 'disabled').addClass('layui-btn-disabled');
                $('#gather-start-id').html('停止采集');
                $('#left-eye-id').attr('disabled', 'disabled');
                $('#right-eye-id').attr('disabled', 'disabled');
                return;
            }
            if (type == 1) {
                // $('#identiry-start-id').removeAttr('disabled').removeClass('layui-btn-disabled');
                $('#gather-start-id').html('开始采集');
                $('#left-eye-id').removeAttr('disabled');
                $('#right-eye-id').removeAttr('disabled');

            }
        },

        // 开始识别按钮禁用 1 开 0 关
        identifyBtnDisabled: function (type) {
            if (type == 0) {
                $('#gather-start-id').attr('disabled', 'disabled').addClass('layui-btn-disabled');
                return;
            }
            if (type == 1) {
                $('#gather-start-id').removeAttr('disabled').removeClass('layui-btn-disabled');

            }
        },

        vailRollback: function () {
            /*  //console.log(imageObj.bRightEye,templateObj.bRightEye,imageScoreObj.QualityScoreL,imageScoreObj.QualityScoreR  )
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
            /*   // 2 验证特征是否正确
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
               }
               */
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

        // 采集赋值
        identify: function () {
            if (imageObj != null && cjtphs != null && sbbb != null && imageScoreObj != null) {
                // 验证 三次回调的参数是否正确
                var isRoolBack = active['vailRollback'].call();
                if (!isRoolBack) { // 回调返回错误, 关闭设备
                    active.selectState("0")
                    active['closeE30'].call();
                    return false; // 终端流程
                }

                // var cjtphs = ((new Date().getTime() - sDate)/1000).toFixed(3);
                // 获取特征和图片耗时
                // imageObj.ulTimeStamp = cjtphs;
                var imageJson = JSON.stringify(imageObj);
                /*  var templageJson = JSON.stringify(templateObj);*/
                var imageScoreJson = JSON.stringify(imageScoreObj);
                /* var dsycjbz = nIrisMode == 2 ? '1' : nIrisMode == 2 ? '1' : nIrisMode;*/
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
                // parent.layui.$("#imageJson").val(imageJson);// 右眼图片

                /*  parent.layui.$("#templageJson").val(templageJson);// 左眼图片*/
                if (sLeftJpegCache != null) {
                    localStorage.setItem("leftEyebes64", "data:image/bmp;base64," + sLeftJpegCache)
                    localStorage.setItem("leftEyebes64H", imageObj.strLeftTemplate)
                }
                //  左右眼存进缓存   如果没有那么设备就是默认路径
                if (sRightJpegCache != null) {
                    // parent.layui.$("#rightEye").attr('src', "data:image/jpeg;base64," + sRightJpegCache); // 右眼图片 JPEG
                    localStorage.setItem("rightEyebes64", "data:image/bmp;base64," + sRightJpegCache)
                    localStorage.setItem("rightEyebes64H", imageObj.strRightTemplate)
                }
                localStorage.setItem("qzcjbz", qzcjbz);
                localStorage.setItem("cjtphs", cjtphs);
                localStorage.setItem("sbxh", sbxh);
                localStorage.setItem("sbbh", sbbh);
                localStorage.setItem("updVersion", sbbb);
                localStorage.setItem("sbcsdm", sbcsdm);
                localStorage.setItem("zy_xxzlpf", imageScoreObj.QualityScoreL);
                localStorage.setItem("yy_xxzlpf", imageScoreObj.QualityScoreR);
                localStorage.setItem("leftCQcode", leftCQcode);
                localStorage.setItem("rightCQcode", rightCQcode);
                localStorage.setItem("dsycjbz", dsycjbz);
                localStorage.setItem("imageJson", imageJson);
                cizt = "1"
                // parent.layui.$("#qzcjbz").val(qzcjbz);
                // parent.layui.$("#cjtphs").val(cjtphs); //采集图片耗时
                // parent.layui.$("#sbxh").val(sbxh); //设备型号
                // parent.layui.$("#sbbh").val(sbbh);//设备编号
                // parent.layui.$('#cjzt').val("0");
                // parent.layui.$('#updVersion').val(sbbb);//TODO 新增，虹膜驱动版本，2019.07.04
                // parent.layui.$("#sbcsdm").val(sbcsdm); //设备厂商代码 新添
                // parent.layui.$("#zy_xxzlpf").val(imageScoreObj.QualityScoreL);//左眼虹膜照片信息质量评分。3位数值型字符串。必填  新添
                // parent.layui.$("#yy_xxzlpf").val(imageScoreObj.QualityScoreR);//右眼虹膜照片信息质量评分。3位数值型字符串。必填  新添
                active['close'].call();
            }
        }
    };
    $("#gather-iris-close").on("click", function () {
        parent.layer.close(index);
    });
    //开始采集
    form.on('submit(gather-start-filter)', function (data) {
        // 发现正在识别， 那么它就是要停止识别
        if (qzcjbz == '0' && isIdentify) {
            active['qzcjOnOff'].call('', 1); // 开启强制采集
            active['closeE30'].call(); // 关闭设备， 打开开始识别按钮
            active.selectState("0")
            return false;
        }

        // 判断是否有业务在运行
        if (isRun) {
            return false;
        }

        // 发现正在识别， 那么它就是要停止识别
        if (isIdentify) {
            active['closeE30'].call(); // 关闭设备， 打开开始识别按钮
            active.selectState("0")
            return false;
        }

        active['qzcjOnOff'].call('', 0); // 关闭强制采集

        qzcjbz = '0';
        var leftEye = data.field.leftEye; // 左眼 2
        var rightEye = data.field.rightEye; // 右眼 1

        // 模式判断 默认赋 0
        /*     nIrisMode = 0;
             if (rightEye == 1){
                 nIrisMode = 1;
             }
             if (leftEye == 2){
                 nIrisMode += 2;
             }*/
        nIrisMode = 0;
        if (leftEye == "0" && rightEye == "0") {
            // 双眼采集状态
            rightCQcode = 0;
            leftCQcode = 0;
            nIrisMode = 3
        }
        if (leftEye == "0" && rightEye != "0") {
            rightCQcode = rightEye;
            leftCQcode = 0;
            // 左眼采集状态
            nIrisMode = 2
        }
        if (leftEye != "0" && rightEye == "0") {
            // 右眼采集状态
            leftCQcode = leftEye;
            rightCQcode = 0;
            nIrisMode = 1
        }

        if (nIrisMode == 0) {
            active['parentPopup'].call("", "请选择要采集的眼睛");
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

    //防止页面后退
    $(document).on("keydown",function(event){
        var ev = event || window.event; //获取event对象 
        var obj = ev.target || ev.srcElement; //获取事件源 
        var t = obj.type || obj.getAttribute('type'); //获取事件源类型 
        var code = event.keyCode|| event.which;
        if(code == 8 && t != "password" && t != "text" && t != "textarea"){
                return false
        } 
    })
    //强制采集
    form.on('submit(gather-force-filter)', function (data) {
        // 判断是否有业务在运行
        if (isRun) {
            return false;
        }

        // 信息初始化
        qzcjbz = '1';
        var leftEye = data.field.leftEye; // 左眼 2
        var rightEye = data.field.rightEye; // 右眼 1
        // 模式判断 默认赋 0
        nIrisMode = 0;
        if (leftEye == "0" && rightEye == "0") {
            // 双眼采集状态
            rightCQcode = 0;
            leftCQcode = 0;
            nIrisMode = 3
        }
        if (leftEye == "0" && rightEye != "0") {
            rightCQcode = rightEye;
            leftCQcode = 0;
            // 左眼采集状态
            nIrisMode = 2
        }
        if (leftEye != "0" && rightEye == "0") {
            // 右眼采集状态
            leftCQcode = leftEye;
            rightCQcode = 0;
            nIrisMode = 1
        }
        if (nIrisMode == 0) {
            active['parentPopup'].call("", "请选择要采集的眼睛");
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
    window.onbeforeunload = function (event) {
        Biometrics.CloseEngine(); // 关闭设备
        $(".imgPrent").css("display","none");
        $(".OBJECTPrent").css("display","none");
        localStorage.setItem("cizt", cizt)
    };



});
// 设备操作信息
function OnNofitfyStatusStr(param1) {

}

// 不知道
function OverTime() {}
// strLeftImage
// function  OnNotifyImage(nWorkMode, nImageNum, ulTimeStamp, bLeftEye, bRightEye, strLetImage, strRightImage,  strLeftImageJPG, strRightImageJPG) {
//     // alert(strLetImage)
//     // alert(strRightImage)
//     var images = {
//         nWorkMode : nWorkMode,
//         nTemplateNum : nImageNum,
//         ulTimeStamp : ulTimeStamp, //输入参数：图像的时间戳(采集图像时间)
//         bLeftEye : bLeftEye,
//         bRightEye : bRightEye,
//         strLeftImageJPG : nIrisMode == 2  || nIrisMode == 3 ? strLetImage : null,
//         strRightImageJPG : nIrisMode == 1  || nIrisMode == 3 ? strRightImage : null
//     };
//     //console.log(images)
//     imageObj = images;
//     sRightJpegCache = nIrisMode == 1  || nIrisMode == 3 ? strRightImageJPG : null;
//     sLeftJpegCache = nIrisMode == 2 || nIrisMode == 3 ? strLeftImageJPG : null;
//     active['identify'].call();
// }


function OnNotifyImage(nWorkMode, nImageNum, ulTimeStamp, bLeftEye, bRightEye, strLetImage, strRightImage, strLeftImageJPG, strRightImageJPG) {

    var images = {
        nWorkMode: nWorkMode,
        nTemplateNum: nImageNum,
        ulTimeStamp: ulTimeStamp, //输入参数：图像的时间戳(采集图像时间)
        bLeftEye: bLeftEye,
        bRightEye: bRightEye,
        strLeftTemplate: nIrisMode == 2 || nIrisMode == 3 ? strLetImage : null,
        strRightTemplate: nIrisMode == 1 || nIrisMode == 3 ? strRightImage : null


    };
    /* var template = {
         nWorkMode : nWorkMode,
         nTemplateNum : nImageNum,
         ulTimeStamp : ulTimeStamp,
         bLeftEye : bLeftEye,
         bRightEye : bRightEye,
         strLeftTemplate : nIrisMode == 2  || nIrisMode == 3 ? strLetImage : null,
         strRightTemplate : nIrisMode == 1  || nIrisMode == 3 ? strRightImage : null


     };
     templateObj = template;*/
    imageObj = images;
    sRightJpegCache = nIrisMode == 1 || nIrisMode == 3 ? strRightImageJPG : null;
    sLeftJpegCache = nIrisMode == 2 || nIrisMode == 3 ? strLeftImageJPG : null;
    active['identify'].call();
}



function OnNotifyQualityScore(PercentVisibleL, QualityScoreL, PercentVisibleR, QualityScoreR) {
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
    cjtphs = param1.toFixed(3);
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

    if (param1 == 0 || param1 == 1) {
        return;
    }

    active['parentPopup'].call("", message);
    if (isCloseE30ByStatus) {
        active['closeE30'].call();
    }



    if (param1 == -2101 || param1 == -2109 || param1 == 2301) {
        active['qzcjOnOff'].call('', 1); // 开启强制采集
    }
}