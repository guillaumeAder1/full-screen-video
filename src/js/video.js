

function FullScreenControl(onLeft, onRight) {

    this.panels = panels = [];
    var defaultCss = { position: "absolute", height: "100%", top: "0", zIndex: "9999999999999" }
    var bodyDom = document.getElementsByTagName("body")[0];
    onLeft && panels.push(onLeft)
    onRight && panels.push(onRight)

    /**
     * 
     * @param {Event} e mouse move event, used to keep track of mouse pos.
     */
    var checkMousePosition = function (e) {
        panels.forEach(function (element) {
            (!element.locked) && checkMousePos(element, e);
        }, this)
    }
    /**
     * verify if the nmouse enter the panel display zone
     * @param {panel{}} panel - panel object             
     * @param {event} evt - mouse event with position
     */
    var checkMousePos = function (panel, evt) {
        var statement;
        var fn;
        if (panel.position === 'left') {
            statement = evt.x < panel.intWidth;
            fn = displayLeftPanel;
        } else if (panel.position === 'right') {
            statement = evt.x > (window.innerWidth - panel.intWidth);
            fn = displayRightPanel;
        }

        (statement) ? fn(panel, evt.x) : fn(panel, panel.intWidth);
    };
    /**
     * calculate right panel pos depending of mousex
     * @param {panel{}} panel 
     * @param {int} mousex - mouse pos x coord 
     */
    var displayRightPanel = function (panel, mousex) {
        var mouseDiff = mousex - (window.innerWidth - panel.intWidth);
        var calcDiff = window.innerWidth - mouseDiff;
        panel.node.style.left = calcDiff + "px";
    }
    /**
    * calculate left panel pos depending of mousex
    * @param {panel{}} panel 
    * @param {int} mousex - mouse pos x coord 
    */
    var displayLeftPanel = function (panel, mousex) {
        var mouseDiff = panel.intWidth - mousex;
        var calcDiff = (-panel.intWidth) + mouseDiff;
        panel.node.style.left = calcDiff + 'px';
    }
    /**
     * 
     * @param {panels[{}]} panels - list of panels objects  
     */
    var initPanel = function (panels) {
        panels.forEach(function (panel) {
            panel.intWidth = panel.width.replace('px', '')
            panel.style.width = panel.width
            panel.locked = false;
            create(panel)
        }, this)
    }

    /**
     * create the html, 
     * apply css, 
     * create click event listener on panel - change its locked value   
     * @param {int} initPos inital pos if the panel - when close
     * @param {int} destPos opened panel pos
     * @param {panel} panel 
     */
    var createDomPanel = function (initPos, destPos, panel) {
        var newDiv = document.createElement("div");
        // apply css to panel
        Object.assign(newDiv.style, panel.style, defaultCss)
        newDiv.innerHTML = panel.html;
        newDiv.style.left = initPos;
        panel.node = newDiv;
        bodyDom.appendChild(newDiv);
        // add event on click panel
        newDiv.addEventListener('click', function (e) {
            panel.locked = !panel.locked;
            if (panel.locked) {
                panel.node.style.left = destPos;
            }
            console.log(panel.locked)
        });
    }
    /**
     * 
     * @param {panel} panel panel data
     */
    var create = function (panel) {
        if (panel.position === 'left') {
            var initpos = "-" + panel.width;
            var destpos = 0;
            createDomPanel(initpos, destpos, panel);
            return;
        }
        if (panel.position === 'right') {
            var initpos = window.innerWidth;
            var destpos = window.innerWidth - panel.intWidth;
            createDomPanel(initpos, destpos, panel);
            return;
        }
    }
    /**
     * when screen size change, destroy previous and re-create new panels with correct positions
     * @param {event} e ScreenResize event
     */
    var screenResize = function (e) {
        this.panels.forEach(function (item) {
            destroyPanel(item.node);
        }, this)
        initPanel(this.panels);

    }
    /**
     * 
     * @param {panel.HTMLnode} node - html node to de destroyed 
     */
    var destroyPanel = function (node) {
        node.parentNode.removeChild(node);
    }

    /**
     * priviledge method, access to private members
     */
    this.startup = function () {
        initPanel(panels);
        document.addEventListener("mousemove", checkMousePosition);
        window.addEventListener("resize", screenResize);
    }

    return this;

}
