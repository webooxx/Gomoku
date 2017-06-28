export const createCanvas = size => {
    const d = document;
    const fragment = d.createDocumentFragment();
    const id = 'c_' + setTimeout(() => {
        });

    const node = d.createElement('canvas');
    const canvas = node.getContext("2d");

    fragment.appendChild(node);

    node.setAttribute('id', id);

    node.width = size[0];
    node.height = size[1];
    canvas.width = size[0];
    canvas.height = size[1];

    // d.body.appendChild(node);

    return {
        id: id,
        $el: node,
        $canvas: canvas
    }
};

