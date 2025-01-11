


function useContextMenu() {

    function createMenu(config) {
        const newEl = document.createElement("div");
        newEl.id = 'contextMenu';

        newEl.innerHTML = /*html*/`
        <div>hola</div>
        `;

        document.appendChild(newEl);
    }

    return {
        createMenu: createMenu
    }
    
}


export {
    useContextMenu
}