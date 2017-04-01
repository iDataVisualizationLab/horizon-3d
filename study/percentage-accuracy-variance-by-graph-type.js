c3.generate({
    bindto: '#chart',
    size: {
        height: 360,
        width: 800
    },

    data: {
        x: 'x',
        columns: [
            ['x', 2, 3, 5, 7],
            ['Simple Graph Surface', 2, 6, 10, 12],
            ['Small Multiples', 2.5, 5, 7, 8],
            ['3D Horizon Graph', 3, 5, 6, 7]
        ]
    },
    axis: {
        y: {
            max: 15,
            // padding: 0,

            label: { // ADD
                text: 'Accuracy (%)',
                position: 'outer-middle'
            }
        },
        x: {
            // type: 'category',
            label: { // ADD
                text: 'Number of study years',
                position: 'outer-middle'
            }
        }
    }
});
