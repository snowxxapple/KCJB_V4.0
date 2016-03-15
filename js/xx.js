var __users = [];
var __info;
var __idx = [];
var chat;
var index;
var billId;
var subscribed_id;
var nowTime = 3600 * 10; //定义成全局变量就行 游客的过期时间 从后台获取
//当页面大小改变时 调整尺寸
window.onresize = function() {
        $("#resize").height(document.documentElement.clientHeight - 490 + 'px');
        $("#userh").height(document.documentElement.clientHeight - 300 + 'px');
        // $("#wrap").height(document.documentElement.clientHeight-260+'px');
        $("#home1").height(document.documentElement.clientHeight - 132 + 'px');
        $("#profile1").height(document.documentElement.clientHeight - 132 + 'px');
        $("#settings1").height(document.documentElement.clientHeight - 132 + 'px');
        $("#messages1").height(document.documentElement.clientHeight - 132 + 'px');
        // $("#minh").height(document.documentElement.clientHeight - 202 + 'px');
        var height = $("#home1").height() * 0.75;
        $("#historyMsg").css('height', height);
        var oBox = document.getElementById('home1');
        var oTop = document.getElementById('historyMsg');
        var oBottom = document.getElementById('historyMsg1');
        var oLine = document.getElementById('line');
        oLine.onmousedown = function(e) {
            var disX = (e || event).clientX;
            var disY = (e || event).clientY;
            oLine.top = oLine.offsetTop;
            document.onmousemove = function(e) {
                var iT = oLine.top + ((e || event).clientY - disY);
                var e = e || window.event,
                    tarnameb = e.target || e.srcElement;
                var maxT = oBox.clientHeight - oLine.offsetHeight;
                oLine.style.margin = 0;
                iT < 0 && (iT = 0);
                iT > maxT && (iT = maxT);
                oLine.style.top = oTop.style.height = iT + "px";
                oBottom.style.height = oBox.clientHeight - iT + "px";

                return false
            };
            document.onmouseup = function() {
                document.onmousemove = null;
                document.onmouseup = null;
                oLine.releaseCapture && oLine.releaseCapture()
            };
            oLine.setCapture && oLine.setCapture();
            return false
        };
    }
    //页面加载时执行的部分
window.onload = function() {
        $("#resize").height(document.documentElement.clientHeight - 490 + 'px');
        $("#userh").height(document.documentElement.clientHeight - 300 + 'px');
        $("#profile1").height(document.documentElement.clientHeight - 132 + 'px');
        $("#settings1").height(document.documentElement.clientHeight - 132 + 'px');
        $("#messages1").height(document.documentElement.clientHeight - 132 + 'px');
        $("#home1").height(document.documentElement.clientHeight - 132 + 'px');
        // $("#minh").height(document.documentElement.clientHeight - 202 + 'px');
        // $("#wrap").height(document.documentElement.clientHeight-260+'px');
        var height = ($("#home1").height()-76) * 0.75;
        $("#historyMsg").css('height', ($("#home1").height()-76) * 0.75);
        $("#historyMsg1").css('height', ($("#home1").height()-76) * 0.25);
        $("#messageInput").focus();
        var oBox = document.getElementById('home1');
        var oTop = document.getElementById('historyMsg');
        var oBottom = document.getElementById('historyMsg1');
        var oLine = document.getElementById('line');

        //聊天窗口 分栏线的拖拽
        // oLine.onmousedown = function(e) {
        //     var disX = (e || event).clientX;
        //     var disY = (e || event).clientY;
        //     // oLine.top = oLine.offsetTop;
        //     document.onmousemove = function(e) {
        //         var iT = oLine.offsetTop + ((e || event).clientY - disY);
        //         // var e = e || window.event,
        //             // tarnameb = e.target || e.srcElement;
        //         var maxT = oBox.clientHeight - oLine.offsetHeight;
        //         oLine.style.margin = 0;
        //         // iT < 0 && (iT = 0);
        //         // iT > maxT && (iT = maxT);
        //         oLine.style.top = oTop.style.height = iT + "px";
        //         oBottom.style.height = oBox.offsetHeight -((e || event).clientY - disY) + "px";

        //         return false
        //     };
        //     document.onmouseup = function() {
        //         document.onmousemove = null;
        //         document.onmouseup = null;
        //         oLine.releaseCapture && oLine.releaseCapture()
        //     };
        //     oLine.setCapture && oLine.setCapture();
        //     return false
        // };
        oLine.onmousedown=function(ev){
            var oEvent=ev||event;
            var mouseY=oEvent.clientY;
            
            var lineY=oLine.offsetTop;
           var topHeight=oTop.offsetHeight;
           var bottomHeight=oBottom.offsetHeight;
            document.onmousemove=function(ev){
                var oEvent=ev||event;
                var mouseY2=oEvent.clientY;
                
                var disY=mouseY-mouseY2;
                ;
                oLine.style.top=lineY-disY+'px';
                oTop.style.height=topHeight-disY+'px';
                oBottom.style.height=bottomHeight+disY+'px';
                // if(oLine.offsetTop>=500)
                // {
                //     oLine.style.top=500+'px';
                //     // disY=0;
                // }
                // if(oLine.offsetTop<=6){
                //     oLine.style.top=6+'px';
                //     // disY=0;
                // }
                 return false;//阻止浏览器默认行为（页面中文字会被选中） FF 和chrome
            }
            document.onmouseup = function(){
                document.onmousemove = null;

                document.onmouseup = null;
                oLine.releaseCapture && oLine.releaseCapture();
            }
            oLine.setCapture && oLine.setCapture();//阻止浏览器默认行为 IE 下独有的 事件捕获机制
            return false;

        }

        $.ajax({
            type: 'GET',
            url: '/api/info',
            success: function(data) {
                console.log("data", data);
                if (data.succ !== 0) {//没拿到信息
                    alert(data.msg);                   
                    $.ajax({
                            url: '/api/login',
                            type: 'POST',
                            dataType: 'json',
                        })
                        .done(function(msg) {
                            console.log("success", msg);
                            if (msg.succ == 0) {//游客
                                networkRun();
                            }
                        });
                } else {
                    networkRun();
                }
            }
        });

        //窗口滚到最新消息

        //定时器1 提醒游客身份 弹出框
        // var timer;
        // clearInterval(timer);
        // timer = setInterval('mention()', 10800000); //函数一定要加引号

        //定时器2 提醒游客身份 行情提醒中提醒 同时有点击注册界面    
        // var timer1;
        // clearInterval(timer1);
        // timer1 = setInterval(function() {
        //     return tiYan(nowTime);
        // }, 1000);


    }
    $("#profile1").click(function(event) {
        this.css('height',height/0.75);
    });
    //定时器1 定时器函数一定要写在外面
function mention() {
    alert('您的身份尚为游客,想体验更多功能，请注册!');
}
//定时器2
function tiYan(Time) {
    if (Time == 0) {
        alert('您的游客身份已过期，请注册！');
        window.location.href = 'register.html';
        clearInterval(timer1);
    } else {
        Time--;
        var Minute = Math.floor(Time / 60);
        var Second = Math.floor(Time % 60);
        $("#tiYanMinute").html(Minute + "分");
        $("#tiYanSecond").html(Second + "秒");
        nowTime = Time; // 更改全局变量的值，以便定时器下次执行时值已经改变
    }
    // console.log(Time);
    // console.log(nowTime);
    // console.log(Minute);
    // console.log(Second);
}

//刷新按钮
$("#Reload").click(function(event) {
    /* Act on the event */
    $("#videoBack").find('embed').remove();
    $("#videoBack").append("<embed src='http://yy.com/s/84010887/84010887/yyscene.swf' bgcolor='#000000' width='100%' height='350px' align='middle' allowscriptaccess='always' allowfullscreen='true' type='application/x-shockwave-flash' pluginspage='http://get.adobe.com/cn/flashplayer/' wmode='Opaque'></embed>");


});
//右面两块滚屏
$('#MsgBtn1').click(function(event) { //按完滚屏按钮后，改变按钮中的内容，同时进行相应的操作
    changeBtn($("#MsgBtn1"), document.getElementById('historyMsg')); //两个参数，第一个是按钮，第二个是对应的要滚屏的div
    gunPing($("#MsgBtn1"), document.getElementById('historyMsg'));
});
$("#Msg1Btn1").click(function(event) {
    changeBtn($("#Msg1Btn1"), document.getElementById('historyMsg1'));
    gunPing($("#Msg1Btn1"), document.getElementById('historyMsg1'));
});
//清屏
$("#MsgBtn2").click(function(event) {
    delet($("#historyMsg"));
});
$("#Msg1Btn2").click(function(event) {
    delet($("#historyMsg1"));
});
$("#hangqingClear").click(function(event) {
    delet($("#home"));
});

//滚屏
function changeBtn(btn, show) { //传入按钮中的内容btn JQuery对象和要滚动的窗口show DOM对象
    console.log(btn.text());
    if (btn.text() == '停止滚屏') { //原来是滚动的，现在要停止滚动
        btn.text('滚屏');
    } else { //原来是不滚动的，现在要滚动，同时改变按钮里的字
        btn.text("停止滚屏");
    }
}

function gunPing(btn, show) { //每次消息粘贴时要执行的函数
    if (btn.text() == '停止滚屏') //按钮上的字是停止滚屏 那么现在应该是滚屏状态
    {
        scrollScreen(show);
    }
}

function scrollScreen(obj) {
    console.log(obj);
    console.log(obj.scrollTop);
    console.log(obj.scrollHeight);
    obj.scrollTop = obj.scrollHeight;
}
//清屏函数
function delet(obj) {
    obj.find('p').remove();
}
//悄悄话
$("#qiaoqiao").click(function(event) {

    var eyeImg = document.getElementById('eyeIcon');
   
    if ($(eyeImg).attr('src') == 'icon/1.png' || $(eyeImg).attr('src') == 'icon/8.png') {
        $(eyeImg).attr('src','icon/11.png');

    } else {
        $(eyeImg).attr('src','icon/1.png');
    }
});
//修改密码模态框 验证密码
var checkChange1;
var checkChange2;
var checkChange3;
var checkChange4;

$('#passOld').blur(function(event) {
    checkChange1 = checkPass(document.getElementById('passOld'));
});

