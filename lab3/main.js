let timerInterval;
let seconds = 0;

const updateDisplay = () => {
    const display = document.getElementById("timerDisplay");
    if (seconds < 60) {
        display.innerText = `${seconds}s`;
    } else {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        display.innerText = `${mins}min ${secs}s`;
    }
};

document.getElementById("startBtn").addEventListener("click", () => {
    if (!timerInterval) {
        timerInterval = setInterval(() => {
            seconds++;
            updateDisplay();
        }, 1000);
    }
});

document.getElementById("stopBtn").addEventListener("click", () => {
    clearInterval(timerInterval);
    timerInterval = null;
});

document.getElementById("resetBtn").addEventListener("click", () => {
    clearInterval(timerInterval);
    timerInterval = null;
    seconds = 0;
    updateDisplay();
});

document.getElementById("generateBtn").addEventListener("click", () => {
    const min = parseInt(document.getElementById("minLength").value);
    const max = parseInt(document.getElementById("maxLength").value);
    const useUpper = document.getElementById("useUpperCase").checked;
    const useSpecial = document.getElementById("useSpecial").checked;

    if (min > max) {
        return alert("min > max")
    };

    const length = Math.floor(Math.random() * (max - min + 1)) + min;
    const lowerChars = "abcdefghijklmnopqrstuvwxyz";
    const upperChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const specialChars = "!@#$%^&*()_+[]{}|;:,.<>?";
    
    let charset = lowerChars;
    if (useUpper) {
        charset += upperChars
    };
    if (useSpecial) {
        charset += specialChars
    };

    let password = "";
    for (let i = 0; i < length; i++) {
        password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    alert(password);
});

let originalData = [];
let currentData = [];

async function fetchData() {
    const response = await fetch("https://dummyjson.com/products");
    const data = await response.json();

    originalData = data.products.slice(0, 30);
    currentData = [...originalData];

    renderTable(currentData);
}

function renderTable(data) {
    const container = document.getElementById("tableContainer");
    container.innerHTML = "";
    
    const table = document.createElement("table");
    const thead = document.createElement("thead");
    thead.innerHTML = `<tr><th>Zdjęcie</th><th>Tytuł</th><th>Opis</th></tr>`;
    table.appendChild(thead);

    const tbody = document.createElement("tbody");
    data.forEach(item => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td><img src="${item.thumbnail}" class="product-img" alt="${item.title}"></td>
            <td>${item.title}</td>
            <td>${item.description}</td>
        `;
        tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    container.appendChild(table);
}

document.getElementById("filterInput").addEventListener("input", (e) => {
    const phrase = e.target.value.toLowerCase();
    const filtered = originalData.filter(item => 
        item.title.toLowerCase().includes(phrase) || 
        item.description.toLowerCase().includes(phrase)
    );
    applySortAndRender(filtered);
});

document.getElementById("sortSelect").addEventListener("change", () => {
    const phrase = document.getElementById("filterInput").value.toLowerCase();
    const filtered = originalData.filter(item => 
        item.title.toLowerCase().includes(phrase) || 
        item.description.toLowerCase().includes(phrase)
    );
    applySortAndRender(filtered);
});

function applySortAndRender(data) {
    const sortType = document.getElementById("sortSelect").value;
    let sortedData = [...data];

    if (sortType === "asc") {
        sortedData.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortType === "desc") {
        sortedData.sort((a, b) => b.title.localeCompare(a.title));
    }

    renderTable(sortedData);
}

fetchData();