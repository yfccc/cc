layui.use(["layer", "urlrelated", "extension"], function () {
    var layer = layui.layer;
    var urlrelated = layui.urlrelated;
    var extension = layui.extension;
    // 提示语是否显示
    if(extension.isIE89()){
        $(".inputSpan").css("display","block")
    }else{
        $(".inputSpan").css("display","none")
    }
    $("input").focus(function(){
        $(this).parent().find(".inputSpan").css("display","none")
    })
    $("input").blur(function(){
        if($(this).val() == ""){
            $(this).parent().find(".inputSpan").css("display","block")
        }
    })
    $(".inputSpan").click(function(){
        $(this).css("display","none")
        $(this).parent().find("input").focus()
    })
    localStorage.clear();
    $("input[type=text]").val("");
    $("input[type=password]").val("");
    $(".danger").hide();
    var thisClick = true;
    $(".dl").on("click", function () {
        if (thisClick) {
            thisClick = false;
        var nameVal = $("input[type=text]").val();
        var passwordVal = $("input[type=password]").val();
        var text = "";
        if (nameVal == undefined || nameVal == "") {
            layer.msg("请输入用户名", {
                icon: "5",
                time: 2000
            });
            $("input[type=text]").focus();
            $(".first").css("border", "1px solid red");
            thisClick = true;
            return false
        } else if (passwordVal == "" || nameVal == undefined) {
            layer.msg("请输入密码", {
                icon: "5",
                time: 2000
            });
            $("input[type=password]").focus();
            $(".towInput").css("border", "1px solid red");
            thisClick = true;
            return false
        } else {
            var desPassworldData = {
                "apiVersion": "1.0.2",
                "appVersion": "1.0.3",
                "data": {
                    "param": passwordVal
                },
                "platform": "1007"
            }
            jQuery.support.cors = true;
            $.ajax({ //账号加密请求接口
                url: urlrelated.logDesUrl,
                type: "post",
                data: JSON.stringify(desPassworldData),
                asnyc: false,
                cache: false,
                contentType: "application/json",
                success: function (res) {
                     if (res.status == 200) {
                        // 提交密码密码加密   
                        var datass = {
                            "platform": "1007",
                            "appversion": "1.0.3",
                            "apiversion": "1.0.2",
                            "mac": "12345678",
                            "ip": "xxx.xxx.xx.xx",
                            "companyCode": "1001",
                            "data": {
                                "userName": nameVal,
                                "password":res.data.result
                            }
                        };
                        var datas = JSON.stringify(datass);
                        jQuery.support.cors = true;
                    $.ajax({
                        url: urlrelated.loginUrl, 
                        type: "post",
                        data: datas,
                        asnyc: false,
                        dataType: "json",
                        cache: false,
                        contentType: "application/json",
                        success: function (ress) {
                            if (ress.status == 200) {
                                var models = JSON.stringify(ress.data.models);
                                localStorage.setItem("token", ress.token); //令牌存起来
                                localStorage.setItem("JGID", ress.data.JGID); //机构id
                                localStorage.setItem("kk",res.data.result ); //密码加密过后
                                localStorage.setItem("userJGDM", ress.data.userJGDM); //公安机构信息代码
                                localStorage.setItem("jgmc", ress.data.jgmc); //公安机构信息代码
                                localStorage.setItem("models", models); //全选过滤用
                                localStorage.setItem("userId", ress.data.userId); //用户代码
                                localStorage.setItem("policeId", ress.data.policeId); //警用代码
                                localStorage.setItem("userName", ress.data.userName); //用户名
                                localStorage.setItem("userRealname", ress.data.realName); ////登录用户信息 姓名idCard
                                localStorage.setItem("gender", ress.data.gender); ////登录用户信息 性别
                                localStorage.setItem("phone", ress.data.phone); ////登录用户信息 姓名idCard
                                localStorage.setItem("idCard", ress.data.idCard); ////登录用户信息 身份证
                                localStorage.setItem("passwordVal", passwordVal); ////登录用户信息密码
                                localStorage.setItem("name", nameVal); ////登录用户信息 登录
                                localStorage.setItem("userPlaceCode", ress.data.userPlaceCode); //采集地址代码 
                                localStorage.setItem("userPlaceName", ress.data.userPlaceName); //采集地址名称
                                localStorage.setItem("rolesName", ress.data.rolesName); //当前登录用户的角色名称
                                layer.msg(ress.message, {
                                    icon: "1",
                                    time: 2000
                                })
                                setTimeout(function () {
                                    window.location.href = "/index.html"
                                }, 2000)
                            } else {
                                layer.msg(ress.message, {
                                    icon: "5",
                                    time: 2000
                                })
                                thisClick = true;
                                $("input[type=password]").val("");
                                $("input[type=password]").focus();
                                $(".inputP").css("border", "1px solid #DBDBDB");
                            }
                        },
                        error: function (xmlhttpRequest) {
                            var status = JSON.stringify(xmlhttpRequest.readyState);
                            layer.msg("系统错误", {
                                icon: "5",
                                time: 2000
                            })
                        }
                    })
                    } else {
                        layer.msg(res.message, {
                            icon: "5",
                            time: 2000
                        })
                        thisClick = true;
                    }
                },
                error: function (xmlhttpRequest, textStatus) {
                    var status = JSON.stringify(xmlhttpRequest.readyState);
                    layer.msg("系统错误", {
                        icon: "5",
                        time: 2000
                    })
                }
            })
        }
        } else {
            setTimeout(function () {
                thisClick = true;
            }, 1000)
        }

    });



    $("input").on("blur", function () {
        if ($(this).val() != "") {
            $(this).parent().css("border", "1px solid #DBDBDB")
        }
    })

    //    enter安夏的时候登陆
    // var thisclicko = true;
    $(document).on("keyup", function (event) {

        if (event.keyCode == "13") {
            //触发按钮点击事件
            $(".dl").trigger("click");
        }
    })
    //防止页面后退  
    // history.pushState(null, null, document.URL);
    // window.addEventListener('popstate', function () {
    //     history.pushState(null, null, document.URL);
    // });
});