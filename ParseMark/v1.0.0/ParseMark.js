let ParseMark = {};
ParseMark.rule = {};

/**
 * 元素包括 块级元素（block）、行级元素（line）、内联元素（inline）
 * 优先级为 block > line > inline
 */


// 定义块级元素
let block = [{
            tag: 'code',
            startReg: /^```/,
            endReg: /^```$/,
            render: (stream, s, e) => {
                    stream[s] = `<hr><pre><code lang="${stream[s].replace(/^```/,'')||''}">`;
                    stream[e] = `</pre></code><hr>`;
    },
},



 ];

// 定义行级元素
let line = [{
        tag: 'h1~h6',
        reg: /^#+\s/,
        render: (stream, s) => {
            let l = stream[s].match(/#/g).length;
            stream[s] = `<h${l > 6 ? 6 : l }>${stream[s].replace(/^#+\s/,'')||''}</h1>`;
        },
    },

];

// 定义内联元素
let inline = [{
    neme:'粗体',
    des:'将内容设置为粗体，例如 **粗体** 两组**间的内容将会是粗体',
    reg: /\*\*[^\*]+\*\*/g,
    render: (stream, s) => {
        let a = stream[s].split('**');
        stream[s] = '';
        for (let i = 0; i+1 < a.length; i+=2) {
            stream[s] +=a[i]+'<strong>'+a[i+1]+'</strong>'
        }
    },
}, {
    neme:'斜体',
    des:'将内容设置为粗体，例如 *斜体* 两组*间的内容将会是斜体体',
    reg: /\*[^\*]+\*/,
    render: (stream, s) => {
        let a = stream[s].split('*');
        stream[s] = '';
        for (let i = 0; i+1 < a.length; i+=2) {
            stream[s] +=a[i]+'<i>'+a[i+1]+'</i>'
        }
    },
}, {
    neme:'删除的字符',
    des:'为文字添加删除线，例如 ~~斜体~~ 两组~~间的内容将会带有删除线',
    reg: /~~[^~]+~~/,
    render: (stream, s) => {
        let a = stream[s].split('~~');
        stream[s] = '';
        for (let i = 0; i+1 < a.length; i+=2) {
            stream[s] +=a[i]+'<del>'+a[i+1]+'</del>'
        }
    },
},{
    neme:'图片',
    des:'显示图片',
    reg: /!\[[^\[\(<)\]\>]+\][\[\(<](\S+)[)\]>]/,
    render: (stream, s) => {
        //console.log(stream[s]);
    },
},];


ParseMark.rule.block = block;
ParseMark.rule.line = line;
ParseMark.rule.inline = inline;


// 将数组转换为数据流
ParseMark.createStream = function(md) {
    // 两个以上换行符转为两个
    md = md.replace(/\n\n+/g, '\n\n');
    // 删除首行换行符
    md = md.replace(/^\n+/, '');
    // 删除末尾换行符
    md = md.replace(/\n+$/g, '*');
    // 以换行符拆分为数组
    md = md.split("\n");
    return md
}



ParseMark.parse = function(md) {
    let stream = this.createStream(md);
    // 遍历 流 中的每一条数据
    for (let s = 0; s < stream.length; s++) {
        // 遍历每一条块级规则
        for (let b = 0; b < ParseMark.rule.block.length; b++) {
            let rule = ParseMark.rule.block[b];
            // 查找起始标记
            if (rule.startReg.test(stream[s])) {
                // 查找结束标记
                let e = s;
                do {
                    e++;
                } while (!rule.endReg.test(stream[e]) && e < stream.length);
                // 开始和结束标记完整
                if (stream[e]) {
                    // 执行渲染
                    rule.render(stream, s, e);
                } else {
                    console.error('未找到结束符');
                }
            }
        }
        // 遍历每一条行级规则
        for (let l = 0; l < ParseMark.rule.line.length; l++) {
            let rule = ParseMark.rule.line[l];
            // 查找起始标记
            if (rule.reg.test(stream[s])) {
                rule.render(stream,s);
            }
            
        }

        // 遍历每一条行内规则
        for (let i = 0; i < ParseMark.rule.inline.length; i++) {
            let rule = ParseMark.rule.inline[i];
            // 查找起始标记
            if (rule.reg.test(stream[s])) {
                rule.render(stream,s);
            }
        }
    }
    return stream
}

// 异步解析 --> 调用同步解析，完成后回调
ParseMark.parseAsync = function(md, cb) {
    cb(ParseMark.parse(md).join(''));
}

function show(html) {
    document.getElementById('content').innerHTML = html;
}

ParseMark.parseAsync(testmd, show);

let reg = /[a-z]=((ss)\d(cdsac))/gi
let r = reg.exec('asdcsa=ss8cdsac');
console.log(r);
/**
 * 正则方法
 * / /.test(' ')
 * / /.compile()
 * / /.exec(' ') --> 返回一个数组，包含属性index:匹配字符串的位置，[0] 整个正则匹配到的内容，[1]、[2]... ()中的正则匹配到的内容
 * 
 * 
 * // 字符串方法
 * ''.search()
 * ''.replace()
 * ''.split()
 * ''.match()
 * 
 * 
 */