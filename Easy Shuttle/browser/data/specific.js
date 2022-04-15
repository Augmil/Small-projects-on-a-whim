let preSpecific = [
    {
        name: 'link',
        value: '链接',
        describe: '',
        group: 'specific',
        judge: (inputText) => {
            let reg = /(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|&|-)+)|(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?|(http(s)?\:\/\/)?(www\.)?(\w+\:\d+)?(\/\w+)+\.(swf|gif|jpg|bmp|jpeg)|(http(s)?\:\/\/)?(www\.)?(\w+\:\d+)?(\/\w+)+\.(swf|gif|jpg|bmp|jpeg)|(https?|http|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]|((ht|f)tps?):\/\/[\w\-]+(\.[\w\-]+)+([\w\-\.,@?^=%&:\/~\+#]*[\w\-\@?^=%&\/~\+#])?/gi;
            return reg.test(inputText);
        },
        out: (nodeElement, outStyle, inputText, item) => {
            //以下正则来自 https://blog.csdn.net/Altaba/article/details/78539752
            // var reg = /(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|&|-)+)/g;
            // var reg = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
            // var reg = /(http(s)?\:\/\/)?(www\.)?(\w+\:\d+)?(\/\w+)+\.(swf|gif|jpg|bmp|jpeg)/gi;
            // var reg = /(http(s)?\:\/\/)?(www\.)?(\w+\:\d+)?(\/\w+)+\.(swf|gif|jpg|bmp|jpeg)/gi;
            // var reg = /(https?|http|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/g;
            // var reg = /^((ht|f)tps?):\/\/[\w\-]+(\.[\w\-]+)+([\w\-\.,@?^=%&:\/~\+#]*[\w\-\@?^=%&\/~\+#])?$/;
            let reg = /(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|&|-)+)|(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?|(http(s)?\:\/\/)?(www\.)?(\w+\:\d+)?(\/\w+)+\.(swf|gif|jpg|bmp|jpeg)|(http(s)?\:\/\/)?(www\.)?(\w+\:\d+)?(\/\w+)+\.(swf|gif|jpg|bmp|jpeg)|(https?|http|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]|((ht|f)tps?):\/\/[\w\-]+(\.[\w\-]+)+([\w\-\.,@?^=%&:\/~\+#]*[\w\-\@?^=%&\/~\+#])?/gi;
            // 等价于以上的组合
            let aURL = inputText.match(reg);
            for (let i = 0; i < aURL.length; i++) {
                //固定参数
                let icoURL = './resources/icon.png',
                    value = item.value,
                    link = aURL[i];
                //不定参数
                let actArr = [
                    {
                        value: '复制',
                        action: (e, link) => {
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
                ],
                    actURL = 'actURL';
                let useStyle = outStyle._02;
                useStyle(nodeElement, icoURL, value, link, actArr, actURL);
            }

            return true;
        },
    },
]