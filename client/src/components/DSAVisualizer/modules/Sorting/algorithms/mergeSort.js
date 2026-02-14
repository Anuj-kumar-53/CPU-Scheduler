export const mergeSort = (initialArray) => {
    // Merge sort is unique because we merge into a new array. To visualize "in-place" like bars,
    // we normally visualize the overwrite step.
    const array = [...initialArray];
    const frames = [];
    const n = array.length;

    frames.push({
        array: [...array],
        comparing: [],
        swapped: [],
        sorted: []
    });

    const merge = (arr, l, m, r) => {
        const n1 = m - l + 1;
        const n2 = r - m;

        const L = new Array(n1);
        const R = new Array(n2);

        for (let i = 0; i < n1; i++) L[i] = arr[l + i];
        for (let j = 0; j < n2; j++) R[j] = arr[m + 1 + j];

        let i = 0;
        let j = 0;
        let k = l;

        while (i < n1 && j < n2) {
            // Comparison
            frames.push({
                array: [...arr],
                comparing: [l + i, m + 1 + j],
                swapped: [],
                sorted: []
            });

            if (L[i] <= R[j]) {
                arr[k] = L[i];
                // Visualizing overwrite
                frames.push({
                    array: [...arr],
                    comparing: [],
                    swapped: [k], // Highlight index being written to
                    sorted: []
                });
                i++;
            } else {
                arr[k] = R[j];
                frames.push({
                    array: [...arr],
                    comparing: [],
                    swapped: [k],
                    sorted: []
                });
                j++;
            }
            k++;
        }

        while (i < n1) {
            arr[k] = L[i];
            frames.push({
                array: [...arr],
                comparing: [],
                swapped: [k],
                sorted: []
            });
            i++;
            k++;
        }

        while (j < n2) {
            arr[k] = R[j];
            frames.push({
                array: [...arr],
                comparing: [],
                swapped: [k],
                sorted: []
            });
            j++;
            k++;
        }
    };

    const runMergeSort = (arr, l, r) => {
        if (l >= r) return;
        const m = l + parseInt((r - l) / 2);
        runMergeSort(arr, l, m);
        runMergeSort(arr, m + 1, r);
        merge(arr, l, m, r);
    };

    runMergeSort(array, 0, n - 1);

    frames.push({
        array: [...array],
        comparing: [],
        swapped: [],
        sorted: Array.from({ length: n }, (_, i) => i)
    });

    return frames;
};
