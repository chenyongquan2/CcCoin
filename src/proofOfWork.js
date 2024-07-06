const sha256 = require('crypto-js/sha256')

//对于不同的输入，哪怕只是一个很微小的改动，输出的结果都是很不一样的
console.log(sha256('cyq123456').toString())
console.log(sha256('cyQ123456').toString())
console.log(sha256('cyq123456').toString() === sha256('cyQ123456').toString())

//对于同一个输入，输出结果是相同的
console.log(sha256('cyq123456').toString())
console.log(sha256('cyq123456').toString())
console.log(sha256('cyq123456').toString() === sha256('cyq123456').toString())

//什么是工作量证明
//当我要让你计算出来一个满足某个特定要求的hash值
//例如需要得到一个开头值为0的哈希值，请告诉我这x值是多少
//例如需要得到一个开头值前4位全为0的哈希值，请告诉我这x值是多少

//'开头值前n位全为0的哈希值'的n的数字越大，问题求解的复杂度也越高,需要的时间也就越长


function proofOfWork(difficulty) {
    const data = 'cyq12345'
    let nounce = 1
    const answerPrev = '0'.repeat(difficulty)
    while (true) {
        let shaStr = sha256(data + nounce).toString()
        if (shaStr.substring(0, difficulty) !== answerPrev) {
            nounce++;
        }
        else {
            //模板字符串 (用反引号 ` 括起来的字符串)来进行字符串拼接。在模板字符串中,你可以使用 ${} 来插入变量值。
            console.log(`得到的hash是:${shaStr},次数是:${nounce}`)
            break;
        }
    }
}

proofOfWork(1)
proofOfWork(2)
proofOfWork(4)
// 得到的hash是:0fe2383a28d89838c97d535a99c8983aced43ca962d63990bd64a632bb81c398,次数是:4
// 得到的hash是:00bcecad2fb273d03616b1f56f24b8b097794308297302ca18083994fbfc864e,次数是:146
// 得到的hash是:0000de31791c34dd20c244866571bdaa079eaba8dd8cec731a2a6e86a9a95eaa,次数是:24262
