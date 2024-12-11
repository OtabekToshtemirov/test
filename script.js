document.addEventListener('DOMContentLoaded', () => {
    const currencyGrid = document.getElementById('currencyGrid');
    const lastUpdatedEl = document.getElementById('lastUpdated');

    async function fetchCurrencyData() {
        try {
            // Use a CORS proxy to handle cross-origin requests
            const response = await fetch('https://www.cbr-xml-daily.ru/daily_json.js');
            const data = await response.json();
            return data.Valute;
        } catch (error) {
            console.error('Error fetching currency data:', error);
            return {};
        }
    }

    async function renderCurrencies() {
        try {
            const currencyData = await fetchCurrencyData();
            
            currencyGrid.innerHTML = Object.entries(currencyData).map(([code, data]) => {
                const changePercent = ((data.Value - data.Previous) / data.Previous * 100).toFixed(2);
                const changeColor = changePercent >= 0 ? 'text-green-600' : 'text-red-600';

                return `
                    <div class="bg-white border rounded-lg p-4 shadow-md hover:shadow-lg transition-all">
                        <div class="flex justify-between items-center">
                            <h2 class="text-xl font-semibold text-gray-800">${code}</h2>
                            <span class="text-sm ${changeColor}">
                                ${changePercent >= 0 ? '▲' : '▼'} ${Math.abs(changePercent)}%
                            </span>
                        </div>
                        <p class="text-gray-600">${data.Name}</p>
                        <div class="text-2xl font-bold text-blue-600 mt-2">
                            ${(data.Value / data.Nominal).toFixed(4)}
                        </div>
                    </div>
                `;
            }).join('');

            lastUpdatedEl.textContent = `Last Updated: ${new Date().toLocaleString()}`;
        } catch (error) {
            currencyGrid.innerHTML = `<div class="text-red-600">Error loading currency data</div>`;
            console.error(error);
        }
    }

    // Initial render
    renderCurrencies();

    // Optional: Refresh data every 5 minutes
    setInterval(renderCurrencies, 5 * 60 * 1000);
});