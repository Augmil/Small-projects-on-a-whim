/**
 * @function TreeView
 * @version 2.0.0
 * @description 用来生成目录树 例如文件夹目录
 * @param box {Element} 必需。放置目录树的 HTML 元素
 * @param tree {Object} 必需。需要显示的目录树对象
 * @param dbClickMethod=console.log {Method} 可选。双击项目执行的回调函数，默认将该放置项目名称的 div 元素传入。
 * @author Augmil 2022/03/22
 * @example
 * let tree = {
 *     name: '这是根目录',
 *     icon: './res/default_folder_opened.svg',
 *     state: 'unfold',// unopen , foldopen , default , nothing
 *     subfolder: [{
 *         name: '一级目录',
 *         icon: './res/default_folder_opened.svg',
 *         state: 'unfold',
 *         subfolder: [
 *             ...
 *             ]
 *         },
 *         ...
 * ],}
 * 
 * let eTVBox = document.getElementsByClassName('tree_view')[0];
 * showTreeView(tree, eTVBox, null);
 * 
 */
function showTreeView(tree, box, dbClickMethod = console.log) {
    //清空内容
    box.innerHTML = '';

    //递归 生成元素标签
    let createItem = function(info, outer) {
        //创建元素
        let li = document.createElement('li');
        outer.appendChild(li);
        li.innerHTML = '';
        let item = document.createElement('div');
        li.appendChild(item);
        item.setAttribute(info.state, '');

        let bullet = document.createElement('i');
        item.appendChild(bullet);

        let icon = document.createElement('i');
        item.appendChild(icon);
        icon.setAttribute('style', `background-image: url(${info.icon});`)

        let name = document.createElement('a');
        item.appendChild(name);
        name.innerText = info.name;

        //鼠标事件
        //折叠状态切换函数
        function toggleFold() {
            if (item.hasAttribute('fold')) {
                item.setAttribute('unfold', '');
                item.removeAttribute('fold', '');
            } else if (item.hasAttribute('unfold')) {
                item.setAttribute('fold', '');
                item.removeAttribute('unfold', '');
            }
        }
        var timeOut = null;
        item.addEventListener('click', (e) => {
            clearTimeout(timeOut);
            timeOut = setTimeout(function() {
                //执行单击事件内容
                toggleFold();
            }, 500);

        });
        item.addEventListener('dblclick', (e) => {
            clearTimeout(timeOut);
            dbClickMethod(item);
            //双击取消折叠
            item.setAttribute('unfold', '');
            item.removeAttribute('fold', '');
        });
        //因为区分单双击事件导致单击事件延迟执行，会出现卡顿现象，添加点击项目符事件屏蔽延时
        bullet.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleFold();
        });

        //递归 子文件夹
        if (info.state != 'empty') {
            let dir = document.createElement('ul');
            li.appendChild(dir);
            for (let i = 0; i < info.subfolder.length; i++) {
                createItem(info.subfolder[i], dir);
            }
        }
    }


    createItem(tree, box);
}