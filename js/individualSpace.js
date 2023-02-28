"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function combineDebounceThrottle(func, wait) {
    var lastTime = 0;
    var timeoutD;
    var timeoutT;
    var later = function (...args) {
        clearTimeout(timeoutD);
        clearTimeout(timeoutT);
        timeoutD = null;
        timeoutT = null;
        lastTime = Date.now();
        func.apply(null, args);
    };
    return function (...args) {
        var now = Date.now();
        var coolingDown = now - lastTime < wait;
        clearTimeout(timeoutD);
        if (!timeoutT && !coolingDown) {
            timeoutT = setTimeout(later, wait, 'throttle', ...args);
        }
        else {
            timeoutD = setTimeout(later, wait, 'debounce', ...args);
        }
    };
}
//获取网页根目录
function getBasePath() {
    var obj = window.location;
    var contextPath = obj.pathname.split("/")[0];
    var basePath = obj.protocol + "//" + obj.host + "/" + contextPath;
    return basePath;
}
if (sessionStorage.getItem("content") == null) {
    sessionStorage.setItem("content", "");
}
if (sessionStorage.getItem("title") == null) {
    sessionStorage.setItem("title", "");
}
if (sessionStorage.getItem("category") == null) {
    sessionStorage.setItem("category", "1");
}
if (sessionStorage.getItem("synopsis") == null) {
    sessionStorage.setItem("synopsis", "");
}
if (sessionStorage.getItem("navigation_article") == null) {
    sessionStorage.setItem("navigation_article", "dynamic");
}
if (sessionStorage.getItem("article_index") == null) {
    sessionStorage.setItem("article_index", "");
}
if (sessionStorage.getItem("category_delete") == null) {
    sessionStorage.setItem("category_delete", "");
}
// function setNativeValue(element, value) {
//     const valueSetter = Object.getOwnPropertyDescriptor(element.__proto__, 'value').set;
//     const prototype = Object.getPrototypeOf(element);
//     const prototypeValueSetter = Object.getOwnPropertyDescriptor(prototype, 'value').set;
//     if (valueSetter && valueSetter !== prototypeValueSetter) {
//         prototypeValueSetter.call(element, value);
//     } else {
//         valueSetter.call(element, value)
//     }
// }
function addAuxiliary(element, value, focus_start, focus_end) {
    let startPos = element.selectionStart;
    let endPos = element.selectionEnd;
    let beforeValue = element.value.substring(0, startPos);
    let afterValue = element.value.substring(endPos, element.value.length);
    element.value = beforeValue + value + afterValue;
    element.selectionStart = startPos + focus_start; // 设置光标开始的位置
    element.selectionEnd = startPos + focus_end; // 设置光标开始的位置
    element.focus();
}
var scrolltime = null;
var article_json;
//每页的文章数量
var pages = 3;
//分页个数
var page_num = 1;
//文章数
var length = 0;
function create(article_json, init_domain_json, index) {
    let temp = document.createElement("div");
    let h1 = document.createElement("a");
    let title = document.createElement("div");
    title.className = "title_a";
    let div = document.createElement("div");
    div.className = "user_and_time";
    let authorname = document.createElement("a");
    //
    let indexx = Object.keys(article_json).sort(function (a, b) { return parseInt(b) - parseInt(a); })[parseInt(index) - 1];
    //  let indexx= Object.keys(article_json)[index-1]
    h1.innerHTML = marked.parse(article_json[indexx]["title"]);
    let div_buttons = document.createElement("div");
    div_buttons.className = "div_buttons";
    let div_button1 = document.createElement("input");
    div_button1.value = "更新";
    div_button1.type = "button";
    div_button1.addEventListener("click", () => __awaiter(this, void 0, void 0, function* () {
        sessionStorage.setItem("category_delete", article_json[indexx]["category"]);
        sessionStorage.setItem("category", article_json[indexx]["category"]);
        sessionStorage.setItem("article_index", indexx);
        sessionStorage.setItem("title", article_json[indexx]["title"]);
        sessionStorage.setItem("synopsis", article_json[indexx]["synopsis"]);
        document.querySelector("#title").value = article_json[indexx]["title"];
        let synopsis = document.querySelector("#synopsis");
        synopsis.value = article_json[indexx]["synopsis"];
        let category = document.querySelector("#category");
        category.value = article_json[indexx]["category"];
        let url = "../article/" + article_json[indexx]["category"] + "/md/" + indexx + ".md";
        let content = yield fetch(url);
        let content_ = yield content.text();
        sessionStorage.setItem("content", content_);
        document.querySelector("#un_full_screen_content_left").value = content_;
        document.querySelector("#create-articles").click();
        if (sessionStorage.getItem("navigation_article") == "dynamic") {
            document.querySelector("#drafts").className = "";
            document.querySelector("#announce").className = "displaynone";
            document.querySelector("#updatearticle").className = "";
            document.querySelector("#cancelupdate").className = "";
        }
        if (sessionStorage.getItem("navigation_article") == "manuscript") {
            document.querySelector("#drafts").className = "displaynone";
            document.querySelector("#announce").className = "";
            document.querySelector("#updatearticle").className = "";
            document.querySelector("#cancelupdate").className = "";
        }
    }));
    let div_button2 = document.createElement("input");
    div_button2.type = "button";
    div_button2.value = "删除";
    div_button2.addEventListener("click", () => __awaiter(this, void 0, void 0, function* () {
        sessionStorage.setItem("article_index", indexx);
        sessionStorage.setItem("category_delete", article_json[indexx]["category"]);
        delete_article();
        document.querySelector("#" + sessionStorage.getItem("navigation_article")).click();
    }));
    div_buttons.appendChild(div_button1);
    div_buttons.appendChild(div_button2);
    let div_s = document.createElement("div");
    div_s.className = "div_s";
    let div_p = document.createElement("div");
    div_p.className = "div_p";
    div_p.innerHTML = marked.parse(article_json[indexx]["synopsis"]);
    authorname.innerHTML = "作者：" + (article_json[indexx]["author"]);
    authorname.addEventListener("click", () => {
        sessionStorage.setItem("author_id", article_json[indexx]["author_id"]);
    });
    let span0 = document.createElement("span");
    let span1 = document.createElement("span");
    let span2 = document.createElement("span");
    let span3 = document.createElement("span");
    span0.innerHTML = "文章类别：" + init_domain_json[article_json[indexx]["category"]]["label"];
    // span1.innerHTML = "评论数：" + article_json[indexx]["comment_amount"]
    // span2.innerHTML = "点赞数：" + article_json[indexx]["favorite_amount"]
    span3.innerHTML = "发布时间：" + (article_json[indexx]["createtime"]);
    authorname.href = getBasePath() + "/html/individualSpace.html";
    // createtime.appendChild(span1)
    // createtime.appendChild(span2)
    title.appendChild(h1);
    temp.appendChild(title);
    div_s.appendChild(div_p);
    div_s.appendChild(div_buttons);
    temp.appendChild(div_s);
    div.appendChild(authorname);
    div.appendChild(span0);
    div.appendChild(span3);
    temp.appendChild(div);
    h1.href = "../html/content.html?domain=" + article_json[indexx]["category"] + "?index=" + indexx;
    // h1.target="_blank"
    return temp;
}
function change_page() {
    let previous_page = document.querySelector(".previous-page");
    let next_page = document.querySelector(".next-page");
    previous_page === null || previous_page === void 0 ? void 0 : previous_page.addEventListener("click", () => {
        let buttons = document.querySelectorAll("#paging .paging-index button");
        let href = window.location.href;
        let index = href.match(/\?paging=(.*)/)[1];
        let index_ = parseInt(index);
        if (index_ - 1 >= 1) {
            buttons[index_ - 2].click();
        }
    });
    next_page.addEventListener("click", () => {
        let buttons = document.querySelectorAll("#paging .paging-index button");
        let href = window.location.href;
        let index = href.match(/\?paging=(.*)/)[1];
        let index_ = parseInt(index);
        if (index_ + 1 <= page_num) {
            buttons[index_].click();
        }
    });
}
function init_page() {
    let buttons = document.querySelectorAll("#paging .paging-index button");
    if (buttons.length != 0) {
        buttons[0].click();
    }
    // for (let j of buttons) {
    //     if (href.match(/\?paging=(.*)/) === null) {
    //         j.click()
    //         break;
    //     }
    //     else if (j.value === href.match(/\?paging=(.*)/)[1]) {
    //         j.click();
    //         break;
    //     }
    // }
}
function announce_article() {
    return __awaiter(this, void 0, void 0, function* () {
        let url = "";
        let index = sessionStorage.getItem("article_index");
        if (index == "") {
            url = "/articleAannounce";
        }
        else {
            url = "/articleUpdate";
        }
        let title = sessionStorage.getItem("title");
        let synopsis = sessionStorage.getItem("synopsis");
        let category = sessionStorage.getItem("category");
        let content = sessionStorage.getItem("content");
        let body_ = {};
        body_["index"] = index;
        body_["title"] = title;
        body_["synopsis"] = synopsis;
        body_["category"] = category;
        body_["content"] = content;
        body_["category_delete"] = sessionStorage.getItem("category_delete");
        body_["state"] = "announce";
        body_["author"] = "Smily";
        let resp = yield fetch(url, {
            method: 'POST',
            body: JSON.stringify(body_),
            headers: { 'Content-Type': "application/json; charset=utf-8" },
        });
        let resp_ = yield resp.text();
        sessionStorage.setItem("article_index", "");
        console.log(resp_);
    });
}
function drafts_article() {
    return __awaiter(this, void 0, void 0, function* () {
        let url = "";
        let index = sessionStorage.getItem("article_index");
        if (index == "") {
            url = "/articleAannounce";
        }
        else {
            url = "/articleUpdate";
        }
        let title = sessionStorage.getItem("title");
        let synopsis = sessionStorage.getItem("synopsis");
        let category = sessionStorage.getItem("category");
        let content = sessionStorage.getItem("content");
        let body_ = {};
        body_["index"] = index;
        body_["title"] = title;
        body_["synopsis"] = synopsis;
        body_["category"] = category;
        body_["category_delete"] = sessionStorage.getItem("category_delete");
        body_["content"] = content;
        body_["state"] = "drafts";
        body_["author"] = "Smily";
        let resp = yield fetch(url, {
            method: 'POST',
            body: JSON.stringify(body_),
            headers: { 'Content-Type': "application/json; charset=utf-8" },
        });
        let resp_ = yield resp.text();
        sessionStorage.setItem("article_index", "");
        console.log(resp_);
    });
}
function delete_article() {
    return __awaiter(this, void 0, void 0, function* () {
        let url = "/articleDelete";
        let body_ = {};
        body_["index"] = sessionStorage.getItem("article_index");
        body_["category_delete"] = sessionStorage.getItem("category_delete");
        let resp = yield fetch(url, {
            method: 'POST',
            body: JSON.stringify(body_),
            headers: { 'Content-Type': "application/json; charset=utf-8" },
        });
        let resp_ = yield resp.text();
        sessionStorage.setItem("article_index", "");
        console.log(resp_);
    });
}
function update_article() {
    return __awaiter(this, void 0, void 0, function* () {
        let url = "/articleUpdate";
        let title = sessionStorage.getItem("title");
        let synopsis = sessionStorage.getItem("synopsis");
        let category = sessionStorage.getItem("category");
        let content = sessionStorage.getItem("content");
        let state = "announce";
        if (sessionStorage.getItem("navigation_article") == "manuscript") {
            state = "drafts";
        }
        if (sessionStorage.getItem("navigation_article") == "dynamic") {
            state = "announce";
        }
        let body_ = {};
        body_["index"] = sessionStorage.getItem("article_index");
        body_["title"] = title;
        body_["synopsis"] = synopsis;
        body_["category"] = category;
        body_["category_delete"] = sessionStorage.getItem("category_delete");
        body_["content"] = content;
        body_["state"] = state;
        body_["author"] = "Smily";
        let resp = yield fetch(url, {
            method: 'POST',
            body: JSON.stringify(body_),
            headers: { 'Content-Type': "application/json; charset=utf-8" },
        });
        let resp_ = yield resp.text();
        sessionStorage.setItem("article_index", "");
        console.log(resp_);
    });
}
function article_display(state) {
    return __awaiter(this, void 0, void 0, function* () {
        let init_domain_json = yield init_domain();
        let text = {};
        for (let domain of Object.keys(init_domain_json)) {
            let url = getBasePath() + "/article/" + domain + "/article.json";
            let articlejson = yield fetch(url, {
                method: 'GET',
                headers: { 'Content-Type': "application/json; charset=utf-8" },
            });
            let articlejson_ = yield articlejson.json();
            text = Object.assign(text, articlejson_);
        }
        let article_json = {};
        if (state == "announce") {
            let keys = Object.keys(text);
            for (let key of keys) {
                if (text[key]["state"] == state) {
                    article_json[key] = text[key];
                }
            }
        }
        if (state == "drafts") {
            let keys = Object.keys(text);
            for (let key of keys) {
                if (text[key]["state"] == state) {
                    article_json[key] = text[key];
                }
            }
        }
        if (state == "") {
            article_json = text;
        }
        let art = document.querySelector(".layout-content>#articles");
        art.innerHTML = "";
        length = Object.keys(article_json).length;
        let paging_index = document.querySelector("#paging .paging-index");
        paging_index.innerHTML = "";
        // for (let x of document.querySelectorAll<HTMLButtonElement>("#paging .paging-index button"))
        //  {
        //     x.remove()
        // }
        page_num = (length + pages - 1) / pages;
        let page_num_ = parseInt(page_num.toString());
        if (page_num_ == 0) {
            art.innerHTML = "暂无数据！";
        }
        for (let i = 1; i <= page_num_; i++) {
            let button = document.createElement("button");
            button.className = "button_off";
            button.innerHTML = i.toString();
            button.value = i.toString();
            button.addEventListener("click", () => {
                let art = document.querySelector(".layout-content>#articles");
                art.innerHTML = "";
                // let temp = document.createElement("div")
                let href = window.location.href;
                let index = "0";
                if (href.match(/\?paging=(.*)/) != null) {
                    index = href.match(/\?paging=(.*)/)[1];
                    if (index != i.toString()) {
                        history.pushState(null, null, '?paging=' + i.toString());
                    }
                }
                else {
                    history.pushState(null, null, '?paging=' + "1");
                }
                let start = (i - 1) * pages + 1;
                let end = start + ((length - start + 1) < pages ? (length - start + 1) : pages);
                for (let i = start; i < end; i++) {
                    art.appendChild(create(article_json, init_domain_json, i.toString()));
                }
                // art.innerHTML = temp.innerHTML
            });
            paging_index.appendChild(button);
        }
        let buttons = paging_index.querySelectorAll("button");
        for (let button of buttons) {
            button.addEventListener("click", () => {
                let href = window.location.href;
                for (let j of buttons) {
                    if (j.value === href.match(/\?paging=(.*)/)[1]) {
                        j.className = "button_on";
                    }
                    else {
                        j.className = "button_off";
                    }
                }
            });
        }
        init_page();
    });
}
function select(content_index) {
    return __awaiter(this, void 0, void 0, function* () {
        const content = document.querySelector("#articles");
        const create = document.querySelector("#create");
        const paging = document.querySelector("#paging");
        const dynamic = document.querySelector("#dynamic");
        const manuscript = document.querySelector("#manuscript");
        const create_articles = document.querySelector("#create-articles");
        if (content_index == "dynamic") {
            dynamic.className = "navigation-article-show";
        }
        else {
            dynamic.className = "navigation-article-hidden";
        }
        if (content_index == "manuscript") {
            manuscript.className = "navigation-article-show";
        }
        else {
            manuscript.className = "navigation-article-hidden";
        }
        if (content_index == "dynamic" || content_index == "manuscript") {
            content.className = "articles";
            paging.className = "paging";
        }
        else {
            content.className = "articles-hidden";
            paging.className = "paging-hidden";
        }
        if (content_index == "create-articles") {
            create.className = "create";
            create_articles.className = "navigation-article-show";
        }
        else {
            create.className = "create-hidden";
            create_articles.className = "navigation-article-hidden";
        }
    });
}
function init_domain() {
    return __awaiter(this, void 0, void 0, function* () {
        let url = getBasePath() + "article/domain.json";
        let text_ = yield fetch(url);
        let text = yield text_.json();
        length = Object.keys(text).length;
        let select = document.querySelector("#category");
        select.innerHTML = "";
        for (let i = 1; i <= length; i++) {
            let option = document.createElement("option");
            option.innerHTML = text[i]["label"];
            option.value = text[i]["index"];
            select.appendChild(option);
        }
        return text;
    });
}
window.addEventListener("load", () => {
    document.querySelector(".logos a").addEventListener("click", () => {
        let buttons = document.querySelectorAll("#paging .paging-index>button");
        if (buttons.length > 0) {
            buttons[0].click();
        }
    });
});
window.addEventListener("popstate", () => {
    let href = window.location.href;
    let index = "0";
    // var code1 = href.match(/\?data=(.*)/)[1];//取 ?data=后面所有字符串
    // var code3 = href.match(/data=(.*)/)[0]; //取 包含 data=及后面的字符串
    // buttons[num-1].click()
    if (href.match(/\?paging=(.*)/) != null) {
        index = href.match(/\?paging=(.*)/)[1]; //取 data=后面所有字符串
    }
    let num = parseInt(index);
    if (num != 0) {
        let buttons = document.querySelectorAll("#paging .paging-index>button");
        buttons[num - 1].click();
    }
});
window.addEventListener('load', () => {
    document.querySelector("#create-articles").addEventListener("click", () => {
        select("create-articles");
    });
    document.querySelector("#manuscript").addEventListener("click", () => {
        // history.pushState(null, null, '?paging=' + "1")
        document.querySelector("#drafts").className = "";
        document.querySelector("#announce").className = "";
        document.querySelector("#updatearticle").className = "displaynone";
        document.querySelector("#cancelupdate").className = "displaynone";
        article_display("drafts");
        select("manuscript");
        sessionStorage.setItem("navigation_article", "manuscript");
    });
    let dynamic = document.querySelector("#dynamic");
    dynamic.addEventListener("click", () => {
        // history.pushState(null, null, '?paging=' + "1");
        document.querySelector("#drafts").className = "";
        document.querySelector("#announce").className = "";
        document.querySelector("#updatearticle").className = "displaynone";
        document.querySelector("#cancelupdate").className = "displaynone";
        article_display("announce");
        select("dynamic");
        sessionStorage.setItem("navigation_article", "dynamic");
    });
    dynamic.className = "navigation-article-show";
});
window.addEventListener("load", () => {
    let full_preview = document.querySelector("#full_preview");
    let full_un_preview = document.querySelector("#full_un_preview");
    let un_full_preview = document.querySelector("#un_full_preview");
    let un_full_un_preview = document.querySelector("#un_full_un_preview");
    let full_screen_div_left = document.querySelector("#full_screen_div_left");
    let full_screen_div_right = document.querySelector("#full_screen_div_right");
    let un_full_screen_div_left = document.querySelector("#un_full_screen_div_left");
    let un_full_screen_div_right = document.querySelector("#un_full_screen_div_right");
    full_preview.addEventListener("click", () => {
        let full_screen_content_right = document.querySelector("#full_screen_content_right");
        let temp = document.createElement("div");
        full_screen_content_right.innerHTML = "";
        temp.innerHTML = marked.parse(sessionStorage.getItem("content"));
        for (const element of temp.querySelectorAll("pre code")) {
            hljs.highlightElement(element);
        }
        full_screen_content_right.appendChild(temp);
        full_preview.className = "div_svg_hidden";
        full_un_preview.className = "div_svg_show";
        full_screen_div_left.className = "content-left-unfull";
        full_screen_div_right.className = "content-right-full";
    });
    full_un_preview.addEventListener("click", () => {
        full_un_preview.className = "div_svg_hidden";
        full_preview.className = "div_svg_show";
        full_screen_div_left.className = "content-left-full";
        full_screen_div_right.className = "content-right-unfull";
    });
    un_full_un_preview.addEventListener("click", () => {
        un_full_un_preview.className = "div_svg_hidden";
        un_full_preview.className = "div_svg_show";
        un_full_screen_div_left.className = "content-left-full";
        un_full_screen_div_right.className = "content-right-unfull";
    });
    un_full_preview.addEventListener("click", () => {
        let un_full_screen_content_right = document.querySelector("#un_full_screen_content_right");
        let temp = document.createElement("div");
        un_full_screen_content_right.innerHTML = "";
        temp.innerHTML = marked.parse(sessionStorage.getItem("content"));
        for (const element of temp.querySelectorAll("pre code")) {
            hljs.highlightElement(element);
        }
        un_full_screen_content_right.appendChild(temp);
        un_full_un_preview.className = "div_svg_show";
        un_full_preview.className = "div_svg_hidden";
        un_full_screen_div_left.className = "content-left-unfull";
        un_full_screen_div_right.className = "content-right-full";
    });
});
window.addEventListener("load", () => {
    let text;
    let full_screen_content_right = document.querySelector("#full_screen_content_right");
    let un_full_screen_content_right = document.querySelector("#un_full_screen_content_right");
    let full_screen_content_left = document.querySelector("#full_screen_content_left");
    let un_full_screen_content_left = document.querySelector("#un_full_screen_content_left");
    if (sessionStorage.getItem("content") != null) {
        let temp = document.createElement("div");
        let temp1 = document.createElement("div");
        full_screen_content_right.innerHTML = "";
        un_full_screen_content_right.innerHTML = "";
        text = sessionStorage.getItem("content");
        un_full_screen_content_left.value = text;
        full_screen_content_left.value = text;
        temp.innerHTML = marked.parse(text);
        for (const element of temp.querySelectorAll("pre code")) {
            hljs.highlightElement(element);
        }
        temp1.innerHTML = marked.parse(text);
        for (const element of temp1.querySelectorAll("pre code")) {
            hljs.highlightElement(element);
        }
        full_screen_content_right.appendChild(temp);
        un_full_screen_content_right.appendChild(temp1);
    }
    if (sessionStorage.getItem("title") != null) {
        document.querySelector("#title").value = sessionStorage.getItem("title");
    }
    if (sessionStorage.getItem("synopsis") != null) {
        document.querySelector("#synopsis").value = sessionStorage.getItem("synopsis");
    }
    let category = document.querySelector("#category");
    category.addEventListener('click', (e) => {
        sessionStorage.setItem("category", e.target.value);
    });
    let title = document.querySelector("#title");
    title.addEventListener('input', () => {
        sessionStorage.setItem("title", title.value);
    });
    let synopsis = document.querySelector("#synopsis");
    synopsis.addEventListener('input', () => {
        sessionStorage.setItem("synopsis", synopsis.value);
    });
    full_screen_content_left.addEventListener('input', combineDebounceThrottle(() => {
        text = full_screen_content_left.value;
        sessionStorage.setItem("content", text);
        let full_screen_div_right = document.querySelector("#full_screen_div_right");
        if (full_screen_div_right.className == "content-right-full") {
            let temp = document.createElement("div");
            full_screen_content_right.innerHTML = "";
            temp.innerHTML = marked.parse(text);
            for (const element of temp.querySelectorAll("pre code")) {
                hljs.highlightElement(element);
            }
            full_screen_content_right.appendChild(temp);
        }
    }, 500));
    un_full_screen_content_left.addEventListener('input', combineDebounceThrottle(() => {
        text = un_full_screen_content_left.value;
        sessionStorage.setItem("content", text);
        let un_full_screen_div_right = document.querySelector("#un_full_screen_div_right");
        if (un_full_screen_div_right.className == "content-right-full") {
            let temp = document.createElement("div");
            un_full_screen_content_right.innerHTML = "";
            temp.innerHTML = marked.parse(text);
            for (const element of temp.querySelectorAll("pre code")) {
                hljs.highlightElement(element);
            }
            un_full_screen_content_right.appendChild(temp);
        }
    }, 500));
});
window.addEventListener("load", () => {
    let full_screen = document.querySelector("#full_screen");
    let full_screen_show = document.querySelector("#full_screen_show");
    let layout = document.querySelector("#layout");
    let un_full_screen = document.querySelector("#un_full_screen");
    full_screen.addEventListener("click", () => {
        layout.className = "layout";
        full_screen_show.className = "full_screen_hidden";
        let un_full_screen_content_left = document.querySelector("#un_full_screen_content_left");
        un_full_screen_content_left.value = sessionStorage.getItem("content");
        let un_full_screen_div_right = document.querySelector("#un_full_screen_div_right");
        if (un_full_screen_div_right.className == "content-right-full") {
            let un_full_screen_content_right = document.querySelector("#un_full_screen_content_right");
            let temp = document.createElement("div");
            un_full_screen_content_right.innerHTML = "";
            temp.innerHTML = marked.parse(sessionStorage.getItem("content"));
            for (const element of temp.querySelectorAll("pre code")) {
                hljs.highlightElement(element);
            }
            un_full_screen_content_right.appendChild(temp);
        }
    });
    un_full_screen.addEventListener("click", () => {
        layout.className = "layout_hidden";
        full_screen_show.className = "full_screen";
        let full_screen_content_left = document.querySelector("#full_screen_content_left");
        full_screen_content_left.value = sessionStorage.getItem("content");
        let full_screen_div_right = document.querySelector("#full_screen_div_right");
        if (full_screen_div_right.className == "content-right-full") {
            let full_screen_content_right = document.querySelector("#full_screen_content_right");
            let temp = document.createElement("div");
            full_screen_content_right.innerHTML = "";
            temp.innerHTML = marked.parse(sessionStorage.getItem("content"));
            for (const element of temp.querySelectorAll("pre code")) {
                hljs.highlightElement(element);
            }
            full_screen_content_right.appendChild(temp);
        }
    });
});
//min辅助
window.addEventListener("load", () => {
    let un_full_screen_content_left = document.querySelector("#un_full_screen_content_left");
    document.querySelector("#un_full_bold").addEventListener("click", () => {
        addAuxiliary(un_full_screen_content_left, "****", 2, 2);
    });
    document.querySelector("#un_full_italic").addEventListener("click", () => {
        addAuxiliary(un_full_screen_content_left, "**", 1, 1);
    });
    document.querySelector("#un_full_color").addEventListener("change", (event) => {
        addAuxiliary(un_full_screen_content_left, "<span style=\"color:" + event.target.value + "\"></span>", 0, 0);
    });
    document.querySelector("#un_full_strikethrough").addEventListener("click", () => {
        addAuxiliary(un_full_screen_content_left, "~~~~", 2, 2);
    });
    document.querySelector("#un_full_unordered_list").addEventListener("click", () => {
        addAuxiliary(un_full_screen_content_left, "* \n* \n* \n", 2, 2);
    });
    document.querySelector("#un_full_ordered_list").addEventListener("click", () => {
        addAuxiliary(un_full_screen_content_left, "1. \n2. \n3. \n", 3, 3);
    });
    document.querySelector("#un_full_unordered_code").addEventListener("click", () => {
        addAuxiliary(un_full_screen_content_left, "```\n\n```\n", 4, 4);
    });
    document.querySelector("#un_full_unordered_link").addEventListener("click", () => {
        addAuxiliary(un_full_screen_content_left, "[](https:// \"Title\")", 1, 1);
    });
    document.querySelector("#un_full_unordered_link_photo").addEventListener("click", () => {
        addAuxiliary(un_full_screen_content_left, "![](https:// )", 2, 2);
    });
});
//max辅助
window.addEventListener("load", () => {
    let full_screen_content_left = document.querySelector("#full_screen_content_left");
    document.querySelector("#full_bold").addEventListener("click", () => {
        addAuxiliary(full_screen_content_left, "****", 2, 2);
    });
    document.querySelector("#full_italic").addEventListener("click", () => {
        addAuxiliary(full_screen_content_left, "**", 1, 1);
    });
    document.querySelector("#full_color").addEventListener("change", (event) => {
        addAuxiliary(full_screen_content_left, "<span style=\"color:" + event.target.value + "\"></span>", 0, 0);
    });
    document.querySelector("#full_strikethrough").addEventListener("click", () => {
        addAuxiliary(full_screen_content_left, "~~~~", 2, 2);
    });
    document.querySelector("#full_unordered_list").addEventListener("click", () => {
        addAuxiliary(full_screen_content_left, "* \n* \n* \n", 2, 2);
    });
    document.querySelector("#full_ordered_list").addEventListener("click", () => {
        addAuxiliary(full_screen_content_left, "1. \n2. \n3. \n", 3, 3);
    });
    document.querySelector("#full_unordered_code").addEventListener("click", () => {
        addAuxiliary(full_screen_content_left, "```\n\n```\n", 4, 4);
    });
    document.querySelector("#full_unordered_link").addEventListener("click", () => {
        addAuxiliary(full_screen_content_left, "[](https:// \"Title\")", 1, 1);
    });
    document.querySelector("#full_unordered_link_photo").addEventListener("click", () => {
        addAuxiliary(full_screen_content_left, "![](https:// )", 2, 2);
    });
});
window.addEventListener("load", () => {
    let flag = 1;
    function addscrollListener(e) {
        let full_screen_content_left = document.querySelector("#full_screen_content_left");
        let full_screen_content_right = document.querySelector("#full_screen_div_right");
        let un_full_screen_content_left = document.querySelector("#un_full_screen_content_left");
        let un_full_screen_content_right = document.querySelector("#un_full_screen_div_right");
        e.addEventListener("scroll", combineDebounceThrottle(function () {
            if (flag == 1) {
                let scrollTop = e.scrollTop;
                let scrollHeight = e.scrollHeight;
                let clientHeight = e.clientHeight;
                let ratio = scrollTop / (scrollHeight - clientHeight);
                sessionStorage.setItem("ratio", ratio.toString());
                set_scroll(full_screen_content_left);
                set_scroll(full_screen_content_right);
                set_scroll(un_full_screen_content_left);
                set_scroll(un_full_screen_content_right);
                set_scroll(un_full_screen_content_right);
                flag = 0;
            }
            else {
                flag = 1;
            }
        }, 500));
    }
    let full_screen_content_left = document.querySelector("#full_screen_content_left");
    let full_screen_content_right = document.querySelector("#full_screen_div_right");
    let un_full_screen_content_left = document.querySelector("#un_full_screen_content_left");
    let un_full_screen_content_right = document.querySelector("#un_full_screen_div_right");
    addscrollListener(full_screen_content_left);
    addscrollListener(full_screen_content_right);
    addscrollListener(un_full_screen_content_left);
    addscrollListener(un_full_screen_content_right);
    function set_scroll(e) {
        let scrollHeight = e.scrollHeight;
        let clientHeight = e.clientHeight;
        let ratio = parseInt(sessionStorage.getItem("ratio"));
        let scrollTop = ratio * (scrollHeight - clientHeight);
        e.scrollTop = scrollTop;
    }
});
window.addEventListener("load", () => {
    let updatearticle = document.querySelector("#updatearticle");
    updatearticle.addEventListener("click", () => {
        update_article();
        document.querySelector("#" + sessionStorage.getItem("navigation_article")).click();
    });
    let announce = document.querySelector("#announce");
    announce.addEventListener("click", () => {
        announce_article();
        document.querySelector("#" + sessionStorage.getItem("navigation_article")).click();
    });
    let drafts = document.querySelector("#drafts");
    drafts.addEventListener("click", () => {
        drafts_article();
        document.querySelector("#" + sessionStorage.getItem("navigation_article")).click();
    });
    let cancelupdate = document.querySelector("#cancelupdate");
    cancelupdate.addEventListener("click", () => {
        sessionStorage.setItem("article_index", "");
        document.querySelector("#" + sessionStorage.getItem("navigation_article")).click();
    });
    let dynamic = document.querySelector("#dynamic");
    dynamic.click();
    change_page();
});
