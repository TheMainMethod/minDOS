function getId(suffix){
    return `startMenu_${suffix}`;
}

/**
 * Start Menu Function
 * @param {Array} items: Array of programs
 * @returns Template string with the menu programs
 */
function startMenuItems(items) {
    let list = '';
    for(let item of items) {
        let icon = item.icon32 ?? 'executable-0.png'
        list += /*html*/`
        <li class="cursor-pointer" id="${getId(item.id)}">
            <img src="pictures/${icon}" alt="icon">${item.name}
        </li>
        `;
    }
    //<div id="${getId('backdrop')}"></div>
    return /*html*/`
    
    <ul class="os-list">
        <li class="title"><span>MinDOS</span></li>
        <span class="separator vertical"></span>
        ${list}
        <span class="separator vertical"></span>
        <li class="cursor-pointer" id="${getId('shutdown')}"><img src="pictures/shut_down_normal-2.png" alt="icon">Shut Down</li>
    </ul>
    `
}

/**
 * Start Menu Function
 * @param {Object} config: Configuration of the start menu
 * @param {string} config.buttonEl: ID of the start button
 * @param {string} config.menuEl: ID of the start menu itself
 * @param {Array} config.apps: Array of applications, with title and icons
 * @param {Function} config.emitEvent: callback function for events
 * @returns An object with the elements of the start menu
 */
function useStartMenu(config) {
    let button = document.getElementById(config.buttonEl);
    let menu = document.getElementById(config.menuEl);

    menu.innerHTML = startMenuItems(config.apps);

    function openStartMenu() {
        button.classList.add('active');
        menu.classList.remove('hidden');

        document.addEventListener("mousedown", closeStartMenu)
    }

    function closeStartMenu(ev) {
        button.classList.remove('active');
        menu.classList.add('hidden');            

        document.removeEventListener("mousedown", closeStartMenu)
    }
    button.onclick = openStartMenu;
    menu.onmousedown = function(e) {
        e.stopPropagation();
    }
    
    //
    for(let app of config.apps) {
        let launcher = document.getElementById(getId(app.id));
        launcher.onclick = function() {
            config.emitEvent('launch', app.id);
            closeStartMenu();
        }
    }


    let shutdownBtn = document.getElementById(getId('shutdown'));
    shutdownBtn.onclick = function() {
        document.body.innerHTML = /*html*/`
            <style>
                html {
                    background-color: black;
                    color: orange;
                }

                body {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-size: 2.5rem;
                    font-weight: bold;
                    font-family: sans-serif;

                }
            </style>
            It's now safe to close this tab.
        `;

        //setTimeout(() => {
        //    location.reload();
        //}, 3000);
    }

    return {
        //toggleStartMenu: toggleStartMenu,
        button: button,
        menu: menu
    };
}

export {
    useStartMenu
}