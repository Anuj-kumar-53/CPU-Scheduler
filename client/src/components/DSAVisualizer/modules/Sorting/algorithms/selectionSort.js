export const selectionSort = (initialArray) => {
    const array = [...initialArray];
    const frames = [];
    const n = array.length;
    const sortedIndices = [];

    frames.push({
        array: [...array],
        comparing: [],
        swapped: [],
        sorted: []
    });

    for (let i = 0; i < n; i++) {
        let minIdx = i;

        // Visualize: starting new pass, highlight current position 'i' as potential min
        frames.push({
            array: [...array],
            comparing: [i, minIdx],
            swapped: [],
            sorted: [...sortedIndices]
        });

        for (let j = i + 1; j < n; j++) {
            // Compare current min with j
            frames.push({
                array: [...array],
                comparing: [minIdx, j],
                swapped: [],
                sorted: [...sortedIndices]
            });

            if (array[j] < array[minIdx]) {
                minIdx = j;
                // Found new min
                frames.push({
                    array: [...array],
                    comparing: [minIdx], // Highlight new min
                    swapped: [],
                    sorted: [...sortedIndices]
                });
            }
        }

        if (minIdx !== i) {
            [array[i], array[minIdx]] = [array[minIdx], array[i]];
            // Visualize Swap
            frames.push({
                array: [...array],
                comparing: [],
                swapped: [i, minIdx],
                sorted: [...sortedIndices]
            });
        }

        sortedIndices.push(i);

        frames.push({
            array: [...array],
            comparing: [],
            swapped: [],
            sorted: [...sortedIndices]
        });
    }

    frames.push({
        array: [...array],
        comparing: [],
        swapped: [],
        sorted: Array.from({ length: n }, (_, i) => i)
    });

    return frames;
};
