const deleteChildren = function (node) {
    while (node.children[0]) {
        node.children[0].remove();
    }
};

export default deleteChildren;
