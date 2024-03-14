const form = document.querySelector(".updateForm")
    form.addEventListener("change", function () {
        const updateBtn = document.querySelector('input[name="login-button"]')
        updateBtn.removeAttribute("disabled")
    })