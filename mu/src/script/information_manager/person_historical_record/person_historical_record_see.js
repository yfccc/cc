$(function(){
    var info = "修改";
    $("#operate_type").html('操作类型（'+'<p style="display:inline-block;">'+info+'</p>'+'）');
    var data = GetRequest(window.location.search);
    var result = {
        "data": [
            {
                "name": "丁一",
                "type": "身份证",
                "number": "130625456987562356",
                "gender": "1",
                "birthday": "2017-01-05",
                "nationality": "2",
                "nation": "3",
                "address": "银谷大厦",
                "authority": "海淀区",
                "effective": "昨天",
                "nowaddress": "公安局",
                "phone": "110",
                "otherphone": "120",
                "persontype": "111",
                "irisdata": "未采集",
                "cradtype_edit": "有证",
                "papersmark": "证件标志",
                "collectaddress": "马路",
                "collectnumber": "23",
                "collectperson": "路人",
                "collecttime": "半夜12点",
                "collectmemo": "122121",
                "modifyperson": "qwe",
                "modifytime": "到就死啊",
                "modifyreason": "伏见司爱凤"
            },
            {
                "name": "丁一",
                "type": "身份证",
                "number": "130625456987562356",
                "gender": "1",
                "birthday": "2017-01-05",
                "nationality": "2",
                "nation": "3",
                "address": "银谷大厦",
                "authority": "1",
                "effective": "昨天",
                "nowaddress": "2",
                "phone": "110",
                "otherphone": "3",
                "persontype": "111",
                "irisdata": "双眼",
                "cradtype_edit": "有证",
                "papersmark": "有证",
                "collectaddress": "马路",
                "collectnumber": "23",
                "collectperson": "1",
                "collecttime": "半夜12点",
                "collectmemo": "2",
                "modifyperson": "qwe",
                "modifytime": "到就死啊",
                "modifyreason": "伏见司爱凤"
            }
        ]
    };
     // 防止页面后退
     history.pushState(null, null, document.URL);
     window.addEventListener('popstate', function () {
             history.pushState(null, null, document.URL);
     });
    result = JSON.parse(JSON.stringify(result));
    RenderDataText($("body"), "original_", result.data[0]);
    RenderDataText($("body"), "present_", result.data[1]);
    $(".irisdata").each(function(){
        if($(this).text() == '未采集'){
            $(this).addClass("colorchange");
        }else{
            $(this).removeClass("colorchange");
        }
    });
    $(".papersmark").each(function(){
        if($(this).text() == '有证'){
            $(this).addClass("havecard");
        }else{
            $(this).removeClass("havecard");
        }
    })
});

function GetRequest(url) {
    var theRequest = {};
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
        }
    }
    return theRequest;
}  

function RenderDataText(body,idpre,result) {
    $.each(result, function (item, val) {
        if(!$("#"+idpre + item).hasClass("select")){
            body.find("#"+idpre + item).text(val);//给弹出层页面赋值，id为对应弹出层表单id
        }
    });
}
