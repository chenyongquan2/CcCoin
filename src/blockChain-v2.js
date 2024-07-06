//v2版本-
//1.引入了proofOfWork，实现了mine函数来生成一个满足difficulty难度要求的hash值，这个过程就叫做挖矿
//2.解释了数字货币是怎么依据proofOfWork的机制来从源头上打消大家去篡改数据的念头的


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

        //nonce 是矿工在挖矿过程中尝试的一个随机数。矿工需要通过不断尝试不同的 nonce 值,直到找到一个能够满足区块链难度要求的哈希值。这个过程被称为 proof-of-work。
        this.nonce = 1
    }

    //计算出来区块的hash(相当于区块的指纹)
    computeHash() {
        return sha256(
            JSON.stringify(this.transations) +
            this.prevHash +
            this.nonce //引入随机数，来改变hash出来的结果
        ).toString()
    }

    getAnswer(difficulty) {
        //开头前n位为0的hash
        return '0'.repeat(difficulty)
    }

    //计算符号区块难度要求的hash
    //为什么需要引入难度要求?为了控制每10min会有一个区块被挖矿挖出来，需要动态调整这个难度要求
    mine(difficulty) {
        const ans = this.getAnswer(difficulty)

        while (true) {
            const hashRes = this.computeHash()
            //console.log(hashRes)
            if (hashRes.toString().substring(0, difficulty) !== ans) {
                //改变随机数，继续尝试
                this.nonce++
            }
            else {
                this.hash = hashRes
                console.log(`挖矿结束, nonce:${this.nonce},difficulty:${difficulty},hash:${this.hash}`)
                break
            }
        }
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

        //挖完矿，才可以添加到链上
        newBlock.mine(this.difficulty)
        //newBlock.hash = newBlock.computeHash()

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

let difficulty = 4
const myChain = new Chain(difficulty)
//console.log(chain)

const block1 = new Block('转账10元', '')
myChain.addBlock2Chain(block1)

const block2 = new Block('转账100元', '')
myChain.addBlock2Chain(block2)

console.log('区块链初始化完成:', myChain)

//判断区块链是否合法
// console.log(myChain.isValidChain())

//尝试去篡改block1的交易数据
// myChain.chain[1].transations ='转账1000000元'
// console.log(myChain.isValidChain()) //区块 1 被篡改了!

//比特币是如何通过proofOfWork来从目的上去篡改的发生的呢?
//因为篡改数据后，你需要重新去找到一个新的hash满足区块的复杂度要求的规则(例如hash值的前x位必须为0),假如这么一个挖矿算出hash/篡改过程需要4s
//篡改完当前的区块，为了不断联，你必须得把后面所有的区块也给篡改了，假如后面有1w个区块，等你所有区块都篡改完成后，别人早就已经挖出了更多的区块并且广播到网络上了，这时候你的链不可能别整个比特币网路所接受
//辛辛苦苦最终颗粒无收...所以有这个篡改的精力，还不如老老实实去挖矿的性价比更高.

bTryModiftBlock = true
if (bTryModiftBlock) {
    //尝试去篡改block1的交易数据+重新计算其hash值
    console.log(`尝试去篡改区块链...`)
    myChain.chain[1].transations = '转账1000000元'
    //myChain.chain[1].hash=myChain.chain[1].computeHash() //区块 2 断联了!
    myChain.chain[1].mine(myChain.difficulty)

    console.log('篡改后的区块链是:', myChain)

    console.log(myChain.isValidChain())
}




