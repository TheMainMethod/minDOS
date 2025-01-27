function useDesktopIcons(el, icons) {
    
    let savedRows = 1;
    let savedCols = 1;

    let iconId = 1000;
    for(let idx in icons) {
        iconId++;
        icons[idx].id = iconId;
    }

    const defCallback = () => { console.info("No action specified.") }

    function drawIcons() {
        let desktop = document.getElementById(el);
        let grid = '';

        let cols = Math.floor(desktop.getBoundingClientRect().width / 80);
        let rows = Math.floor(desktop.getBoundingClientRect().height / 96);

        if(cols == savedCols && rows == savedRows) return;

        //console.log(rows, cols);

        for(let icon of icons){
            let row = icon.row ?? 'auto';
            let col = icon.col ?? 'auto';

            if(row < 0) row = rows - row - 1;
            if(col < 0) col = cols - col - 1;

            let imgIcon = icon.icon64 ?? 'executable-0.png';


            grid += /*html*/`
            <div class="desktop-icon" style="grid-row: ${row}; grid-column: ${col};">
                <div class="icon-layers" id="icon_${icon.id}">
                    <img src="pictures/${imgIcon}" alt="desktop icon">
                    ${ icon.shortcut != null && icon.shortcut == true? `<img src="pictures/overlay_shortcut-2.png" alt="desktop icon">` : '' }
                </div>
                <span>${icon.name}</span>
            </div>
            `;
        }

        desktop.innerHTML = grid;

        for(let icon of icons) {
            document.getElementById(`icon_${icon.id}`).ondblclick = icon.callback ?? defCallback;
        }

        savedCols = cols;
        savedRows = rows;

    }

    return {
        drawIcons: drawIcons
    }
    
}


export {
    useDesktopIcons
}