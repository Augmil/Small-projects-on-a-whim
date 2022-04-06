let preSmart = [
    {
        name: 'test',
        value: '测试',
        describe: '',
        group: 'smart',
        judge: (inputText) => {
            let reg = /^调试$/;
            return reg.test(inputText);
        },
        out: (inputText) => {
            return console.log('**************************************************************************************************');
        },
    }
]