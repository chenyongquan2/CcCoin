
//引入依赖之前得在项目根目录下先用npm来安装相关的依赖
//eg: npm install crypto-js
//引入依赖
const sha256 = require('crypto-js/sha256')


//区块，用来存储交易信息
class Block {
    constructor(transations, prevHash) {
        //transations是一个string，需要把交易的给string化
        // data -> transaction <-> array of objects
        this.transations = transations
        this.prevHash = prevHash

        //hash是一个区块的指纹
        this.hash = this.computeHash()
    }

    //计算出来区块的hash(相当于区块的指纹)
    computeHash() {
        return sha256(
            JSON.stringify(this.transations) +
            this.prevHash
        ).toString()
    }

}

//区块的链表
class Chain {
    constructor(difficulty) {
        this.chain = []
        this.chain.push(this.bingBang())

        this.difficulty = difficulty
    }

    //生成祖先区块/创世区块(Genesis Block)
    //创世区块是区块链中第一个被创建的区块
    //隐喻了区块链网络的诞生,就像宇宙大爆炸(Big Bang)一样,创世区块标志着区块链网络的开始。
    bingBang() {
        const genesisBlock = new Block('我是祖先', "");
        return genesisBlock;
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1]
        //return this.chain.lastIndexOf()
    }

    //添加区块到区块链
    addBlock2Chain(newBlock) {
        newBlock.prevHash = this.getLatestBlock().hash
        newBlock.hash = newBlock.computeHash()

        this.chain.push(newBlock)
    }

    //验证区块的合法性
    isValidChain() {
        if (this.chain.length === 1) {
            //通过区块的hash值，验证内容和hash值有无被篡改
            if (this.chain[0].hash !== this.chain[0].computeHash()) {
                console.log('祖先区块被篡改了!')
                return false
            }
            return true
        }

        for (let i = 1; i < this.chain.length; ++i) {
            const blcok = this.chain[i];
            //检验当前数据是否有无被篡改
            if (blcok.hash !== blcok.computeHash()) {
                console.log('区块', i, '被篡改了!')
                return false;
            }
            //通过prevHash来判断是否断链
            const prevBlockHash = this.chain[i - 1].hash;
            if (blcok.prevHash !== prevBlockHash) {
                console.log('区块', i, '断联了!')
                return false;
            }
        }
        return true
    }
}

const myChain = new Chain(4)
//console.log(chain)

const block1 = new Block('转租10元', '')
myChain.addBlock2Chain(block1)

const block2 = new Block('转租100元', '')
myChain.addBlock2Chain(block2)

console.log(myChain)
console.log(myChain.isValidChain())

//尝试去篡改block1的交易数据
// myChain.chain[1].transations ='转账1000000元'
// console.log(myChain.isValidChain()) //区块 1 被篡改了!

//尝试去篡改block1的交易数据+重新计算其hash值
myChain.chain[1].transations ='转账1000000元'
myChain.chain[1].hash=myChain.chain[1].computeHash() //区块 2 断联了!
console.log(myChain.isValidChain())


