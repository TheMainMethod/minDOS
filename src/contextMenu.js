


function useContextMenu() {

    function createMenu(config, x, y) {
        const newEl = document.createElement("div");
        //newEl.id = 'contextMenu';

        newEl.innerHTML = /*html*/`
        <div class="panel">content</div>
        `;

        newEl.classList.add('context-menu');


        document.body.appendChild(newEl);
    }

    return {
        createMenu: createMenu
    }
    
}


export {
    useContextMenu
}