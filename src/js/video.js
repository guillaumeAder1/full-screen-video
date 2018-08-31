
function FullScreenControl(onLeft, onRight) {

    panels = [];
    onLeft && panels.push(onLeft)
    onRight && panels.push(onRight)

    var checkMousePosition = function (e) {
        panels.forEach(function (element) {
            (!element.locked) && checkMousePos(element, e);
        }, this)
    }

    var checkMousePos = function (panel, evt) {
        var statement;
        if (panel.position === 'left') {
            statement = evt.x < panel.intWidth;
            if (statement) {
                displayLeftPanel(panel, evt.x)
            } else {
                displayLeftPanel(panel, panel.intWidth)
            }
        } else if (panel.position === 'right') {
            statement = evt.x > (window.innerWidth - panel.intWidth)
            if (statement) {
                displayRightPanel(panel, evt.x)
            } else {
                displayRightPanel(panel, panel.intWidth)
            }
        }
    };

    var displayRightPanel = function (panel, mousex) {
        var mouseDiff = mousex - (window.innerWidth - panel.intWidth);
        var calcDiff = window.innerWidth - mouseDiff;
        panel.node.style.left = calcDiff + "px";
    }

    var displayLeftPanel = function (panel, mousex) {
        var mouseDiff = panel.intWidth - mousex;
        var calcDiff = (-panel.intWidth) + mouseDiff;
        panel.node.style.left = calcDiff + 'px';
        console.log('display panel **************************')
        console.log('mouseX', mousex)
        console.log('panel.left', panel.node.style.left)
        console.log('diff', mouseDiff)
        console.log('new left pos', calcDiff)

    }

    var initPanel = function (panels) {
        panels.forEach(function (panel) {
            panel.intWidth = panel.width.replace('px', '')
            panel.style.width = panel.width
            panel.locked = false;
            create(panel)
        }, this)
    }

    var create = function (panel) {
        if (panel.position === 'left') {
            var negVal = "-" + panel.width;
            var newDiv = document.createElement("div");
            Object.assign(newDiv.style, panel.style, { position: "absolute", height: "100%", top: "0", zIndex: "999" });
            newDiv.innerHTML = panel.html;
            newDiv.style.left = negVal;
            //
            panel.node = newDiv
            var t = document.getElementsByTagName("body")[0].appendChild(newDiv);
            newDiv.addEventListener('click', function (e) {
                panel.locked = !panel.locked;
                console.log(panel.locked)
                if (panel.locked) { panel.node.style.left = 0; }
            });
            return;
        }
        if (panel.position === 'right') {
            var newDiv = document.createElement("div");
            Object.assign(newDiv.style, panel.style, { position: "absolute", height: "100%", top: "0", zIndex: "999" })
            newDiv.innerHTML = panel.html;
            newDiv.style.left = window.innerWidth;
            panel.node = newDiv
            var t = document.getElementsByTagName("body")[0].appendChild(newDiv);
            newDiv.addEventListener('click', function (e) {
                panel.locked = !panel.locked;
                console.log(panel.locked)
                if (panel.locked) { panel.node.style.left = window.innerWidth - panel.intWidth; }
            });
            return;
        }
    }

    initPanel(panels);
    document.addEventListener("mousemove", checkMousePosition);

    // return {
    //     panels: panels
    // }


}