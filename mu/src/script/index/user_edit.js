layui.use(["layer", "form", "extension","urlrelated"], function () {
  var layer = layui.layer,
    extension = layui.extension,
    urlrelated=layui.urlrelated,
    form = layui.form;
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
  // 所有的逻辑写在父页面里面

  form.on("submit", function () {
    var ymm = document.getElementById("ymm"),
      xmm = document.getElementById("xmm"),
      qrmm = document.getElementById("qrmm");
    var nameVal = localStorage.getItem("userName");
    var passwordVal = localStorage.getItem("passwordVal");
    var ymmVal = $(ymm).val(),
      xmmVal = $(xmm).val(),
      qrmmVal = $(qrmm).val();
    if (ymmVal != passwordVal) {
      $("#ymm").addClass("layui-form-danger")
      layer.msg("原密码不正确", {
        icon: "5"
      });
      return false
    } else if (qrmmVal != xmmVal) {
      $("#xmm").addClass("layui-form-danger")
      layer.msg("新密码与确认密码不符", {
        icon: "5"
      });
      return false
    } else if (ymmVal == xmmVal) {
      $("#xmm").addClass("layui-form-danger")
      layer.msg("新密码不能是原密码,请做出修改", {
        icon: "5"
      });
      return false
    }else if(!/^[0-9a-zA-Z]{8,16}$/.test(qrmmVal)){
      layer.msg("新密码格式错误，支持8-16位数字或字母的任意组合", {
        icon: "6"
      });
    }else {
      var desPassworldData = {
        "apiVersion": "1.0.2",
        "appVersion": "1.0.3",
        "data": {
          "param": xmmVal
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
            var data = {
              "platform": "pc",
              "appversion": "1.0.3",
              "apiversion": "1.0.2",
              "mac": "12345678",
              "ip": "xxx.xxx.xx.xx",
              "companyCode": "1001",
              "token": localStorage.getItem("token"),
              "data": {
                "userName": nameVal,
                "password":localStorage.getItem("kk"),
                "newPassword":res.data.result
              }
            };
            jQuery.support.cors = true;
            $.ajax({
              url:urlrelated.resetPassword,
              type: "post",
              dataType: "json",
              data: JSON.stringify(data),
              contentType: "application/json",
              success: function (data) {
                if (data.status == 200) {
                  layer.msg(data.message + "，请重新登录", {
                    icon: "6"
                  });
                  setTimeout(function () {
                    localStorage.clear();
                    window.parent.location.href = "/login.html";
                  }, 2000)
                } else {
                  layer.msg(data.message, {
                    icon: "5"
                  });
                  return false
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
          } else {
            layer.msg(ress.message, {
              icon: "5",
              time: 2000
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
    }
  })
  $(".close").click(function () {
    var index = parent.layer.getFrameIndex(window.name);
    parent.layer.close(index);
  })

  $(".layui-input").each(function (i, item) {
    $(item).on("blur", function () {
      if ($(this).val() != "") {
        $(this).removeClass("layui-form-danger")
      }
    })
  })

})
