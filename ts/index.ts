
declare var marked: { parse:Function
} 


//获取网页根目录
function getBasePath() {
    var obj = window.location;
    var contextPath = obj.pathname.split("/")[0];
    var basePath = obj.protocol + "//" + obj.host + "/" + contextPath;
    return basePath;
}
var article_json;
//每页的文章数量
var pages = 4
//分页个数
var page_num = 1
//文章数
var length = 0

function create(text: any, index: string) {
    let temp = document.createElement("div")
    let h1 = document.createElement("a")
    h1.innerHTML = marked.parse(text[index]["title"])
    let div_p = document.createElement("div")
    div_p.className = "div_p"
    let title = document.createElement("div")
    title.className = "title_a"
    div_p.innerHTML = marked.parse(text[index]["content"])
    // let indexx = Object.keys(text).sort(function (a, b) { return b - a })[index - 1]
    let div_s = document.createElement("div")
    div_s.className = "div_s"
    h1.href = "./html/domain.html" + "?domain=" + text[index]["index"]

    title.appendChild(h1)
    temp.appendChild(title)
    div_s.appendChild(div_p)
    temp.appendChild(div_s)
    return temp;
}
function change_page() {

    let previous_page: HTMLButtonElement = document.querySelector(".previous-page") as HTMLButtonElement
    if (previous_page != null) {
        previous_page.addEventListener("click", () => {
            let buttons = document.querySelectorAll<HTMLButtonElement>("#paging .paging-index button")
            let href: string = window.location.href;
            let index: string = (href.match(/\?paging=(.*)/) as RegExpMatchArray)[1]
            let index_num: number = parseInt(index)
            if (index_num - 1 >= 1) {
                buttons[index_num - 2].click();
            }
        })
    }
    let next_page: HTMLButtonElement = document.querySelector(".next-page") as HTMLButtonElement
    if (next_page != null) {
        next_page.addEventListener("click", () => {
            let buttons = document.querySelectorAll<HTMLButtonElement>("#paging .paging-index button")
            let href: string = window.location.href;
            let index: string = (href.match(/\?paging=(.*)/) as RegExpMatchArray)[1]
            let index_num: number = parseInt(index)
            if (index_num + 1 <= page_num) {
                buttons[index_num].click();
            }
        })
    }
}
function init_page() {
    let href: string = window.location.href;
    let buttons = document.querySelectorAll<HTMLButtonElement>("#paging .paging-index button")
    for (let j of buttons) {
        if (href.match(/\?paging=(.*)/) == null) {
            j.click()
            break;
        }
        else if (j.value === (href.match(/\?paging=(.*)/) as RegExpMatchArray)[1]) {
            j.click();
            break;
        }
    }
}
async function init_index() {

    let url = "article/domain.json"
    let text = await fetch(url)
    text = await text.json()
    length = Object.keys(text).length;
    let paging_index: HTMLDivElement | null = document.querySelector(".paging .paging-index")
    if (paging_index == null) {
        console.log("paging_index_is_null")
    }
    else {
        page_num = (length + pages - 1) / pages
        for (let i = 1; i <= page_num; i++) {
            let button = document.createElement("button")
            button.className = "button_off";
            button.innerHTML = i.toString();
            button.value = i.toString()
            button.addEventListener("click", () => {
                let art: HTMLDivElement | null = document.querySelector(".layout-content>.articles")
                if (art != null) {
                    art.innerHTML = ""
                    // let temp = document.createElement("div")
                    let href = window.location.href;
                    let index = "0"
                    if (href.match(/\?paging=(.*)/) != null) {
                        index = (href.match(/\?paging=(.*)/) as RegExpMatchArray)[1];
                        if (index != i.toString()) {
                            history.pushState(null, "", '?paging=' + i.toString())
                        }
                    }
                    else {
                        history.pushState(null, "", '?paging=' + "1")
                    }
                    let start = (i - 1) * pages + 1
                    let end = start + ((length - start + 1) < pages ? (length - start + 1) : pages)
                    for (let i = start; i < end; i++) {
                        art.appendChild(create(text, i.toString()))
                    }
                }


            })
            paging_index.appendChild(button)
        }
    }


    let buttons = document.querySelectorAll<HTMLButtonElement>(".paging .paging-index>button")
    if (buttons == null) {
        console.log("buttons_id_null")
    }
    else {
        for (let button of buttons) {
            button.addEventListener("click", () => {
                let href = window.location.href;
                for (let j of buttons) {
                    if (j.value == (href.match(/\?paging=(.*)/) as RegExpMatchArray)[1]) {
                        j.className = "button_on"
                    }
                    else {
                        j.className = "button_off"
                    }

                }

            })
        }
    }

    init_page()

}
window.addEventListener('load', init_index)
window.addEventListener("load", change_page)
window.addEventListener("popstate", () => {
    let href = window.location.href;
    let index = "0"

    index = (href.match(/\?paging=(.*)/) as RegExpMatchArray)[1];//取 data=后面所有字符串

    let num = parseInt(index)
    if (num != 0) {
        let buttons = document.querySelectorAll<HTMLButtonElement>(".paging .paging-index>button")
        buttons[num - 1].click()
    }

});
//indivdualSpace
window.addEventListener("load", () => {

    (document.querySelector("#identity-visitor") as HTMLDivElement).addEventListener("click", () => {

        window.location.href = "../html/individualSpace.html"
    })


})
//complex search 
window.addEventListener("load", () => {
    let searchs = document.querySelectorAll(".search-complex svg")
    for (let x of searchs) {
        x.addEventListener("click", () => {
            window.location.href = "../html/search.html"
        })
    }

})
window.addEventListener("load", () => {

    time()

})

