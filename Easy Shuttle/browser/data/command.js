let preCommand = [
    {
        name: 'formoule',
        value: '计算',
        describe: '',
        group: 'smart',
        judge: (inputText) => {
            let identifier = commandIdentifier === undefined ? '>>' : commandIdentifier;
            //let reg = /^{000 编辑正则 000}$/;
            //return reg.test(inputText);
            return false;
        },
        out: (nodeElement, outStyle, inputText, item) => {

            let icoURL = './resources/svg/search.svg',
                value = item.value,
                word = inputText;
            let actClick = () => {
                console.log('命令测试项输出')//,nodeElement, outStyle, inputText, item);
            };
            let useStyle = outStyle._03;
            useStyle(nodeElement, icoURL, value, word, actClick);
        },
    },

]