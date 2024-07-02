const app = Vue.createApp({
    data() {
return {
            cells: Array(9).fill(0),
            maxCellVal: 15,
            editing: false,
            showModal: false,
            showSettingsModal: false,
            selectedStyle: 'default', // Default style
            customColors: Array(31).fill('#ff0000'), // Default colors for custom values (0-30)
            customMaxCellVal: 15 // Initial value, synced with maxCellVal
        };
    },
    methods: {
        incrementCell(index, event = null) {
            if (event && event.deltaY) {
                this.cells[index] += event.deltaY > 0 ? -1 : 1;
            } else {
                this.cells[index]++;
            }
            this.constrainCell(index);
        },
        decrementCell(index) {
            this.cells[index]--;
            this.constrainCell(index);
        },
        resetCells() {
            this.cells = Array(9).fill(0);
            this.default = true;
        },
        randomizeCells() {
            this.cells = this.cells.map(() => Math.floor(Math.random() * (this.maxCellVal + 1)));
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
        customCellStyles(cellValue) {
            let hue = (cellValue / this.maxCellVal) * 240; // Example custom hue adjustment
            let backgroundColor = this.hexToHsl(this.customColors[cellValue]);
            let textColor = this.getContrastColor(backgroundColor);
            return {
                backgroundColor: backgroundColor,
                color: textColor
            };
        },
        hexToHsl(hex) {
            // Remove '#' if present
            hex = hex.replace('#', '');

            // Parse the hex values
            let r = parseInt(hex.substring(0, 2), 16) / 255;
            let g = parseInt(hex.substring(2, 4), 16) / 255;
            let b = parseInt(hex.substring(4, 6), 16) / 255;

            // Find greatest and smallest channel values
            let cmin = Math.min(r, g, b),
                cmax = Math.max(r, g, b),
                delta = cmax - cmin,
                h = 0,
                s = 0,
                l = 0;

            // Calculate hue
            if (delta == 0) h = 0;
            else if (cmax == r) h = ((g - b) / delta) % 6;
            else if (cmax == g) h = (b - r) / delta + 2;
            else h = (r - g) / delta + 4;

            h = Math.round(h * 60);

            // Make negative hues positive behind 360°
            if (h < 0) h += 360;

            // Calculate lightness
            l = (cmax + cmin) / 2;

            // Calculate saturation
            s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

            // Multiply l and s by 100
            s = +(s * 100).toFixed(1);
            l = +(l * 100).toFixed(1);

            return `hsl(${h},${s}%,${l}%)`;
        },
        updateCellStyles(cellValue) {
            return this.default ? this.getCellStyles(cellValue) : this.customCellStyles(cellValue);
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
            this.constrainCell(index);
        },
        showInfo() {
            this.showModal = true;
        },
        showSettings() {
            this.showSettingsModal = true;
            this.customMaxCellVal = this.maxCellVal; // Sync customMaxCellVal with maxCellVal
        },
        applySettings() {
            // Update maxCellVal with customMaxCellVal
            this.maxCellVal = this.customMaxCellVal;
            // Adjust customColors array length to match new maxCellVal
            this.customColors.length = this.maxCellVal + 1;
            this.default = this.selectedStyle === 'default';
            this.showSettingsModal = false;
        },
    }
});

app.mount('#app');
