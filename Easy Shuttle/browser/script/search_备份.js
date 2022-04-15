
function EaseShuttle(keywords) {
    //文本类型库
    this.typeBase = {
        specialStr:
        {
            type: 'specialStr',
            name: '特殊字符串',
            judge: (str) => {
                return true;
            },
            description: '将输入的内容按照预定规则检查，判断是否属于预定的特殊内容。智能识别出网页链接、文件路径、各类账号......',
            is: [
                {
                    index: 0, name: 'isUrl', type: 'specialStr', value: '链接',
                    judge: (str) => {//判断是否存在链接
                        var reg = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\*\+,;=.]+$/;
                        console.log(reg.test(str), str)
                        return reg.test(str);
                    },
                    out: (item, str) => {//提取出存在的链接并显示出来
                        console.log('输入的文本可能不止一个链接哦，后续请完善！！！')
                        //计算参数值
                        let style = 'background-image: url(./resources/icon.png);',
                            value = item.value,
                            link = str,
                            actArr = [
                                {
                                    value: '打开',
                                    monitor: (e, link) => {
                                        e.addEventListener("click", (e) => {
                                            console.log('在浏览器环境中可以使用，配置到Electron时可能需要调整，若报错请重新编写。')
                                            link = /^http/.test(link) ? link : 'http://' + link;
                                            window.open(link);
                                        });
                                        return link;
                                    }
                                },
                                {
                                    value: '复制',
                                    monitor: (e, link) => {
                                        e.addEventListener("click", (e) => {//复制至剪贴板
                                            let content = link,
                                                aux = document.createElement("input");
                                            aux.setAttribute("value", content);
                                            document.body.appendChild(aux);
                                            aux.select();
                                            document.execCommand("copy");//vscode提示已弃用，但貌似还能用
                                            document.body.removeChild(aux);
                                        });
                                        return link;
                                    }
                                }
                            ];
                        this.outStyle_2(actArr, style, value, link)
                        //return eBox;
                    },
                },
                {
                    index: 1, name: 'isEmail', type: 'specialStr', value: '邮箱',
                    judge: (str) => {
                        var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
                        return reg.test(str);
                    },
                    out: (item, str) => {
                        return true;
                    },
                },
                {
                    index: 2, name: 'isPhoneNumber', type: 'specialStr', value: '手机或电话号码',
                    judge: (str) => {
                        var reg = /^((\d{3}-\d{8}|\d{4}-\d{7,8})|(1[3|5|7|8][0-9]{9}))$/;
                        return reg.test(str);
                    },
                    out: (str) => {
                    },
                },
                {
                    index: 3, name: 'isFilePath', type: 'specialStr', value: '文件路径',
                    judge: (str) => {
                        var reg = /^(file:\/\/\/\/)?[a-zA-Z]:((\\)[\S].+\s?)*\\$/;
                        //      /^(file:\/\/\/\/)?[a-zA-Z]:((\\|\/)(^[`~!@#$%^&-+=\\?:\"|,/;'\\[\\]·~！@#￥%……&*（）+=\\{\\}\\|《》？：“”【】、；‘'，。\\、\\-])+)*(\\|\/)?$/.test('C:\Easy')
                        console.log("请完善此处");
                        return reg.test(str);

                    },
                    out: (str) => {
                    },
                },
                {
                    index: 4, name: 'isIdCard', type: 'specialStr', value: '身份证号',
                    judge: (str) => {
                        var reg = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
                        return reg.test(str);

                    },
                    out: (str) => {
                    },
                },
                {
                    index: 5, name: 'isGATIdCard', type: 'specialStr', value: '港、澳、台身份证号',
                    judge: (str) => {
                        var reg1 = /^[A-Z]{1,2}[0-9]{6}[\(|\（]?[0-9A-Z][\)|\）]?$/;//香港格式1 (香港身份证号码结构：XYabcdef(z))
                        var reg2 = /^[A-Z][0-9]{8,12}$/;//香港格式2 (H60152555)
                        var reg3 = /^[1|5|7][0-9]{6}[\(|\（]?[0-9A-Z][\)|\）]?$/;//澳门,8位数,不包含出生年月 格式为 xxxxxxx(x) 注:x全为数字,无英文字母 首位数只有1、5、7字开头的
                        var reg4 = /^[a-zA-Z][0-9]{9}$/;//台湾:10位字母和数字
                        if (reg1.test(str) || reg2.test(str) || reg3.test(str) || reg4.test(str)) {
                            return true;
                        }

                    },
                    out: (str) => {
                    },
                },
                {
                    index: 6, name: 'isQQ', type: 'specialStr', value: 'QQ账号',
                    judge: (str) => {

                        var reg = /^[1-9][0-9]{4,10}$/;
                        return reg.test(str);
                    },
                    out: (str) => {
                    },
                },
                {
                    index: 7, name: 'isWeChat', type: 'specialStr', value: '微信账号',
                    judge: (str) => {
                        var reg = /^[a-zA-Z]([-_a-zA-Z0-9]{5,19})+$/;
                        return reg.test(str);

                    },
                    out: (str) => {
                    },
                },
                {
                    index: 8, name: 'isLicensePlate', type: 'specialStr', value: '车牌号',
                    judge: (str) => {
                        var reg = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/;
                        return reg.test(str);

                    },
                    out: (str) => {
                    },
                },
                {
                    index: 9, name: 'isTax', type: 'specialStr', value: '企业税号',
                    judge: (str) => {
                        var reg = /^[A-Z0-9]{15}$|^[A-Z0-9]{17}$|^[A-Z0-9]{18}$|^[A-Z0-9]{20}$/;
                        return reg.test(str);

                    },
                    out: (str) => {
                    },
                },
                {
                    index: 9, name: 'isOther', type: 'specialStr', value: '全网搜索',
                    judge: (str) => {
                        var reg = /^[A-Z0-9]{15}$|^[A-Z0-9]{17}$|^[A-Z0-9]{18}$|^[A-Z0-9]{20}$/;
                        return reg.test(str);
                    },
                    out: (str) => {
                    },
                },
            ]
        },
        command:
        {
            type: 'command',
            name: '预定命令',
            identifier: '>>',
            judge: (str) => {
                let reg = /^(>>)\S{1,}(\s(\S+)+)?$/;//标识符(如>>)+命令启动器(如=)+空格+参数一+参数二+... (例如>>= 25+6*2/5) //自动计算结果
                return reg.test(str);
            },
            description: '通过输入命令标识符,快速启动预先设定的命令操作',
            is: ['详见 ./data/command.js']
        },
        understand:
        {
            type: 'understand',
            name: '智能理解',
            judge: (str) => {
                return true;
            },
            description: '通过输入命令标识符,快速启动预先设定的命令操作',
            is: ['详见 ./data/understand.js']
        },
        network:
        {
            type: 'network',
            name: '全网搜索',
            judge: (str) => {
                return true;
            },
            description: '通过输入命令标识符,快速启动预先设定的命令操作',
            is: [
                {
                    name: '百度搜索联想词', type: 'network', value: '输入关键词，调用百度搜索api，返回推荐搜索联想词',
                    judge: (str) => {
                        return true;
                    },
                    out: (item, str) => {
                        //创建百度联想词回调函数，以及数据存储变量  
                        //不要使用 let/var/const,需要提升变量作用域至全局！！！！！！
                        //当然也可以直接在全局作用域中创建，但是那样后期将会忘记该函数是干嘛的。
                        saveData = (data) => {
                            baiduSugData = data;
                            return data;
                        }, baiduSugData = null;
                        let eScript = document.createElement('script');
                        eScript.src = 'https://sp0.baidu.com/5a1Fazu8AA54nxGko9WTAnF6hhy/su?wd=' + str + '&cb=saveData';
                        document.body.appendChild(eScript);
                        //等待获得数据
                        let n = 0;
                        var int = self.setInterval(() => {
                            if (baiduSugData != null) {
                                let maxNumber = 5;//最大推荐个数
                                let sugData = baiduSugData.s;
                                let eSeaBox = document.getElementById('seaBox');
                                if (sugData.length === 0 && eSeaBox.innerHTML === '') {//无搜索推荐，也无匹配项时执行
                                    this.outStyle_3([], '', '暂无相关匹配项，请重新输入......');
                                } else {
                                    for (let i = 0; i < maxNumber && i < sugData.length; i++) {
                                        let value = item.value,
                                            text = sugData[i],
                                            actArr = [
                                                {
                                                    value: item.value,
                                                    monitor: (e, text) => {
                                                        e.addEventListener("click", (e) => {
                                                            console.log('该百度搜索api调用方式过于粗俗，后期请优化。')
                                                            window.open('https://www.baidu.com/s?ie=utf-8&f=3&rsv_bp=1&rsv_idx=1&tn=baidu&wd=' + text +
                                                                '&fenlei=256&rsv_pq=d27645a500007718&rsv_t=f76as6xI31685qYGnWceEdrHytTmx2akpmcO%2Fm3aOtT8xUkoqxlO5m2byJc' +
                                                                '&rqlang=cn&rsv_enter=1&rsv_dl=ts_0&rsv_sug3=4&rsv_sug1=4&rsv_sug7=101&rsv_sug2=1&rsv_btype=i' +
                                                                '&prefixsug=kai&rsp=0&inputT=4092&rsv_sug4=8393')
                                                        });
                                                        return text;
                                                    }
                                                }
                                            ];
                                        this.outStyle_3(actArr, value, text);
                                    }

                                }
                                int = window.clearInterval(int);
                                baiduSugData = null;
                            } else if (n >= 9) {
                                int = window.clearInterval(int);
                                baiduSugData = null;
                                console.log('数据获取失败')
                            }
                            n++;
                        }, 100);
                        return true;
                    },
                },
            ]
        },
    }
    //显示样式库
    this.outStyle_2 = (actArr, style, value, link) => {
        //.appendChild() .createElement() .setAttribute('className', 'value');
        //创建dom节点
        let eBox = document.getElementById('down_warp_box');
        let eWarp = document.createElement('div'),
            eIcon = document.createElement('span'),

            eInfo = document.createElement('div'),
            eValue = document.createElement('strong'),
            eTit = document.createElement('span'),

            eAct = document.createElement('div');

        //添加class属性
        eWarp.setAttribute('class', 'drop_item_s2');
        eIcon.setAttribute('class', 'item_s2_icon');
        eInfo.setAttribute('class', 'item_s2_info');
        eAct.setAttribute('class', 'item_s2_action');
        //连接各dom节点
        eBox.appendChild(eWarp);
        eWarp.appendChild(eIcon);
        eWarp.appendChild(eInfo);
        eWarp.appendChild(eAct);
        eInfo.appendChild(eValue);
        eInfo.appendChild(eTit);
        //向节点中加入内容
        eIcon.setAttribute('style', style);
        eValue.innerText = value;
        eTit.setAttribute('title', link);

        //配置按钮
        for (let i = 0; i < actArr.length; i++) {
            let eAct_i = document.createElement('strong');
            eAct.appendChild(eAct_i);
            eAct_i.innerText = actArr[i].value;
            actArr[i].monitor(eAct_i, link);
        }
        return eBox;
    };
    this.outStyle_3 = (actArr, value, text) => {

        console.log('数据获取', text)
        //.appendChild() .createElement() .setAttribute('className', 'value');
        let eBox = document.getElementById('down_warp_box');
        let eWarp = document.createElement('div'),
            eIcon = document.createElement('span'),
            eText = document.createElement('i'),
            eGo = document.createElement('span');
        eBox.appendChild(eWarp);
        eWarp.appendChild(eIcon);
        eWarp.appendChild(eText);
        eWarp.appendChild(eGo);
        eWarp.setAttribute('class', 'drop_item_s3');
        eWarp.setAttribute('title', value + `>` + text);
        eText.innerHTML = text;

        for (let i = 0; i < actArr.length; i++) {
            actArr[i].monitor(eWarp, text);
        }
    }
    //显示输出触发器
    this.outHTML = (str) => {
        console.log(str)
        let sumHTML = [];
        let baseObj;
        let typeName = ['specialStr', 'command', 'understand', 'network']
        for (let n = 0; n < typeName.length; n++) {
            baseObj = this.typeBase[typeName[n]];
            if (baseObj.judge(str)) {
                for (let i = 0; i < baseObj.is.length; i++) {
                    let item = baseObj.is[i];
                    if (item.judge(str)) {
                        item.out(item, str)
                    }
                }
            }
        }
        return true;
    }
}


