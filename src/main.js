import './style.css'
import { useStartMenu } from './startMenu';
import { useWindows } from './window';
import { useTaskBar } from './taskbarApps';

import { useContextMenu } from './contextMenu';
import { useDesktopIcons } from './desktopIcons';

let apps = [
  {
    id: 'iexplorer',
    name: 'Internet Explorer',
    icon16: 'msie1-4.png',
    icon32: 'msie1-1.png',
    start: true
  },
  {
    id: 'explorer',
    name: 'My Files',
    icon16: 'directory_closed-1.png',
    icon32: 'directory_closed-3.png',
    start: true
  },
  {
    id: 'notepad',
    name: 'Notepad',
    icon16: 'notepad-3.png',
    icon32: 'notepad-4.png',
    start: true
  },
  {
    id: 'photoViewer',
    name: 'Photo Viewer',
    icon16: 'image_old_jpeg-1.png',
    icon32: 'image_old_jpeg-0.png'
  },
  {
    id: 'about',
    name: 'About',
    config: {
      width: 390,
      height: 165,
      canResize: false
    },
    start: true
  }
]

let desktopIcons = [
  {
    name: 'Internet Explorer',
    icon64: 'msie1-2.png',
    shortcut: true,
    row: 5,
    col: 2,
    callback: () => {
      windowEvent('launch', 'iexplorer');
    }
  },
  {
    name: 'Top secret',
    icon64: 'directory_closed-4.png',
    row: -1,
    col: -1,
    callback: () => {
      windowEvent('launch', 'explorer', 'Desktop/Top secret');
    }
  },
  {
    name: 'Arch Linux',
    callback: () => {
      window.open('https://archlinux.org', '_blank');
    }
  },
]

let processList = [];


let startMenu = useStartMenu({
  buttonEl: 'startBtn', 
  menuEl: 'startMenu',
  apps: apps.filter(e => e.start != null && e.start == true),
  emitEvent: windowEvent
});

let desktop = document.getElementById('desktopApps');

let desktopIconManager = useDesktopIcons('desktopIcons', desktopIcons);
desktopIconManager.drawIcons();
window.onresize = desktopIconManager.drawIcons;

function inactiveWindows() {
  for(let proc of processList){
    document.getElementById(`${proc}_title`).classList.remove('active');
    document.getElementById(`${proc}_taskPanel`).classList.remove('active');
  }
}

function orderWindows(procId) {
  let idx = processList.indexOf(procId);
  processList = [...processList.toSpliced(idx, 1), procId];
  //console.log(processList);
  let i = 0;
  for(let proc of processList){
    document.getElementById(`${proc}_window`).style.zIndex = 100 + i;
    i++;
  }
}

function windowEvent(e, id, params) {
  //console.log(e, id);
  switch(e){
    case 'launch':
      openApp(id, params);
      break;
    case 'close':
      let idx = processList.indexOf(id);
      processList = processList.toSpliced(idx);
      document.getElementById(`${id}_task`).remove();
      break;
    case 'focus':
      inactiveWindows();
      document.getElementById(`${id}_title`).classList.add('active');
      document.getElementById(`${id}_taskPanel`).classList.add('active');
      orderWindows(id);
      break;
    case  'lostFocus':
      inactiveWindows();
      break;
    case 'minimize': 
      document.getElementById(`${id}_window`).classList.add('hidden');
      break;
    
    case 'unminimize':
      document.getElementById(`${id}_window`).classList.remove('hidden');
      break;
    
  }
}

desktop.onmousedown = function() {
  inactiveWindows();
}

let windowManager = useWindows({
  desktop: document.getElementById('desktopApps'),
  emitEvent: windowEvent
});

let taskbarManager = useTaskBar({
  taskbarEl: 'taskBarPrograms',
  emitEvent: windowEvent
});

let menuManager = useContextMenu();

function openApp(name, params) {
  let app = apps.find(e => e.id == name);
  let procId = windowManager.newWindow(app, params);
  taskbarManager.newTask(app, procId);

  processList.push(procId);
  orderWindows(procId);
}


function setTime() {
  let time = new Date();
  const clock = document.getElementById("clock");

  const tickTime = () => {
    time = new Date();
    clock.textContent = formatTime(time);
  }

  const formatTime = (t) => {
    let h = t.getHours();
    let m = String(t.getMinutes()).padStart(2,'0');
    let ampm = h < 12 ? 'AM' : 'PM';
    h = h > 12 ? h -12 : h;
    return `${h}:${m} ${ampm}`;
  }
 
  setInterval(tickTime, 1000);
  tickTime();
  
}

setTime();

openApp('about');

//menuManager.createMenu(null, 100, 100);


console.log("procesos",processList);