$('#passNew').focus(function(event) {
    // divShow(passDiv);
    iconHide($('#passId'));
});
$('#passNew').blur(function(event) {
    checkChange2 = checkPass(document.getElementById('passNew'), document.getElementById('passNewShow'));
    iconShow(checkChange2, $('#passId'));
});
$('#passSure').focus(function(event) {
    // divShow(passDiv2);
    iconHide($('#pass2Id'));
});
$('#passSure').blur(function(event) {
    checkChange3 = checkPass(document.getElementById('passSure'), document.getElementById('passSureShow')); //先检测是否为空
    checkChange4 = checkConsist(document.getElementById('passNew'), document.getElementById('passSure'), document.getElementById('passSureShow')); //再检测两次是否一致
    var test = checkChange3 && checkChange4;
    iconShow(test, $('#pass2Id'));
});
$("#changePass").click(function(event) {
    iconHide($('#passId'));
    iconHide($('#pass2Id'));
    $("#passNew").val('');
    $("#password").val('');
    $("#passNewShow").html('');
    $("#passSureShow").html('');

});

$("#sureChange").click(function(event) {

    /* Act on the event */
    if (checkChange1 && checkChange2 && checkChange3 && checkChange4) //密码确认修改
    {
        $.ajax({
                url: '/path/to/file',
                type: 'default GET (Other values: POST)',
                dataType: 'default: Intelligent Guess (Other values: xml, json, script, or html)',
                data: {
                    param1: 'value1'
                },
            })
            .done(function() {
                console.log("success");
            })
            .fail(function() {
                console.log("error");
            })
            .always(function() {
                console.log("complete");
            });

    } else {
        alert('输入信息有误！');
    }
});

