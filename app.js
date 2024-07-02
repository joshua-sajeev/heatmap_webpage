const app = Vue.createApp({
    data() {
        return {
            cells: Array(9).fill(0),
            maxCellVal: 15,
            editing: false,
            showModal: false,
            customMaxCellVal: 15, // Add this line
            showSettingsModal: false,
        };
    },
    methods: {
        incrementCell(index, event = null) {
            if (event && event.deltaY) {
                this.cells[index] += event.deltaY > 0 ? -1 : 1;
            } else {
                this.cells[index]++;
            }
            if (this.cells[index] > this.maxCellVal) {
                this.cells[index] = this.maxCellVal;
            } else if (this.cells[index] < 0) {
                this.cells[index] = 0;
            }
        },
        decrementCell(index) {
            this.cells[index]--;
            if (this.cells[index] > this.maxCellVal) {
                this.cells[index] = this.maxCellVal;
            } else if (this.cells[index] < 0) {
                this.cells[index] = 0;
            }
        },
        resetCells() {
            this.cells = Array(9).fill(0);
        },
        randomizeCells() {
            this.cells = this.cells.map(() => Math.floor(Math.random() * this.maxCellVal));
        },
        saveAsImage() {
            html2canvas(document.querySelector('.matrix-table')).then(canvas => {
                const imageData = canvas.toDataURL();
                const link = document.createElement('a');
                link.href = imageData;
                link.download = 'heatmap.png';
                link.click();
            });
        },
        toggleEditing() {
            this.editing = !this.editing;
            if (this.editing) {
                this.cells = Array(9).fill(0);
            }       },
        editStyle() {
            if (this.editing) {
                return {
                    backgroundColor: '#FFFFFF', // White background when editing
                    color: '#000000' // Black text color
                };
            } else {
                return {
                    backgroundColor: '#237EDC', // Blue background when not editing
                    color: '#FFFFFF' // White text color
                };
            }
        },
        getCellStyles(cellValue) {
            let hue = (cellValue / this.maxCellVal) * 120; // Adjusted maximum value
            let backgroundColor = `hsl(${hue}, 100%, 50%)`;
            let textColor = this.getContrastColor(backgroundColor);
            return {
                backgroundColor: backgroundColor,
                color: textColor
            };
        },
        getContrastColor(bgColor) {
            let rgb = bgColor.match(/\d+/g);
            let r = parseInt(rgb[0]);
            let g = parseInt(rgb[1]);
            let b = parseInt(rgb[2]);
            let luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
            return luminance > 0.3 ? 'black' : 'white';
        },
        constrainCell(index) {
            if (this.cells[index] > this.maxCellVal) {
                this.cells[index] = this.maxCellVal;
            } else if (this.cells[index] < 0) {
                this.cells[index] = 0;
            }
        },
        validateCell(index) {
            // Ensure cell value is within bounds
            if (this.cells[index] > this.maxCellVal) {
                this.cells[index] = this.maxCellVal;
            } else if (this.cells[index] < 0) {
                this.cells[index] = 0;
            }
        },
        showInfo() {
            this.showModal = true;
        },
        showSettings() {
            this.showSettingsModal = true;
            this.customMaxCellVal = this.maxCellVal; // Set customMaxCellVal to current maxCellVal
        },
        applySettings() {
            this.maxCellVal = this.customMaxCellVal; // Update maxCellVal with the custom value
            this.showSettingsModal = false;
        },
        cancelSettings() {
            this.showSettingsModal = false;
        }
    }
});

app.mount('#app');