(() => {//立即执行函数，搜索框的输入事件
    let seaBox = document.getElementById('seaBox');
    let downDropBox = document.getElementById('down_warp_box');
    let seaBoxDelayTrue = false,
        seaBoxDelay = undefined;
    seaBox.addEventListener("input", () => {
        if (seaBoxDelay === undefined) {//创建延时间隔执行，为防止拼音打字时频繁请求
            seaBoxDelay = self.setInterval(() => {
                if (seaBoxDelayTrue) {
                    seaBoxDelay = window.clearInterval(seaBoxDelay);
                    console.log('自动关闭计时器', seaBoxDelay)
                } else {
                    seaBoxDelayTrue = true;
                }
            }, 250);
        } else if (seaBoxDelayTrue) {
            seaBoxDelayTrue = false;
            {//执行搜索匹配
                if (seaBox.value == '') {
                    //关闭下拉框
                    downDropBox.classList.remove('sea_drop_warp');
                    downDropBox.classList.add('sea_drop_warp_hide');
                    seaBox.classList.remove('search_box_res');
                    seaBox.classList.add('search_box_def');
                } else {
                    //打开下拉框
                    downDropBox.classList.remove('sea_drop_warp_hide');
                    downDropBox.classList.add('sea_drop_warp');
                    seaBox.classList.remove('search_box_def');
                    seaBox.classList.add('search_box_res');
                }
                if (downDropBox.classList.contains("sea_drop_warp")) {
                    let eBox = document.getElementById('down_warp_box');
                    eBox.innerHTML = '';
                    let newEaseShuttle = new EaseShuttle();
                    newEaseShuttle.typeBase.command.is = preCommand;
                    newEaseShuttle.typeBase.understand.is = preUnderstand;
                    newEaseShuttle.outHTML(seaBox.value);
                }
            }
        }
    });
})();