function networkRun() {
    $.ajax({
        type: 'GET',
        url: '/api/info',
        // async:true,
        success: function(data) {
            // if (data.succ !== 0) {//游客
            //     window.location.href = '/login.html';//跳到登录界面，又跳回去了。。
            //     return;
            // }
            __info = data;
            //填写用户信息：积分 姓名
            $("#userddd").html(__info.display); //?
            $(".dropdown-menu").append('<li><a>积分 ' + data.score + '</a></li>');
            //根据用户的组别来添加对应的功能按钮
            if (__info.group == 0) { //组别 游客？？
                $(".dropdown-menu").find('li').eq('0').remove();
                $(".dropdown-menu").find('li').eq('0').remove();
                $(".dropdown-menu").find('li').eq('0').remove();//保留注销？？
                $("#left-panel").find('button').remove();//清除左侧行情提醒中的按钮
                $("#home").append("<p style='font-size:14px;color:white;'>您的身份是游客,尚不能查看喊单.您还剩下<span id='tiYanMinute' class='tiYan'></span><span id='tiYanSecond' class='tiYan'></span>体验时间<a href='register.html' style='color:red;margin-left:10px;margin-right:10px;font-size:16px;font-weight:bold;'>点此注册</a>即可查看行情提醒!</p>");
                //定时器1 提醒游客身份 弹出框
                var timer;
                clearInterval(timer);
                timer = setInterval('mention()', 10800000); //函数一定要加引号

                var timer1;
                clearInterval(timer1);
                timer1 = setInterval(function() {
                    return tiYan(nowTime);
                }, 1000);

            };
            if (__info.group == 100) { //root
                //                $(".dropdown-menu").append('<li class="divider"></li><li><a href="/htgl/admin.html">后台管理中心</a></li>')

                $(".dropdown-menu").append("<li id='power'><a>全屏蔽</a></li>");
                // $("#sendBtn").after("<button class='btn btn-primary pull-right btn-sm' style='margin-left:2px;margin-right:2px;' id='power'>全屏蔽</button>");
            }
            if (__info.group >= 92) {
                $(".dropdown-menu").append('<li class="divider"></li><li><a href="/htgl/admin.html">后台管理中心</a></li>');
            }
            if (__info.group >= 95) { //老师
                // $("#sendBtn").after("<span class='pull-right' style='color:#fff;'>行情到大厅</span><input type='checkbox' name = 'lobby' class='pull-right'>");
                // $("#sendBtn").after("<button class='btn btn-primary pull-right btn-sm' style='margin-left:2px;margin-right:2px;' id='ding'>行情提醒</button>");
                // $("#sendBtn").after("<button class='btn btn-primary pull-right btn-sm' style='margin-left:2px;margin-right:2px;' id='callbill' data-toggle='modal' data-target='#myModal'>喊单</button>");
                $("#appendBtn").append("<button class='btn btn-primary pull-right btn-sm' style='margin-left:2px;margin-right:2px;' id='callbill' data-toggle='modal' data-target='#myModal'>喊单</button><button class='btn btn-primary pull-right btn-sm' style='margin-left:2px;margin-right:2px;' id='ding'>行情提醒</button><span class='pull-right hangqing' style='color:#fff;'><input type='checkbox' name = 'lobby'><span style='position:relative;top:-3px;'>行情到大厅</span></span>");
                $("#callbill").unbind('click').click(function(event) {
                    //喊单模态框 在线喊单
                    $.ajax({
                            url: '/api/category',
                            type: 'GET',
                            dataType: 'json',

                        })
                        .done(function(data) {


                            $("#pro").find('input').remove(); //每次添加新内容时，都把旧的标签删除,实际上只更改标签里的内容就可以了
                            $("#pro").find('span').remove();

                            for (var i = 0; i < data.length; i++) { //新添加一堆框 产品类型
                                $("#pro").append("<input type='radio' name='pro' value=''><span></span>");
                                $("input[name='pro']").next('span').eq(i).text(data[i].name); //向标签里面写内容
                                $("input[name='pro']").eq(i).val(data[i].name).text(data[i].name);
                            }

                            $("input[name='pro']").click(function(event) { //单选框选中
                                for (var i = 0; i < data.length; i++) {
                                    if (data[i].name == $(this).val()) { //更新data的值，为选中框的值
                                        index = i; //index最后不就是data.length-1?

                                    }

                                };
                                $("#billtype").find('input').remove(); //跟上面一样
                                $("#billtype").find('span').remove();
                                for (var j = 0; j < data[index].products.length; j++) { //填了一堆报价类型
                                    $("#billtype").append("<input type='radio' name='billtype' value='" + data[index].products[j] + "'><span>" + data[index].products[j] + "</span>");
                                    // $("input[name='billtype']").next('span').eq(j).text(data[index].products[j]);
                                    // $("input[name='billtype']").eq(j).val(data[index].products[j]);
                                };
                            });



                        });

                });
            };
            /*
            if (__info.group >= 90 && __info.group < 95) {
                $("#sendBtn").after("<button class='btn btn-primary pull-right' id='ding'>行情提醒</button>")
            };
        */

            if (__info.group >= 50 && __info.group <= 89) { //这个用户组只添加了一个提问按钮
                $("#sendBtn").after("<button class='btn btn-primary pull-right' id='question'>提问</button>");
            }

            
            $.ajax({
                    url: '/api/suscribe',
                    type: 'GET',
                    dataType: 'json',

                })
                .done(function(data) { //模态窗里 谁 几天 几积分  一排单选按钮
                    for (var i = 0; i < data.length; i++) {
                        $("#subscribed").append("<input type='radio' name='long' value=" + data[i].name + "><span>" + data[i].name + "天(" + data[i].score + "积分)</span>");

                    };
                });
            $.ajax({
                url: '/api/history', //?type???聊天记录
                dataType: 'json'
            }).done(function(msg) {
                for (var i = 0; i < msg.length; i++) {
                    if (msg[i].pass) { //这个代表什么？？pass是什么消息验证通过？？
                        var from = msg[i].from_display; //变量定义有必要分开写吗？？
                        var to = msg[i].to_display;
                        var color = "#fff";
                        // var to = __users[msg[i].to_idx].display||'大家';
                        var a = msg[i].createTime;
                        var msg1 = msg[i].context;
                        var date = moment(a).format('HH:mm:ss'); //时间要改？？
                        // var day=new Date();
                        // date=day.toString(day).slice(16, 24);//字符串

                        if (isAdminstrator(from)) //是老师或客服发来的消息,消息为红色,historyMsg为上面的框，字号12px
                            $("#historyMsg").append("<p><span style='background-color:#505050;color:#fff;padding:3px 5px 3px 5px;margin-right:5px;border-radius: 5px;'>" + date + "</span><span style='padding:3px 5px 3px 5px;background-color:#66cc66;color:#fff;border-radius: 5px;font-size:12px;'>" + from + "</span> 对 <span  style='padding:3px 5px 3px 5px;background-color:#66cc66;color:#fff;border-radius: 5px;font-size:12px;'>" + to + "</span> ：<span style='padding:3px 5px 3px 5px;background-color:" + color + ";font-size:12px;border-radius: 5px; color:#FF0000;'>" + msg1 + "</span></p>");
                        else //其他消息默认黑色，不用设置
                            $("#historyMsg").append("<p><span style='background-color:#505050;color:#fff;padding:3px 5px 3px 5px;margin-right:5px;border-radius: 5px;'>" + date + "</span><span style='padding:3px 5px 3px 5px;background-color:#66cc66;color:#fff;border-radius: 5px;font-size:12px;'>" + from + "</span> 对 <span  style='padding:3px 5px 3px 5px;background-color:#66cc66;color:#fff;border-radius: 5px;font-size:12px;'>" + to + "</span> ：<span style='padding:3px 5px 3px 5px;background-color:" + color + ";font-size:12px;border-radius: 5px;'>" + msg1 + "</span></p>");
                        // document.getElementById('historyMsg').scrollTop = document.getElementById('historyMsg').scrollHeight;//滚动条自动到最新消息
                        gunPing($("#MsgBtn1"), document.getElementById('historyMsg'));
                    } else if (__info.group >= 90) { //另一个组别的人发消息,消息贴上，字号14px，黑色
                        var from = msg[i].from_display;
                        var to = msg[i].to_display;
                        var color = '#fff';
                        // var to = __users[msg[i].to_idx].display||'大家';
                        var a = msg[i].createTime;
                        var msg1 = msg[i].context;
                        var date = moment(a).format('HH:mm:ss');
                        $("#historyMsg").append("<p><span style='background-color:#505050;color:#fff;padding:3px 5px 3px 5px;margin-right:5px;border-radius: 5px;'>" + date + "</span><span style='padding:3px 5px 3px 5px;background-color:#66cc66;color:#fff;border-radius: 5px;font-size:14px;'>" + from + "</span> 对 <span  style='padding:3px 5px 3px 5px;background-color:#66cc66;color:#fff;border-radius: 5px;font-size:14px;'>" + to + "</span> ：<span style='padding:3px 5px 3px 5px;background-color:" + color + ";font-size:14px;border-radius: 5px;'>" + msg1 + "</span></p>");
                        // document.getElementById('historyMsg').scrollTop = document.getElementById('historyMsg').scrollHeight;
                        gunPing($("#MsgBtn1"), document.getElementById('historyMsg'));
                    }
                };
            });
            $.ajax({
                url: '/api/bill/history', //喊单记录 左下侧框
                dataType: 'json'
            }).done(function(data) {
                for (var i = 0; i < data.length; i++) {
                    if (!data[i].finnishTime) data[i].finnishTime = data[i].createTime;
                    //var date = data[i].finnishTime.split(' ')[1];
                    var preDate = data[i].finnishTime;
                    var date = String(moment(preDate).format('YYYY-MM-DD HH:mm'));
                    //var endDate = data[i].finnishTime.split(' ')[1];
                    var from = data[i].from;
                    var product = data[i].product;
                    // var moreless = data[i].moreless ? '做多' : '做空';
                    // var hang = data[i].hang ? '挂单' : '现金';
                    var type = data[i].type;
                    var type_format = /空/.test(type) ? '空单' : '多单';
                    var operation = data[i].state; //操作状态号 增仓 减仓 开仓。。。
                    var checkUpPrice = data[i].checkUpPrice;
                    var checkLowPrice = data[i].checkLowPrice;
                    var finnishPrice = data[i].finnishPrice;
                    var openPrice = data[i].openPrice;
                    // var lobby = data[i].lobby;
                    var reason = data[i].reason;
                    var id = data[i].id;
                    var word, fword;
                    if (data[i].type === 'speaker') {

                        $("#home").append("<p style='font-size:12px;'><span style='font-size:12px;color:#A73CC2'>【" + from + "】</span>建议，【<span style='font-size:12px;color:blue;'>行情提醒</span>】" + date + "<br><span style='font-size:12px;'>" + reason + "</span><br><span style='font-size:6px;color:grey;'>(以上建议仅供参考，投资有风险，操作需谨慎)</span></p>");
                        document.getElementById('home').scrollTop = document.getElementById('home').scrollHeight; //home是第一个选项卡，
                        document.getElementById('resize').scrollTop = document.getElementById('resize').scrollHeight; //resize是整个tab 设置了overflow=auto;
                        continue; //如果是老师行情提醒，那么跳出本次循环，不进行平仓，减仓等判断操作
                    }

                    if (finnishPrice == checkUpPrice) {
                        word = "止盈平仓";
                        fword = "止盈减仓";
                    } else if (finnishPrice == checkLowPrice) {
                        word = "止损平仓";
                        fword = "止损减仓";
                    }
                    //判断状态号 封装成函数 把自动滚动也封装 css单独写
                    if (operation === '开仓') {
                        $("#home").append("<p style='font-size:12px;'><span style='font-size:12px;color:#A73CC2;'>【" + from + "】</span>建议，【单号】：" + id + "<span style='font-weight:600;font-size:14px;color:red;'>" + "&nbsp&nbsp" + type + "&nbsp&nbsp" + "</span>" + date + "<br><span style='font-size:14px;font-weight:600;'>" + product + "&nbsp&nbsp" + "</span>" + "【开仓价】:<span style='font-size:14px;color:red;font-weight:600;'>" + openPrice + "</span>，建议【止盈价】：<span style='font-size:14px;color:red;font-weight:600;'>" + checkUpPrice + "</span>，建议【止损价】：<span style='color:red;font-weight:600;font-size:14px;'>" + checkLowPrice + "</span><br><span style='font-size:6px;color:grey;'>(以上建议仅供参考，投资有风险，操作需谨慎)</span></p>");
                        document.getElementById('home').scrollTop = document.getElementById('home').scrollHeight;
                        document.getElementById('resize').scrollTop = document.getElementById('resize').scrollHeight;
                    }
                    if (operation === '增仓') { //字体不一样 14px
                        $("#home").append("<p style='font-size:12px;'><span style='font-size:14px;color:#A73CC2;'>【" + from + "】</span>建议，【单号】：" + id + "<span style='font-weight:600;font-size:14px;color:red;'>" + "&nbsp&nbsp" + type + "&nbsp&nbsp" + "</span>" + date + "<br><span style='font-size:14px;font-weight:600;'>" + product + "&nbsp&nbsp" + "</span>" + "【增仓价】:<span style='font-size:14px;color:red;font-weight:600;'>" + openPrice + "</span>，建议【止盈价】：<span style='font-size:14px;color:red;font-weight:600;'>" + checkUpPrice + "</span>，建议【止损价】：<span style='color:red;font-weight:600;font-size:14px;'>" + checkLowPrice + "</span><br><span style='font-size:6px;color:grey;'>(以上建议仅供参考，投资有风险，操作需谨慎)</span></p>");
                        document.getElementById('home').scrollTop = document.getElementById('home').scrollHeight;
                        document.getElementById('resize').scrollTop = document.getElementById('resize').scrollHeight;
                    }
                    if (operation === '挂单') {
                        $("#home").append("<p style='font-size:12px;'><span style='font-size:12px;color:#A73CC2;'>【" + from + "】</span>建议，【单号】：" + id + "<span style='font-weight:600;font-size:14px;color:red;'>" + "&nbsp&nbsp" + type + "&nbsp&nbsp" + "</span>，" + date + "<br><span style='font-size:14px;font-weight:600;'>" + product + "&nbsp&nbsp" + "</span>" + "【开仓价】:<span style='font-size:14px;color:red;font-weight:600;'>" + openPrice + "</span>，建议【止盈价】：<span style='font-size:14px;color:red;font-weight:600;'>" + checkUpPrice + "</span>，建议【止损价】：<span style='color:red;font-weight:600;font-size:14px;'>" + checkLowPrice + "</span><br><span style='font-size:6px;color:grey;'>(以上建议仅供参考，投资有风险，操作需谨慎)</span></p>");
                        document.getElementById('home').scrollTop = document.getElementById('home').scrollHeight;
                        document.getElementById('resize').scrollTop = document.getElementById('resize').scrollHeight;
                    }



                    if (operation === '减仓') {
                        //$("#home").append("<p style='font-size:14px;'><span style='font-size:14px;color:#A73CC2;'>【" + from + "】</span>建议，【单号】：" + id + "<span style='font-weight:600;font-size:16px;color:red;'>" +"&nbsp&nbsp"+ type +"&nbsp&nbsp"+ "</span>，" + date + "<br><span style='font-size:16px;font-weight:600;'>" + product +"&nbsp&nbsp"+ "</span>" + "【减仓价】:<span style='font-size:16px;color:red;font-weight:600;'>" + openPrice + "</span>，建议【止盈价】：<span style='font-size:16px;color:red;font-weight:600;'>" + checkUpPrice + "</span>，建议【止损价】：<span style='color:red;font-weight:600;font-size:16px;'>" + checkLowPrice + "</span><br><span style='font-size:6px;color:grey;'>(以上建议仅供参考，投资有风险，操作需谨慎)</span></p>");
                        $("#home").append("<p style='font-size:12px;'><span style='font-size:12px;color:#A73CC2;'>【" + from + "】</span>建议，【单号】：" + id + "<span style='font-weight:600;font-size:14px;color:red;'>" + "&nbsp&nbsp" + fword + "&nbsp&nbsp" + type_format + "</span>，" + date + "<br><span style='font-size:14px;font-weight:600;'>" + product + "&nbsp&nbsp" + "</span>" + "建议【减仓价】:<span style='font-size:14px;color:red;font-weight:600;'>" + finnishPrice + "</span><br><span style='font-size:6px;color:grey;'>(以上建议仅供参考，投资有风险，操作需谨慎)</span></p>");
                        document.getElementById('home').scrollTop = document.getElementById('home').scrollHeight;
                        document.getElementById('resize').scrollTop = document.getElementById('resize').scrollHeight;
                    }
                    if (operation === '平仓') {
                        $("#home").append("<p style='font-size:12px;'><span style='font-size:12px;color:#A73CC2;'>【" + from + "】</span>建议，【单号】：" + id + "<span style='font-weight:600;font-size:14px;color:red;'>" + "&nbsp&nbsp" + word + "&nbsp&nbsp" + type_format + "</span>，" + date + "<br><span style='font-size:14px;font-weight:600;'>" + product + "&nbsp&nbsp" + "</span>" + "建议【平仓价】:<span style='font-size:14px;color:red;font-weight:600;'>" + finnishPrice + "</span><br><span style='font-size:6px;color:grey;'>(以上建议仅供参考，投资有风险，操作需谨慎)</span></p>");
                        document.getElementById('home').scrollTop = document.getElementById('home').scrollHeight;
                        document.getElementById('resize').scrollTop = document.getElementById('resize').scrollHeight;
                    }


                    if (operation === '挂单成交') {
                        $("#home").append("<p style='font-size:12px;'><span style='font-size:12px;color:#A73CC2;'>【" + from + "】</span>建议，【单号】：" + id + "<span style='font-weight:600;font-size:14px;color:red;'>&nbsp&nbsp挂单成交</span>，" + date + "<br><span style='font-size:14px;font-weight:600;'>" + product + "&nbsp&nbsp" + "</span>建议" + type + "【开仓价】:<span style='font-size:14px;color:red;font-weight:600;'>" + openPrice + "</span>，建议【止盈价】：<span style='font-size:14px;color:red;font-weight:600;'>" + checkUpPrice + "</span>，建议【止损价】：<span style='color:red;font-weight:600;font-size:14px;'>" + checkLowPrice + "</span><br><span style='font-size:6px;color:grey;'>(以上建议仅供参考，投资有风险，操作需谨慎)</span></p>");
                        document.getElementById('home').scrollTop = document.getElementById('home').scrollHeight;
                        document.getElementById('resize').scrollTop = document.getElementById('resize').scrollHeight;
                    }


                    if (operation === '撤单') {
                        $("#home").append("<p style='font-size:12px;'><span style='font-size:12px;color:#A73CC2;'>【" + from + "】</span>建议，【单号】：" + id + "<span style='font-weight:600;font-size:14px;color:red;'></span>，" + date + "<br><span style='font-size:14px;font-weight:600;'>" + product + "&nbsp&nbsp" + "</span>【撤单】：撤单理由" + reason + "<br /><span style='font-size:6px;color:grey;'>(以上建议仅供参考，投资有风险，操作需谨慎)</span></p>");
                        document.getElementById('home').scrollTop = document.getElementById('home').scrollHeight;
                        document.getElementById('resize').scrollTop = document.getElementById('resize').scrollHeight;
                    }
                };
            })
            var hichat = new HiChat();
            hichat.init();
        }
    });
}

