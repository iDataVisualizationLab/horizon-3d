c3.generate({
    bindto: '#chart',
    size: {
        height: 360,
        width: 800
    },

    data: {
        x: 'x',
        columns: [
            ['x', 'Simple Surface', 'Small Multiples', '3D Horizon'],
            ['Task 1', 86, 93, 93],
            ['Task 2', 80, 85, 90]
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
                text: 'Graph Type',
                position: 'outer-middle'
            }
        }
    }
});
