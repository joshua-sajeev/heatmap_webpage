document.addEventListener('DOMContentLoaded', () => {
  const cells = document.querySelectorAll('.cell');
  const resetButton = document.getElementById('reset-btn');
  const randomButton = document.getElementById('random-btn');
  const saveButton = document.getElementById('save-btn');

  cells.forEach(cell => {
    cell.addEventListener('click', () => incrementCellValue(cell));
    cell.addEventListener('wheel', event => {
      event.preventDefault();
      const direction = event.deltaY > 0 ? -1 : 1;
      updateCellValue(cell, direction);
    });
  });

  resetButton.addEventListener('click', () => {
    cells.forEach(cell => {
      cell.textContent = '0';
      updateCellColor(cell);
    });
  });

  randomButton.addEventListener('click', () => {
    cells.forEach(cell => {
      const randomValue = Math.floor(Math.random() * 15); // Random value from 0 to 14
      cell.textContent = randomValue.toString();
      updateCellColor(cell);
    });
  });

  saveButton.addEventListener('click', () => {
    saveHeatmapAsImage();
  });

  function incrementCellValue(cell) {
    let count = parseInt(cell.textContent);
    cell.textContent = (count + 1) % 15;
    updateCellColor(cell);
  }

  function updateCellValue(cell, direction) {
    let currentValue = parseInt(cell.textContent);
    let newValue = currentValue + direction;
    if (newValue < 0) {
      newValue = 0; // Ensure it doesn't go below 0
    } else if (newValue > 14) {
      newValue = 14; // Ensure it doesn't exceed 14
    }
    cell.textContent = newValue;
    updateCellColor(cell);
  }

  function updateCellColor(cell) {
    let value = parseInt(cell.textContent);
    if (value === 0) {
      cell.style.backgroundColor = 'hsl(0, 100%, 50%)'; // Red color for value 0
    } else {
      let hue = (value / 14) * 240; // Adjusted maximum value
      let backgroundColor = `hsl(${hue}, 100%, 50%)`;
      cell.style.backgroundColor = backgroundColor;
    }
    let textColor = getContrastColor(cell.style.backgroundColor);
    cell.style.color = textColor;
  }

  function getContrastColor(bgColor) {
    let rgb = bgColor.match(/\d+/g);
    let r = parseInt(rgb[0]);
    let g = parseInt(rgb[1]);
    let b = parseInt(rgb[2]);
    let luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? 'black' : 'white';
  }

  function saveHeatmapAsImage() {
    // Select the container element containing the heatmap
    const container = document.querySelector('.heatmap');

    // Use html2canvas to capture the container as an image
    html2canvas(container).then(canvas => {
      // Convert canvas to image data URL
      const imgDataUrl = canvas.toDataURL('image/png');

      // Create a download link
      const link = document.createElement('a');
      link.download = 'heatmap.png';
      link.href = imgDataUrl;
      link.click();
    }).catch(error => {
      console.error('Error in saving heatmap as image:', error);
    });
  }

  // Initialize matrix colors on page load
  cells.forEach(cell => {
    cell.textContent = '0'; // Set default value to 0
    updateCellColor(cell);
  });
});