function isAdminstrator(from) { //判断是否是老师或客服发来的消息
    if (String(from) === "天囊投资-小喆" || String(from) === "天囊投资-咚咚" || String(from) === "天囊投资-吴老师" || String(from) === "天囊投资-小瑾" || String(from) === "天囊投资-屠老师" || String(from) === "天囊投资-张老师" || String(from) === "天囊投资-隆老师")
        return true;
    else
        return false;
}

function chatTo(id, name) {
    chat = id;
    $("#schat").text(name);
}

function schatTo(id, name) {
    $("#schat").text(name);
    chat = id;
}

function banmsg(id, name) {
    $.ajax({
            url: '/api/profile',
            type: 'POST',
            dataType: 'json',
            data: {
                grant: '-2',
                id: id
            }, //屏蔽消息
        })
        .done(function() {});

}

function banspeak(id, name) {

    $.ajax({
            url: '/api/profile',
            type: 'POST',
            dataType: 'json',
            data: {
                grant: '-3',
                id: id
            }, //禁言
        })
        .done(function() {});
}

function sendgift(id, name) {
    $("#giftto").val(name);

}

function opera_finnish() {

    $("#pingcang").css('display', 'block');
    $("#zengcang").css('display', 'none');
    $("#jiancang").css('display', 'none');
    $("#deal").css('display', 'none');
    $("#chedan").css('display', 'none');

}

function opera_add() {

    $("#pingcang").css('display', 'none');
    $("#jiancang").css('display', 'none');
    $("#deal").css('display', 'none');
    $("#chedan").css('display', 'none');

    $("#zengcang").css('display', 'block');

}

function opera_reduce() {
    $("#jiancang").css('display', 'block');
    $("#pingcang").css('display', 'none');
    $("#zengcang").css('display', 'none');
    $("#deal").css('display', 'none');
    $("#chedan").css('display', 'none');

}

function opera_deal() {
    $("#deal").css('display', 'block');
    $("#pingcang").css('display', 'none');
    $("#jiancang").css('display', 'none');
    $("#zengcang").css('display', 'none');
    $("#chedan").css('display', 'none');

}

function opera_cancel() {
    $("#chedan").css('display', 'block');
    $("#pingcang").css('display', 'none');
    $("#jiancang").css('display', 'none');
    $("#zengcang").css('display', 'none');
    $("#deal").css('display', 'none');

}

$("#sendgiftto").unbind('click').click(function(event) {
    var to = $("input[name='sendto']").val();
    var cost = $("input[name='cost']").val();
    var bypass = $("input[name='bypass']").val();
    $.ajax({
            url: '/path/to/file',
            type: 'POST',
            dataType: 'json',
            data: {
                to: to,
                cost: cost,
                bypass: bypass
            }
        })
        .done(function() {});

});
$("#dingyue").unbind('click').click(function(event) {
    var howlong = $("input[name='long']:checked").val();
    $.ajax({
            url: '/api/send/' + gg_id,
            type: 'POST',
            dataType: 'json',
            data: {
                type: 'suscribe',
                name: howlong
            },
        })
        .done(function(data) {
            if (data.succ === 0) alert("您已订阅成功！");
            else alert(data.msg);
            window.location.href = "/index.html";
        });

});
$('#billtable>tbody').on('click', '.btn-warning', function(e) {
    var that = this;
    $("#chedan_submit").unbind('click').click(function(event) {
        $("#chedan").css('display', 'none');
        var reason = $("input[name='reason']").val();
        var id = $(that).attr('id');
        $.ajax({
            url: '/api/bill/' + id,
            type: 'POST',
            dataType: 'json',
            data: {
                operation: "cancel",
                reason: reason
            },
        }).done(function() {
            var table = $('#billtable').DataTable();
            table.row($(that).parents('tr')).remove().draw(false);

        });

    });



});
$("#billtable>tbody").on('click', 'tr', function(event) {
    // event.preventDefault();
    $("input[name='checkUpPrice']").val($(this)[0].cells[6].innerHTML);
    $("input[name='checkLowPrice']").val($(this)[0].cells[7].innerHTML);
    $("input[name='openPrice']").val($(this)[0].cells[4].innerHTML);
    billId = $(this)[0].cells[0].innerHTML;
});

$('#billtable>tbody').on('click', '.btn-danger', function(e) {
    // e.preventDefault();
    var that = this;
    $("#ping_checkUp").unbind('click').click(function(event) {
        var checkUpPrice = $("input[name='checkUpPrice']").val();
        $("#pingcang").css('display', 'none');
        $.ajax({
                url: '/api/bill/' + billId,
                type: 'POST',
                dataType: 'json',
                data: {
                    operation: 'finnish',
                    checkUpPrice: checkUpPrice,
                    id: billId
                },
            })
            .done(function(data) {
                if (data.succ == 0) {
                    var table = $('#billtable').DataTable();
                    table.row($(that).parents('tr')).remove().draw(false);
                }
            });

    });
    $("#ping_checkLow").unbind('click').click(function(event) {
        $("#pingcang").css('display', 'none');

        var checkLowPrice = $("input[name='checkLowPrice']").val();
        $.ajax({
                url: '/api/bill/' + billId,
                type: 'POST',
                dataType: 'json',
                data: {
                    operation: 'finnish',
                    checkLowPrice: checkLowPrice,
                    id: billId
                },
            })
            .done(function(data) {
                if (data.succ == 0) {
                    var table = $('#billtable').DataTable();
                    table.row($(that).parents('tr')).remove().draw(false);
                }
            });

    });

});
$("#billtable>tbody").on('click', '.sub', function(event) {
    var that = this;
    $("#jian_checkUp").unbind('click').click(function(event) {
        $("#jiancang").css('display', 'none');

        var checkUpPrice = $("input[name='checkUpPrice']").val();
        $.ajax({
                url: '/api/bill/' + billId,
                type: 'POST',
                dataType: 'json',
                data: {
                    operation: 'reduce',
                    checkUpPrice: checkUpPrice,
                    id: billId
                },
            })
            .done(function(data) {
                if (data.succ == 0) {
                    var table = $('#billtable').DataTable();
                    table.row($(that).parents('tr')).remove().draw(false);
                }

            });

    });
    $("#jian_checkLow").unbind('click').click(function(event) {
        $("#jiancang").css('display', 'none');

        var checkLowPrice = $("input[name='checkLowPrice']").val();
        $.ajax({
                url: '/api/bill/' + billId,
                type: 'POST',
                dataType: 'json',
                data: {
                    operation: 'reduce',
                    checkLowPrice: checkLowPrice,
                    id: billId
                },
            })
            .done(function(data) {
                if (data.succ == 0) {
                    var table = $('#billtable').DataTable();
                    table.row($(that).parents('tr')).remove().draw(false);
                }
            });

    });

});
$("#billtable>tbody").on('click', '.add', function(event) {
    var that = this;
    $("#zeng_submit").unbind('click').click(function(event) {
        $("#zengcang").css('display', 'none');

        var openPrice = $("input[name='openPrice']").val();
        var checkLowPrice = $("input[name='checkLowPrice']").val();

        var checkUpPrice = $("input[name='checkUpPrice']").val();

        $.ajax({
                url: '/api/bill/' + billId,
                type: 'POST',
                dataType: 'json',
                data: {
                    operation: 'add',
                    openPrice: openPrice,
                    checkUpPrice: checkUpPrice,
                    checkLowPrice: checkLowPrice,
                    id: billId
                },
            })
            .done(function(data) {
                if (data.succ == 0) {
                    var table = $('#billtable').DataTable();
                    table.row.add(data).draw();
                }

            });

    });


});
$("#billtable>tbody").on('click', '.deal', function(event) {
    var that = this;
    $("#deal_submit").unbind('click').click(function(event) {
        $("#deal").css('display', 'none');

        var openPrice = $("input[name='openPrice']").val();
        var checkLowPrice = $("input[name='checkLowPrice']").val();
        var checkUpPrice = $("input[name='checkUpPrice']").val();
        $.ajax({
                url: '/api/bill/' + billId,
                type: 'POST',
                dataType: 'json',
                data: {
                    operation: 'deal',
                    openPrice: openPrice,
                    checkLowPrice: checkLowPrice || 0,
                    checkUpPrice: checkUpPrice || 0,
                    id: billId
                },
            })
            .done(function(data) {
                if (data.succ == 0) {

                    var table = $('#billtable').DataTable();
                    table.row($(that).parents('tr')).remove().draw(false);
                    table.row.add(data).draw();
                }
            });

    });

});


