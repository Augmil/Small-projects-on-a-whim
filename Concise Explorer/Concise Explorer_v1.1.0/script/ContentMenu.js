/**
 * @class ContentMenu
 * @version 1.1.0
 * @description 
 * 用于快速注册右键菜单。
 * 理论可以支持多层菜单嵌套，但不建议这么做，因为从第三层开始将可能超出窗口显示范围。
 * 需要注意的是快捷键仅有提示作用，需另行添加，后续版本将尝试加入。
 * @param target {Element} 必需。创建右键菜单的目标元素
 * @param menu {Array} 必需。菜单对象数组
 * @author Augmil 2022/03/24
 * @example
 * // 创建菜单对象数组
 * let menuTem = [{
 *         label: '网红歌曲网红歌曲网红歌曲网红歌曲网红歌曲', // 必需
 *         icon: '../res/compatible_edge.png', // 可选
 *         shortcut: 'ctrl+j', // 可选
 *         type: 'item', // 必需
 *         method: (e) => { console.log('默认菜单事件', e); }, // 必需
 *     },
 *     {
 *         type: 'separator' // 唯一必需
 *     },
 *     {
 *         label: '乐库', // 必需
 *         icon: '../res/compatible_edge.png', // 可选
 *         type: 'group', // 必需
 *         submenu: [...] // 必需
 *     },
 * ];
 * // 实例化菜单
 * let CM = new ContentMenu();
 * // 为目标元素添加右键菜单
 * let target = document.getElementById('ContentMenu');
 * CM.register(target, menuTem);
 */
class ContentMenu {
    constructor(target, menu) {
        if (target && menu) {
            this.register(target, menu);
        }
    }
    createMenu(menu, box) {
        // 构建生成菜单html函数
        let createMenuitem = (menu, outer) => {
            let ul = document.createElement('ul');
            outer.appendChild(ul);
            for (let m = 0; m < menu.length; m++) {
                switch (menu[m].type) {
                    case 'separator': // 分割线
                        let hr = document.createElement('hr');
                        ul.appendChild(hr);
                        break;
                    default: // 非分割线
                        let li = document.createElement('li');
                        ul.appendChild(li);

                        let item = document.createElement('div');
                        li.appendChild(item);

                        let i = document.createElement('i');
                        item.appendChild(i);
                        i.setAttribute('style', `background-image: url(${menu[m].icon || ''});`);

                        let a = document.createElement('a');
                        item.appendChild(a);
                        a.innerText = menu[m].label;
                        switch (menu[m].type) {
                            case 'item': // 菜单项
                                item.setAttribute('data-shortcut', menu[m].shortcut || '');
                                // 给菜单项添加任务
                                item.onclick = e => {
                                    typeof menu[m].method === 'function' ? menu[m].method(e) : console.log('您点击了菜单项，但该菜单项无调用方法', e);
                                }
                                break;
                            case 'group': // 菜单组
                                item.setAttribute('data-group', '');
                                for (let s = 0; s < menu[m].submenu.length; s++) {
                                    createMenuitem(menu[m].submenu, li);
                                }
                                break;
                            default:
                                break;
                        }
                        break;
                }
            }
        }
        if (box === undefined) {
            // 执行元素创建并加入 body 中
            let body = document.body;
            box = document.getElementById('content_menu') || document.createElement('div');
            box.innerHTML = '';
            box.id = 'content_menu';
            body.appendChild(box);
        }
        box.setAttribute('class', 'menu_box');
        createMenuitem(menu, box);
        return box;
    }
    register(target, menu) {
        target.oncontextmenu = e => {
            // 阻止默认事件
            e.preventDefault();
            let menuBox = this.createMenu(menu);
            // 确定菜单位置
            let body = document.body;
            let cW = body.clientWidth;
            let cH = body.clientHeight;
            let cX = e.clientX;
            let cY = e.clientY;
            let bH = menuBox.clientHeight;
            let bW = menuBox.clientWidth;
            // 横向位置
            let left, top;
            if (cW - cX < bW) {
                left = cX - bW;
                menuBox.setAttribute('data-pos', 'left');
            } else if (cW - cX < 2 * bW) {
                left = cX;
                menuBox.setAttribute('data-pos', 'left');
            } else {
                menuBox.setAttribute('data-pos', '');
                left = cX;
            }
            // 纵向位置
            if (cH - cY < bH) {
                top = cY - bH
            } else {
                top = cY;
            }
            // 赋予定位
            menuBox.setAttribute('style', `top: ${top}px;left: ${left}px;`);
        }

        function removeMenu() {
            let menuBox = document.getElementById('content_menu');
            if (menuBox) {
                menuBox.remove();
            }
        }
        // 添加点击后移除元素 的一次性点击事件
        document.addEventListener('click', removeMenu);
    }
}