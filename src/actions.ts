
const Actions = {
    moveNode(parent, node, postion='last'){
        return {
            data: parent, 
            children: [ node]}
    },
    addNode(parent, node, position){},
    removeNode(parent, node, position){},
    toggleNode(node){},


}

export default Actions;
