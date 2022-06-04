/**
 * @module person
 * @description 伪造身份证号
 */
var person = {};
person.idCard = {}

person.idCard.provincialCode = { 11: "北京", 12: "天津", 13: "河北", 14: "山西", 15: "内蒙古", 21: "辽宁", 22: "吉林", 23: "黑龙江", 31: "上海", 32: "江苏", 33: "浙江", 34: "安徽", 35: "福建", 36: "江西", 37: "山东", 41: "河南", 42: "湖北", 43: "湖南", 44: "广东", 45: "广西", 46: "海南", 50: "重庆", 51: "四川", 52: "贵州", 53: "云南", 54: "西藏", 61: "陕西", 62: "甘肃", 63: "青海", 64: "宁夏", 65: "新疆", 71: "台湾", 81: "香港", 82: "澳门", 91: "国外" };
person.idCard.coefficient = ['7', '9', '10', '5', '8', '4', '2', '1', '6', '3', '7', '9', '10', '5', '8', '4', '2'];
person.idCard.checkCode = { 1: "0", 0: "1", x: "2", X: "2", 9: "3", 8: "4", 7: "5", 6: "6", 5: "7", 4: "8", 3: "9", 2: "10", }

/**
 * @method person.idCard.check
 * @description 校验身份证号
 */
person.idCard.check = function(id) {
    // 检查基本格式
    if (!/^\d{17}[\dxX]$/.test(id)) return false;

    // 拆分身份证号
    let frag = id.match(/^(\d{2})(\d{2})(\d{2})(\d{4})(\d{2})(\d{2})(\d{2})(\d{1})([0-9]|X|x)/);
    let [, idProvincial, , , idYear, idMonth, idDay, , , idCheck] = frag;

    // 地区 --> 6位内容过多，只粗略检验2位
    if (!person.idCard.provincialCode[idProvincial]) return false;

    // 生日
    try {
        new Date(idYear + '-' + idMonth + '-' + idDay).toISOString();
    } catch (error) {
        return false;
    }

    // 校验码
    let coefficient = person.idCard.coefficient,
        checkCode = person.idCard.checkCode,
        productSum = 0;
    for (let i = 0; i < coefficient.length; i++) {
        productSum += id[i] * coefficient[i];
    }
    let remainder = productSum % 11;
    if (!(checkCode[idCheck] * 1 === remainder)) return false;

    // 以上验证均正确
    return true
}



/**
 * @method person.idCard.generate
 * @description 生成身份证号
 */
person.idCard.generate = function(optionals) {
    let {
        area: idArea = undefined,
        date: idDate = undefined,
        maxDate = 0,
        minDate = 0,
        gender: idGender = undefined,
    } = optionals || {}


    if (/^[\u4e00-\u9fa5]{2,3}$/.test(idArea)) {
        for (let key in person.idCard.provincialCode) {
            if (idArea === person.idCard.provincialCode[key]) {
                idArea = parseInt(key) + parseInt(9999 * Math.random()).toString();
                break
            }
        }
    } else if (/^\d+$/.test(idArea) && person.idCard.provincialCode[idArea.match(/^\d{2}/)[0]] && !(/^\d{6}$/.test(idArea))) {
        idArea = idArea.match(/^\d{2}/)[0] + parseInt(9999 * Math.random()).toString();
    }
    if (!(/^\d{6}$/.test(idArea))) {
        idArea = '';
        do {
            idArea = parseInt(59 * Math.random() + 10);
        } while (!person.idCard.provincialCode[idArea]);
        idArea += parseInt(9999 * Math.random()).toString();
    }

    return idArea //+ idDate + idNumber + idGender + idCheck;
}
let id = person.idCard.generate({
    area: '520'
});

let ids = []
for (let i = 0; i < 50; i++) {
    ids.push(person.idCard.generate({
        area: '520'
    }))
}

console.log(ids);