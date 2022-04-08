// 简写js原生函数
// 创建元素并添加至父元素
function $ce_ac(tag, parent) {
    let e = document.createElement(tag);
    parent.appendChild(e);
    return e
}
// 防抖函数
function debounce(fn, delay = 250) {
    let timer = null;
    return function() {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
            fn.apply(this, arguments);
            timer = null;
        }, delay);
    }
}
// 必要的HTML元素
// 当前网站信息
var wi = document.querySelector("#web_icon");
var wt = document.querySelector("#web_title");
var wu = document.querySelector("#web_url");
// 可选功能区
var osa = document.querySelector("#opt_sel_api");
var oma = document.querySelector("#opt_man_api");
var odt = document.querySelector("#opt_dev_too");
var au = document.querySelector(".api_ul");
var ma = document.querySelector(".man_api");
var dt = document.querySelector(".dev_too");

var nt = document.querySelector("#new_true");
var nf = document.querySelector("#new_false");

// 播放按钮
var bp = document.querySelector("#play");

// 所有 api 单选框
var eas = document.getElementsByName('api');



// 必要的全局变量 
// apis install
var apis, install, tabs;

// 关闭功能区
function closeOptBox() {
    osa.classList.remove("opt_cur");
    oma.classList.remove("opt_cur");
    odt.classList.remove("opt_cur");
    au.style.display = 'none';
    ma.style.display = 'none';
    dt.style.display = 'none';
}

// 基本 dom 操作
//切换至 ap i列表页
osa.onclick = e => {
    osa.classList.add("opt_cur");
    oma.classList.remove("opt_cur");
    odt.classList.remove("opt_cur");
    au.style.display = 'block';
    ma.style.display = 'none';
    dt.style.display = 'none';
}

// 切换至新建页
oma.onclick = e => {
    osa.classList.remove("opt_cur");
    oma.classList.add("opt_cur");
    odt.classList.remove("opt_cur");
    au.style.display = 'none';
    ma.style.display = 'block';
    dt.style.display = 'none';
}

// 切换至开发工具
odt.onclick = e => {
    osa.classList.remove("opt_cur");
    oma.classList.remove("opt_cur");
    odt.classList.add("opt_cur");
    au.style.display = 'none';
    ma.style.display = 'none';
    dt.style.display = 'block';
}

// 点击播放
bp.onclick = e => {
    play();
}

// 确定新建
nt.onclick = e => {
    // closeOptBox();
    let nan = document.querySelector("#new_api_name");
    let nau = document.querySelector("#new_api_url");
    let n = nan.value,
        u = nau.value;
    if (!u) return;
    let i = {};
    i.url = u;
    n ? i.name = n : null;
    apis.push(i);
    showApiList();
    localStorage.setItem("apis", JSON.stringify(apis));
    nan.value = nau.value = '';
    closeOptBox();
}

// 取消新建
nf.onclick = e => {
    closeOptBox();
}

// 重置数据
document.querySelector('#too_reset').onclick = e => {
    var r = confirm("确认重置数据？重置后无法恢复！重置后本插件将会重启。");
    if (r === true) {
        localStorage.clear();
        location.reload();
    }
}

// 导出数据
document.querySelector('#too_export').onclick = e => {
    let data =
        `
const defaultApis = ${localStorage.getItem('apis')}
    
const defaultInstall = ${localStorage.getItem('install')}
`;
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(data));
    element.setAttribute('download', 'Play VIP data.json');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

}

// 打开开发者工具
document.querySelector('#too_dev').onclick = e => {
    alert('请右键调试打开');
    console.log('恭喜你可以打开开发者工具了')
}

// 显示警告信息
function showWarning(text) {
    wi.src = 'res/warning.jpg'
    wt.innerText = text;
}

// 当前页是否为视频页 后期尝试过滤非视频网站
function isVideoPage() {
    if (wu.value == '') { showWarning('请输入视频链接'); return false }
    switch (true) {
        case /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/g.test(wu.value):
            return true;
        default:
            showWarning('请输入正确链接');
            return false
    }
}

// 实时验证网址
wu.oninput = debounce(e => { isVideoPage() });

// 播放视频
function play() {
    if (!isVideoPage()) return;
    let a, api;
    for (a = 0; a < eas.length; a++) {
        if (eas[a].checked) {
            api = apis[a].url;
            break;
        }
    }
    window.open(api + tabs.url);
    install.defaultApi = a;
    localStorage.setItem("install", JSON.stringify(install));
}
// 显示 api 列表
function showApiList() {
    // apis au
    au.innerHTML = '';
    for (let k = 0; k < apis.length; k++) {
        let l = $ce_ac('div', au);
        l.className = 'api_li';

        let i = $ce_ac('input', l);
        i.type = 'radio';
        i.name = 'api';
        if (install.defaultApi == k) { i.checked = 1; }

        let n = $ce_ac('div', l);
        n.className = 'api_name';
        n.innerHTML = apis[k].name || apis[k].url;

        let m = $ce_ac('div', l);
        m.className = 'api_meth';

        let s1 = $ce_ac('span', m);
        let s2 = $ce_ac('span', m);
        let s3 = $ce_ac('span', m);

        n.addEventListener('click', e => {
            i.checked = 1;
        })

        s1.onclick = e => {
            if (isVideoPage()) {
                window.open(apis[k].url + tabs.url);
            }
        }
        s2.onclick = e => {
            let p = document.createElement('p');
            p.innerText = apis[k].url;
            p.select();
            document.execCommand("Copy");
        }
        s3.onclick = e => {
            var r = confirm("确认删除？删除后无法不可恢复！");
            if (r === true) {
                apis.splice(k, 1);
                k == install.defaultApi ? install.defaultApi = 0 : k < install.defaultApi ? install.defaultApi-- : null;
                localStorage.setItem("install", JSON.stringify(install));
                localStorage.setItem("apis", JSON.stringify(apis));
                showApiList();
            }
        }



    }
}


// 显示当前标签页信息
function showTabInfo() {
    // wi wt
    wi.src = tabs.favIconUrl;
    wt.innerHTML = tabs.title;
    wu.value = tabs.url;
    isVideoPage();
}

// 第一次使用
function firstUse(callback) {
    let s = $ce_ac('script', document.getElementsByTagName('head')[0]);
    s.src = 'script/default.js';
    s.onload = e => {
        localStorage.setItem("apis", JSON.stringify(defaultApis));
        localStorage.setItem("install", JSON.stringify(defaultInstall));
        callback();
    }
}

// localStorage.clear(); 
// 初始化
function init() {
    // 启动初始化
    let start = () => {
        apis = JSON.parse(localStorage.getItem("apis"));
        install = JSON.parse(localStorage.getItem("install"));
        // 显示标签页信息
        showTabInfo();
        // 显示 api 列表
        showApiList();
    }

    // 判断是否首次使用
    let apisSto = localStorage.getItem("apis");
    if (apisSto === null) {
        firstUse(start);
        console.log('首次使用初始化成功');
    } else { start(); }
}

// 获取当前页信息
chrome.tabs.getSelected(null, function(data) {
    tabs = data;
    init();
});