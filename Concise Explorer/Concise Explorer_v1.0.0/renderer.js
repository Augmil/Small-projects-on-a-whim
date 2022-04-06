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


/*
let readDir = function(folder, name) {
    folder.name = name;
    folder.icon = './res/default_folder_opened.svg';

    folder.state = 'unfold';
    folder.directory = [];

    let dir = fs.readdirSync(name);
    console.log(dir);
    if (dir.length > 0) {

        for (let d = 0; d < dir.length; d++) {

            if (fs.lstatSync(name + '/' + dir[d]).isDirectory()) {
                folder.directory[folder.directory.length] = {};
                readDir(folder.directory[folder.directory.length], name + '/' + dir[d]);
            }

        }
    }
    return folder;
}
*/

let recursionReadDir = function(pathName) {
    if (fs.lstatSync(pathName).isDirectory()) {
        let folder = {

            name: pathName.match(/([^/]+)$/)[1],



            icon: "./res/default_folder_opened.svg",
            state: 'empty',
            directory: []
        };
        let dir = fs.readdirSync(pathName);
        if (dir.length > 0) {
            folder.state = 'unfold';
            for (let d = 0; d < dir.length; d++) {
                let item = recursionReadDir(pathName + '/' + dir[d]);
                if (item) {
                    folder.directory.push(item);
                }
            }
        } else {
            folder.state = 'empty';
            folder.directory = [];
        }
        return folder;
    } else {
        return false;
    }
}

//readDir(dirTree, '测试文件夹根目录');
let dirTree = recursionReadDir('测试文件夹根目录');
console.log(dirTree);
new TreeView(eTVBox, dirTree);