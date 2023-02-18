## 前言
JavaScript 提供了许多迭代集合的方法，从简单的 for 循环到 map() 和 filter()。迭代器和生成器将迭代的概念直接带入核心语言，并提供了一种机制来自定义 for...of 循环的行为。
## 迭代器
在 JavaScript 中，迭代器是一个对象，它定义一个序列，并在终止时可能返回一个返回值。更具体地说，迭代器是通过使用 next() 方法实现 Iterator protocol 的任何一个对象，该方法返回具有两个属性的对象： value，这是序列中的 next 值；和 done ，如果已经迭代到序列中的最后一个值，则它为 true 。如果 value 和 done 一起存在，则它是迭代器的返回值。

一旦创建，迭代器对象可以通过重复调用 next（）显式地迭代。迭代一个迭代器被称为消耗了这个迭代器，因为它通常只能执行一次。在产生终止值之后，对 next（）的额外调用应该继续返回{done：true}。

Javascript 中最常见的迭代器是 Array 迭代器，它只是按顺序返回关联数组中的每个值。虽然很容易想象所有迭代器都可以表示为数组，但事实并非如此。数组必须完整分配，但迭代器仅在必要时使用，因此可以表示无限大小的序列，例如 0 和无穷大之间的整数范围。

这是一个可以做到这一点的例子。它允许创建一个简单的范围迭代器，它定义了从开始（包括）到结束（独占）间隔步长的整数序列。它的最终返回值是它创建的序列的大小，由变量 iterationCount 跟踪。

```
function makeRangeIterator(start = 0, end = Infinity, step = 1) {
    let nextIndex = start;
    let iterationCount = 0;
    const rangeIterator = {
        next: function () {
            let result;
            if (nextIndex < end) {
                result = { value: nextIndex, done: false }
                nextIndex += step;
                iterationCount++;
                return result;
            }
            return { value: iterationCount, done: true }
        }
    };
    return rangeIterator;
}
let it = makeRangeIterator(1, 10, 2);
let result = it.next();
while (!result.done) {
    console.log(result.value); // 1 3 5 7 9
    result = it.next();
}
console.log("Iterated over sequence of size: ", result.value); // 5
```

## 生成器函数
虽然自定义的迭代器是一个有用的工具，但由于需要显式地维护其内部状态，因此需要谨慎地创建。生成器函数提供了一个强大的选择：它允许你定义一个包含自有迭代算法的函数，同时它可以自动维护自己的状态。生成器函数使用 function*语法编写。最初调用时，生成器函数不执行任何代码，而是返回一种称为 Generator 的迭代器。通过调用生成器的下一个方法消耗值时，Generator 函数将执行，直到遇到 yield 关键字。

可以根据需要多次调用该函数，并且每次都返回一个新的 Generator，但每个 Generator 只能迭代一次。

我们现在可以调整上面的例子了。此代码的行为是相同的，但实现更容易编写和读取。

```javascript
function* makeRangeIterator(start = 0, end = Infinity, step = 1) {
    for (let i = start; i < end; i += step) {
        yield i;
    }
}
var a = makeRangeIterator(1,10,2)
a.next() // {value: 1, done: false}
a.next() // {value: 3, done: false}
a.next() // {value: 5, done: false}
a.next() // {value: 7, done: false}
a.next() // {value: 9, done: false}
a.next() // {value: undefined, done: true}
```
## yield
[rv] = yield [expression];

yield 关键字使生成器函数执行暂停，yield 关键字后面的表达式的值返回给生成器的调用者。它可以被认为是一个基于生成器的版本的 return 关键字。

yield 关键字实际返回一个 IteratorResult 对象，它有两个属性，value 和 done。value 属性是对 yield 表达式求值的结果，而 done 是 false，表示生成器函数尚未完全完成。

一旦遇到 yield 表达式，生成器的代码将被暂停运行，直到生成器的 next() 方法被调用。每次调用生成器的 next() 方法时，生成器都会恢复执行，直到达到以下某个值：

yield，导致生成器再次暂停并返回生成器的新值。下一次调用 next() 时，在 yield 之后紧接着的语句继续执行。
throw 用于从生成器中抛出异常。这让生成器完全停止执行，并在调用者中继续执行，正如通常情况下抛出异常一样。
到达生成器函数的结尾.在这种情况下，生成器的执行结束，并且 IteratorResult 给调用者返回 value 的值是 undefined 并且 done 为 true。
到达 return 语句。在这种情况下，生成器的执行结束，并将 IteratorResult 返回给调用者，其 value 的值是由 return 语句指定的，并且 done 为 true。
如果将参数传递给生成器的 next() 方法，则该值将成为生成器当前 yield 操作返回的值。







