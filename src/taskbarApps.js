

function useTaskBar(config)
{
    let taskbar = document.getElementById(config.taskbarEl);


    function newTask(app, procId) {
        let icon = app.icon16 ?? 'executable-1.png';

        function getId(suffix){
            return `${procId}_${suffix}`;
        }

        const newEl = document.createElement("div");
        newEl.id = getId('task');
        newEl.style.pointerEvents = 'none';
        newEl.style.flexShrink = '0';
        newEl.innerHTML = /*html*/`
        <div class="program-tab panel cursor-pointer" id="${getId('taskPanel')}">
            <img src="pictures/${icon}" alt="icon">
            <span>${app.name}</span>
        </div>
        `;

        taskbar.appendChild(newEl);

        let tab = document.getElementById(getId('taskPanel'));

        tab.onclick = function () {
            if(tab.classList.contains('active')) {
                config.emitEvent('lostFocus', procId);
                config.emitEvent('minimize', procId);
            }
            else {
                config.emitEvent('focus', procId);
                config.emitEvent('unminimize', procId);
            }

            
        }

    }


    return {
        newTask: newTask
    }    

}

export {
    useTaskBar
}