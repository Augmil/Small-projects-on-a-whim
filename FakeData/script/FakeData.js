// node FakeData/script/FakeData.js

var fake = {};





/**
 * @method fake.importModule
 * @description 引入所需模块
 * @param {Object} install 
 */
fake.importModule = function(install) {
    let { modules = [] } = install || {};
    // 判断运行环境
    if (typeof window === 'object') { // 运行在浏览器中
        // 获取脚本所在位置
        let allScripts = document.getElementsByTagName("script");
        let selfSrc = allScripts[allScripts.length - 1].getAttribute("src");
        let selfFolder = selfSrc.match(/^[^]+(?=\/[^/.]+\.js$)/)[0]; // 去除最后一个 / 以及js文件名

        let moduleName, script;
        for (let i = 0; i < modules.length; i++) {
            moduleName = modules[i];
            script = document.createElement('script');
            script.src = selfFolder + '/module/' + moduleName + '.js';
            document.querySelector('head').appendChild(script);
        }

    } else if (Object.prototype.toString.call(process) === '[object process]') { // 运行在node中
        var { ID } = require('./module/person.js');
        console.log(ID);
    }
}

fake.importModule({
    modules: ['person', ]
});

















//