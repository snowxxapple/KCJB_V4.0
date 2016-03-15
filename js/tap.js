//统计相关 本周 当天  和订阅详情以及订阅提示框
detail($("#getday")); //点击哪个按钮
detail($("#getweek"));
detail($("#getlastweek"));
detail($("#getmonth"));
detail($("#getall"));

function detail(btn) {
    var time;
    var tap;
    if (btn === $("#getday")) { //点了当天的就换当天的这个table里
        tap = $("#danTapNow"); //tap一定要是jquery对象 是tbody
        time = moment() - moment().startOf('day');
    }
    if (btn === $("#getweek")) {
        tap = $("#danTapWeek");
        time = moment() - moment().startOf('week');
    }
    if (btn === $("#getlastweek")) {
        tap = $("#danTapLast");
        time = moment() - moment().add("days", -7).startOf('week');
    }
    if (btn === $("#getmonth")) {
        tap = $("#danTapMonth");
        time = moment() - moment().startOf('month');
    }
    if (btn === $("#getall")) {
        tap = $("#danTapAll");
        time = moment();
    }
    get(time, tap);
}

function get(time, tap) {
    $.ajax({
            url: 'api/Statistics/' + time,
            type: 'GET',
            dataType: 'json',
        })
        .done(function(data) { //这个地方不要把tap传进来
            console.log("success", data, tap, time);
            dan(data, tap, time); //tap可以传进来

        })
        .fail(function() {
            console.log("error");
        })
}

function dan(data, tap, time) {
    var flag; //是详情还是订阅提示框
    var target; //显示哪个模态框
    var link=tap.find('a');
    for (var i = 0; i < data.length; i++) { //粘贴老师信息的时候没有顺序，顺序粘贴就好
        if (data[i].isSubscribed) //isSubscribed??true:显示详情 false:订阅提示框
        {
            flag = "详情";
            target = '#modaltable';
            // 统计相关后，要弹出模态框，把数据放到对应的模态框中
            for (var j = 0; j < link.length; j++) //给每个a标签添加点击事件
            {
                link[j].index = j; //给当前点击的标签添加下标
                link[j].onclick = showTabel(this.index, time, flag);//给每个点击的链接添加方法
                        
            }

        } else {
            flag = "订阅";
            target = '#modallist';//
        }
        tap.find('tr').remove(); //移除之前所有的
        tap.append("<tr>" + "<td>" + data[i].FA + "</td>" + "<td>" + data[i].count.total + "</td>" + "<td>" + data[i].count.succ / data[i].count.total + "</td>" + "<td>" + data[i].benefit + "</td>" + "<td>" + "<a data-toggle='modal' data-target='+" + target + "'>" + flag + "</a>" + "</td>" + "</tr>");

    }
    // 统计相关后，要弹出模态框，把数据放到对应的模态框中
    for (var j = 0; j < link.length; j++) //给每个a标签添加点击事件
    {
        link[j].index = j; //给当前点击的标签添加下标
        link[j].onclick = showTabel(this.index, time, flag);
        //给每个点击的链接添加方法        
    }    
}

// 在模态框里显示喊单详情部分
function showTabel(num, time, flag) {
        if (flag == "详情") {
            $.ajax({
                    url: '/api/Bills' + data[num].FAid + time, //把老师和时间加进去//管理??能看见所有信息怎么办
                    type: 'GET',
                    dataType: 'json',
                })
                .done(function(dataDan) { //返回的就是这个老师的喊单记录
                    console.log("success", dataDan, num, time);
                    // var arr1=new Array();
                    // var arr2=new Array();
                    for (var i = 0; i < dataDan.length; i++) {
                        if (dataDan[i].state >= 0 && dataDan[i].state <= 3) {
                            var first = '现价';
                        }
                        if (dataDan[i].state > 3 && dataDan[i].state <= 6) {
                            var first = "挂单";
                        }
                        if (dataDan[i].isMore) {
                            var second = "买多";
                        }
                        if (dataDan[i].isMore) {
                            var second = '卖空';
                        }
                    }
                    // 把json转化成自定义数组
                    $("#modaltable1").DataTable().destroy();
                    $("#modaltable1").dataTable({
                        "ajax": '/api/Bills' + data[this.index].FAid + time, //不知道怎么处理。。又获取了一次数据
                        "columns": [{
                            "data": "id"
                        }, {
                            "data": "FA"
                        }, {
                            "data": "priceType"
                        }, {
                            "data": null,
                            "defaultContent": first + second;
                        }, {
                            "data": "openPrice"
                        }, {
                            "data": "openTime"
                        }, {
                            "data": "upPrice"
                        }, {
                            "data": "lowPrice"
                        }, {
                            "data": "closePrice"
                        }, {
                            "data": "closeTime"
                        }, {
                            "data": "benefit"
                        }, {
                            "data": "state"
                        }],
                        "retrieve": true, //这个是啥, 没查到
                        // "paging" : false,
                        "order": [
                            [0, "desc"] //降序排序
                        ]

                    });
                })
                .fail(function() {
                    console.log("error");
                })
        }

    }