$("#cancel").click(function(event) {
    $("#pingcang").css('display', 'none');
});
$("#cancel_add").click(function(event) {
    $("#zengcang").css('display', 'none');
});
$("#cancel_sub").click(function(event) {
    $("#jiancang").css('display', 'none');
});
$("#cancel_cancel").click(function(event) {
    $("#chedan").css('display', 'none');
});
$("#cancel_deal").click(function(event) {
    $("#deal").css('display', 'none');
});
// $("#schat").click(function(event) {
//     $(this).text('所有人');
//     chat = null;
// });
var HiChat = function() {
    this.socket = null;
};
HiChat.prototype = {
    init: function() {
        var that = this;
        this.socket = io.connect();
        this.socket.on('who', function() {
            that.socket.emit('who', __info);

        });
        // this.socket.on('refresh', function() {
        //     window.location.reload();
        // })
        this.socket.on('passed', function(x) {
            $('#pass_btn' + x).hide();
        });
        this.socket.on('login', function(user) {
            __users.push(user);
            //update index
            var i;
            for (i = 0; i < __idx.length; ++i) {
                if (user.group > __users[__idx[i]].group) break;
            }
            __idx.splice(i, -1, __idx.length);

            /*
            var index;
            for (var i = 0; i < __users.length; i++) {
                if(user.group>=__users[i].group)
                    index = i;
                break;
            };
            __users.splice(index,-1,user);
            */
            var color = user.group >= 90 ? "#FF0000" : "#FFF";
            if (i == 0) {
                                if(user.group >= 90){

                $("#userdd").find('li').eq(0).before("<li style='padding-top:5px;padding-bottom:5px;margin-left:10px;'><a onclick='chatTo(" + user.id + "," + '"' + user.display + '"' + ")' ><img src='img/admin.png'><span style='color:" + color + ";'>" + user.display + "</span></a><a data-target='#modallist' data-toggle='modal'>订阅喊单</a></li>");
                gg_id = user.id;
                }
                else{$("#userdd").find('li').eq(0).before("<li style='padding-top:5px;padding-bottom:5px;margin-left:10px;'><a onclick='chatTo(" + user.id + "," + '"' + user.display + '"' + ")' ><img src='img/admin.png'><span style='color:" + color + ";'>" + user.display + "</span></a></li>");}
            }else {                                if(user.group >= 90){

                $("#userdd").find('li').eq(i-1).before("<li style='padding-top:5px;padding-bottom:5px;margin-left:10px;'><a onclick='chatTo(" + user.id + "," + '"' + user.display + '"' + ")' ><img src='img/admin.png'><span style='color:" + color + ";'>" + user.display + "</span></a><a data-target='#modallist' data-toggle='modal'>订阅喊单</a></li>");
                gg_id = user.id;
                }
                else{$("#userdd").find('li').eq(i-1).before("<li style='padding-top:5px;padding-bottom:5px;margin-left:10px;'><a onclick='chatTo(" + user.id + "," + '"' + user.display + '"' + ")' ><img src='img/admin.png'><span style='color:" + color + ";'>" + user.display + "</span></a></li>");}
}
            $("#status").text(__users.length);

        });
        this.socket.on('room', function(alluser) {
            $("#userdd").find('li').remove();
            __users = alluser;
            __idx = [];
            for (var i = 0; i < __users.length; i++) {
                __idx.push(i);
            }
            __idx.sort(function(a, b) {
                return __users[b].group - __users[a].group
            });
            //__users.sort(function(a,b){return b.group-a.group;})
            for (var t = 0; t < __users.length; t++) {
                i = __idx[t];
                var color = __users[i].group >= 90 ? "#FF0000" : "#FFF";
                if(__users[i].group >= 90){
                 $("#userdd").append("<li style='padding-top:5px;padding-bottom:5px;margin-left:10px;'><a onclick='chatTo(" + __users[i].id + "," + '"' + __users[i].display + '"' + ")'  ><img src='img/admin.png'><span style='color:" + color + ";'>" + __users[i].display + "</span></a><a data-target='#dingyue' data-toggle='modal'>订阅喊单</a></li>");
                gg_id = __users[i].id;  }                 
                else 
                $("#userdd").append("<li style='padding-top:5px;padding-bottom:5px;margin-left:10px;'><a onclick='chatTo(" + __users[i].id + "," + '"' + __users[i].display + '"' + ")'  ><img src='img/admin.png'><span style='color:" + color + ";'>" + __users[i].display + "</span></a></li>");
            };

        });
        /*
        this.socket.on('connect', function() {
            __users = [];
        });
        this.socket.on('disconnect', function() {
            __users = [];
        });*/
        this.socket.on('logout', function(idx) {
            __users.splice(idx, 1);
            var x = __idx.indexOf(idx);
            $("#userdd").find('li').eq(x).remove();
            $("#status").text(__users.length);
            __idx.splice(x, 1);
            for (i = 0; i < __idx.length; ++i) {
                if (__idx[i] > idx) __idx[i]--;
            }
        });
        this.socket.on('kick', function() {
            $.ajax({
                    url: '/api/logout',
                    type: 'POST',
                    dataType: 'json',

                })
                .done(function() {
                    window.location.href = "/login.html";
                });

        });
        // this.socket.on('newMsg', function(user, msg, color) {
        //     that._displayNewMsg(user, msg, color);
        // });
        // this.socket.on('newImg', function(user, img, color) {
        //     that._displayImage(user, img, color);
        // });

        $("#bill").click(function(event) {
            var category = $("input[name='pro']:checked").val();
            var product = $("input[name='billtype']:checked").val();
            var type = $("input[name='kaicang']:checked").val();

            var openPrice = $("#openPrice").val().trim() || '';
            var checkUpPrice = $("#checkUpPrice").val().trim() || '';
            var checkLowPrice = $("#checkLowPrice").val().trim() || '';
            var createTime = new Date();
            var lobby = $("input[name='send']:checked").length === 2;
            var bill = {
                //id:
                from: __info.id,
                category: category,
                product: product,
                lobby: lobby, //附送大厅,
                // moreless: /more/.test(type), //现价买多
                // hang:/hang/.test(type),
                type: type,
                openPrice: openPrice,
                checkUpPrice: checkUpPrice,
                checkLowPrice: checkLowPrice,
                operation: 'open', //open,
                createTime: createTime
            }
            $.ajax({
                    url: '/api/bill',
                    type: 'POST',
                    dataType: 'json',
                    data: bill,
                })
                .done(function(data) {
                    $("input[name='pro']:checked").attr('checked', '');;
                    $("input[name='billtype']:checked").attr('checked', '');;
                    $("input[name='kaicang']:checked").attr('checked', '');;

                    $("#openPrice").val(' ');
                    $("#checkUpPrice").val(' ');
                    $("#checkLowPrice").val(' ');
                    $("#billtable").DataTable().row.add(data).draw();

                });


            // that.socket.emit('bill', bill);
        });
        this.socket.on('bill', function(data) {

            if (data.succ == 0) {
                if (data.msg) {

                } else {
                    if (!data.finnishTime) data.finnishTime = data.createTime;
                    var date = data.finnishTime.split(' ')[1];
                    //var endDate = data[i].finnishTime.split(' ')[1];
                    var from = data.from;
                    var product = data.product;
                    // var moreless = data.moreless ? '做多' : '做空';
                    // var hang = data.hang ? '挂单' : '现金';
                    var type = data.type;
                    var type_format = /空/.test(type) ? '空单' : '多单';
                    var operation = data.state;
                    var checkUpPrice = data.checkUpPrice;
                    var checkLowPrice = data.checkLowPrice;
                    var finnishPrice = data.finnishPrice;
                    var openPrice = data.openPrice;
                    // var lobby = data.lobby;
                    var reason = data.reason;
                    var id = data.id;
                    var word, fword;
                    if (finnishPrice == checkUpPrice) {
                        word = "止盈平仓";
                        fword = "止盈减仓";
                    } else if (finnishPrice == checkLowPrice) {
                        word = "止损平仓";
                        fword = "止损减仓";
                    }
                    if (operation === '开仓') {
                        //$("#home").append("<p style='font-size:14px;'><span style='font-size:14px;color:#A73CC2;'>【" + from + "】</span>建议，【单号】：" + id + "，<span style='font-weight:600;font-size:14px;color:red;'>" + type + "</span>" + date + "<br><span style='font-weight:600;'>" + product + "</span>" + "，【开仓价】:<span style='color:red;'>" + openPrice + "</span>，建议【止盈价】：<span style='color:red;'>" + checkUpPrice + "</span>，建议【止损价】：<span style='color:red;'>" + checkLowPrice + "</span><br><span style='font-size:8px;'>(以上建议仅供参考，投资有风险，操作需谨慎)</span></p>");
                        $("#home").append("<p style='font-size:12px;'><span style='font-size:12px;color:#A73CC2;'>【" + from + "】</span>建议，【单号】：" + id + "<span style='font-weight:600;font-size:14px;color:red;'>" + "&nbsp&nbsp" + type + "&nbsp&nbsp" + "</span>" + date + "<br><span style='font-size:14px;font-weight:600;'>" + product + "&nbsp&nbsp" + "</span>" + "【开仓价】:<span style='font-size:14px;color:red;font-weight:600;'>" + openPrice + "</span>，建议【止盈价】：<span style='font-size:14px;color:red;font-weight:600;'>" + checkUpPrice + "</span>，建议【止损价】：<span style='color:red;font-weight:600;font-size:16px;'>" + checkLowPrice + "</span><br><span style='font-size:6px;color:grey;'>(以上建议仅供参考，投资有风险，操作需谨慎)</span></p>");
                        document.getElementById('home').scrollTop = document.getElementById('home').scrollHeight;
                        document.getElementById('resize').scrollTop = document.getElementById('resize').scrollHeight;
                        $("audio").attr('src', 'img/handan.mp3');
                        $("marquee").html("【喊单提醒】" + date + "【" + from + "】发布：【单号】：" + id + "，建议" + product + "&nbsp&nbsp" + type + "&nbsp&nbsp" + "，【开仓价】:" + openPrice + "，【止盈价】：" + checkUpPrice + "，【止损价】：" + checkLowPrice + "(以上建议仅供参考，投资有风险，操作需谨慎)");
                    }
                    if (operation === '增仓') {
                        //$("#home").append("<p style='font-size:14px;'><span style='font-size:14px;color:#A73CC2;'>【" + from + "】</span>建议，【单号】：" + id + "，<span style='font-weight:600;font-size:14px;color:red;'>" + type + "</span>，" + date + "<br><span style='font-weight:600;'>" + product + "</span>" + "，【增仓价】:<span style='color:red;'>" + openPrice + "</span>，建议【止盈价】：<span style='color:red;'>" + checkUpPrice + "</span>，建议【止损价】：<span style='color:red;'>" + checkLowPrice + "</span><br><span style='font-size:8px;'>(以上建议仅供参考，投资有风险，操作需谨慎)</span></p>");
                        $("#home").append("<p style='font-size:12px;'><span style='font-size:12px;color:#A73CC2;'>【" + from + "】</span>建议，【单号】：" + id + "<span style='font-weight:600;font-size:14px;color:red;'>" + "&nbsp&nbsp" + type + "&nbsp&nbsp" + "</span>，" + date + "<br><span style='font-size:14px;font-weight:600;'>" + product + "&nbsp&nbsp" + "</span>" + "【增仓价】:<span style='font-size:14px;color:red;font-weight:600;'>" + openPrice + "</span>，建议【止盈价】：<span style='font-size:14px;color:red;font-weight:600;'>" + checkUpPrice + "</span>，建议【止损价】：<span style='color:red;font-weight:600;font-size:14px;'>" + checkLowPrice + "</span><br><span style='font-size:6px;color:grey;'>(以上建议仅供参考，投资有风险，操作需谨慎)</span></p>");
                        document.getElementById('home').scrollTop = document.getElementById('home').scrollHeight;
                        document.getElementById('resize').scrollTop = document.getElementById('resize').scrollHeight;
                        $("audio").attr('src', 'img/handan.mp3');
                        $("marquee").html("【喊单提醒】" + date + "【" + from + "】发布：【单号】：" + id + "，建议" + product + "&nbsp&nbsp" + type + "&nbsp&nbsp" + "，【增仓价】:" + openPrice + "，【止盈价】：" + checkUpPrice + "，【止损价】：" + checkLowPrice + "(以上建议仅供参考，投资有风险，操作需谨慎)");
                    }
                    if (operation === '减仓') {
                        //$("#home").append("<p style='font-size:14px;'><span style='font-size:14px;color:#A73CC2;'>【" + from + "】</span>建议，【单号】：" + id + "，<span style='font-weight:600;font-size:14px;color:red;'>" + type + "</span>，" + date + "<br><span style='font-weight:600;'>" + product + "</span>" + "，【减仓价】:<span style='color:red;'>" + openPrice + "</span>，建议【止盈价】：<span style='color:red;'>" + checkUpPrice + "</span>，建议【止损价】：<span style='color:red;'>" + checkLowPrice + "</span><br><span style='font-size:8px;'>(以上建议仅供参考，投资有风险，操作需谨慎)</span></p>");
                        //$("#home").append("<p style='font-size:14px;'><span style='font-size:14px;color:#A73CC2;'>【" + from + "】</span>建议，【单号】：" + id + "<span style='font-weight:600;font-size:16px;color:red;'>" +"&nbsp&nbsp"+ type +"&nbsp&nbsp"+ "</span>，" + date + "<br><span style='font-size:16px;font-weight:600;'>" + product +"&nbsp&nbsp"+ "</span>" + "【减仓价】:<span style='font-size:16px;color:red;font-weight:600;'>" + openPrice + "</span>，建议【止盈价】：<span style='font-size:16px;color:red;font-weight:600;'>" + checkUpPrice + "</span>，建议【止损价】：<span style='color:red;font-weight:600;font-size:16px;'>" + checkLowPrice + "</span><br><span style='font-size:6px;color:grey;'>(以上建议仅供参考，投资有风险，操作需谨慎)</span></p>");
                        $("#home").append("<p style='font-size:12px;'><span style='font-size:12px;color:#A73CC2;'>【" + from + "】</span>建议，【单号】：" + id + "<span style='font-weight:600;font-size:14px;color:red;'>" + "&nbsp&nbsp" + fword + "&nbsp&nbsp" + type_format + "</span>，" + date + "<br><span style='font-size:14px;font-weight:600;'>" + product + "&nbsp&nbsp" + "</span>" + "建议【减仓价】:<span style='font-size:14px;color:red;font-weight:600;'>" + finnishPrice + "</span><br><span style='font-size:6px;'>(以上建议仅供参考，投资有风险，操作需谨慎)</span></p>");
                        document.getElementById('home').scrollTop = document.getElementById('home').scrollHeight;
                        document.getElementById('resize').scrollTop = document.getElementById('resize').scrollHeight;
                        $("audio").attr('src', 'img/handan.mp3');
                        $("marquee").html("【喊单提醒】" + date + "【" + from + "】发布：【单号】：" + id + "，建议" + product + "&nbsp&nbsp" + type + "&nbsp&nbsp" + "，【减仓价】:" + openPrice + "，【止盈价】：" + checkUpPrice + "，【止损价】：" + checkLowPrice + "(以上建议仅供参考，投资有风险，操作需谨慎)");
                    }
                    if (operation === '平仓') {
                        //$("#home").append("<p style='font-size:14px;'><span style='font-size:14px;color:#A73CC2;'>【" + from + "】</span>建议，【单号】：" + id + "，<span style='font-weight:600;font-size:14px;color:red;'>" + word + type_format + "</span>，" + date + "<br><span style='font-weight:600;'>" + product + "</span>" + "，建议【平仓价】:<span style='color:red;'>" + finnishPrice + "</span><br><span style='font-size:8px;'>(以上建议仅供参考，投资有风险，操作需谨慎)</span></p>");
                        $("#home").append("<p style='font-size:12px;'><span style='font-size:12px;color:#A73CC2;'>【" + from + "】</span>建议，【单号】：" + id + "<span style='font-weight:600;font-size:14px;color:red;'>" + "&nbsp&nbsp" + word + "&nbsp&nbsp" + type_format + "</span>，" + date + "<br><span style='font-size:14px;font-weight:600;'>" + product + "&nbsp&nbsp" + "</span>" + "建议【平仓价】:<span style='font-size:14px;color:red;font-weight:600;'>" + finnishPrice + "</span><br><span style='font-size:6px;'>(以上建议仅供参考，投资有风险，操作需谨慎)</span></p>");
                        document.getElementById('home').scrollTop = document.getElementById('home').scrollHeight;
                        document.getElementById('resize').scrollTop = document.getElementById('resize').scrollHeight;
                        $("audio").attr('src', 'img/handan.mp3');
                        $("marquee").html("【喊单提醒】" + date + "【" + from + "】发布：【单号】：" + id + "，建议" + product + "&nbsp&nbsp" + type + "&nbsp&nbsp" + "，【平仓价】:" + finnishPrice + "(以上建议仅供参考，投资有风险，操作需谨慎)");
                    }
                    if (operation === '挂单') {
                        //$("#home").append("<p style='font-size:14px;'><span style='font-size:14px;color:#A73CC2;'>【" + from + "】</span>建议，【单号】：" + id + "，<span style='font-weight:600;font-size:14px;color:red;'>" + type + "</span>，" + date + "<br><span style='font-weight:600;'>" + product + "</span>" + "，【开仓价】:<span style='color:red;'>" + openPrice + "</span>，建议【止盈价】：<span style='color:red;'>" + checkUpPrice + "</span>，建议【止损价】：<span style='color:red;'>" + checkLowPrice + "</span><br><span style='font-size:8px;'>(以上建议仅供参考，投资有风险，操作需谨慎)</span></p>");
                        $("#home").append("<p style='font-size:12px;'><span style='font-size:12px;color:#A73CC2;'>【" + from + "】</span>建议，【单号】：" + id + "<span style='font-weight:600;font-size:14px;color:red;'>" + "&nbsp&nbsp" + type + "&nbsp&nbsp" + "</span>，" + date + "<br><span style='font-size:14px;font-weight:600;'>" + product + "&nbsp&nbsp" + "</span>" + "【开仓价】:<span style='font-size:14px;color:red;font-weight:600;'>" + openPrice + "</span>，建议【止盈价】：<span style='font-size:14px;color:red;font-weight:600;'>" + checkUpPrice + "</span>，建议【止损价】：<span style='color:red;font-weight:600;font-size:14px;'>" + checkLowPrice + "</span><br><span style='font-size:6px;color:grey;'>(以上建议仅供参考，投资有风险，操作需谨慎)</span></p>");
                        document.getElementById('home').scrollTop = document.getElementById('home').scrollHeight;
                        document.getElementById('resize').scrollTop = document.getElementById('resize').scrollHeight;
                        $("audio").attr('src', 'img/handan.mp3');
                        $("marquee").html("【喊单提醒】" + date + "【" + from + "】发布：【单号】：" + id + "，建议" + product + "&nbsp&nbsp" + type + "&nbsp&nbsp" + "，【挂单价】:" + openPrice + "，【止盈价】：" + checkUpPrice + "，【止损价】：" + checkLowPrice + "(以上建议仅供参考，投资有风险，操作需谨慎)");

                    }
                    if (operation === '挂单成交') {
                        //$("#home").append("<p style='font-size:14px;'><span style='font-size:14px;color:#A73CC2;'>【" + from + "】</span>建议，【单号】：" + id + "，<span style='font-weight:600;font-size:14px;color:red;'>挂单成交</span>，" + date + "<br><span style='font-weight:600;'>" + product + "</span>建议" + type + "，【开仓价】:<span style='color:red;'>" + openPrice + "</span>，建议【止盈价】：<span style='color:red;'>" + checkUpPrice + "</span>，建议【止损价】：<span style='color:red;'>" + checkLowPrice + "</span><br><span style='font-size:8px;'>(以上建议仅供参考，投资有风险，操作需谨慎)</span></p>");
                        $("#home").append("<p style='font-size:12px;'><span style='font-size:12px;color:#A73CC2;'>【" + from + "】</span>建议，【单号】：" + id + "<span style='font-weight:600;font-size:14px;color:red;'>&nbsp&nbsp挂单成交</span>，" + date + "<br><span style='font-size:14px;font-weight:600;'>" + product + "&nbsp&nbsp" + "</span>建议" + type + "【开仓价】:<span style='font-size:14px;color:red;font-weight:600;'>" + openPrice + "</span>，建议【止盈价】：<span style='font-size:14px;color:red;font-weight:600;'>" + checkUpPrice + "</span>，建议【止损价】：<span style='color:red;font-weight:600;font-size:14px;'>" + checkLowPrice + "</span><br><span style='font-size:6px;color:grey;'>(以上建议仅供参考，投资有风险，操作需谨慎)</span></p>");
                        document.getElementById('home').scrollTop = document.getElementById('home').scrollHeight;
                        document.getElementById('resize').scrollTop = document.getElementById('resize').scrollHeight;
                        $("audio").attr('src', 'img/handan.mp3');
                        $("marquee").html("【喊单提醒】" + date + "【" + from + "】发布：【单号】：" + id + "，建议" + product + "&nbsp&nbsp" + type + "&nbsp&nbsp" + "，【挂单成交价】:" + openPrice + "，【止盈价】：" + checkUpPrice + "，【止损价】：" + checkLowPrice + "(以上建议仅供参考，投资有风险，操作需谨慎)");
                    }
                    if (operation === '撤单') {
                        //$("#home").append("<p style='font-size:14px;'><span style='font-size:14px;color:#A73CC2;'>【" + from + "】</span>建议，【单号】：" + id + "，<span style='font-weight:600;font-size:14px;color:red;'></span>，" + date + "<br><span style='font-weight:600;'>" + product + "</span>，【撤单】：撤单理由" + reason + +"<span style='font-size:8px;'>(以上建议仅供参考，投资有风险，操作需谨慎)</span></p>");
                        $("#home").append("<p style='font-size:12px;'><span style='font-size:12px;color:#A73CC2;'>【" + from + "】</span>建议，【单号】：" + id + "<span style='font-weight:600;font-size:14px;color:red;'></span>，" + date + "<br><span style='font-size:14px;font-weight:600;'>" + product + "&nbsp&nbsp" + "</span>【撤单】：撤单理由" + reason + "<br/><span style='font-size:6px;color:grey;'>(以上建议仅供参考，投资有风险，操作需谨慎)</span></p>");
                        document.getElementById('home').scrollTop = document.getElementById('home').scrollHeight;
                        document.getElementById('resize').scrollTop = document.getElementById('resize').scrollHeight;
                        $("audio").attr('src', 'img/handan.mp3');
                        $("marquee").html("【喊单提醒】" + date + "【" + from + "】发布：【单号】：" + id + "，建议" + product + "&nbsp&nbsp" + type + "&nbsp&nbsp" + "，【撤单】：撤单理由" + reason + "(以上建议仅供参考，投资有风险，操作需谨慎)");
                    }
                }
            } else {
                alert(data.msg);
            }
        });
        this.socket.on('speaker', function(data) {
            var speak = data.display;
            var msg = data.msg;
            var time = data.createTime.split(' ')[1];
            //$("#home").append("<p style='font-size:14px;'>【<span style='color:#A73CC2'>" + speak + "</span>】建议，【<span style='color:blue;'>行情提醒</span>】" + time + "<br>" + msg + "<br><span style='font-size:8px;'>(以上建议仅供参考，投资有风险，操作需谨慎)</span></p>");
            $("#home").append("<p style='font-size:12px;'>【<span style='font-size:12px;color:#A73CC2'>" + speak + "</span>】建议，【<span style='font-size:12px;color:blue;'>行情提醒:</span>】" + time + "<br>" + "<span style='font-size:14px;'>" + msg + "</span>" + "<br><span style='font-size:6px;color:grey;'>(以上建议仅供参考，投资有风险，操作需谨慎)</span></p>");
            $("audio").attr('src', 'img/ding.mp3');
            $("marquee").html("【行情提醒】" + time + "【" + speak + "】：" + msg);
            document.getElementById('home').scrollTop = document.getElementById('home').scrollHeight;
            document.getElementById('resize').scrollTop = document.getElementById('resize').scrollHeight;

        });
        $("#power").unbind('click').click(function(event) {
            that.socket.emit('power');

        });
        this.socket.on('power', function(power_on) {
            if (power_on.now) $("#power").text('全屏蔽');
            else $("#power").text('解除屏蔽');
        })
        document.getElementById('sendBtn').addEventListener('click', function() {
            var msg = $("#messageInput").val()
                // var messageInput = document.getElementById('messageInput'),
                //     msg = messageInput.value,
                // color = document.getElementById('colorStyle').value;
            var whisper;
            if($("#qiaoqiao").attr('src')=='icon/whispher2.png'){
                whisper = true;

            }
            else if($("#qiaoqiao").attr('src')=='icon/eye3.png'){
                whisper = false;
            }
            // if ($("input[name='qiaoqiao']:checked").length != 0) {
            //     whisper = true;
            // } else if ($("input[name='qiaoqiao']:checked").length == 0) {
            //     whisper = false;
            // }
            $("#messageInput").val('');
            $("#messageInput").focus();
            if (msg.trim().length != 0) {
                if (chat != null) {
                    var message = {
                            from: __info.id,
                            to: chat,
                            createTime: new Date(),
                            context: msg, //.replace(/&/g,'&amp;')
                            // .replace(/"/g,'&quot;')
                            // .replace(/'/g,'&#39;')
                            // .replace(/</g,'&lt;')
                            // .replace(/>/g,'&gt;'),
                            whisper: whisper
                        }
                        // that.socket.emit('msg', message);
                } else {
                    var message = {
                        from: __info.id,
                        createTime: new Date(),
                        context: msg, //.replace(/&/g,'&amp;')
                        // .replace(/"/g,'&quot;')
                        // .replace(/'/g,'&#39;')
                        // .replace(/</g,'&lt;')
                        // .replace(/>/g,'&gt;'),
                        whisper: whisper
                    };
                }
                console.log(msg.context);
                that.socket.emit('pre_msg', message);
                return;
            };
        }, false);
        if (document.getElementById('ding')) {
            document.getElementById('ding').addEventListener('click', function() {
                var msg = $("#messageInput").val();
                var lobby;
                $("#messageInput").val('');
                if ($("input[name='lobby']:checked").length != 0) {
                    lobby = true;
                } else if ($("input[name='lobby']:checked").length == 0) {
                    lobby = false;
                }
                if (msg.trim().length != 0) {
                    var message = {
                        from: __info.id,
                        createTime: new Date(),
                        context: msg,
                        lobby: lobby
                    };

                    that.socket.emit('speaker', message);
                    // that._displayNewMsg('我', msg, color);
                };

            }, false);

        };
        this.socket.on('pre_msg', function(msg) {
            var from = msg.from_display;
            // var to = __users[msg.to_idx].display||'大家';
            var to = '大家';
            if (msg.to_display) to = msg.to_display;
            var color = msg.warning ? "red" : "#fff";
            var a = new Date();
            var date = a.toString().substr(15, 9);
            if (msg.to == __info.id) {
                $("#historyMsg1").append("<p><span style='background-color:#505050;color:#fff;padding:3px 5px 3px 5px;margin-right:5px;border-radius: 5px;'>" + date + "</span><a tabindex='0' role='button' data-trigger='focus' data-toggle='popover' data-placement='right'><span style='padding:3px 5px 3px 5px;background-color:green;color:#fff;border-radius: 5px;font-size:12px;'>" + from + "</span></a>对<span style='padding:3px 5px 3px 5px;background-color:green;color:#fff;border-radius: 5px;font-size:12px;'>我</span>：<span style='padding:3px 5px 3px 5px;background-color:" + color + ";font-size:12px;border-radius: 5px;'>" + "<a style='text-decoration:none;color:#000;' onclick='schatTo(" + msg.from + ",\"" + from + "\")'>" + msg.context + "</a>" + "</span><span class='btn btn-sm btn-info pass' id='pass_btn" + msg.id + "'>通过</span></p>");
                document.getElementById('historyMsg1').scrollTop = document.getElementById('historyMsg1').scrollHeight;
                // document.getElementById('home1').scrollBottom = document.getElementById('home1').scrollHeight;
                // document.getElementById('minh').scrollTop = document.getElementById('minh').scrollHeight;
                $(function() {
                    $('[data-toggle="popover"]').popover({
                        html: true,
                        content: "<li><a onclick='schatTo(" + msg.from + ",\"" + from + "\")'>跟我聊天</a></li><li><a onclick='banmsg(" + msg.from + ",\"" + from + "\")'>屏蔽消息</a></li><li><a onclick='banspeak(" + msg.from + ",\"" + from + "\")'>禁言</a></li><li><a data-toggle='modal' data-target='#myModal12' onclick='sendgift(" + msg.from + ",\"" + from + "\")'>送礼物</a></li>"
                    })
                })
            } else {
                $("#historyMsg").append("<p><span style='background-color:#505050;color:#fff;padding:3px 5px 3px 5px;margin-right:5px;border-radius: 5px;'>" + date + "</span><a tabindex='0' role='button' data-trigger='focus' data-toggle='popover'  data-placement='right'><span style='padding:3px 5px 3px 5px;background-color:green;color:#fff;border-radius: 5px;font-size:12px;'>" + from + "</span></a> 对 <span  style='padding:3px 5px 3px 5px;background-color:green;color:#fff;border-radius: 5px;font-size:12px;'>" + to + "</span> ：<span style='padding:3px 5px 3px 5px;background-color:" + color + ";font-size:12px;border-radius: 5px;'>" + "<a style='text-decoration:none;color:#000;' onclick='schatTo(" + msg.from + ",\"" + from + "\")'>" + msg.context + "</a>" + "</span><span class='btn btn-sm btn-info pass' id='pass_btn" + msg.id + "'+>通过</span></p>");
                document.getElementById('historyMsg').scrollTop = document.getElementById('historyMsg').scrollHeight;
                $(function() {
                    $('[data-toggle="popover"]').popover({
                        html: true,
                        content: "<li><a onclick='schatTo(" + msg.from + ",\"" + from + "\")'>跟我聊天</a></li><li><a onclick='banmsg(" + msg.from + ",\"" + from + "\")'>屏蔽消息</a></li><li><a onclick='banspeak(" + msg.from + ",\"" + from + "\")'>禁言</a></li><li><a data-toggle='modal' data-target='#myModal12' onclick='sendgift(" + msg.from + ",\"" + from + "\")'>送礼物</a></li>"
                    })
                })
            }
            $("#pass_btn" + msg.id).unbind('click').click(function() {
                that.socket.emit('msg', msg.id);
                $(this).remove();

            });
        });
        this.socket.on('msg', function(msg) {
            var from = msg.from_display;
            // var to = __users[msg.to_idx].display||'大家';
            var to = '大家';
            if (msg.to_display) to = msg.to_display;
            var color = msg.warning ? "red" : "#fff";
            var a = new Date();
            var date = a.toString().substr(15, 9);
            if (msg.to == __info.id || msg.whisper) {
                if (msg.whisper) qiaoqiao = "悄悄";
                else qiaoqiao = ' ';
                if (msg.to == __info.id) to = "我";
                if (msg.to == __info.id || msg.from == __info.id)
                    if (isAdminstrator(from))
                        $("#historyMsg1").append("<p><span style='background-color:#505050;color:#fff;padding:3px 5px 3px 5px;margin-right:5px;border-radius: 5px;'>" + date + "</span><a tabindex='0' role='button' data-trigger='focus' data-toggle='popover'  data-placement='right'><span style='padding:3px 5px 3px 5px;background-color:green;color:#fff;border-radius: 5px;font-size:12px;'>" + from + "</span></a> " + qiaoqiao + "对 <span  style='padding:3px 5px 3px 5px;background-color:green;color:#fff;border-radius: 5px;font-size:12px;'>" + to + "</span> ：<span style='padding:3px 5px 3px 5px;background-color:" + color + ";font-size:12px;border-radius: 5px; '>" + "<a style='text-decoration:none;color:#FF0000;' onclick='schatTo(" + msg.from + ",\"" + from + "\")'>" + msg.context + "</a>" + "</span></p>");
                    else
                        $("#historyMsg1").append("<p><span style='background-color:#505050;color:#fff;padding:3px 5px 3px 5px;margin-right:5px;border-radius: 5px;'>" + date + "</span><a tabindex='0' role='button' data-trigger='focus' data-toggle='popover'  data-placement='right'><span style='padding:3px 5px 3px 5px;background-color:green;color:#fff;border-radius: 5px;font-size:12px;'>" + from + "</span></a> " + qiaoqiao + "对 <span  style='padding:3px 5px 3px 5px;background-color:green;color:#fff;border-radius: 5px;font-size:12px;'>" + to + "</span> ：<span style='padding:3px 5px 3px 5px;background-color:" + color + ";font-size:12px;border-radius: 5px;'>" + "<a style='text-decoration:none;color:#000;' onclick='schatTo(" + msg.from + ",\"" + from + "\")'>" + msg.context + "</a>" + "</span></p>");
                document.getElementById('historyMsg1').scrollTop = document.getElementById('historyMsg1').scrollHeight;
                $(function() {
                    var content = "<li><a onclick='schatTo(" + msg.from + ",\"" + from + "\")'>跟我聊天</a></li>";
                    if (__info.group >= 90)
                        content += "<li><a onclick='banmsg(" + msg.from + ",\"" + from + "\")'>屏蔽消息</a></li><li><a onclick='banspeak(" + msg.from + ",\"" + from + "\")'>禁言</a></li><li><a data-toggle='modal' data-target='#myModal12' onclick='sendgift(" + msg.from + ",\"" + from + "\")'>送礼物</a></li>";
                    $('[data-toggle="popover"]').popover({
                        html: true,
                        //   content: "<li><a onclick='schatTo(" + msg.from + ",\"" + from + "\")'>跟我聊天</a></li><li><a onclick='banmsg(" + msg.from + ",\"" + from + "\")'>屏蔽消息</a></li><li><a onclick='banspeak(" + msg.from + ",\"" + from + "\")'>禁言</a></li><li><a data-toggle='modal' data-target='#myModal12' onclick='sendgift(" + msg.from + ",\"" + from + "\")'>送礼物</a></li>"
                        content: content
                    })
                })
            } else {
                if (isAdminstrator(from))
                    $("#historyMsg").append("<p><span style='background-color:#505050;color:#fff;padding:3px 5px 3px 5px;margin-right:5px;border-radius: 5px;'>" + date + "</span><a tabindex='0' role='button' data-trigger='focus' data-toggle='popover'  data-placement='right'><span style='padding:3px 5px 3px 5px;background-color:green;color:#fff;border-radius: 5px;font-size:12px;'>" + from + "</span></a> 对 <span  style='padding:3px 5px 3px 5px;background-color:green;color:#fff;border-radius: 5px;font-size:12px;'>" + to + "</span> ：<span style='padding:3px 5px 3px 5px;background-color:" + color + ";font-size:12px;border-radius: 5px;'>" + "<a style='text-decoration:none;color:#FF0000;' onclick='schatTo(" + msg.from + ",\"" + from + "\")'>" + msg.context + "</a>" + "</span></p>");
                else
                    $("#historyMsg").append("<p><span style='background-color:#505050;color:#fff;padding:3px 5px 3px 5px;margin-right:5px;border-radius: 5px;'>" + date + "</span><a tabindex='0' role='button' data-trigger='focus' data-toggle='popover'  data-placement='right'><span style='padding:3px 5px 3px 5px;background-color:green;color:#fff;border-radius: 5px;font-size:12px;'>" + from + "</span></a> 对 <span  style='padding:3px 5px 3px 5px;background-color:green;color:#fff;border-radius: 5px;font-size:12px;'>" + to + "</span> ：<span style='padding:3px 5px 3px 5px;background-color:" + color + ";font-size:12px;border-radius: 5px;'>" + "<a style='text-decoration:none;color:#000;' onclick='schatTo(" + msg.from + ",\"" + from + "\")'>" + msg.context + "</a>" + "</span></p>");
                $(function() {
                    var content = "<li><a onclick='schatTo(" + msg.from + ",\"" + from + "\")'>跟我聊天</a></li>";
                    if (__info.group >= 90)
                        content += "<li><a onclick='banmsg(" + msg.from + ",\"" + from + "\")'>屏蔽消息</a></li><li><a onclick='banspeak(" + msg.from + ",\"" + from + "\")'>禁言</a></li><li><a data-toggle='modal' data-target='#myModal12' onclick='sendgift(" + msg.from + ",\"" + from + "\")'>送礼物</a></li>";
                    $('[data-toggle="popover"]').popover({
                        html: true,
                        //   content: "<li><a onclick='schatTo(" + msg.from + ",\"" + from + "\")'>跟我聊天</a></li><li><a onclick='banmsg(" + msg.from + ",\"" + from + "\")'>屏蔽消息</a></li><li><a onclick='banspeak(" + msg.from + ",\"" + from + "\")'>禁言</a></li><li><a data-toggle='modal' data-target='#myModal12' onclick='sendgift(" + msg.from + ",\"" + from + "\")'>送礼物</a></li>"
                        content: content
                    })
                })


            }
            document.getElementById('historyMsg').scrollTop = document.getElementById('historyMsg').scrollHeight;

        });
        document.getElementById('messageInput').addEventListener('keyup', function(e) {
            msg = $("#messageInput").val()
                // var messageInput = document.getElementById('messageInput'),
                //     msg = messageInput.value,
                // color = document.getElementById('colorStyle').value;
            $("#messageInput").focus();
            var whisper;
            if ($("input[name='qiaoqiao']:checked").length != 0) {
                whisper = true;
            } else if ($("input[name='qiaoqiao']:checked").length == 0) {
                whisper = false;
            }
            if (e.keyCode == 13 && msg.trim().length != 0) {
                messageInput.value = '';
                if (chat != null) {
                    var message = {
                        from: __info.id,
                        to: chat,
                        createTime: new Date(),
                        context: msg, //.replace(/&/g,'&amp;')
                        // .replace(/"/g,'&quot;')
                        // .replace(/'/g,'&#39;')
                        // .replace(/</g,'&lt;')
                        // .replace(/>/g,'&gt;'),
                        whisper: whisper
                    }
                } else {
                    var message = {
                        from: __info.id,
                        createTime: new Date(),
                        context: msg, //.replace(/&/g,'&amp;')
                        // .replace(/"/g,'&quot;')
                        // .replace(/'/g,'&#39;')
                        // .replace(/</g,'&lt;')
                        // .replace(/>/g,'&gt;'),
                        whisper: whisper
                    };

                }

                that.socket.emit('pre_msg', message);
                // that._displayNewMsg('我', msg, color);
            };
        }, false);
        document.getElementById('clearBtn').addEventListener('click', function() {
            document.getElementById('historyMsg').innerHTML = '';
            document.getElementById('historyMsg1').innerHTML = '';
        }, false);
        // document.getElementById('sendImage').addEventListener('change', function() {
        //     if (this.files.length != 0) {
        //         var file = this.files[0],
        //             reader = new FileReader(),
        //             color = document.getElementById('colorStyle').value;
        //         if (!reader) {
        //             that._displayNewMsg('system', '!your browser doesn\'t support fileReader', 'red');
        //             this.value = '';
        //             return;
        //         };
        //         reader.onload = function(e) {
        //             this.value = '';
        //             that.socket.emit('img', e.target.result, color);
        //             that._displayImage('我', e.target.result, color);
        //         };
        //         reader.readAsDataURL(file);
        //     };
        // }, false);
        // this._initialEmoji();
        // document.getElementById('emoji').addEventListener('click', function(e) {
        //     var emojiwrapper = document.getElementById('emojiWrapper');
        //     emojiwrapper.style.display = 'block';
        //     e.stopPropagation();
        // }, false);
        // document.body.addEventListener('click', function(e) {
        //     var emojiwrapper = document.getElementById('emojiWrapper');
        //     if (e.target != emojiwrapper) {
        //         emojiwrapper.style.display = 'none';
        //     };
        // });
        document.getElementById('emojiWrapper').addEventListener('click', function(e) {
            var target = e.target;
            if (target.nodeName.toLowerCase() == 'img') {
                var messageInput = document.getElementById('messageInput');
                messageInput.focus();
                messageInput.value = messageInput.value + '[emoji:' + target.title + ']';
            };
        }, false);
    },
    // _initialEmoji: function() {
    //     var emojiContainer = document.getElementById('emojiWrapper'),
    //         docFragment = document.createDocumentFragment();
    //     for (var i = 69; i > 0; i--) {
    //         var emojiItem = document.createElement('img');
    //         emojiItem.src = '../content/emoji/' + i + '.gif';
    //         emojiItem.title = i;
    //         docFragment.appendChild(emojiItem);
    //     };
    //     emojiContainer.appendChild(docFragment);
    // },
    // _displayNewMsg: function(user, msg, color) {
    //     var container = document.getElementById('historyMsg'),
    //         msgToDisplay = document.createElement('p'),
    //         date = new Date().toTimeString().substr(0, 8),
    //         //determine whether the msg contains emoji
    //         msg = this._showEmoji(msg);
    //     msgToDisplay.style.color = color || '#000';
    //     msgToDisplay.innerHTML = user + '<span class="timespan">(' + date + '): </span>' + msg;
    //     container.appendChild(msgToDisplay);
    //     container.scrollTop = container.scrollHeight;
    // },
    // _displayImage: function(user, imgData, color) {
    //     var container = document.getElementById('historyMsg'),
    //         msgToDisplay = document.createElement('p'),
    //         date = new Date().toTimeString().substr(0, 8);
    //     msgToDisplay.style.color = color || '#000';
    //     msgToDisplay.innerHTML = user + '<span class="timespan">(' + date + '): </span> <br/>' + '<a href="' + imgData + '" target="_blank"><img src="' + imgData + '"/></a>';
    //     container.appendChild(msgToDisplay);
    //     container.scrollTop = container.scrollHeight;
    // },
    // _showEmoji: function(msg) {
    //     var match, result = msg,
    //         reg = /\[emoji:\d+\]/g,
    //         emojiIndex,
    //         totalEmojiNum = document.getElementById('emojiWrapper').children.length;
    //     while (match = reg.exec(msg)) {
    //         emojiIndex = match[0].slice(7, -1);
    //         if (emojiIndex > totalEmojiNum) {
    //             result = result.replace(match[0], '[X]');
    //         } else {
    //             result = result.replace(match[0], '<img class="emoji" src="../content/emoji/' + emojiIndex + '.gif" />'); //todo:fix this in chrome it will cause a new request for the image
    //         };
    //     };
    //     return result;
    // }
};
