let ParseMark = {};
ParseMark.rule = {};

/**
 * 元素包括 块级元素（block）、行级元素（line）、内联元素（inline）
 * 优先级为 block > line > inline
 */

const block = [
    // 代码块
    {
        name: '代码块',
        reg: /```[^`]+```/,
        render: (s, r) => {
            s = s.replace(r, '<br/><strong>代码</strong><br/>');
            console.log(s);
        },
    },

]
const line = [
    // 标题
    {
        name: '标题 (Heading)',
        reg: /^#+\s$/,
        render: (s, i) => {
            let l = s[i].match(/#/g).length;
            s[i] = `<h${l > 6 ? 6 : l }>${s[i].replace(/^#+\s/,'')||''}</h1>`;
        },
    },
    // 分隔线
    {
        name: '分隔线 (Horizontal Rule)',
        reg: /^[*|-]{3,}$/,
        render: (s, i) => {
            s[i] = '<hr/>'
        },
    },
]



const inline = [
    // 粗斜体
    {
        name: '粗斜体 (bold and italic)',
        reg: /\*{3}([^\*]*)\*{3}/g,
        render: (s, i, r) => {
            let m = s[i].match(r);
            for (let k = 0; k < m.length; k++) {
                s[i] = s[i].replace(m[k], m[k].replace(r, '<strong><i>$1</i></strong>'));
            }
        },
    },
    // 粗体
    {
        name: '粗体 (bold)',
        reg: /\*\*([^\*]*)\*\*/g,
        render: (s, i, r) => {
            let m = s[i].match(r);
            for (let k = 0; k < m.length; k++) {
                s[i] = s[i].replace(m[k], m[k].replace(r, '<strong>$1</strong>'));
            }
        },
    },
    // 斜体
    {
        name: '斜体 (italic)',
        reg: /\*([^\*]*)\*/g,
        render: (s, i, r) => {
            let m = s[i].match(r);
            for (let k = 0; k < m.length; k++) {
                s[i] = s[i].replace(m[k], m[k].replace(r, '<i>$1</i>'));
            }
        },
    },
    // 删除
    {
        name: '删除 (delete)',
        reg: /\~\~([^~]*)\~\~/g,
        render: (s, i, r) => {
            let m = s[i].match(r);
            for (let k = 0; k < m.length; k++) {
                s[i] = s[i].replace(m[k], m[k].replace(r, '<del>$1</del>'));
            }
        },
    },
    // 代码
    {
        name: '代码 (Code)',
        reg: /[^`]`(.*)`[^`]/g,
        render: (s, i, r) => {
            let m = s[i].match(r);
            for (let k = 0; k < m.length; k++) {
                s[i] = s[i].replace(m[k], m[k].replace(r, '<code>$1</code>'));
            }
        },
    },
    // 换行
    {
        name: '换行 (Line Break)',
        reg: /[^ ]+ {2,}/g,
        render: (s, i) => {
            s[i] = s[i].replace(/ {2,}/g, '<br/>');
        },
    },
    // 图片
    {
        name: '图片 (Img)',
        reg: /!\[(.*?)\]\((.*?)\)/g,
        render: (s, i, r) => {
            let m = s[i].match(r);
            for (let k = 0; k < m.length; k++) {
                s[i] = s[i].replace(m[k], m[k].replace(r, '<img alt="$1" src="$2">'));
            }
        },
    },
    // 链接
    {
        name: '链接 (Link)',
        reg: /\[(.*?)\]\(([^ "']*?)( ?["'](.*)["'])?\)/g,
        render: (s, i, r) => {
            let m = s[i].match(r);
            for (let k = 0; k < m.length; k++) {
                s[i] = s[i].replace(m[k], m[k].replace(r, '<a href="$2" title=$4>$1</a>'));
            }
        },
    },

]

ParseMark.rule.block = block;
ParseMark.rule.line = line;
ParseMark.rule.inline = inline;

// 同步解析函数
ParseMark.parse = function(md) {
    let s = md; // stream

    s = s.replace(/\n\n+/g, '\n\n');
    s = s.replace(/^\n+/, '\n');
    s = s.replace(/\n+$/g, '\n');

    let rule = ParseMark.rule.block;
    // 遍历 block rule
    for (let r = 0; r < rule.length; r++) {
        if (rule[r].reg.test(s)) {
            rule[r].render(s, r);
        };
    }

    // 以 \n\n 拆分为数组
    s = s.split("\n");
    // 遍历 stream
    for (let i = 0; i < s.length; i++) {
        // 遍历 line rule
        rule = ParseMark.rule.line;
        for (let r = 0; r < rule.length; r++) {
            if (rule[r].reg.test(s[i])) {
                rule[r].render(s, i);
            };
        }
        // 遍历 inline rule
        rule = ParseMark.rule.inline;
        for (let r = 0; r < rule.length; r++) {
            if (rule[r].reg.test(s[i])) {
                rule[r].render(s, i, rule[r].reg);
            };
        }

    }
    return s.join('');
}

// 异步解析 --> 调用同步解析，完成后回调
ParseMark.parseAsync = function(md, cb) {
    cb(ParseMark.parse(md));
}

function show(html) {
    document.getElementById('content').innerHTML = html;
}
// 测试
ParseMark.parseAsync(testmd, show);