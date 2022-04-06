/*
let span = document.getElementById('test');
console.log(span);
span.removeAttribute('unfold');
span.setAttribute('fold', '');
console.log(span);
*/

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


/**
 * tree_view 目录树操作事件
 */
class TreeView {
    constructor(box, tree, dbClickMethod) {
        this.box = box;
        this.tree = tree;
        this.dbClickMethod = dbClickMethod ? dbClickMethod : console.log;;
        this.createHTML(this.tree, this.box, this.dbClickMethod);
    }
    createHTML(tree, box, dbClickMethod) {
        //清空内容
        box.innerHTML = '';

        //递归 生成元素标签
        let createItem = function(info, outer) {
            //创建元素
            let li = document.createElement('li');
            outer.appendChild(li);
            li.innerHTML = '';
            let bullet = document.createElement('span');
            li.appendChild(bullet);
            bullet.setAttribute(info.state, '');

            let icon = document.createElement('span');
            li.appendChild(icon);
            icon.setAttribute('style', `background-image: url(${info.icon});`)

            let name = document.createElement('table');
            li.appendChild(name);
            name.innerText = info.name;

            //创建鼠标事件
            let timeOut = null;
            let dbclick = false;
            li.addEventListener('click', (e) => {
                //屏蔽除该事件外的所有事件，包括外层元素的所有事件，双击等事件
                e.stopPropagation();

                clearTimeout(timeOut);
                timeOut = setTimeout(() => {
                    dbclick = false;
                    if (bullet.hasAttribute('fold')) {
                        bullet.setAttribute('unfold', '');
                        bullet.removeAttribute('fold', '');
                    } else if (bullet.hasAttribute('unfold')) {
                        bullet.setAttribute('fold', '');
                        bullet.removeAttribute('unfold', '');
                    } else {
                        bullet.removeAttribute('fold', '');
                        bullet.removeAttribute('unfold', '');
                    };
                    let ul = e.path[0].getElementsByTagName('ul')[0];
                    console.log('单击');
                }, 300);

                if (dbclick) {
                    //清除单击事件
                    clearTimeout(timeOut);
                    //双击事件
                    dbClickMethod(e.path[0]);

                    dbclick = false;
                }
                dbclick = true;
                setTimeout(() => {
                    dbclick = false;
                }, 300);
            });

            //悬浮样式
            li.addEventListener('mouseover', (e) => {
                for (var i = e.path.length - 1; i >= 0; i--) {
                    if (e.path[i].tagName === 'TABLE') {
                        e.path[i].setAttribute('style', 'background-color: #3c3c3c;')
                        e.path[i].addEventListener('mouseout', (e) => {
                            e.path[0].removeAttribute('style');
                        });
                        break
                    }
                }
            });







            //递归 子文件夹
            if (info.state != 'empty') {
                let dir = document.createElement('ul');
                li.appendChild(dir);
                for (let i = 0; i < info.directory.length; i++) {
                    createItem(info.directory[i], dir);
                }
            }
        }



        createItem(this.tree, this.box);
        console.log(this.box);
    }

}

let tree = {
    name: '这是根目录',
    icon: './res/default_folder_opened.svg',
    state: 'unfold',
    directory: [{
        name: '这是一级目录',
        icon: './res/default_folder_opened.svg',
        state: 'unfold',
        directory: [{
            name: '这是二级目录',
            icon: './res/default_folder_opened.svg',
            state: 'unfold',
            directory: [{
                name: '这是三级目录',
                icon: './res/default_folder_opened.svg',
                state: 'empty',
                directory: []
            }, ]
        }, ]
    }, {
        name: '这是一级目录',
        icon: './res/default_folder_opened.svg',
        state: 'unfold',
        directory: [{
            name: '这是二级目录',
            icon: './res/default_folder_opened.svg',
            state: 'unfold',
            directory: [{
                name: '这是三级目录',
                icon: './res/default_folder_opened.svg',
                state: 'empty',
                directory: []
            }, {
                name: '这是三级目录',
                icon: './res/default_folder_opened.svg',
                state: 'empty',
                directory: []
            }, ]
        }, {
            name: '这是二级目录',
            icon: './res/default_folder_opened.svg',
            state: 'empty',
            directory: []
        }, {
            name: '这是二级目录',
            icon: './res/default_folder_opened.svg',
            state: 'empty',
            directory: []
        }, {
            name: '这是二级目录',
            icon: './res/default_folder_opened.svg',
            state: 'unfold',
            directory: [{
                name: '这是三级目录',
                icon: './res/default_folder_opened.svg',
                state: 'empty',
                directory: []
            }, {
                name: '这是三级目录',
                icon: './res/default_folder_opened.svg',
                state: 'empty',
                directory: []
            }, {
                name: '这是三级目录',
                icon: './res/default_folder_opened.svg',
                state: 'empty',
                directory: []
            }, ],
        }, ]
    }, {
        name: '这是一级目录',
        icon: './res/default_folder_opened.svg',
        state: 'unfold',
        directory: [{
            name: '这是二级目录',
            icon: './res/default_folder_opened.svg',
            state: 'empty',
            directory: []
        }, {
            name: '这是二级目录',
            icon: './res/default_folder_opened.svg',
            state: 'empty',
            directory: []
        }, {
            name: '这是二级目录',
            icon: './res/default_folder_opened.svg',
            state: 'empty',
            directory: []
        }, ]
    }]
}






let eTVBox = document.getElementsByClassName('tree_view')[0];
//let TV = new TreeView(eTVBox, testTree);

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







/*


let seaTimeOut = null;
seaBut.addEventListener('mouseover', (e) => {
    clearTimeout(seaTimeOut);
    seaBox.setAttribute('style', `min-width: 200px; width: 70%; padding: 0 1em;`);
});
seaBut.addEventListener('mouseout', (e) => {
    seaTimeOut = setTimeout(() => {
        seaBox.setAttribute('style', `min-width: 0px; width: 0; padding: 0;`);
    }, 500)
});
seaBox.addEventListener('mouseover', (e) => {
    clearTimeout(seaTimeOut);
});
seaBox.addEventListener('mouseout', (e) => {
    if (seaBox === document.activeElement) {} else {
        seaTimeOut = setTimeout(() => {
            seaBox.setAttribute('style', `min-width: 0px; width: 0; padding: 0;`);
        }, 250)
    }
});







seaBut.addEventListener('click', (e) => {
    console.log(seaBox.value);
});

*/

/**
 *  else {
        seaBox.blur();
        seaBox.focus();
        seaBox.setAttribute('style', `min-width: 200px; width: 70%;`);
    }
 */