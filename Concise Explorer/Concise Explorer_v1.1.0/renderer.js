// renderer.js


let ipcRenderer = require('electron').ipcRenderer;

function initWindows() {
    //获取窗口控件元素
    var min = document.getElementById('win_min');
    var restore = document.getElementById('win_restore');
    var max = document.getElementById('win_max');
    var close = document.getElementById('win_close');

    //点击最小化按钮
    if (min) {
        min.addEventListener('click', () => {
            ipcRenderer.send('window-min');
        });
    }
    //点击向下还原按钮
    if (restore) {
        restore.addEventListener('click', () => {
            ipcRenderer.send('window-restore');
        });
    }
    //点击最大化按钮
    if (max) {
        max.addEventListener('click', () => {
            ipcRenderer.send('window-max');
        });
    }
    //点击关闭按钮
    if (close) {
        close.addEventListener('click', () => {
            ipcRenderer.send('window-close');
        });
    }

    ipcRenderer.on('main-window-max', (event) => {
        max.style.display = "none";
        restore.style.display = "block";
    });
    ipcRenderer.on('main-window-unmax', (event) => {
        max.style.display = "block";
        restore.style.display = "none";
    });

}
//执行窗口初始化
initWindows();

//窗口标题栏信息
let links = document.getElementsByTagName('link');
for (let l = 0; l < links.length; l++) {
    switch (links[l].rel) {
        case 'icon':
            window.icon = links[l].href;
            document.getElementsByClassName('header_icon')[0]
                .setAttribute('style', `background-image: url(${links[l].href});`);
            break;
        default:
            break;
    }
}


//文件系统
let fs = require("fs");
//console.log(fs.readdirSync('file://' + __dirname + '测试文件夹根目录/贵州'));


let recursionReadDir = function(pathName) {
    let folder = {
        name: pathName.match(/([^/]+)$/)[1],
        icon: "./res/default_folder_opened.svg",
        state: 'empty',
        subfolder: []
    };
    let dir = fs.readdirSync(pathName);
    if (dir.length > 0) {
        folder.state = 'default';
        for (let d = 0; d < dir.length; d++) {
            let subPathName = pathName + '/' + dir[d];
            if (fs.lstatSync(subPathName).isDirectory()) {
                folder.state = 'unfold';
                let item = recursionReadDir(subPathName);
                if (item) {
                    folder.subfolder.push(item);
                }
            }
        }
    } else {
        folder.state = 'nothing';
        folder.subfolder = [];
    }
    return folder;
}

//readDir(dirTree, '测试文件夹根目录');
let dirTree = recursionReadDir('测试文件夹根目录');
//console.log(dirTree);
let eTVBox = document.getElementsByClassName('tree_view')[0];
showTreeView(dirTree, eTVBox, console.log);

/*
let dirTree = recursionReadDir('E:/学习文件');
let eTVBox = document.getElementsByClassName('tree_view')[0];
showTreeView(dirTree, eTVBox, console.log);

*/



// 创建 新建资源库 对话浮窗

function newLibrary(params) {
    let newBox = document.createElement('div');
    let FW = new FloatWindow();

    let newTitle = document.createElement('div');
    newTitle.innerText = '打开文件夹保存新素材库';
    let newButton = document.createElement('button');
    newButton.innerText = '新建素材库'
    newBox.appendChild(newTitle);
    newBox.appendChild(newButton);
    FW.content.appendChild(newBox);

    // 点击向主程序发送消息
    newButton.addEventListener('click', e => {
        ipcRenderer.send('req-new-library');
    });
}

// 接受主程序消息
ipcRenderer.on('res-new-library', function(e, data) {
    if (data) {
        fs.writeFile(data, '新建资源库数据文件', function(err) {
            if (err) throw err;
            console.log('资源库创建成功');
        });
    } else {
        console.log('取消新建素材库');
    }
});



// 因需求不明确，技术不到家，该项目暂时搁置。2022年03月26日
//