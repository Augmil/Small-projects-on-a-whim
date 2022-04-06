/**
 * @function FileView
 * @version 2.0.0
 * @description 用来生成目录树 例如文件夹目录
 * @author Augmil 2022/03/22
 * @example
 * 
 */
class FileView {
    constructor(options) {
        let o = options || {};
        this.openList = [];
        this.openSingle = o.openSingle || true; // 默认不可打开多个
        this.defaultFold = o.defaultFold || true; // 默认折叠文件夹
        this.openMethod = o.openMethod || console.log; //默认打开方法
    }
    getIcon(name, type) {
        let icon;
        if (type === 'file') {
            icon = 'style/img/default_file.svg';
        } else {
            icon = 'style/img/default_folder.svg';
        }
        return icon
        console.log(name, icon);
    }
    formatDirectory(directory) {
        let format = (sup) => {
            let r = [];
            for (let s = 0; s < sup.length; s++) {
                // 添加固有属性
                r[s] = ((o) => {
                    let r = {};
                    r.name = o.name;
                    r.type = o.type;
                    r.icon = o.icon || this.getIcon(r.name, r.type);
                    r.open = false;
                    r.fold = this.defaultFold;
                    return r;
                })(sup[s]);
                // 递归子文件夹
                if (sup[s].type = 'folder') {
                    if (sup[s].sub) {
                        r[s].sub = format(sup[s].sub);
                    } else {
                        r[s].sub = [];
                    }
                }
            }
            return r;
        }
        return format(directory);
    }
    createViewSync(directory) {
        let dir = directory || this.directory;
        // 生成视图
        let view = document.createElement('div');
        view.className = 'file_view'
        this.view = view;
        // 定义递归函数
        let create = (sub, outer) => {
                let ul = document.createElement('ul');
                outer.appendChild(ul);
                for (let s = 0; s < sub.length; s++) {
                    // 创建元素
                    let li = document.createElement('li');
                    ul.appendChild(li);
                    let item = document.createElement('div');
                    li.appendChild(item);
                    let i = document.createElement('i');
                    item.appendChild(i);
                    let a = document.createElement('a');
                    item.appendChild(a);
                    // 设置元素基本属性
                    a.innerText = sub[s].name;
                    i.setAttribute('style', sub[s].icon ? `background-image: url(${sub[s].icon});` : '');
                    item.dataset.type = sub[s].type;
                    item.dataset.open = sub[s].open;
                    if (sub[s].type === 'file') {
                        // 文件 单击事件
                        item.addEventListener('click', e => {
                            if (item.dataset.open == 'false') {
                                this.open(sub[s], li);
                            }
                        })
                    } else {
                        // 文件夹 单双击事件
                        let t = true;
                        item.addEventListener('click', e => {
                            setTimeout(() => {
                                t = true;
                            }, 500);
                            if (t) {
                                t = false;
                                if (item.dataset.fold === 'true') {
                                    item.dataset.fold = 'false';
                                } else if (item.dataset.fold === 'false') {
                                    item.dataset.fold = 'true'
                                }
                            }
                        });
                        item.addEventListener('dblclick', e => {
                            if (item.dataset.open == 'false') {
                                item.dataset.fold = 'false';
                                this.open(sub[s], li);
                            }
                        });
                        // 设置属性
                        item.dataset.fold = sub[s].fold;
                        if (sub[s].sub) {
                            // 递归子文件
                            create(sub[s].sub, li);
                        }
                    }
                }
            }
            // 执行递归
        create(dir, view);
        return view;
    }
    open(info, li) {
        // 生成参数
        let item = li.children[0];
        item.dataset.open = 'true';
        let e = info;
        e.element = li;
        if (this.openList.indexOf(e) === -1) {
            this.openList.push(e);
        }
        // 是否只打开单个
        if (this.openSingle) {
            for (let o = 0; o < this.openList.length; o++) {
                if (this.openList[o].element === e.element) {} else {
                    let item = this.openList[o].element.children[0]
                    item.dataset.open = 'false';
                    this.openList.splice(o, 1);
                }
            }
        }
        this.openMethod(e);
    }
    close(e) {
        console.log('关闭');
        let i = this.openList.indexOf(e);
        let item = this.openList[i].element.children[0];
        item.dataset.open = 'false';
        this.openList.splice(i, 1);
        return e;
    }
    closeAll() {
        while (this.openList.length > 0) {
            let item = this.openList[0].element.children[0];
            item.dataset.open = 'false';
            this.openList.splice(0, 1);
        }
        return true
    }
}