(() => {//立即执行函数，搜索框内的功能按钮
    let seaButMic = document.getElementById('seaButMic'),
        seaButCam = document.getElementById('seaButCam'),
        seaButSea = document.getElementById('seaButSea'),
        seaButMenu = document.getElementById('seaButMenu');

    seaButMic.addEventListener("click", () => {
        console.log('点击麦克风')
    });
    seaButCam.addEventListener("click", () => {
        console.log('点击摄像机')
    });
    seaButSea.addEventListener("click", () => {
        console.log('点击搜索按钮')
    });
    seaButMenu.addEventListener("click", () => {
        console.log('点击菜单')
    });
})();





























/*
out: (item,str) => {
    //appendChild()和createElement()
    //创建dom节点
    let eBox = document.getElementById('down_warp_box');
    let eWarp = document.createElement('div'),
        eIcon = document.createElement('span'),
        eInfo = document.createElement('div'),
        eTit = document.createElement('span'),
        eDes = document.createElement('span'),
        eAct = document.createElement('div'),
        eValue = document.createElement('span'),
        eKey = document.createElement('span');
    //添加class属性
    eWarp.setAttribute('class', 'drop_item_def');
    eIcon.setAttribute('class', 'item_def_icon');
    eInfo.setAttribute('class', 'item_def_info');
    eAct.setAttribute('class', 'item_def_action');
    //连接各dom节点
    //eBox.appendChild(eWarp);
    eWarp.appendChild(eIcon);
    eWarp.appendChild(eInfo);
    eWarp.appendChild(eAct);
    eInfo.appendChild(eTit);
    eInfo.appendChild(eDes);
    eAct.appendChild(eValue);
    eAct.appendChild(eKey);
    let iconUrl = str, tit, 
    des = item.value + ' | ' + str,
    value = '浏览器打开',
    key;





    //向节点中加入内容
    eIcon.setAttribute('style', 'background-image: url(./resources/icon.png)');
    eTit.innerText = tit;
    eDes.innerText = des;
    eValue.innerText = value;
    eKey.innerText = key;
    return eBox;
},
*/