## 1. 回调函数
从早期的Javascript代码来看，在ES6诞生之前，基本上所有的异步处理都是基于回调函数函数实现的，你们可能会见过下面这种代码：
```
ajax('aaa', () => {
    // callback 函数体
    ajax('bbb', () => {
        // callback 函数体
        ajax('ccc', () => {
            // callback 函数体
        })
    })
})
```
没错，在ES6出现之前，这种代码可以说是随处可见。它虽然解决了异步执行的问题，可随之而来的是我们常听说的回调地狱问题：

没有顺序可言：嵌套函数执行带来的是调试困难，不利于维护与阅读
耦合性太强：一旦某一个嵌套层级有改动，就会影响整个回调的执行

所以，为了解决这个问题，社区最早提出和实现了Promise，ES6将其写进了语言标准，统一了用法。
## 2.Promise
Promise 是异步编程的一种解决方案，比传统的解决方案——回调函数和事件——更合理和更强大。它就是为了解决回调函数产生的问题而诞生的。
有了Promise对象，就可以将异步操作以同步操作的流程表达出来，避免了层层嵌套的回调函数。此外，Promise对象提供统一的接口，使得控制异步操作更加容易。
所以上面那种回调函数的方式我们可以改成这样：(前提是ajax已用Promise包装)
```cpp
ajax('aaa').then(res=>{
  return ajax('bbb')
}).then(res=>{
  return ajax('ccc')
})
```

通过使用Promise来处理异步，比以往的回调函数看起来更加清晰了，解决了回调地狱的问题，Promise的then的链式调用更能让人接受，也符合我们同步的思想。
但Promise也有它的缺点：

Promise的内部错误使用try catch捕获不到，只能只用then的第二个回调或catch来捕获

```
let pro
try{
    pro = new Promise((resolve,reject) => {
        throw Error('err....')
    })
}catch(err){
    console.log('catch',err) // 不会打印
}
pro.catch(err=>{
    console.log('promise',err) // 会打印
})
```


Promise一旦新建就会立即执行，无法取消

## 3.Generator
Generator 函数是 ES6 提供的一种异步编程解决方案，语法行为与传统函数完全不同。
声明
与函数声明类似，不同的是function关键字与函数名之间有一个星号，以及函数体内部使用yield表达式，定义不同的内部状态（yield在英语里的意思就是“产出”）。
```
function* gen(x){
 const y = yield x + 6;
 return y;
}
// yield 如果用在另外一个表达式中,要放在()里面
// 像上面如果是在=右边就不用加()
function* genOne(x){
  const y = `这是第一个 yield 执行:${yield x + 1}`;
 return y;
}
```


```
const g = gen(1);
//执行 Generator 会返回一个Object,而不是像普通函数返回return 后面的值
g.next() // { value: 7, done: false }
//调用指针的 next 方法,会从函数的头部或上一次停下来的地方开始执行，直到遇到下一个 yield 表达式或return语句暂停,也就是执行yield 这一行
// 执行完成会返回一个 Object,
// value 就是执行 yield 后面的值,done 表示函数是否执行完毕
g.next() // { value: undefined, done: true }
// 因为最后一行 return y 被执行完成,所以done 为 true
```

调用 Generator 函数后，该函数并不执行，返回的也不是函数运行结果，而是一个指向内部状态的指针对象，也就是遍历器对象（Iterator Object）。下一步，必须调用遍历器对象的next方法，使得指针移向下一个状态。
所以上面的回调函数又可以写成这样：
```
function *fetch() {
    yield ajax('aaa')
    yield ajax('bbb')
    yield ajax('ccc')
}
let gen = fetch()
let res1 = gen.next() // { value: 'aaa', done: false }
let res2 = gen.next() // { value: 'bbb', done: false }
let res3 = gen.next() // { value: 'ccc', done: false }
let res4 = gen.next() // { value: undefined, done: true } done为true表示执行
```
由于 Generator 函数返回的遍历器对象，只有调用next方法才会遍历下一个内部状态，所以其实提供了一种可以暂停执行的函数。yield表达式就是暂停标志。
遍历器对象的next方法的运行逻辑如下。
+ 遇到yield表达式，就暂停执行后面的操作，并将紧跟在yield后面的那个表达式的值，作为返回的对象的value属性值。
+ 下一次调用next方法时，再继续往下执行，直到遇到下一个yield表达式。
+ 如果没有再遇到新的yield表达式，就一直运行到函数结束，直到return语句为止，并将return语句后面的表达式的值，作为返回的对象的value属性值。
+ 如果该函数没有return语句，则返回的对象的value属性值为undefined。
yield表达式本身没有返回值，或者说总是返回undefined。next方法可以带一个参数，该参数就会被当作上一个yield表达式的返回值。
例子：
```
function* foo(x) {
  var y = 2 * (yield (x + 1));
  var z = yield (y / 3);
  return (x + y + z);
}
var a = foo(5);
a.next() // Object{value:6, done:false}
a.next() // Object{value:NaN, done:false}
a.next() // Object{value:NaN, done:true}
var b = foo(5);
b.next() // { value:6, done:false }
b.next(12) // { value:8, done:false }
b.next(13) // { value:42, done:true }
```

