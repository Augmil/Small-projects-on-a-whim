/**
 * 创建主菜单
 */
let mainMenu = [{
    label: '新建素材库',
    icon: './res/compatible_edge.png',
    shortcut: 'ctrl+n',
    type: 'item',
    method: newLibrary,
}, {
    type: 'separator'
}, {
    label: '导入素材',
    icon: './res/compatible_edge.png',
    type: 'group',
    submenu: [{
        label: 'Eagle素材库',
        icon: './res/compatible_edge.png',
        shortcut: 'ctrl+n',
        type: 'item',
        method: (e) => { console.log('默认菜单事件', e); },
    }, {
        label: 'Eagle素材包',
        icon: './res/compatible_edge.png',
        shortcut: 'ctrl+n',
        type: 'item',
        method: (e) => { console.log('默认菜单事件', e); },
    }, {
        type: 'separator'
    }, {
        label: 'Billfish素材库',
        icon: './res/compatible_edge.png',
        shortcut: 'ctrl+n',
        type: 'item',
        method: (e) => { console.log('默认菜单事件', e); },
    }, {
        label: 'Billfish素材包',
        icon: './res/compatible_edge.png',
        shortcut: 'ctrl+n',
        type: 'item',
        method: (e) => { console.log('默认菜单事件', e); },
    }, {
        type: 'separator'
    }, {
        label: '花瓣画板素材',
        icon: './res/compatible_edge.png',
        shortcut: 'ctrl+n',
        type: 'item',
        method: (e) => { console.log('默认菜单事件', e); },
    }, ],
}, {
    type: 'separator'
}, {
    label: '偏好设置',
    icon: './res/compatible_edge.png',
    shortcut: 'ctrl+n',
    type: 'item',
    method: (e) => { console.log('默认菜单事件', e); },
}, {
    type: 'separator'
}, {
    label: '意见反馈',
    icon: './res/compatible_edge.png',
    shortcut: 'ctrl+n',
    type: 'item',
    method: (e) => { console.log('默认菜单事件', e); },
}, {
    label: '检查更新',
    icon: './res/compatible_edge.png',
    shortcut: 'ctrl+n',
    type: 'item',
    method: (e) => { console.log('默认菜单事件', e); },
}, {
    label: '关于与帮助',
    icon: './res/compatible_edge.png',
    type: 'group',
    submenu: [{
        label: '关于软件',
        icon: './res/compatible_edge.png',
        shortcut: 'ctrl+n',
        type: 'item',
        method: (e) => { console.log('默认菜单事件', e); },
    }, {
        label: '官方网站',
        icon: './res/compatible_edge.png',
        shortcut: 'ctrl+n',
        type: 'item',
        method: (e) => { console.log('默认菜单事件', e); },
    }, {
        label: '帮助教程',
        icon: './res/compatible_edge.png',
        shortcut: 'ctrl+n',
        type: 'item',
        method: (e) => { console.log('默认菜单事件', e); },
    }, {
        label: '导出日志',
        icon: './res/compatible_edge.png',
        shortcut: 'ctrl+n',
        type: 'item',
        method: (e) => { console.log('默认菜单事件', e); },
    }, ]
}, {
    type: 'separator'
}, {
    label: '退出软件',
    icon: './res/compatible_edge.png',
    shortcut: 'ctrl+n',
    type: 'item',
    method: (e) => { alert('你点击了退出软件'); },
}, ];

// 实例化菜单
let CM = new ContentMenu();

// 为目标元素添加右键菜单
let mainMenuBox = document.getElementById('main_menu_box');
CM.createMenu(mainMenu, mainMenuBox);
mainMenuBox.style.display = 'none';
let mainMenuBut = document.getElementById('main_menu_but');

mainMenuBut.addEventListener('click', e => {
    e.stopPropagation();
    if (mainMenuBox.style.display === 'none') {
        mainMenuBox.style.display = 'block';
    } else {
        mainMenuBox.style.display = 'none';
    };
});
document.addEventListener('click', e => {
    mainMenuBox.style.display = 'none';
})


/**
 * 拖拽缩放视窗
 */
class HorizontalDragZoom {
    constructor(warp, left, resize, right, limit) {
        this.warp = warp;
        this.left = left;
        this.resize = resize;
        this.right = right;
        this.init();
    }
    init() {
        this.drag = false;
        let i = 0;
        this.resize.addEventListener('mousedown', (e) => {
            this.drag = true;
            this.clientX = e.clientX;
            this.leftStartingWidth = this.left.clientWidth / this.warp.clientWidth;
            this.rightStartingWidth = this.right.clientWidth / this.warp.clientWidth;
        });
        document.body.addEventListener('mousemove', (e) => {
            if (this.drag) {
                let move = (e.clientX - this.clientX) / this.warp.clientWidth;
                this.left.style.width = (this.leftStartingWidth + move) * 100 + '%';
                this.right.style.width = (this.rightStartingWidth - move) * 100 + '%';
            }
        });
        document.body.addEventListener('mouseup', (e) => {
            this.drag = false;
        });
    }
}
let warp = document.getElementsByClassName('body')[0];
let box_left = document.getElementsByClassName('aside_left')[0];
let resize_LM = document.getElementById('resize_asideLeft_main');

let box_main = document.getElementsByClassName('main')[0];
let resize_MR = document.getElementById('resize_main_asideRight');
let box_right = document.getElementsByClassName('aside_right')[0];

new HorizontalDragZoom(warp, box_left, resize_LM, box_main);
new HorizontalDragZoom(warp, box_main, resize_MR, box_right);





let seaBut = document.getElementById('search_button');
let seaBox = document.getElementById('input_search_path');

//搜索框 失焦
seaBox.addEventListener('focus', (e) => {
    seaBox.setAttribute('style', `min-width: 200px; width: 70%; padding: 0 1em;`);
});
//搜索框 焦点
seaBox.addEventListener('blur', (e) => {
    seaBox.setAttribute('style', `min-width: 0px; width: 0; padding: 0;`);
});

let seaTimeOut = null;
//悬停按钮 显示 搜索框
seaBut.addEventListener('mouseover', (e) => {
    clearTimeout(seaTimeOut);
    seaBox.setAttribute('style', `min-width: 200px; width: 70%; padding: 0 1em;`);
});
seaBut.addEventListener('mouseout', (e) => {
    seaTimeOut = setTimeout(() => {
        seaBox.setAttribute('style', `min-width: 0px; width: 0; padding: 0;`);
    }, 300)
});

//悬停搜索框 获取焦点
seaBox.addEventListener('mouseover', (e) => {
    clearTimeout(seaTimeOut);
    seaBox.focus();
});

//移出搜索框 有焦点显示 ，无焦点隐藏
seaBox.addEventListener('mouseout', (e) => {
    if (seaBox === document.activeElement) {} else {
        seaBox.setAttribute('style', `min-width: 0px; width: 0; padding: 0;`);
    }
});

//单击按钮执行搜索
seaBut.addEventListener('click', (e) => {
    console.log(seaBox.value);
});







//