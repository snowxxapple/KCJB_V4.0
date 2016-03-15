//检查用户名，密码 密码一致 提示框 图标的显示和隐藏
function checkName(name, div) {
    var inputName = name.value;
    if (inputName == "") {
        // div.innerHTML = null;
        div.innerHTML = "<small>用户名不能为空</small>";
        return false;
    }
    //检测是否出现非数字或者非字母
    for (var i = 0; i < inputName.length; i++) {
        var text = inputName.charAt(i);
        console.log(inputName);
        console.log(inputName.length);
        console.log(i);
        console.log(text);
        if (!(text <= 9 && text >= 0) && !(text >= 'a' && text <= 'z') && !(text >= 'A' && text <= 'Z')) //如果既不是是数字又不是字母
        {
            console.log(text);
            // div.innerHTML = null;
            div.innerHTML = "<small>用户名只能由数字、字母组成</small>";
            return false;
            break; //一旦检测到非字母数字就停止检测,跳出去了，但是整个循环体怎么执行了inputName.length遍？
        }
    }
    //检测长度是否符合
    if (inputName.length < 3 || inputName.length > 20) {
        // div.innerHTML = null;
        div.innerHTML = "<small>用户名的长度在3到20之间</small>";
        return false;
    }
//检测都通过了
    if (i >= inputName.length) {
        console.log("i=" + i);
        // div.innerHTML = null;
        $(div).find('small').remove();
        return true;
    }

}

function checkPass(password, show) {//都是DOM对象
    var inputPass = password.value;
    if (inputPass == "") {
        // show.innerHTML = null;
        show.innerHTML = "<small>密码不能为空</small>";
        return false;
    }
    if (inputPass.length < 6 || inputPass.length > 20) {
        show.innerHTML = "<small>输入密码长度不符合</small>";
        return false;
    } 
    else {
        // show.innerHTML=null;
        $(show).find('small').remove();
        return true;
    }
}
function checkConsist(pass1, pass2,div) {
    var word1 = pass1.value;
    var word2 = pass2.value;
    // var passDiv2 = document.getElementById('pass2'); //确认是否一致框
    if (word1 === word2) {
        return true;
    } 
    else {
        div.innerHTML = "<small>两次密码不一致</small>";
        return false;
    }
}
function divShow(div){
    // div.innerHTML=null;
    $(div).find('small').remove();
}
function iconShow(flag,target){
    if (flag) {
            target.attr('class', 'has-feedback has-success form-group');
            target.find('span').eq(0).hide();
            target.find('span').eq(1).show();
        }
        if (!flag) {
            target.attr('class', 'has-feedback has-error form-group');
            target.find('span').eq(1).hide();
            target.find('span').eq(0).show();
        }
}
function iconHide(target){
    target.attr('class','has-feedback form-group');
    target.find('span').hide();
}