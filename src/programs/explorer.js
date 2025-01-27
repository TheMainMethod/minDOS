import { useExplorerIcons } from "./explorer/explorerIcons";

/**
 * Application: file explorer
 * @param {Object} config: Configuration
 * @param {HTMLElement} config.el: HTML element
 * @param {number} config.id: Process Id
 * @param {string} config.params: Extra params
 * @param {number} config.callback: Callback function
 */
function explorer(config) {
    //let user = 'Kevin';

    const about = "This is a file.\nYes.";

    let disk = [
        {
            name: 'Desktop',
            typ: 'dir',
            children: [
                {
                    name: 'Top secret',
                    typ: 'dir',
                    children: [
                        {
                            name: 'about.txt',
                            typ: 'txt',
                            content: about
                        },
                        {
                            name: 'cat.jpg',
                            typ: 'img',
                            content: 'explorer/cat.jpg'
                        }
                    ]
                }
            ]
        },
        {
            name: 'Documents',
            typ: 'dir',
            children: []
        },
        {
            name: 'Downloads',
            typ: 'dir',
            children: []
        },
        {
            name: 'Music',
            typ: 'dir',
            children: []
        },
        {
            name: 'Pictures',
            typ: 'dir',
            children: []
        },
        {
            name: 'Videos',
            typ: 'dir',
            children: []
        }
        
    ]

    //
    let dirStart = disk;
    if(config.params != null){
        for(let dir of config.params.split('/')){
            let item = dirStart.find(e => e.name == dir);
            if(item != null && item.children != null) {
                dirStart = item.children;
            }
            else {
                dirStart = disk;
                break;
            }
        }
    }

    //
    config.el.innerHTML = /*html*/`
    <style>
        .e-main {
            background: white;
            min-height: 100%;
            min-width: fit-content;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        .explorer-icons {
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            align-content: flex-start;
            align-items: flex-start;
        }

    </style>
    <div class="e-main explorer-icons" id="${config.id}_explorer">
        ${dirStart.map(e => e.name).join(",")}
    </div>
    `;

    //
    function draw(start) {
        let icons = start.map(e => {
            switch(e.typ) {
                case 'dir': 
                    e.icon64 = 'directory_closed-4.png';
                    e.callback = () => {
                        draw(e.children)
                    }
                    break;
                case 'txt': e.icon64 = 'notepad-5.png';
                    e.callback = () => {
                        config.callback('launch', 'notepad', e.content);
                    }
                    break;
                case 'img': e.icon64 = e.content;
                    e.callback = () => {
                        config.callback('launch', 'photoViewer', e.content);
                    }
                    break;
            }
            return e;
        })
    
        const iconManager = useExplorerIcons(`${config.id}_explorer`, icons)
        iconManager.drawIcons(config.id);
    } 
    draw(dirStart);
}

export {
    explorer
}