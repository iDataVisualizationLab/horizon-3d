c3.generate({
    bindto: '#chart',
    size: {
        height: 360,
        width: 800
    },

    data: {
        x: 'x',
        columns: [
            ['x', 2, 3, 4],
            ['Simple Graph Surface', 10, 15, 20],
            ['Small Multiples', 5, 10, 10],
            ['3D Horizon Graph', 10, 20, 35]
        ]
    },
    axis: {
        y: {
            max: 40,
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
