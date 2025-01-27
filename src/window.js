import { iexplorer } from './programs/iexplorer';
import { about } from './programs/about';
import { explorer } from './programs/explorer';
import { notepad } from './programs/notepad';
import { photoViewer } from './programs/photoViewer';

/**
 * Use windows
 * @param {Object} config: Configuration
 * @param {string} config.desktop: ID of desktop
 * @param {string} config.emitEvent: Callback function
 * @returns An object with functions
 */
function useWindows(config) {

    let processId = 1000;

    const programs = {
        iexplorer: iexplorer,
        explorer: explorer,
        about: about,
        notepad: notepad,
        photoViewer: photoViewer
    }

    function newWindow(app, params) {
        processId++;

        let defWidth = Math.min(768, window.innerWidth * 0.5);
        let defHeight = Math.min(480, window.innerHeight * 0.5);
        let width = app.config != undefined && app.config.width != undefined ? app.config.width : defWidth;
        let height = app.config != undefined && app.config.height != undefined ? app.config.height : defHeight;

        let defX = (window.innerWidth - width)/2;
        let defY = (window.innerHeight - height)/2;
        let maximized = false;
        let canResize = app.config != undefined && app.config.canResize != undefined ? app.config.canResize : true;

        let thisProc = processId;
        let icon = app.icon16 ?? 'executable-1.png';

        function getId(suffix){
            return `${thisProc}_${suffix}`;
        }

        const windowStyle = `width: ${width}px; height: ${height}px; --x: ${defX}px; --y: ${defY}px`;
        const controlStyle = `width: ${width+4}px; height: ${height+4}px`;
        const contentStyle = `width: ${width-4}px; height: ${height-4}px`;

        const isMaximized = maximized ? 'maximized' : '';

        const newEl = document.createElement("div");
        newEl.id = processId;
        newEl.style.pointerEvents = 'none';
        newEl.innerHTML = /*html*/`
        <div class="window panel ${isMaximized}" id="${getId('window')}" style="${windowStyle}">
            <div class="window-controls ${isMaximized}" id="${getId('controls')}" style="${controlStyle}">
                <div class="flex">
                    <div class="control-area cursor-nw-resize" id="${getId('nw-resize')}"></div>
                    <div class="control-area cursor-n-resize grow" id="${getId('n-resize')}"></div>
                    <div class="control-area cursor-ne-resize" id="${getId('ne-resize')}"></div>
                </div>
                <div class="flex grow">
                    <div class="control-area cursor-w-resize" id="${getId('w-resize')}"></div>
                    <div class="control-area cursor-move grow" id="${getId('move')}"></div>
                    <div class="control-area cursor-e-resize" id="${getId('e-resize')}"></div>
                </div>
                <div class="flex">
                    <div class="control-area cursor-sw-resize" id="${getId('sw-resize')}"></div>
                    <div class="control-area cursor-s-resize grow" id="${getId('s-resize')}"></div>
                    <div class="control-area cursor-se-resize" id="${getId('se-resize')}"></div>
                </div>
            </div>
            <div class="window-content ${isMaximized}" id="${getId('content')}" style="${contentStyle}">
                <div class="window-title" id="${getId('title')}">
                    <img src="pictures/${icon}" alt="icon">
                    <span>${app.name}</span>
                    <button class="panel window-btn cursor-pointer" id="${getId('minBtn')}">_</button>
                    <button class="panel window-btn ${canResize ? 'cursor-pointer' : ''} ${isMaximized ? 'hidden' : ''}" ${!canResize ? 'disabled' : ''} id="${getId('maxBtn')}">□</button>
                    <button class="panel window-btn cursor-pointer ${isMaximized ? '' : 'hidden'}" id="${getId('resBtn')}">⧠</button>
                    <button class="panel window-btn cursor-pointer" id="${getId('cloBtn')}">×</button>
                </div>
                <div class="window-body cursor-default" id="${getId('body')}"></div>
            </div>
            
            
        </div>`;

        config.desktop.appendChild(newEl);
        //

        let win = document.getElementById(getId('window'));
        let ctrls = document.getElementById(getId('controls'));
        let content = document.getElementById(getId('content'));
        let body = document.getElementById(getId('body'));

        let area = document.getElementById(getId('move'));
        let minBtn = document.getElementById(getId('minBtn'));
        let maxBtn = document.getElementById(getId('maxBtn'));
        let resBtn = document.getElementById(getId('resBtn'));
        let cloBtn = document.getElementById(getId('cloBtn'));

        let resizePrefixes = ['nw', 'n', 'ne', 'w', 'e', 'sw', 's', 'se'];
        let resizers = [];

        for (let i of resizePrefixes) {
            resizers.push(document.getElementById(getId(i+'-resize')));
        }
        function getResizer(prefix) {
            let idx = resizePrefixes.indexOf(prefix);
            return resizers[idx];
        }
    
        //window content
        programs[app.id]({el: body, id: thisProc, params: params, callback: config.emitEvent});

        //move window
        area.ondragstart = function() { return false; }

        area.onmousedown = function(ev) {
            body.style.pointerEvents = 'none';
            let shiftX = ev.clientX - win.getBoundingClientRect().left;
            let shiftY = ev.clientY - win.getBoundingClientRect().top;

            if(win.classList.contains('maximized')){
                restore(); //dirty, but it works
                shiftX = win.getBoundingClientRect().width/2;
                shiftY = 10;
                maximize();
            }
            
            function moveAt(x,y) { 
                if(win.classList.contains('maximized')) restore();
                let newX = x - shiftX;
                let newY = y - shiftY;
                win.style.setProperty('--x', newX+"px");
                win.style.setProperty('--y', newY+"px");
            }
    
            function mouseMove(ev) {
                moveAt(ev.pageX, ev.pageY);
            }

            function cleanListeners() {
                body.style.pointerEvents = 'all';
                document.removeEventListener('mousemove', mouseMove);
                document.onmouseup = null;
                document.onmouseleave = null;
            }

            document.addEventListener('mousemove', mouseMove);

            document.onmouseup = cleanListeners;
            document.onmouseleave = cleanListeners;
        }

        //window buttons
        function minimize(e) {
            e.stopPropagation();
            config.emitEvent('minimize', thisProc);
            config.emitEvent('lostFocus', thisProc);
        }

        function maximize(e) {
            if(e) e.stopPropagation();
            win.classList.add('maximized');
            ctrls.classList.add('maximized');
            content.classList.add('maximized');

            maxBtn.classList.add('hidden');
            resBtn.classList.remove('hidden');

            for(let i in resizers) resizers[i].classList.add('hidden');
        }

        function restore(e) {
            if(e) e.stopPropagation();
            win.classList.remove('maximized');
            ctrls.classList.remove('maximized');
            content.classList.remove('maximized');

            maxBtn.classList.remove('hidden');
            resBtn.classList.add('hidden');

            for(let i in resizers) resizers[i].classList.remove('hidden');
        }

        function close(e) {
            e.stopPropagation();
            config.emitEvent('close', thisProc);
            newEl.remove();
            
        }

        minBtn.onclick = minimize;
        maxBtn.onclick = maximize;
        resBtn.onclick = restore;
        cloBtn.onclick = close;

        //window resize
        function resizeN(y) {
            let newY = win.getBoundingClientRect().top + win.getBoundingClientRect().height - y;

            if(newY >= 50) {
                win.style.setProperty('--y', y+"px");    
            } else {
                win.style.setProperty('--y', (y+newY-50)+"px");
                newY = 50;
            }
            
            win.style.height = newY+"px";
            ctrls.style.height = (newY+4)+"px";
            content.style.height = (newY-4)+"px";            
        }

        function resizeS(y) { 
            let newY = y - win.getBoundingClientRect().top;
            newY = newY < 50 ? 50 : newY;

            win.style.height = newY+"px";
            ctrls.style.height = (newY+4)+"px";
            content.style.height = (newY-4)+"px";
        }

        function resizeE(x) { 
            let newX = x - win.getBoundingClientRect().left;
            newX = newX < 112 ? 112 : newX;

            win.style.width = newX+"px";
            ctrls.style.width = (newX+4)+"px";
            content.style.width = (newX-4)+"px";
        }

        function resizeW(x) {
            let newX = win.getBoundingClientRect().left + win.getBoundingClientRect().width - x;

            if(newX >= 112) {
                win.style.setProperty('--x', x+"px");    
            } else {
                win.style.setProperty('--x', (x+newX-112)+"px");
                newX = 112;
            }
            
            win.style.width = newX+"px";
            ctrls.style.width = (newX+4)+"px";
            content.style.width = (newX-4)+"px";            
        }

        function callResize(prefix, x, y) {
            switch(prefix) {
                case 'n':
                    resizeN(y);
                    break;
                case 'ne':
                    resizeN(y);
                    resizeE(x);
                    break;
                case 'e':
                    resizeE(x);
                    break;
                case 'se':
                    resizeS(y);
                    resizeE(x);
                    break;
                case 's':
                    resizeS(y);
                    break;
                case 'sw':
                    resizeS(y);
                    resizeW(x);
                    break;
                case 'w':
                    resizeW(x);
                    break;
                case 'nw':
                    resizeN(y);
                    resizeW(x);
                    break;
            }
        }

        for(let prefix of resizePrefixes) {
            if(!canResize) {
                getResizer(prefix).style.pointerEvents = 'none';
            }
            getResizer(prefix).ondragstart = function() { return false; }

            getResizer(prefix).onmousedown = function() {
    
                function mouseMove(ev) {
                    callResize(prefix, ev.pageX, ev.pageY);
                }
    
                document.addEventListener('mousemove', mouseMove);
    
                function cleanListeners() {
                    document.removeEventListener('mousemove', mouseMove);
                    document.onmouseup = null;
                    document.onmouseleave = null;
                }
    
                document.onmouseup = cleanListeners;
                document.onmouseleave = cleanListeners;
            }
        }

        //focus 
        win.onmousedown = (e) => {
            e.stopPropagation();
            config.emitEvent('focus', thisProc);
        }

        //

        return processId;
    }


    return {
        newWindow: newWindow
    }
}


export {
    useWindows
}