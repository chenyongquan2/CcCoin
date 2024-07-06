//npm install elliptic

//elliptic 是一个基于椭圆曲线加密的 JavaScript 库,提供了各种与椭圆曲线相关的功能,如密钥生成、签名和验证等。
const ecLib = require('elliptic').ec //ec 代表的是 "elliptic curve" 的缩写
//并指定了使用 secp256k1 椭圆曲线
//ecp256k1 是一种广泛使用的椭圆曲线,它被许多加密货币和区块链项目所采用,如比特币、以太坊等
const ec = new ecLib('secp256k1')

const sha256 = require('crypto-js/sha256')

//生成我们的密钥对
const keyPair = ec.genKeyPair();
console.log(keyPair.getPrivate('hex'))
console.log(keyPair.getPublic('hex'))

//使用sha256来进行加密，得到内容的hash值
const docData = 'the chicken is so beautiful, it likes ctrl'
const hashDocData =  sha256(docData).toString()

//对内容的hash值来使用私钥进行加密，得到签名
//方法使用私钥对哈希值进行签名,并输出 base64 编码的签名值。
//toDER('hex') 方法将签名值转换为 DER (Distinguished Encoding Rules) 编码的十六进制字符串格式。
//DER 是一种用于编码签名的标准格式,它可以确保签名的可移植性和互操作性
const hexSingature = keyPair.sign(hashDocData,'base64').toDER('hex')

console.log('hashed doc:',hashDocData)
console.log('signature:',hexSingature)

//接收者获取发送者的公钥
//key.getPublic('hex') 是获取之前生成的密钥对的公钥部分,并将其转换为十六进制字符串格式。
//ec.keyFromPublic(key.getPublic('hex'), 'hex') 是使用 elliptic 库提供的 keyFromPublic() 方法,将十六进制格式的公钥转换为一个可用于验证签名的公钥对象。
// 'hex' 作为第二个参数表示输入的公钥字符串是十六进制格式的。
const senderPublicKey = ec.keyFromPublic(keyPair.getPublic('hex'),'hex')

//接收者使用发送者的公钥senderPublicKey来验证之前生成的数字签名(hexSignature)是否合法。
//使用公钥对hexSingature进行解密，
//若解密失败，则说明不是此发送者发送的;
//若解密成功
    //判断hexSingature解密后得到的hash值是否与hashDocData相等，若相等，则说明信息没被篡改
console.log(senderPublicKey.verify(hashDocData, hexSingature))

//尝试去tamper/篡改
const tamperedDocData = 'the chicken is not beautiful, it dont likes ctrl'
const hashTamperedDocData = sha256(tamperedDocData).toString()
console.log('tampered hased doc', hashTamperedDocData)
console.log(senderPublicKey.verify(hashTamperedDocData, hexSingature))