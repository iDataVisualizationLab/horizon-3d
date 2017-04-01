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
            ['Simple Graph Surface', 2, 6, 15, 25],
            ['Small Multiples', 3, 5, 10, 15],
            ['3D Horizon Graph', 4, 5, 8, 10]
        ]
    },
    axis: {
        y: {
            max: 30,
            // padding: 0,

            label: { // ADD
                text: 'Time (s)',
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
