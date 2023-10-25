const list = {
    1:{"name":"link 1", "sub":{
        1:{"name":"link 1.1"},
        2:{"name":"link 1.2"},
        3:{"name":"link 1.3", "sub":{
            1:{"name":"link 1.3.1"},
            2:{"name":"link 1.3.2"}
        }},
        4:{"name":"link 1.4"},
        5:{"name":"link 1.5", "sub":{
            1:{"name":"link 1.5.1"},
            2:{"name":"link 1.5.2"}
        }}
    }},
    2:{"name":"link 2", "sub":{
        1:{"name":"link 2.1"},
        2:{"name":"link 2.2"}
    }},
    3:{"name":"link 3",
        "sub":{
            1:{"name":"link 3.1"},
            2:{"name":"link 3.2",
                "sub":{
                    1:{"name":"link 3.2.1", "sub":{
                        1:{"name":"link 3.2.1.1"},
                        2:{"name":"link 3.2.1.2"},
                        3:{"name":"link 3.2.1.3"},
                        4:{"name":"link 3.2.1.4"},
                        5:{"name":"link 3.2.1.5"}
                    }
                    },
                    2:{"name":"link 3.2.2"},
                    3:{"name":"link 3.2.3"}
                }
            },
            3:{"name":"link 3.3"},
            4:{"name":"link 3.3"}
        }
    },
    4:{"name":"link 4"}
}

const menu = document.getElementsByClassName('typelang')[0],
        time = [],
        menu_dict = {},
        open_dict = {};
let over = false;

function addEventHandler(n, t, f){
    if (n.addEventListener){
        n.addEventListener(t, f, false);
    } else if(n.attachEvent){
        n.attachEvent('on' + t, f);
    } else {
        n['on' + t] = f;
    }
}

class Sequence {

    constructor() {
        this.a = 1;
    }

    incr(){
        return this.a++;
    }

}

const seq = new Sequence();

class MenuList {

    constructor(j) {
        const arr = [];
        const el = document.createElement("div");
        el.className = 'menu';
        const tb = document.createElement("table");
        tb.className = 'menu_pt';

        for(const k in j){
            if(j.hasOwnProperty(k)){
                const tr = document.createElement("tr");
                const td = document.createElement("td");
                const sp = document.createElement("span");
                sp.className = 'punkt';
                if(j[k]["sub"]){
                    sp.id = seq.incr();
                    const di = document.createElement("div");
                    di.className = 'triangle';
                    td.append(di);
                    const sub = new MenuList(j[k]["sub"]);
                    menu_dict[sp.id] = sub.create_menu();
                    arr.push(sp.id);
                }

                sp.innerHTML = j[k]["name"];
                td.append(sp);
                tr.append(td);
                tb.append(tr);
            }
        }

        el.append(tb);

        this.a = el;

        if(arr.length>1){
            arr.forEach(function(el){
                const ar = [];
                for (let i=0;arr.length>i;i++){
                    if(arr[i]!=el){ar.push(arr[i])}
                }
                open_dict[el] = ar;
            });
        }
    }

    create_menu(){
        return this.a;
    }
}

const menu_inst = new MenuList(list);
menu_dict[0] = menu_inst.create_menu();

for (let i in menu_dict){
    if(menu_dict.hasOwnProperty(i)){
        menu.append(menu_dict[i]);
        if(i>0){
            const menu_link = document.getElementById(i.toString()).parentNode;
            addEventHandler(menu_link, 'mouseover', function(){
                if (time[i]) {
                    clearTimeout(time[i]);
                }
                if(open_dict[i]){
                    open_dict[i].forEach(function(el){
                        for(let ii=el;time.length>ii;ii++){
                            if(i!=ii){
                                menuFade(menu_dict[ii],0);
                                time[ii] = null;
                            }
                        }
                    });
                }
                menuShow(menu_dict[i], menu_link.childNodes[0].getBoundingClientRect(), 400, -20, -15);
            });
            addEventHandler(menu_link, 'mouseout', function(){
                time[i] = setTimeout(function(){
                    menuFade(menu_dict[i], 150);
                }, 400);
            });
            addEventHandler(menu_dict[i], 'mouseover', function(){
                for(let o=0;o<=i;o++){
                    if (time[o]) {
                        clearTimeout(time[o]);
                        menuShow(menu_dict[o]);
                    }
                    menuShow(menu_dict[i]);
                }
            });
            addEventHandler(menu_dict[i], 'mouseout', function(){
                time[i] = setTimeout(function(){
                    menuFade(menu_dict[i],150);
                },400);
            });
        }
    }
}
function menuShow(m, c, ms, top, left){
    over = true;
    if(m.style.opacity !== '1'){
        if(c&&ms&&top&&left){
            m.style.top = c.top + top + 'px';
            m.style.left = c.left - left + 'px';
            m.style.transition = 'visibility '+ms+'ms, opacity '+ms+'ms';
        }
        m.style.visibility = 'visible';
        m.style.opacity = '1';
    }
}
function menuFade(m, ms){
    m.style.visibility = 'hidden';
    m.style.transition = 'visibility '+ms+'ms, opacity '+ms+'ms';
    m.style.opacity = '0';
}
function closeAllOut() {
    over = false;
    time[0] = setTimeout(function(){
        for(let k in menu_dict){
            if(menu_dict.hasOwnProperty(k)){
                menuFade(menu_dict[k],150);
            }
        }
    },400);
}
function closeAllClick(){
    if(!over){
        for(let k in menu_dict){
            if(menu_dict.hasOwnProperty(k)){
                menuFade(menu_dict[k],80);
            }
        }
    }
}
addEventHandler(menu, 'mouseover', function(){
        if (time[0]) {
            clearTimeout(time[0]);
        }
        menuShow(menu_dict[0], menu.getBoundingClientRect(), 400, 25, 5);
});
addEventHandler(menu, 'mouseout', closeAllOut);
addEventHandler(document, 'mousedown', closeAllClick);
