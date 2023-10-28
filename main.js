document.addEventListener("DOMContentLoaded", function () {
    const checkboxes = document.querySelectorAll("input[type='checkbox']");
    const getDataButton = document.getElementById("getDataButton");

    checkboxes.forEach((checkbox) => {
        checkbox.addEventListener("change", function () {
            if (!this.checked) {
                selectAllCheckbox.checked = false;
            }
        });
    });

    getDataButton.addEventListener("click", fetchData);

    function fetchData() {
        const apiKey = 'BWMAV7DQIIVXGQGL';
        const selectedStockSymbols = [];

        selectedStockSymbols.length = 0;
        checkboxes.forEach(checkbox => {
            if (checkbox.checked) {
                selectedStockSymbols.push(checkbox.value);
            }
        });

        if (selectedStockSymbols.length === 0) {
            document.getElementById("responseOutput").textContent = "Please select at least one stock symbol.";
            return;
        }

        const dataPromises = selectedStockSymbols.map(symbol => {
            const apiUrl = `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=${apiKey}`;
            return fetch(apiUrl)
                .then(response => {
                    if (!response.ok) {
                        throw Error(`Network response was not ok (${response.status})`);
                    }
                    return response.json();
                });
        });

        Promise.all(dataPromises)
            .then(dataArray => {
                const results = dataArray.map((data, index) => ({
                    stockSymbol: selectedStockSymbols[index],
                    data: data,
                }));
                displayResults(results);
            })
            .catch(error => {
                document.getElementById("responseOutput").textContent = `Error: ${error.message}`;
            });
    }

    function displayResults(results) {
        const tableContainer = document.getElementById("responseOutput");
        tableContainer.innerHTML = '';

        const table = document.createElement("table");
        table.classList.add("stock-table");
        const tableHeader = createTableHeader();
        table.appendChild(tableHeader);

        results.forEach(result => {
            const tableRow = createTableRow(result.stockSymbol, result.data);
            table.appendChild(tableRow);
        });

        tableContainer.appendChild(table);
    }

    function createTableHeader() {
        const tableHeader = document.createElement("thead");
        const headerRow = document.createElement("tr");

        const headers = [
            "Stock Symbol",
            "Name",
            "Description",
            "Country",
            "Industry",
            "Address",
            "52-Week High",
            "52-Week Low",
            "50-Day Moving Average",
            "200-Day Moving Average",
            "Book Value",
        ];

        headers.forEach(headerText => {
            const header = document.createElement("th");
            header.innerText = headerText;
            header.scope = "col";
            headerRow.appendChild(header);
        });

        tableHeader.appendChild(headerRow);
        return tableHeader;
    }

    function createTableRow(stockSymbol, data) {
        const tableRow = document.createElement("tr");

        const rowData = [
            stockSymbol,
            data.Name,
            data.Description,
            data.Country,
            data.Industry,
            data.Address,
            data["52WeekHigh"],
            data["52WeekLow"],
            data["50DayMovingAverage"],
            data["200DayMovingAverage"],
            `$${data.BookValue}`,
        ];

        rowData.forEach(cellData => {
            const cell = document.createElement("td");
            cell.innerText = cellData;
            tableRow.appendChild(cell);
        });

        return tableRow;
    }
});
