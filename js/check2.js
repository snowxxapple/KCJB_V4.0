//检查qq 和 昵称 和所有
function checkNickName(nick, show) { //2到10位 字母，数字，汉字，不能有连续5个数字
    var nickName = nick.value;//两个对象都是dom对象
    if (nickName == "") {
        show.innerHTML = "<small>昵称名不能为空</small>";
        return false;
    }
    for (var m = 0; m < nickName.length; m++) {
        var text = nickName.charAt(m);
        var check1 = /^[A-Za-z0-9\u4e00-\u9fa5]$/.test(text); //检测是否是数字，字母，汉字
        if (!check1) {
            show.innerHTML = "<small>昵称名只能是字母、数字和汉字</small>";
            return false;
            break;
        }
    }
    if (nickName.length < 2 || nickName.length > 10) {
        show.innerHTML = "<small>长度只能2~10</small>";
        return false;
    }
    if (m >= nickName.length) {
        var check2 = /^\d{5,}$/.test(nickName);//检测有问题 只能检测出一串数字中有五个连续的
        if (check2)
         {
            show.innerHTML = '<small>不能有5个数字相连</small>';
            return false;
        } 
        else {
            // show.innerHTML=null;
            $(show).find('small').remove();
            return true;
        }
    }

    // var pass=/(?![0-9]{5})[^\[\]]{2,10}/.test(nickName);//检测昵称名，一次都检测完，提示没法写
    // if(pass)
    // {
    //     return true;
    // }
}

function checkQQ(qq, show) {
    console.log(qq); //是input标签
    var qq = qq.value;
    console.log(qq); //是input里的value，是一个字符串!!
    console.log(typeof(qq))
    console.log(qq[0]);
    if (qq == "") {
        show.innerHTML = '<small>QQ号不能为空!</small>';
        return false;
    }
    for (var j = 0; j <= qq.length; j++) {
        var qqText = qq.charAt(j); //chartAt(index),返回的特定索引值下的字符
        if (!(qqText <= 9 && qqText >= 0)) //不是数字
        {
            show.innerHTML = "<small>输入只能为数字</small>";
            return false;
            break;
        }
    }
    if (qq.length < 5 || qq.length > 10) {
        show.innerHTML = '<small>长度不正确</small>';
        return false;
    }
    if (j >= qq.length) {
        // show.innerHTML=null;
        $(show).find('small').remove();
        return true;
    }    
}
// function checkConsist(pass1, pass2,div) {
//     var word1 = pass1.value;
//     var word2 = pass2.value;
//     // var passDiv2 = document.getElementById('pass2'); //确认是否一致框
//     if (word1 === word2) {
//         return true;
//     } else {
//         div.innerHTML = "<small>两次密码不一致</small>";
//         return false;
//     }
// }
function checkAll(a, b, c, d, e, f) {
    if (a && b && c && d && e && f) {
        return true;
    } else {
        return false;
    }
}
// function divShow(div){
//     div.innerHTML=null;
// }
// function iconShow(flag,target){
//     if (flag) {
//             target.attr('class', 'has-feedback has-success form-group');
//             target.find('span').eq(0).hide();
//             target.find('span').eq(1).show();
//         }
//         if (!flag) {
//             target.attr('class', 'has-feedback has-error form-group');
//             target.find('span').eq(1).hide();
//             target.find('span').eq(0).show();
//         }
// }
// function iconHide(target){
//     target.attr('class','has-feedback form-group');
//     target.find('span').hide();
// }