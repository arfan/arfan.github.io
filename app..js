(function(root, doc) {
    const appOnError = (err) => {
        window.jeLastError = err;
        alert(String(err));
    };

    const panelLeft = doc.getElementById("panel-left");
    const panelRight = doc.getElementById("panel-right");

    const startJson = {
        "array": [1, 2, 3],
        "boolean": true,
        "null": null,
        "number": 123,
        "object": { "a": "b", "c": "d" },
        "string": "Hello World",
    };

    const editorLeft = new JSONEditor(
        panelLeft,
        { mode: "code", modes: ["code", "tree"], onError: appOnError },
        startJson
    );
    const editorRight = new JSONEditor(
        panelRight,
        { mode: "tree", modes: ["code", "tree"], onError: appOnError },
        startJson
    );

    document.addEventListener("click", (evt) => {
        if (evt.target.matches("[data-app-action='to-left']")) {
            evt.target.focus();
            try {
                editorLeft.set(editorRight.get());
            } catch (err) {
                appOnError(err);
            }
        } else if (evt.target.matches("[data-app-action='to-right']")) {
            evt.target.focus();
            try {
                editorRight.set(editorLeft.get());
            } catch (err) {
                appOnError(err);
            }
        }
    });

    root.jeEditorLeft = editorLeft;
    root.jeEditorRight = editorRight;
})(window, document);
(function(root, doc) {
    function dragElement(elDragHandle, elSeparator, elLeftBox, elRightBox) {
        let md;
        elDragHandle.onmousedown = onMouseDown;

        function onMouseDown(e) {
            const leftWidth = elLeftBox.offsetWidth;
            const rightWidth = elRightBox.offsetWidth;
            md = {
                e,
                leftWidth,
                rightWidth,
                totalWidth: leftWidth + rightWidth,
            };

            doc.onmousemove = onMouseMove;
            doc.onmouseup = () => {
                doc.onmousemove = doc.onmouseup = null;
            }
        }

        function onMouseMove(e) {
            const delta = e.clientX - md.e.clientX;
            // Prevent negative-sized elements
            const adjDelta = Math.min(
                Math.max(delta, -md.leftWidth),
                md.rightWidth
            );

            const leftNewWidth = md.leftWidth + adjDelta;
            const rightNewWidth = md.rightWidth - adjDelta;

            const leftProportion = leftNewWidth / md.totalWidth;
            const rightProportion = rightNewWidth / md.totalWidth;

            elLeftBox.style.flexGrow = leftProportion;
            elRightBox.style.flexGrow = rightProportion;
        }
    }

    const panelLeft = doc.getElementById("panel-left");
    const panelRight = doc.getElementById("panel-right");
    const panelSep = doc.getElementById("panel-separator");
    const panelSepDragHandle = doc.getElementById("panel-separator-draghandle");

    dragElement(panelSepDragHandle, panelSep, panelLeft, panelRight);
})(window, document);
