export const bubbleSort = (initialArray) => {
    const array = [...initialArray];
    const frames = [];
    const n = array.length;
    const sortedIndices = [];

    // Push initial state
    frames.push({
        array: [...array],
        comparing: [],
        swapped: [],
        sorted: []
    });

    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            // Compare j and j+1
            frames.push({
                array: [...array],
                comparing: [j, j + 1], // Highlights these bars yellow
                swapped: [],
                sorted: [...sortedIndices]
            });

            if (array[j] > array[j + 1]) {
                // Swap
                [array[j], array[j + 1]] = [array[j + 1], array[j]];

                // Visualization Frame: Show swap color
                frames.push({
                    array: [...array],
                    comparing: [],
                    swapped: [j, j + 1], // Highlights these bars purple
                    sorted: [...sortedIndices]
                });
            }
        }
        // Element at n-i-1 is sorted
        sortedIndices.push(n - i - 1);

        frames.push({
            array: [...array],
            comparing: [],
            swapped: [],
            sorted: [...sortedIndices] // Updates green bars
        });
    }

    // Final sorted frame
    frames.push({
        array: [...array],
        comparing: [],
        swapped: [],
        sorted: Array.from({ length: n }, (_, i) => i) // All sorted
    });

    return frames;
};
