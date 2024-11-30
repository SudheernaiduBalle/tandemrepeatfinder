function findRepeatsAndDesignPrimers() {
    let sequence = document.getElementById('sequence').value.toUpperCase();
    let resultTable = document.getElementById('resultTable').getElementsByTagName('tbody')[0];
    resultTable.innerHTML = ''; // Clear previous results

    if (!sequence) {
        alert("Please enter a DNA sequence.");
        return;
    }

    const results = [];
    const minMotifLength = 2; // Minimum motif length (e.g., di-nucleotides)
    const seenRegions = new Set(); // To track and avoid overlaps

    for (let start = 0; start < sequence.length; start++) {
        for (let length = minMotifLength; length <= sequence.length - start; length++) {
            let motif = sequence.substring(start, start + length);
            let position = start;

            // Check if motif repeats consecutively (tandem repeat)
            let repeatLength = 0;
            while (sequence.substring(position, position + length) === motif) {
                repeatLength += length;
                position += length;
            }

            // Valid repeat found (motif repeats at least once)
            if (repeatLength >= length * 2) {
                let startPosition = start + 1; // 1-based index
                let endPosition = start + repeatLength;

                // Ensure no overlap
                if (!Array.from(seenRegions).some(region => startPosition >= region[0] && endPosition <= region[1])) {
                    const forwardPrimer = sequence.substring(start, start + 20);
                    const reversePrimer = getReverseComplement(
                        sequence.substring(endPosition - 20, endPosition)
                    );

                    results.push({
                        motif: motif,
                        totalRepeatLength: repeatLength,
                        start: startPosition,
                        end: endPosition,
                        forwardPrimer: forwardPrimer,
                        forwardBinding: startPosition,
                        reversePrimer: reversePrimer,
                        reverseBinding: endPosition,
                        ampliconLength: endPosition - startPosition + 1
                    });

                    // Mark this region as seen
                    seenRegions.add([startPosition, endPosition]);
                }

                start = endPosition - 1; // Move to the end of this repeat
                break; // Avoid nested repeats
            }
        }
    }

    // Display results in the table
    results.forEach(result => {
        const row = resultTable.insertRow();
        row.insertCell(0).textContent = result.motif;
        row.insertCell(1).textContent = result.totalRepeatLength;
        row.insertCell(2).textContent = result.start;
        row.insertCell(3).textContent = result.end;
        row.insertCell(4).textContent = result.forwardPrimer;
        row.insertCell(5).textContent = result.forwardBinding;
        row.insertCell(6).textContent = result.reversePrimer;
        row.insertCell(7).textContent = result.reverseBinding;
        row.insertCell(8).textContent = result.ampliconLength;
    });
}

// Function to calculate the reverse complement of a DNA sequence
function getReverseComplement(sequence) {
    const complement = { A: 'T', T: 'A', G: 'C', C: 'G' };
    return sequence.split('').reverse().map(base => complement[base] || base).join('');
}

function reloadPage() {
    document.getElementById('sequence').value = ''; // Clear the sequence input
    document.getElementById('resultTable').getElementsByTagName('tbody')[0].innerHTML = ''; // Clear the results table
}