由于yield没有返回值，所以（yield（x+1））执行后的值是undefined，所以在第二次执行a.next()是其实是执行的2*undefined，所以值是NaN，所以下面b的例子中，第二次执行b.next()时传入了12，它会当成第一次b.next()的执行返回值，所以b的例子中能够正确计算。这里不能把next执行结果中的value值与yield返回值搞混了，它两不是一个东西
yield与return的区别
相同点:

都能返回语句后面的那个表达式的值
都可以暂停函数执行

区别:

一个函数可以有多个 yield,但是只能有一个 return
yield 有位置记忆功能,return 没有

## 4.Async/await
Async/await其实就是上面Generator的语法糖，async函数其实就相当于funciton *的作用，而await就相当与yield的作用。而在async/await机制中，自动包含了我们上述封装出来的spawn自动执行函数。
所以上面的回调函数又可以写的更加简洁了：
```
async function fetch() {
  	await ajax('aaa')
    await ajax('bbb')
    await ajax('ccc')
}
// 但这是在这三个请求有相互依赖的前提下可以这么写，不然会产生性能问题，因为你每一个请求都需要等待上一次请求完成后再发起请求，如果没有相互依赖的情况下，建议让它们同时发起请求，这里可以使用Promise.all()来处理
```
```
const promise1 = Promise.resolve(3);
const promise2 = 42;
const promise3 = new Promise((resolve, reject) => {
  setTimeout(resolve, 100, 'foo');
});
Promise.all([promise1, promise2, promise3]).then((values) => {
  console.log(values);
});
// Expected output: Array [3, 42, "foo"]
```


async函数对Generator函数的改进，体现在以下四点：

内置执行器：async函数执行与普通函数一样，不像Generator函数，需要调用next方法，或使用co模块才能真正执行
语意化更清晰：async和await，比起星号和yield，语义更清楚了。async表示函数里有异步操作，await表示紧跟在后面的表达式需要等待结果。
适用性更广：co模块约定，yield命令后面只能是 Thunk 函数或 Promise 对象，而async函数的await命令后面，可以是 Promise 对象和原始类型的值（数值、字符串和布尔值，但这时会自动转成立即 resolved 的 Promise 对象）。
返回值是Promise：async函数的返回值是 Promise 对象，这比 Generator 函数的返回值是 Iterator 对象方便多了。你可以用then方法指定下一步的操作。

async函数
async函数的返回值为Promise对象，所以它可以调用then方法
```
async function fn() {
  return 'async'
}
fn().then(res => {
  console.log(res) // 'async'
})
```
await表达式
await 右侧的表达式一般为 promise 对象, 但也可以是其它的值

如果表达式是 promise 对象, await 返回的是 promise 成功的值
如果表达式是其它值, 直接将此值作为 await 的返回值
await后面是Promise对象会阻塞后面的代码，Promise 对象 resolve，然后得到 resolve 的值，作为 await 表达式的运算结果
所以这就是await必须用在async的原因，async刚好返回一个Promise对象，可以异步执行阻塞



## 总结

线程是为了操作系统“同时”运行更多的程序。协程是为了让一个线程内的程序并发服务更多内容。线程切换是由操作系统的时间片控制的，而协程是程序自己实现的。，协程的切换不是按照时间来算的，而是按照代码既定分配，就是说代码运行到这一行才启动协程，协程是可以由我们程序设计者自己操控的，所以 Generator（协程）作用只有一个，在用户态可以细粒度地控制任务的切换。
