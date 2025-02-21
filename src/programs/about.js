/**
 * Application: about
 * @param {Object} config: Configuration
 * @param {HTMLElement} config.el: HTML element
 * @param {number} config.id: Process Id
 * @param {string} config.params: Extra params
 * @param {number} config.callback: Callback function
 */
function about(config) {

    config.el.innerHTML = /*html*/`
    <style>
        .about {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100%;
            padding: 1rem;
            text-align: center;
        }
    </style>
    <div class="about">
        Made with lots of ☕ by KamiKevin
    </div>
    `;
}



export {
    about
}