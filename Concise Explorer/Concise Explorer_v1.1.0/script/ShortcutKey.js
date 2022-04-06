/**
 * @class ShortcutKey
 * @version 1.0.0
 * @description 用来快捷生成键盘快捷键，仅支持应用内
 * @param key {String} 必需。需要创建的快捷键，例如 ctrl+c 、alt+b
 * @param method {method} 必需。放置目录树的 HTML 元素
 * @author Augmil 2022/03/23
 * @example
 * // 实例化快捷键
 * let SK = new ShortcutKey();
 * // 注册快捷键
 * SK.register('Ctrl + B', console.log);
 * // 刷新快捷键 --> 注册完所有快捷键后刷新一次即可
 * SK.refresh();
 */

class ShortcutKey {
    constructor() {
        this.ctrl = {};
        this.ctrlShift = {};
        this.ctrlAlt = {};
        this.ctrlAltShift = {};
        this.alt = {};
        this.altShift = {};
        this.shift = {};

        // 注册模块默认快捷键
        this.ctrlAltShift['h'] = e => {
            console.error('文档暂未编写');
        }
    }
    register(key, method) {
        if (typeof(method) != 'function') {
            console.error('method 不是函数', method);
            return false;
        }
        // 删除空格
        key = key.replace(/[^a-z+]/gi, '');
        // 拆分为数组
        let keys = key.split('+');

        // 解析快捷键组合，提取修饰键，判断快捷键修饰组合模式
        let modes = ['o', 'o', 'o'];
        let mode = 'ooo';
        let must = false;
        for (let k = 0; k < keys.length; k++) {
            switch (keys[k].toLowerCase()) {
                case 'ctrl':
                case 'control':
                    modes[0] = 'c';
                    break;
                case 'alt':
                    modes[1] = 'a';
                    break;
                case 'shift':
                    modes[2] = 's';
                    break;
                default:
                    must = keys[k].toLowerCase();
                    break;
            }
            mode = modes.join('');
        };

        // 向快捷键实例中注册对应快捷方式
        switch (mode) {
            case 'coo':
                if (this.ctrl[must]) {
                    console.error('快捷键 ctrl + ' + must + ' 已存在，无法重复创建')
                } else {
                    this.ctrl[must] = method;
                }
                break;
            case 'cao':
                if (this.ctrlAlt[must]) {
                    console.error('快捷键 ctrl + alt + ' + must + ' 已存在，无法重复创建')
                } else {
                    this.ctrlAlt[must] = method;
                }
            case 'cos':
                if (this.ctrlShift[must]) {
                    console.error('快捷键 ctrl + shift + ' + must + ' 已存在，无法重复创建')
                } else {
                    this.ctrlShift[must] = method;
                }
                break;
            case 'cas':
                if (this.ctrlAltShift[must]) {
                    console.error('快捷键 ctrl + shift + ' + must + ' 已存在，无法重复创建')
                } else {
                    this.ctrlAltShift[must] = method;
                }
                break;
            case 'oao':
                if (this.alt[must]) {
                    console.error('快捷键 ctrl + alt + ' + must + ' 已存在，无法重复创建')
                } else {
                    this.alt[must] = method;
                }
                break;
            case 'oas':
                if (this.altShift[must]) {
                    console.error('快捷键 ctrl + alt + ' + must + ' 已存在，无法重复创建')
                } else {
                    this.altShift[must] = method;
                }
                break;
            case 'oos':
                if (this.shift[must]) {
                    console.error('快捷键 ctrl + alt + ' + must + ' 已存在，无法重复创建')
                } else {
                    this.shift[must] = method;
                }
                break;
            default:
                if (this.single[must]) {
                    console.error('快捷键 ' + must + ' 已存在，无法重复创建')
                } else {
                    this.single[must] = method;
                }
                break;
        }
    }

    // 刷新快捷键 启动所有快捷键事件监听
    refresh() {
        let registerShortcutKey = e => {
            // 按下 ctrl、alt、shift 以外的按键才执行
            if (e.key != 'Control' && e.key != 'Alt' && e.key != 'Shift') {
                // ctrl
                if (e.ctrlKey === true && e.altKey === false && e.shiftKey === false) {
                    if (this.ctrl[e.key.toLowerCase()]) {
                        this.ctrl[e.key.toLowerCase()](e);
                    }
                }
                // ctrl、alt
                if (e.ctrlKey === true && e.altKey === true && e.shiftKey === false) {
                    if (this.ctrlAlt[e.key.toLowerCase()]) {
                        this.ctrlAlt[e.key.toLowerCase()](e);
                    }
                }
                // ctrl、shift
                if (e.ctrlKey === true && e.altKey === false && e.shiftKey === true) {
                    if (this.ctrlShift[e.key.toLowerCase()]) {
                        this.ctrlShift[e.key.toLowerCase()](e);
                    }
                }
                // ctrl、alt、shift
                if (e.ctrlKey === true && e.altKey === true && e.shiftKey === true) {
                    if (this.ctrlAltShift[e.key.toLowerCase()]) {
                        this.ctrlAltShift[e.key.toLowerCase()](e);
                    }
                }
                // alt
                if (e.ctrlKey === false && e.altKey === true && e.shiftKey === false) {
                    if (this.alt[e.key.toLowerCase()]) {
                        this.alt[e.key.toLowerCase()](e);
                    }
                }
                // alt、shift
                if (e.ctrlKey === false && e.altKey === true && e.shiftKey === true) {
                    if (this.altShift[e.key.toLowerCase()]) {
                        this.altShift[e.key.toLowerCase()](e);
                    }
                }
                // shift
                if (e.ctrlKey === false && e.altKey === false && e.shiftKey === true) {
                    if (this.shift[e.key.toLowerCase()]) {
                        this.shift[e.key.toLowerCase()](e);
                    }
                }
            }
        }
        document.addEventListener('keydown', registerShortcutKey);
    }
}