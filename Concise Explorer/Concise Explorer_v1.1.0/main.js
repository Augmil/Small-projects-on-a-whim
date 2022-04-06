//const electron = require('electron');
//const app = electron.app;
//const BrowserWindow = electron.BrowserWindow;
//const Menu = electron.Menu;

//批量引入模块
const { app, BrowserWindow, Menu, MenuItem, dialog } = require('electron')




// 保持一个对于 window 对象的全局引用，不然，当 JavaScript 被 GC，
// window 会被自动地关闭
var mainWindow = null;
//创建窗口函数
function createWindow() {

    // 创建浏览器窗口。
    mainWindow = new BrowserWindow({
        width: 1000,
        height: 618,
        minWidth: 1000,
        minHeight: 618,

        //暴露一个js文件供渲染进程使用，该文件可在index.html中调用并且可使用node.js语法解析。
        webPreferences: {
            preload: 'file://' + __dirname + 'renderer.js',
            nodeIntegration: true,
            contextIsolation: false,
        },

        useContentSize: true,
        //frame:false 去掉默认的标题栏 ，否则显示标题栏，默认为 true
        frame: false,


    });

    // 隐藏菜单栏
    //Menu.setApplicationMenu(null);
    //创建菜单栏
    const menu = new Menu();
    menu.append(new MenuItem({
        label: '调试',
        submenu: [{
            role: '开发者工具',
            accelerator: process.platform === 'darwin' ? 'F12' : 'F12',
            click: () => {
                console.log('Electron rocks! ----> F12');
                // 打开开发工具
                mainWindow.openDevTools();
            }
        }, ]
    }));
    Menu.setApplicationMenu(menu);


    // 加载应用的 index.html
    mainWindow.loadURL('file://' + __dirname + '/index.html');

    // 打开开发工具
    mainWindow.openDevTools();

    //初始化窗口，该函数为自建的
    initWindows(mainWindow);

    // 当 window 被关闭，这个事件会被触发
    mainWindow.on('closed', function() {
        // 取消引用 window 对象，如果你的应用支持多窗口的话，
        // 通常会把多个 window 对象存放在一个数组里面，
        // 但这次不是。
        mainWindow = null;
    });
}





// 当所有窗口被关闭了，退出。
app.on('window-all-closed', function() {
    // 在 OS X 上，通常用户在明确地按下 Cmd + Q 之前
    // 应用会保持活动状态
    if (process.platform != 'darwin') {
        app.quit();
    }
});

// 当 Electron 完成了初始化并且准备创建浏览器窗口的时候
// 这个方法就被调用
app.on('ready', function() {
    createWindow();
});


let ipcMain = require('electron').ipcMain;

/*************************************
 * 初始化窗口 函数
 *************************************/
function initWindows(mainWindow) {
    //接收最小化命令
    ipcMain.on('window-min', function() {
        mainWindow.minimize();
    })

    //接收最大化命令
    ipcMain.on('window-max', function() {
        mainWindow.maximize();
    })

    //接收向下还原命令
    ipcMain.on('window-restore', function() {
        mainWindow.restore();
    })

    //接收关闭命令
    ipcMain.on('window-close', function() {
        mainWindow.close();
    })

    //窗口最大化事件
    mainWindow.on('maximize', function() {
        mainWindow.webContents.send('main-window-max');
    })

    //窗口向下恢复事件
    mainWindow.on('unmaximize', function() {
        mainWindow.webContents.send('main-window-unmax');
    })


    // 重要参考 勿删 https://blog.liboliu.com/a/106#:~:text=%E7%AE%80%E4%BB%8B%20Dialog%E7%BB%84%E4%BB%B6%E7%94%A8%E4%BA%8E%E6%98%BE%E7%A4%BA%E6%89%93%E5%BC%80%E3%80%81%E4%BF%9D%E5%AD%98%E6%96%87%E4%BB%B6%E3%80%81%E8%AD%A6%E5%91%8A%E7%AD%89%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F%E5%AF%B9%E8%AF%9D%E6%A1%86%E3%80%82,%E6%98%BE%E7%A4%BA%E6%89%93%E5%BC%80%E6%96%87%E4%BB%B6%E5%AF%B9%E8%AF%9D%E6%A1%86%EF%BC%9Adialog.showOpenDialogSync%20%28%5BbrowserWindow%2C%20%5Doptions%29
    //打开文件夹
    ipcMain.on('req-new-library', function(event) {

        let options = {
            title: "选择新素材库保存地址",
            defaultPath: "新建素材库",
            buttonLabel: "保存素材库",
            filters: [
                { name: '自制文件', extensions: ['aug'] },
            ],
        }
        let path = dialog.showSaveDialogSync(options);
        mainWindow.webContents.send('res-new-library', path);
    })

}



















//