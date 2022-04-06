const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

// 保持一个对于 window 对象的全局引用，不然，当 JavaScript 被 GC，
// window 会被自动地关闭
var mainWindow = null;

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
    // 创建浏览器窗口。
    mainWindow = new BrowserWindow({
        width: 1000,
        height: 618,
        minWidth: 1000,
        minHeight: 618,

        webPreferences: {
            preload: 'file://' + __dirname + 'renderer.js',
            nodeIntegration: true,
            contextIsolation: false,
        },

        useContentSize: true,
        frame: false, // 去掉默认的标题栏
    });



    // 加载应用的 index.html
    mainWindow.loadURL('file://' + __dirname + '/index.html');

    // 打开开发工具
    mainWindow.openDevTools();

    // 当 window 被关闭，这个事件会被触发
    mainWindow.on('closed', function() {
        // 取消引用 window 对象，如果你的应用支持多窗口的话，
        // 通常会把多个 window 对象存放在一个数组里面，
        // 但这次不是。
        mainWindow = null;
    });

    //初始化窗口
    initWindows(mainWindow);
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



}



















//