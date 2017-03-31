c3.generate({
    bindto: '#chart',
    size: {
        height: 360,
        width: 800
    },

    data: {
        x: 'x',
        columns: [
            ['x', 2, 3, 7],
            ['Simple Surface Graph', 5, 8, 40],
            ['Small Multiples', 5, 15, 25],
            ['3D Horizon Graph', 10, 13, 15]
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
