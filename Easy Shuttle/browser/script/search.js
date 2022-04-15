
//仿jQuery选择器 //class和id不要包含需满足变量名命名要求（只能由字母开头或下划线，只能由字母、数字、下划线组成）
let $ = (classOrId) => {
    if (/^\.[0-9a-zA-Z_]{1,}$/.test(classOrId)) {
        return document.getElementsByClassName(classOrId.replace('.', ''));
    } else if (/^#[0-9a-zA-Z_]{1,}$/.test(classOrId)) {
        return document.getElementById(classOrId.replace('#', ''));
    } else {
        console.log('请标识出 参数是id还是class', classOrId);
    }
}

//防抖函数 //防止短时间内频繁触发操作。
let debounce = (fn, wait) => {//(需要间隔防抖的函数，间隔时间)
    var timer = null;
    return function () {
        if (timer !== null) {
            clearTimeout(timer);
        }
        timer = setTimeout(fn, wait);
    }
}

//该构造函数中如需获取元素请直接传入或使用原生js获取，避免代码混乱后期难以维护
function CreateSearchResults(nodeElement, inputText) {
    //显示匹配结果的HTML节点元素
    this.nodeElement = nodeElement;
    //搜索框中用户输入的文本
    this.inputText = inputText;
    //显示输出触发器
    this.outHTML = (nodeElement, inputText) => {
        let aGroupName = groupPriority === undefined ? ['specific', 'command', 'smart', 'network'] : groupPriority;
        for (let g = 0; g < aGroupName.length; g++) {
            aType = this.typeGroup[aGroupName[g]];
            for (let t = 0; t < aType.length; t++) {
                let item = aType[t];
                if (item.judge(inputText)) {
                    item.out(nodeElement, this.outStyle, inputText, item);
                }
            }
        }
        return true;
    };
    //显示样式库
    this.outStyle = {
        _02: (nodeElement, icoURL, value, link, ...arguments) => {
            //.appendChild() .createElement() .setAttribute('className', 'value');
            //创建dom节点
            let eBox = nodeElement;
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
            eIcon.setAttribute('style', 'background-image: url(' + icoURL + ')');
            eValue.innerText = value;
            eTit.setAttribute('title', link);

            //分析配置不定参
            for (let a = 0; a < arguments.length; a++) {
                let arg = arguments[a]
                if (Array.isArray(arg)) {
                    //按钮
                    for (let i = 0; i < arg.length; i++) {
                        let eAct_i = document.createElement('strong');
                        eAct.appendChild(eAct_i);
                        eAct_i.innerText = arg[i].value;
                        arg[i].action(eAct_i, link);
                    }
                } else if (arg === 'actURL') {
                    eTit.onclick = () => {
                        window.open(/^http/.test(link) ? link : 'http://' + link);
                    }
                }
            }


            return eBox;
        },
        _03: (nodeElement, icoURL, value, word, actClick) => {
            //.appendChild() .createElement() .setAttribute('className', 'value');
            let eBox = nodeElement;
            let eWarp = document.createElement('div'),
                eIcon = document.createElement('span'),
                eText = document.createElement('i'),
                eGo = document.createElement('span');
            eBox.appendChild(eWarp);
            eWarp.appendChild(eIcon);
            eWarp.appendChild(eText);
            eWarp.appendChild(eGo);
            eWarp.setAttribute('class', 'drop_item_s3');
            eWarp.setAttribute('title', value + `>` + word);
            eIcon.setAttribute('style', 'background-image: url(' + icoURL + ')');
            eText.innerText = word;
            actClick(eWarp, word);
        }
    };
    this.typeGroup = {
        specific: [
            {
                name: 'isUrl',
                value: '链接',
                describe: '',
                group: 'specific',
                judge: '判断是否属于该类型',
                out: '执行操作'
            },
        ],
        command: [
            {
                name: 'formoule',
                value: '算式计算',
                describe: '',
                type: 'smart',
                judge: '判断是否属于该类型',
                out: '执行操作'
            }
        ],
        smart: [
            {
                name: 'isOther...',
                value: '智能理解,开发中，请耐心等待',
                describe: '',
                type: 'smart',
                judge: '判断是否属于该类型',
                out: '执行操作'
            }
        ],
        network: [
            {
                name: '百度搜索联想词',
                value: '输入关键词，调用百度搜索api，返回推荐搜索联想词',
                describe: '',
                type: 'smart',
                judge: '判断是否属于该类型',
                out: '执行操作'
            }
        ]
    };
};
(() => {//立即执行函数，搜索框的输入事件
    //创建 解析输入字符串并显示 的函数
    let searchInputText = () => {
        let eSeaBox = $('#seaBox');
        let eDisBox = $('#down_warp_box');
        let eSeaButDel = $('#seaButDel');
        if (eSeaBox.value == '') {
            //隐藏删除按钮
            eSeaButDel.style.display = 'none';
        } else {
            //显示删除按钮
            eSeaButDel.style.display = 'inline-block';
            //解析输入的字符串，进行搜索并显示搜索结果
            let eBox = $('#down_warp_box');
            eBox.innerHTML = '';
            //新建搜索解析函数
            let newCSR = new CreateSearchResults();
            //更新解析库
            newCSR.typeGroup.specific = preSpecific;
            newCSR.typeGroup.command = preCommand;
            newCSR.typeGroup.smart = preSmart;
            newCSR.typeGroup.network = preNetwork;
            //触发解析函数，解析搜索后显示出来
            newCSR.outHTML(eDisBox, eSeaBox.value);
        }
    };
    $('#seaBox').addEventListener('input', debounce(searchInputText, 300));
})();

(() => {//按钮的点击事件
    //点击删除按钮
    $('#seaButDel').onclick = () => {
        $('#seaButDel').style.display = 'none';
        $('#seaBox').value = '';
        $('#seaBox').focus();
    }
    //点击搜索按钮
    $('#seaButSea').onclick = () => {
        window.open('https://www.baidu.com/s?ie=utf-8&f=3&rsv_bp=1&rsv_idx=1&tn=baidu&wd=' + $('#seaBox').value +
            '&fenlei=256&rsv_pq=d27645a500007718&rsv_t=f76as6xI31685qYGnWceEdrHytTmx2akpmcO%2Fm3aOtT8xUkoqxlO5m2byJc' +
            '&rqlang=cn&rsv_enter=1&rsv_dl=ts_0&rsv_sug3=4&rsv_sug1=4&rsv_sug7=101&rsv_sug2=1&rsv_btype=i' +
            '&prefixsug=kai&rsp=0&inputT=4092&rsv_sug4=8393')
    }

})();










