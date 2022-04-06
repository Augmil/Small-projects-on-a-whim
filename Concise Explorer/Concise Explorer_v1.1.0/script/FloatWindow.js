/**
 * @class FloatWindow
 * @version 1.0.0
 * @description 用来快速创建浮窗
 * @param attribute {Object} 可选。属性值可创建对象后再更改。
 * @author Augmil 2022/03/25
 * @example
 * // 创建浮窗实例
 * let FW = new FloatWindow();
 * FW.onclose = e => {
 * alert('关闭窗口');
 * }
 * // 添加窗口内容 FW.content 为放置内容的 HTML 元素
 * let content = document.createElement('div');
 * FW.content.appendChild(content);
 */

class FloatWindow {
    constructor(attribute) {
        if (attribute) {} else { attribute = {} }
        // 初始化属性
        this.content = attribute.content || '';
        this.allowMove = attribute.allowMove || true;
        this.onclose = attribute.onclose || (e => null);
        this.cover = true;
        //创建窗口
        this.window = this.createWindow();
    }
    createWindow() {
        let win = document.createElement('div');
        win.className = 'float_win';
        //win.id = 'FloatWindow_1';
        let ctrl = document.createElement('div');
        win.appendChild(ctrl);
        ctrl.className = 'float_win__ctrl';

        let closeA = document.createElement('a');
        ctrl.appendChild(closeA);
        closeA.id = 'float_win_close';
        let closeI = document.createElement('i');
        closeA.appendChild(closeI);

        let contentBox = document.createElement('div');
        contentBox.className = 'float_win_content';
        win.appendChild(contentBox);
        // 是否传入内容
        if (this.content === '') {
            this.content = contentBox;
        } else {
            contentBox.appendChild(this.content);
            this.content = contentBox;
        }
        // 是否可移动
        if (this.allowMove) {
            this.registerMove(ctrl);
            win.setAttribute('data-move', 'true');
        }
        // 创建关闭事件
        this.registerClose(closeA);

        // 是否遮盖底层
        if (this.cover) {
            this.createCover();
        }
        // 显示浮窗
        document.body.appendChild(win);

        return win;
    }
    registerMove(ctrl) {
        //是否可移动
        if (this.allowMove) {
            let allow = false;
            let offsetX, offsetY;
            ctrl.addEventListener('mousedown', e => {
                e.stopPropagation();
                allow = true;
                offsetX = e.offsetX;
                offsetY = e.offsetY;
            });
            document.addEventListener('mouseup', e => {
                allow = false;
            })
            ctrl.addEventListener('mousemove', e => {
                if (allow) {
                    this.window.style.left = e.x - offsetX + 'px';
                    this.window.style.top = e.y - offsetY + 'px';
                }
            });
        }
    }
    registerClose(but) {
        but.addEventListener('mousedown', e => {
            e.stopPropagation();
        });
        but.addEventListener('click', e => {
            e.stopPropagation();
            // 移除浮窗
            this.window.remove();
            if (this.cover) {
                this.coverElement.remove();
            }
            // 回调窗口关闭事件
            this.onclose(this.window);
        });
    }
    createCover() {
        let cover = document.createElement('div');
        cover.className = 'win_cover';
        this.coverElement = cover;
        document.body.appendChild(cover);

        // 执行窗口抖动
        cover.addEventListener('click', e => {
            let box = this.window;
            let i = 0;
            let o = 0.2
            let intVal = setInterval(() => {
                box.style.opacity = 0.8 + o;
                box.style.left = box.offsetLeft + o * 10 + 'px';
                box.style.top = box.offsetTop + o * 10 + 'px';
                o *= -1;
                i++
                if (i > 16) {
                    clearInterval(intVal);
                }
            }, 20);
        })
        return cover;
    }
}