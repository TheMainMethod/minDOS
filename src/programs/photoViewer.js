/**
 * Application: photo viewer
 * @param {Object} config: Configuration
 * @param {HTMLElement} config.el: HTML element
 * @param {number} config.id: Process Id
 * @param {string} config.params: Extra params
 * @param {number} config.callback: Callback function
 */
function photoViewer(config) {

    let img = /*html*/`<img src="${'pictures/'+config.params ?? ''}">`;

    config.el.innerHTML = /*html*/`
    <style>
        .pv {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100%;
            padding: 1rem;
            text-align: center;
        }

        .pv img {
            max-height: 100%;
        }
    </style>
    <div class="pv">
        ${config.params ? img : ''}
    </div>
    `;
}



export {
    photoViewer
}