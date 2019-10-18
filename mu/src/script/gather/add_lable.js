var imList = [];
layui.use(["layer"], function () {
    var layer = layui.layer;
    var len;
    setTimeout(function(){
        len = localStorage.getItem("add_lable_arr_len")//已经选择的数据    不能重复添加
        if(len !=0  && len != undefined){
            $("strong").css("display","block")
        }else{
            $("strong").css("display","none")
        }
    },200)
    // $(".clear").find("span:first").html('已选（' + len + '），最多可添加5条');
    $(document).on("click", ".add", function () {
        var name = $(this).prev().text();
        var imId = $(this).prev().attr("imid");
        $("strong").css("display","block")
        if (len == 5) {
            len = 5;
            layer.msg("最多只能添加5个标签",{icon:"5"});
            return false;
        } else {
            len++;
            $(".clear").find("span:first").html('已选（' + len + '），最多可添加5条');
            $(this).parents("li").remove();
            $(".right").append(' <li><span   class="rigth_item  firstContent" imId=' + imId + '>' + name + '</span><span  class="del">删除</span></li>');
            imList.push({
                "imId": imId,
                "imName": name
            })
        }
    });
    $(document).on("click", ".del", function () {
        var name = $(this).prev().text();
        var imids = $(this).prev().attr("imId");
        $(this).parents("li").remove();
        $(".left").append(' <li><span  class="firstContent" imId=' + imids + '>' + name + '</span><span  class="add">+添加</span>');
        if (len == 1) {
            len = 0;
            $(".clear").find("span:first").html('已选（' + len + '），最多可添加5条');
            imList = [];
            $("strong").css("display","none")
            return false
        } else {
            len--;
            $(".clear").find("span:first").html('已选（' + len + '），最多可添加5条');
            $(imList).each(function (i, item) {
                if (item.imId == imids) {
                    imList.splice(i, 1)
                }
            })
        }

    })


    $(document).on("click","strong",function(){
        var  lis = $(".rigth_item")
        $(lis).each(function(i,item){
                var itemName = $(item).text()
                var imIds = $(item).attr("imid")
                $(item).parents("li").remove()
                $(".left").append(' <li><span    class="firstContent"  imId=' + imIds + '>' + itemName + '</span><span  class="add">+添加</span>');
                // alert(len)
                $("strong").css("display","none")
                len=0
                $(".clear").find("span:first").html('已选（' + len + '），最多可添加5条');
            
        })
    })
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

function sethtml() {
    var imLists = [];
    var rigth_item = $(".right").find(".rigth_item")
    $(rigth_item).each(function (ii, item) {
        var imId = $(item).attr("imId"),
            imName = $(item).text();
        imLists.push({
            imId: imId,
            imName: imName
        })
    })
    var rableHtml = "";
    $(imLists).each(function (i, item) {
        rableHtml += '<div class="people_lable_item"><span  class="imId"  imId=' + item.imId + '>' + item.imName + '</span><span class="layui-icon layui-icon-close"></span></div>'
    });

    return rableHtml;
}