/*
//修改代码样式//尝试快捷修改代码结构
let outCode = new EaseShuttle();

outCode.typeBase.command.is = preCommand;
outCode.typeBase.understand.is = preUnderstand;




console.log(outCode);
let newCode = {};
newCode.inputText = '输入的文本';
newCode.nodeElement = '将生成的内容添加到这里';
newCode.outHTML = '触发输出页面';

newCode.outStyle = {};
newCode.outStyle._02 = '获取参数，输出对应样式的页面';//outCode.outStyle_2;
newCode.outStyle._03 = '获取参数，输出对应样式的页面';//outCode.outStyle_3;
newCode.typeBase = {
    specific: [],
    smart: [],
    command: [],
    network: [],
};

for (let i = 0; i < outCode.typeBase.specialStr.is.length; i++) {
    let obj = outCode.typeBase.specialStr.is[i];
    newCode.typeBase.specific.push(
        {
            name: obj.name,
            value: obj.value,
            describe: '',
            type: 'specific',
            judge: '判断是否属于该类型',
            out: '执行操作',
        });
}

for (let i = 0; i < outCode.typeBase.command.is.length; i++) {
    let obj = outCode.typeBase.command.is[i];
    newCode.typeBase.command.push(
        {
            name: obj.name,
            value: obj.value,
            describe: '',
            type: 'smart',
            judge: '判断是否属于该类型',
            out: '执行操作',
        });
}


for (let i = 0; i < outCode.typeBase.understand.is.length; i++) {
    let obj = outCode.typeBase.understand.is[i];
    newCode.typeBase.smart.push(
        {
            name: obj.name,
            value: obj.value,
            describe: '',
            type: 'smart',
            judge: '判断是否属于该类型',
            out: '执行操作',
        });
}


for (let i = 0; i < outCode.typeBase.network.is.length; i++) {
    let obj = outCode.typeBase.network.is[i];
    newCode.typeBase.network.push(
        {
            name: obj.name,
            value: obj.value,
            describe: '',
            type: 'smart',
            judge: obj.judge,
            out: obj.out,
        });
}
// specific,smart,command,network
let newCodeJson = JSON.stringify(newCode)
console.log(newCode);

function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}


//download("newCode.json", newCodeJson);

let a = 
{
    "inputText": "输入的文本",
    "nodeElement": "将生成的内容添加到这里",
    "outHTML": "触发输出页面",
    "outStyle": {
        "_02": "获取参数，输出对应样式的页面",
        "_03": "获取参数，输出对应样式的页面"
    },
    "typeBase": {
        "specific": [
            {
                "name": "isUrl",
                "value": "链接",
                "describe": "",
                "type": "specific",
                "judge": "判断是否属于该类型",
                "out": "执行操作"
            },
        ],
        "smart": [
            {
                "name": "isOther...",
                "value": "智能理解,开发中，请耐心等待",
                "describe": "",
                "type": "smart",
                "judge": "判断是否属于该类型",
                "out": "执行操作"
            }
        ],
        "command": [
            {
                "name": "formoule",
                "value": "算式计算",
                "describe": "",
                "type": "smart",
                "judge": "判断是否属于该类型",
                "out": "执行操作"
            }
        ],
        "network": [
            {
                "name": "百度搜索联想词",
                "value": "输入关键词，调用百度搜索api，返回推荐搜索联想词",
                "describe": "",
                "type": "smart"
            }
        ]
    }
}

*/









