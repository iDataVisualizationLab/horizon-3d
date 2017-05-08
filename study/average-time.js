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
            ['Simple Surface Graph', 9, 17, 19],
            ['Small Multiples', 13, 16, 17],
            ['3D Horizon Graph', 13, 15, 18]
        ],
        type: 'bar'
    },
    bar: {
        width: {
            ratio: 0.5 // this makes bar width 50% of length between ticks
        }
    },
    axis: {
        y: {
            max: 20,
            // padding: 0,

            label: { // ADD
                text: 'Time (s)',
                position: 'outer-middle'
            }
        },
        x: {
            type: 'category',
            label: { // ADD
                text: 'Number of study years',
                position: 'outer-middle'
            }
        }
    }
});