function time() {
    let nowDate = new Date()
    let sencond = ``
    for (let i = 0; i < 60; i++) {
        let onediv = `<div id = "sencond${i}" style="width: 100%;text-align: right;position: absolute;display: inline-block;transform: rotate(${(i) * -6}deg);"> ${i} 秒</div>`
        sencond = sencond + onediv
    }

    (document.querySelector('.secondBox') as HTMLDivElement).innerHTML = sencond
    let minute = ``
    for (let i = 0; i < 60; i++) {
        let onediv = `<div id = "minute${i}"  style="width: 100%;text-align: right;position: absolute;display: inline-block;transform: rotate(${(i) * -6}deg);"> ${i} 分</div>`
        minute = minute + onediv
    }
    (document.querySelector('.minuteBox') as HTMLDivElement).innerHTML = minute
    let hour = ``
    for (let i = 0; i < 24; i++) {
        let onediv = `<div id = "hour${i}" style="width: 100%;text-align: right;position: absolute;display: inline-block;transform: rotate(${(i) * -15}deg);"> ${i} 时</div>`
        hour = hour + onediv
    }
    (document.querySelector('.hourBox') as HTMLDivElement).innerHTML = hour
    let day = ``
    let mounthtemp = nowDate.getMonth()
    let yeartemp = nowDate.getFullYear()

    let d = new Date(yeartemp, mounthtemp, 0);

    for (let i = 0; i < d.getDate(); i++) {
        let onediv = `<div id = "day${i + 1}" style="width: 100%;text-align: right;position: absolute;display: inline-block;transform: rotate(${(i) * -(360 / d.getDate())}deg);"> ${i + 1} 日</div>`
        day = day + onediv
    }
    (document.querySelector('.dayBox') as HTMLDivElement).innerHTML = day
    let mounth = ``
    for (let i = 0; i < 12; i++) {
        let onediv = `<div id = "mounth${i}" style="width: 100%;text-align: right;position: absolute;display: inline-block;transform: rotate(${(i) * -30}deg);"> ${i + 1} 月</div>`
        mounth = mounth + onediv
    }
    (document.querySelector('.mounthBox') as HTMLDivElement).innerHTML = mounth

    var sencond360 = 0
    var Minute360 = 0
    var hour360 = 0
    var day360 = 0
    var mounth360 = 0

    var oldsencond = 0
    var oldMinute = 0
    var oldhour = 0
    var oldday = 0
    var oldmounth = 0


    function transformBox() {

        let nowDate = new Date()
        let sencond = nowDate.getSeconds()
        let minute = nowDate.getMinutes()
        let hour = nowDate.getHours()
        let day = nowDate.getDate()
        let mounth = nowDate.getMonth()
        let year = nowDate.getFullYear()
        let d = new Date(year, mounth, 0);

        if (sencond === 0 && oldsencond !== sencond) {
            sencond360 = sencond360 + 1
        }
        if (minute === 0 && oldMinute !== minute) {
            Minute360 = Minute360 + 1
        }
        if (hour === 0 && oldhour !== hour) {
            hour360 = hour360 + 1
        }
        if (day === 1 && oldday !== day) {
            day360 = day360 + 1
        }
        if (mounth === 0 && oldmounth !== mounth) {
            mounth360 = mounth360 + 1
        }

        if (sencond360 >= 24 * 60) {
            sencond360 = 0
            Minute360 = 0
            hour360 = 0
            day360 = 0
            mounth360 = 0
        }

        (document.querySelector('.secondBox') as HTMLDivElement).style.transform = `rotate(${sencond360 * 360 + (sencond) * 6}deg)`;
        (document.querySelector('.minuteBox') as HTMLDivElement).style.transform = `rotate(${Minute360 * 360 + (minute) * 6}deg)`;
        (document.querySelector('.hourBox') as HTMLDivElement).style.transform = `rotate(${hour360 * 360 + (hour) * 15}deg)`;
        (document.querySelector('.dayBox') as HTMLDivElement).style.transform = `rotate(${day360 * 360 + (day - 1) * 360 / d.getDate()}deg)`;
        (document.querySelector('.mounthBox') as HTMLDivElement).style.transform = `rotate(${mounth360 * 360 + (mounth) * 30}deg)`;
        (document.querySelector('.yearBox') as HTMLDivElement).innerHTML = year + ' 年'

        let nowDates = document.querySelectorAll('.NowData')
        for (let element of nowDates) {
            element.className = ''
        }

        document.querySelector(`#sencond${sencond}`)?.classList.add("NowData")
        document.querySelector(`#minute${minute}`)?.classList.add("NowData")
        document.querySelector(`#hour${hour}`)?.classList.add("NowData")
        document.querySelector(`#day${day}`)?.classList.add("NowData")
        document.querySelector(`#mounth${mounth}`)?.classList.add("NowData")

        oldsencond = sencond
        oldMinute = minute
        oldhour = hour
        oldday = day
        oldmounth = mounth

    }
    setInterval(() => {
        transformBox()

    }, 1000);
}

