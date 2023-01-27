let MyPromise = function () {
    Promise.resolve("3211111")
        .then((e) => {

            console.log("----")
            return e

        }).then((e) => {

            console.log("----")
            return e

        }).then((e) => {

            console.log("----")
            return e

        }).then((e) => {
            // for (let i = 0; i < 10000000000; i++) {
            // }
            console.log("----")
        }).catch(error => console.log(error));
}

let MMyPromise = function () {
    Promise.resolve("3211111")
        .then((e) => {

            console.log("++++")
            return e

        }).then((e) => {

            console.log("++++")
            return e

        }).then((e) => {

            console.log("++++")
            return e

        }).then((e) => {
            // for (let i = 0; i < 10000000000; i++) {
            // }
            console.log("++++")
        }).catch(error => console.log(error));
}
function* test() {

    yield myPromise();


};
function sss() {
    console.log("----")
    // for (let i = 0; i < 10000000000; i++) {

    // }
}
async function myPromise() {
    await sss()
    await console.log("----")
    await console.log("----")
    await console.log("----")
}
async function fetchs() {

    await console.log("8888")
    await console.log("8888")

    await myPromise()
    await MyPromise()
    // await MMyPromise()

    await console.log("8888")
    await console.log("8888")
    await console.log("8888")

}

// fetchs()
MyPromise()
MMyPromise()
console.log("000000")
