//



class QuickMethod {
    constructor() {
        window.onload = () => {

            this.test()
        }
    }

    init() {

    }

    /**
     * 判断元素是否为 dom 元素
     */
    isHTMLElement(obj) {
        if (obj.nodeType) {
            return obj.nodeType == 1;
        }
    }

    /**
     * 元素抖动效果
     * 提醒用户完成当前操作
     */
    shakeElement(element) {
        if (this.isHTMLElement(element)) {
            let e = element;
            let v = 1,
                n = 10;
            let style = e.style;
            let val = setInterval(() => {
                if (n > 0) {
                    e.setAttribute('style', `position: relative; top: ${v}px; left: ${v}px; opacity: ${0.7 + (0.4*v)/Math.abs(2*v)};`)
                    v *= -1, n--;
                } else {
                    e.setAttribute('style', '');
                    clearInterval(val);
                }
            }, 60);
        }
    }

    /**
     * 创建窗口遮盖层
     * 禁止用户操作
     */
    createCover() {
        let cover;
        if (document.getElementById("QM_cover")) {
            cover = document.getElementById("QM_cover");
            let box = cover.children[0];
            this.shakeElement(box)
            cover = false;
        } else {
            cover = document.createElement('div');
            cover.id = 'QM_cover';
            let body = document.body;
            body.appendChild(cover);
            body.classList.add('QM_cover_body');
        }
        cover.addEventListener('click', e => {
            if (e.path[0].id === 'QM_cover') {
                this.shakeElement(cover.children[0]);
            }
        })
        return cover;
    }

    /**
     * 移除窗口遮盖层
     * 恢复用户操作
     */
    removeCover() {
        let cover = document.getElementById('QM_cover');
        cover.remove();
        document.body.classList.remove('QM_cover_body');
    }

    /**
     * 动态引入 js 文件
     */
    loadScript(src, callback) {
        let script = document.createElement('script');
        script.type = 'text/javascript';
        script.onload = () => {
            callback();
            script.remove();
            console.log('若引入的js无效，请回到此处删除 "script.remove();"');
        };
        script.src = src;
        document.getElementsByTagName('head')[0].appendChild(script);
        return script;
    }

    /**
     * 动态引入 css 文件
     */
    loadStyle(href, callback) {
        let link = document.createElement("link");
        link.rel = "stylesheet";
        link.type = "text/css";
        link.href = href;
        document.getElementsByTagName('head')[0].appendChild(link);
        link.onload = () => {
            callback();
        };
        return link
    }

    /**
     * 弹出用户警告框
     * 强制告知用户一些内容
     */
    alert(text) {
        let cover = this.createCover();
        if (cover) {
            let w = document.createElement('div');
            w.className = 'QM_alert_warp'
            cover.appendChild(w);
            w.innerHTML =
                `<strong>此页面显示：</strong><p>${text}</p>`
            let b = document.createElement('input');
            b.type = 'button';
            b.value = '确定';
            w.appendChild(b)
            b.addEventListener('click', () => {
                this.removeCover()
            });
        }
    }

    /**
     * 弹出用户输入框
     * 接收用户输入，受 js 机制决定，暂无法设置为同步函数
     */
    input(msg, defaultText, callback) {
        let cover = this.createCover();
        if (cover) {
            let a = arguments;
            let m = typeof(a[0]) === 'string' && a[0] ? a[0] : '请输入一些内容：',
                d = typeof(a[1]) === 'string' ? a[1] : '',
                c =
                typeof(a[0]) === 'function' ? a[0] :
                typeof(a[1]) === 'function' ? a[1] :
                typeof(a[2]) === 'function' ? a[2] :
                () => {
                    console.log('Callback is not a function');
                    console.log([typeof(msg), typeof(defaultText), typeof(callback)]);
                };
            let w = document.createElement('div');
            w.className = 'QM_input_warp';
            cover.appendChild(w);
            let l = document.createElement('label');
            w.appendChild(l);
            l.innerText = m;
            let i = document.createElement('input');
            w.appendChild(i);
            i.type = 'text';
            i.value = d;
            let b = document.createElement('input');
            w.appendChild(b);
            b.type = 'button';
            b.value = '确定';
            b.addEventListener('click', () => {
                let res = i.value === '' ? false : i.value;
                c(i.value)
                this.removeCover()
            })
        }
    }

    /**
     * 弹出 判断/选择/提示 弹窗
     * 强制用户进行决策
     */

    confirm(text, callback) {
        let cover = this.createCover();
        if (cover) {
            let a = arguments;
            let t = typeof(a[0]) === 'string' ? a[0] : '';
            let c = typeof(a[1]) === 'function' ? a[1] : typeof(a[0]) === 'function' ? a[0] : () => null;

            let w = document.createElement('div');
            w.className = 'QM_confirm_warp'
            cover.appendChild(w);
            w.innerHTML =
                `<strong>此页面显示：</strong><p>${t}</p>`
            let bt = document.createElement('input');
            bt.type = 'button', bt.value = '确定', w.appendChild(bt);
            bt.addEventListener('click', () => {
                c(true), this.removeCover();
            });
            let bf = document.createElement('input');
            bf.type = 'button', bf.value = '取消', w.appendChild(bf)
            bf.addEventListener('click', () => {
                c(false), this.removeCover();
            });
        }
    }

    /**
     * 弹出提示框
     * 提示用户一些信息，不久后自动消失
     */
    tips(text) {
        let t = text === undefined || text === null ? '程序执行错误，提示信息为空' : text.toString();
        let cover = document.body;
        let w = document.createElement('div');
        w.className = 'QM_tips_warp'; /* QM_center_down_box*/
        cover.appendChild(w);
        let p = document.createElement('p');
        w.appendChild(p);
        p.innerText = t;
        //以 1s 5个汉字或10个字母为准 计算所需时间
        let u = 10;
        let ms = t.replace(/[^\x00-\xff]/g, "01").length * 1000 / u;
        ms = ms < 3000 ? 3000 : ms;
        setTimeout(() => {
            w.setAttribute('style', `transition: ${ms/2}ms;opacity: 0;`)
            setTimeout(() => { w.remove() }, ms / 2 + 200);
        }, ms);
    }

    form() {
        let request = {

        }
    }

    /*
    sleep(millisecond) {
        alert('难以优美地实现 sleep ')
    }
    */
    sleep(millisecon) {
            return new Promise((resolve) => setTimeout(resolve, millisecon));
        }
        /**
         * 调用 sleep 的方法
         * 
         * sleep(500).then(() => {
         *  // 这里写sleep之后需要去做的事情
         * })
         */

    test() {
        //this.createCover();
        //this.removeCover();
        //this.shakeElement(document.body);
        /*
        this.loadScript('js/loadScript.js', () => {
            console.log('文件 "js/loadScript.js" 加载成功');
        });
        */
        /*
         this.loadStyle('css/loadStyle.css', () => {
             console.log('文件 "css/loadStyle.css" 加载成功');
         });
         */
        //this.input('请输入一段内容', console.log);
        //this.alert(`this.loadStyle.css" 加载成'`);
        //this.confirm('提示需要判断的内容', (r) => { console.log(r, 'callback') });
        //this.tips(this);


        //this.sleep();
    }






}

var Q = new QuickMethod();



















//description