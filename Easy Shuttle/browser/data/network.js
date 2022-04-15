let preNetwork = [
    {
        name: 'Baidu Predictive Search',
        value: '推荐搜索',//百度联想词
        describe: '输入关键词，调用百度搜索api，返回推荐搜索联想词',
        group: 'network',
        judge: (inputText) => {
            //只要输入了都会进行检索
            //配置到Electron中后将会根据网络判断是否进行检索
            return true;
        },
        out: (nodeElement, outStyle, inputText, item) => {
            // 不要在此处声明变量 BaiduCallbackSug
            // JSONP 要求该回调函数必须是全局变量
            BaiduCallbackSug = (data) => {
                data = data.s.length === 0 || data === undefined ? { s: [inputText] } : data;
                for (let i = 0; i < 5 && i < data.s.length; i++) {
                    let icoURL = './resources/svg/search.svg',
                        value = item.value,
                        word = data.s[i],
                        actClick = (e, word) => {
                            e.addEventListener("click", (e) => {
                                console.log('该百度搜索api调用方式过于粗俗，后期请优化。')
                                window.open('https://www.baidu.com/s?ie=utf-8&f=3&rsv_bp=1&rsv_idx=1&tn=baidu&wd=' + word +
                                    '&fenlei=256&rsv_pq=d27645a500007718&rsv_t=f76as6xI31685qYGnWceEdrHytTmx2akpmcO%2Fm3aOtT8xUkoqxlO5m2byJc' +
                                    '&rqlang=cn&rsv_enter=1&rsv_dl=ts_0&rsv_sug3=4&rsv_sug1=4&rsv_sug7=101&rsv_sug2=1&rsv_btype=i' +
                                    '&prefixsug=kai&rsp=0&inputT=4092&rsv_sug4=8393')
                            });
                        }
                    let useStyle = outStyle._03;
                    useStyle(nodeElement, icoURL, value, word, actClick);
                }
            };
            let eBaiduSugScript = document.createElement('script')
            eBaiduSugScript.src = `http://suggestion.baidu.com/su?wd=${inputText}&cb=BaiduCallbackSug`
            document.getElementsByTagName('body')[0].appendChild(eBaiduSugScript);
            eBaiduSugScript.remove();
        },
    },
]