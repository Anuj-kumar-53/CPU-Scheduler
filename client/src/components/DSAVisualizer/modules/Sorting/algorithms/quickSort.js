export const quickSort = (initialArray) => {
    const array = [...initialArray];
    const frames = [];
    const n = array.length;

    frames.push({
        array: [...array],
        comparing: [],
        swapped: [],
        sorted: []
    });

    const partition = (arr, low, high) => {
        const pivot = arr[high];
        let i = low - 1;

        // Visualize pivot
        frames.push({
            array: [...arr],
            comparing: [high], // Pivot in yellow
            swapped: [],
            sorted: []
        });

        for (let j = low; j < high; j++) {
            // Visualize comparison
            frames.push({
                array: [...arr],
                comparing: [j, high],
                swapped: [],
                sorted: []
            });

            if (arr[j] < pivot) {
                i++;
                [arr[i], arr[j]] = [arr[j], arr[i]];

                // Visualize swap
                frames.push({
                    array: [...arr],
                    comparing: [],
                    swapped: [i, j],
                    sorted: []
                });
            }
        }
        [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];

        // Final pivot placement
        frames.push({
            array: [...arr],
            comparing: [],
            swapped: [i + 1, high],
            sorted: [] // We could track sorted partitions, but quicksort is tricky to visualize partially sorted ranges cleanly until end
        });

        return i + 1;
    };

    const runQuickSort = (arr, low, high) => {
        if (low < high) {
            const pi = partition(arr, low, high);
            runQuickSort(arr, low, pi - 1);
            runQuickSort(arr, pi + 1, high);
        }
    };

    runQuickSort(array, 0, n - 1);

    // Final sorted frame
    frames.push({
        array: [...array],
        comparing: [],
        swapped: [],
        sorted: Array.from({ length: n }, (_, i) => i)
    });

    return frames;
};
