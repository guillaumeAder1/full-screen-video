

function FullScreenControl(onLeft, onRight) {

    this.panels = panels = [];
    var defaultCss = { position: "absolute", height: "100%", top: "0", zIndex: "2147483647 !important" }
    var bodyDom = document.getElementsByTagName("body")[0];
    onLeft && panels.push(onLeft)
    onRight && panels.push(onRight)


    /**
     * define css property for panel animation
     */
    var addCustomCss = function () {
        // TODO, for now use the loca CSS file
    }

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
        if (panel.position === 'left') {
            statement = evt.x < panel.intWidth;
        } else if (panel.position === 'right') {
            statement = evt.x > (window.innerWidth - panel.intWidth);
        }
        // 'statement' define if the mouse position is inside the panel area
        (statement) ? togglePanel(panel, true) : togglePanel(panel, false);
    };
    /**
     * 
     * @param {panel{}} panel 
     * @param {Boolean} open - open or close 
     */
    var togglePanel = function (panel, open) {
        panel.node.style.left = (open) ? panel.destPos : panel.initPos;
    }

    /**
     * 
     * @param {panels[{}]} panels - list of panels objects  
     */
    var initPanel = function (panels) {
        panels.forEach(function (panel) {
            panel.intWidth = panel.width.replace('px', '')
            panel.style.width = panel.width;
            panel.locked = false;
            panel.visible = true;
            create(panel);
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
        Object.assign(newDiv.style, panel.style, defaultCss);
        newDiv.appendChild(panel.html);
        newDiv.style.left = initPos;
        panel.node = newDiv;
        panel.node.classList.add('control-panel')
        // bodyDom.insertAdjacentElement('afterbegin', newDiv);
        bodyDom.appendChild(newDiv);

    }
    /**
     * calculate inital and destination value for each panel based on their params
     * @param {panel} panel panel data
     */
    var create = function (panel) {
        if (panel.position === 'left') {
            var initpos = "-" + panel.width;
            var destpos = 0;
            panel.initPos = initpos;
            panel.destPos = destpos;
            createDomPanel(initpos, destpos, panel);
            return;
        }
        if (panel.position === 'right') {
            var initpos = window.innerWidth;
            var destpos = window.innerWidth - panel.intWidth;
            panel.initPos = initpos;
            panel.destPos = destpos;
            createDomPanel(initpos, destpos, panel);
            return;
        }
    }
    /**
     * when screen size change, destroy previous and re-create new panels with correct positions
     * @param {event} e ScreenResize event
     */
    var screenResize = function (bool) {
        this.panels.forEach(function (item) {
            destroyPanel(item.node);
        }, this)
        bool && initPanel(this.panels);

    }

    this.hide = function () {
        screenResize(false)
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
        addCustomCss()
        initPanel(panels);
        document.addEventListener("mousemove", checkMousePosition);
        window.addEventListener("resize", screenResize(true));
    }

    return this;

}
