const { app, BrowserWindow, globalShortcut } = require('electron');

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        icon: './browser/resources/icon_64x64.ico',
        /*异形窗口
        maximizable: false,
        minimizable: false,
        resizable: false,
        fullscreenable: false,
        frame: false,
        transparent: true,
        hasShadow: false,
        */
    });//创建一个 800x600 的浏览器窗口

    mainWindow.loadFile('./browser/index.html')  //加载应用的界面文件

    //mainWindow.webContents.openDevTools();//打开开发者工具，方便调试

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

//注册全局快捷键
function registerShortcuts() {
    globalShortcut.register('ctrl+alt+s', function () {
        mainWindow.show();//全局 ctrl+alt+s 显示窗口
    })
    globalShortcut.register('ctrl+alt+h', function () {
        mainWindow.hide();//全局 ctrl+alt+h 隐藏窗口
    })
}

// 页面加载时执行
app.on('ready', () => {
    createWindow();
    registerShortcuts();
});
