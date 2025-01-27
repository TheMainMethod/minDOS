function useExplorerIcons(el, icons) {
    
    let savedRows = 1;
    let savedCols = 1;

    let iconId = 1000;
    for(let idx in icons) {
        iconId++;
        icons[idx].id = iconId;
    }

    const defCallback = () => { console.info("No action specified.") }

    function drawIcons(procId) {
        let desktop = document.getElementById(el);
        let grid = '';

        let cols = Math.floor(desktop.getBoundingClientRect().width / 80);
        let rows = Math.floor(desktop.getBoundingClientRect().height / 96);

        if(cols == savedCols && rows == savedRows) return;

        //console.log(rows, cols);

        for(let icon of icons){
            let imgIcon = icon.icon64 ?? 'executable-0.png';


            grid += /*html*/`
            <div class="desktop-icon" style="grid-row: auto; grid-column: auto;">
                <div class="icon-layers" id="${procId}_icon_${icon.id}">
                    <img src="pictures/${imgIcon}" alt="desktop icon">
                    ${ icon.shortcut != null && icon.shortcut == true? `<img src="pictures/overlay_shortcut-2.png" alt="desktop icon">` : '' }
                </div>
                <span>${icon.name}</span>
            </div>
            `;
        }

        desktop.innerHTML = grid;

        for(let icon of icons) {
            document.getElementById(`${procId}_icon_${icon.id}`).ondblclick = icon.callback ?? defCallback;
        }

        savedCols = cols;
        savedRows = rows;

    }

    return {
        drawIcons: drawIcons
    }
    
}

export {
    useExplorerIcons
}