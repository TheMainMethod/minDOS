/**
 * Application: notepad
 * @param {Object} config: Configuration
 * @param {HTMLElement} config.el: HTML element
 * @param {number} config.id: Process Id
 * @param {string} config.params: Extra params
 * @param {number} config.callback: Callback function
 */
function notepad(config) {

    config.el.innerHTML = /*html*/`
    <style>
        .notepad {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100%;
            text-align: center;
        }

        .notepad textarea {
            width: 100%;
            height: 100%;
            resize: none;
            border: none;
            font-family: monospace;
            font-size: 1.15rem;
        }

    </style>
    <div class="notepad">
        <textarea rows="1" spellcheck="false">${config.params ?? ''}</textarea>
    </div>
    `;
}



export {
    notepad
}