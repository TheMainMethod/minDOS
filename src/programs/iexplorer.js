/**
 * Application: internet explorer
 * @param {Object} config: Configuration
 * @param {HTMLElement} config.el: HTML element
 * @param {number} config.id: Process Id
 * @param {string} config.params: Extra params
 * @param {number} config.callback: Callback function
 */
function iexplorer(config) {
    //https://google.com/search?igu=1
    config.el.innerHTML = /*html*/`
    <style>
        .ie-main {
            background: white;
            min-height: 100%;
            min-width: fit-content;
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        .ie-g-logo {
            padding-top: 1em;
            font-size: 6rem;
        }

        .ie-g-search {
            max-width: 90%;
            width: 600px;
            font-size: 22px;
            padding: 0.25em;
            margin: 1.5rem 0;
        }
    </style>
    <div class="ie-main">
        <div class="ie-g-logo">
        <span style="color: cornflowerblue">G</span><span style="color: crimson">o</span><span style="color: gold">o</span><span style="color: cornflowerblue">g</span><span style="color: green">o</span><span style="color: crimson">l</span>
        <br>
        </div>
        <input class="ie-g-search" type="text">
    </div>
    `;
}



export {
    iexplorer
}