class Desktop {
    constructor() {
        //this.window = document.getElementById('window');
        this.applicationLibrary = InitialLibrary;
        this.program = [];
        this.settings = {
            show: {
                iconSize: 'medium', //'big' 'medium' 'small'
                autoFill: true, // true,false
                alignGrid: true, // true,false
                sortingMode: 'name', //'name' 'date'
                descendingOrder: true, // true,false
                showDirection: 'lr', //'lr' 'tb' 'rl'
            }

        }
        this.start();
    }
    modifySortingMode(show) {
        if (show === undefined || typeof(show) != 'object') {
            return;
        }
        let clsaaList = ['window'];
        //图标大小
        clsaaList[1] = (() => {
            if (show.iconSize === undefined || typeof(show.iconSize) != 'string') {
                return 'icon_size_' + this.show.iconSize;
            } else {
                return 'icon_size_' + show.iconSize;
            }
        })();
        //是否自动填充
        clsaaList[2] = (() => {
            if (show.autoFill === undefined) {
                return 'auto_fill_' + this.show.autoFill ? 'true' : 'false';
            } else {
                return 'auto_fill_' +
                    (show.autoFill === 'false' || show.autoFill === false ? 'false' :
                        show.autoFill === 'true' || show.autoFill === true ? 'true' :
                        this.show.autoFill ? 'true' : 'false');
            }
        })();
        //显示方向
        clsaaList[3] = (() => {
            if (show.showDirection === undefined || typeof(show.showDirection) != 'string') {
                return 'writing_mode_' + this.show.showDirection;
            } else {
                return 'writing_mode_' + show.showDirection;
            }
        })();

        this.window.setAttribute('class', clsaaList.join(' '));
        console.log(clsaaList);
        return clsaaList;
    }
    monitorMenu() {
        let win = this.window;
        /**
         * 菜单
         */
        let menu = document.getElementById("menu") === null ? (() => {
            let menu = document.createElement('div');
            this.window.appendChild(menu);
            menu.id = 'menu';
            return menu;
        })() : document.getElementById("menu");

        win.oncontextmenu = function(e) {
            var e = e || window.event;
            //鼠标点的坐标
            var oX = e.clientX;
            var oY = e.clientY;
            //菜单出现后的位置
            menu.style.display = "block";
            menu.style.left = oX + "px";
            menu.style.top = oY + "px";
            console.log(menu, e);
            //阻止浏览器默认事件
            return false; //一般点击右键会出现浏览器默认的右键菜单，写了这句代码就可以阻止该默认事件。
        }
        win.onclick = function(e) {
                var e = e || window.event;
                menu.style.display = "none"
            }
            /**
             * 框选
             */


        document.onmousedown = function(e) {
            var posx = e.clientX;
            var posy = e.clientY;
            var div = document.createElement("div");
            div.className = "cover_box";
            div.style.left = e.clientX + "px";
            div.style.top = e.clientY + "px";
            document.body.appendChild(div);
            document.onmousemove = function(ev) {
                div.style.left = Math.min(ev.clientX, posx) + "px";
                div.style.top = Math.min(ev.clientY, posy) + "px";
                div.style.width = Math.abs(posx - ev.clientX) + "px";
                div.style.height = Math.abs(posy - ev.clientY) + "px";
                document.onmouseup = function() {
                    console.log('x', ev.clientX, 'y', ev.clientY);
                    div.parentNode.removeChild(div);
                    document.onmousemove = null;
                    document.onmouseup = null;
                }
            }
        }




    }
    showProgram() {
        let eUl = document.createElement('ul');
        eUl.id = 'window';
        this.window = eUl;
        document.getElementsByTagName('body')[0].appendChild(eUl);
        this.window.innerHTML = '';
        this.modifySortingMode(this.settings.show);
        this.program.forEach((v, i, a) => {
            this.window.appendChild(this.program[i].element);
        });
    }
    createProgramElement(info) {
        info = info === undefined ? {
            icon: 'ProgramDefaultIcon.png'
        } : info;

        let oP = {};
        for (let key in info) {
            oP[key] = info[key];
        }

        let eLi = document.createElement('li');
        eLi.setAttribute('class', 'program_warp');
        eLi.draggable = true;

        let eA = document.createElement('a');
        eA.href = oP.link;
        eA.target = '_blank';
        eLi.appendChild(eA);

        let eSI = document.createElement('span');
        eSI.setAttribute('class', 'program_icon');
        eSI.style = 'background-image: url(' + oP.icon + ');';
        eA.appendChild(eSI);

        let eSN = document.createElement('span');
        eSN.setAttribute('class', 'program_name');
        eSN.innerText = oP.name;
        eA.appendChild(eSN);
        oP.element = eLi;

        this.program.push(oP)
        return oP;
    }

    start() {
        console.log(this);
        let b = this.applicationLibrary;
        for (let i = 0; i < b.length; i++) {
            //console.log(b[i])
            this.createProgramElement(b[i]);
        }
        this.showProgram();
        //this.monitorMenu();














    }













}




var desk = new Desktop();





























//