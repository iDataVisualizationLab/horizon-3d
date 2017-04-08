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
            ['Simple Surface Graph', 90, 78, 68],
            ['Small Multiples', 88, 80, 75],
            ['3D Horizon Graph', 65, 50, 42.5]
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
            max: 100,
            // padding: 0,

            label: { // ADD
                text: 'Accuracy (%)',
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
