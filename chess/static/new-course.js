document.addEventListener("DOMContentLoaded", function() {

    const div = document.querySelector(".floating-form-container");

    document.querySelector(".new-course").addEventListener("click", function() {
        div.insertAdjacentHTML("beforeend",`
        <form>
        </form>
        `);
    })

});