window.addEventListener("load", () => {

    let full_screen_content_left = document.querySelector("#full_screen_content_left")
    document.querySelector("#full_bold").addEventListener("click", () => {
        addAuxiliary(full_screen_content_left, "****", 2, 2)
    })
    document.querySelector("#full_italic").addEventListener("click", () => {
        addAuxiliary(full_screen_content_left, "**", 1, 1)
    })

    document.querySelector("#full_color").addEventListener("change", (event) => {


        addAuxiliary(full_screen_content_left, "<span style=\"color:" + event.target.value + "\"></span>", 0, 0)

    })
    document.querySelector("#full_strikethrough").addEventListener("click", () => {


        addAuxiliary(full_screen_content_left, "~~~~", 2, 2)
    })

    document.querySelector("#full_unordered_list").addEventListener("click", () => {


        addAuxiliary(full_screen_content_left, "* \n* \n* \n", 3, 3)
    })
    document.querySelector("#full_ordered_list").addEventListener("click", () => {

        addAuxiliary(full_screen_content_left, "1. \n2. \n3. \n", 3, 3)

    })
    document.querySelector("#full_unordered_code").addEventListener("click", () => {

        addAuxiliary(full_screen_content_left, "```\n\n```\n", 4, 4)

    })
    document.querySelector("#full_unordered_link").addEventListener("click", () => {

        addAuxiliary(full_screen_content_left, "[](https:// \"Title\")", 1, 1)

    })
    document.querySelector("#full_unordered_link_photo").addEventListener("click", () => {

        addAuxiliary(full_screen_content_left, "![](https:// )", 2, 2)

    })

})