let p = {}

p.parse = function(md) {
    let s = md; // stream

    s = s.replace(/\n\n+/g, '\n\n');
    s = s.replace(/^\n+/, '\n');
    s = s.replace(/\n+$/, '\n');

    s = s.split("\n");

    for (let i = 0; i < s.length; i++) {
        //换行
        s[i] = s[i].replace(/^$/, '<br/>');
        //分割线
        s[i] = s[i].replace(/^[-*]{3,}$/, '<hr/>');

        // 强调
        s[i] = s[i].replace(/(\*{1,3})([^*]+)\1/g, (p0, p1, p2) => {
            return /^\*$/.test(p1) ? `<i>${p2}</i>` :
                /^\*\*$/.test(p1) ? `<strong>${p2}</strong>` :
                /^\*\*\*$/.test(p1) ? `<strong><i>${p2}</i></strong>` : p0;
        });
        // 标记
        s[i] = s[i].replace(/==([^=]+)==/g, '<mark>$1</mark>');
        // 删除
        s[i] = s[i].replace(/~~([^~]+)~~/g, '<del>$1</del>');
        // 代码
        s[i] = s[i].replace(/`([^`]+)`/g, '<code>$1</code>');

        //标题
        s[i] = s[i].replace(/(#+) ([^]+)/, (p0, p1, p2) => {
            let h = p1.length > 6 ? 6 : p1.length;
            return `<h${h}>${p2}</h${h}>`;
        });
        /*
        [显示文本](https://markdown.com.cn "链接title")
        [显示文本]<fake@example.com>
        第一部分 --> [引用链接][1]
        第二部分 --> [1]: 链接地址（地址可用 ""、''、<>包裹）
        */
        //链接 运行在bug上
        s[i] = s[i].replace(/\[([^\]]+)\]\(([^ "]+) *((["])?([^"])+\4?)?\)/g, (p0, p1, p2, p3, p4, p5) => {
            console.log(p0);
            console.log(p1);
            console.log(p2);
            console.log(p3);
            console.log(p4);
            console.log(p5);
            return `<a href="${p2}" title=${p3}>${p1}</a>`;
        });



    }









    //console.log(s);

    return s.join('');
}

document.write(p.parse(md));