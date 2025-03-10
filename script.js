document.getElementById("search-button").addEventListener("click", fetchCountryData);

async function fetchCountryData() {
    const countryName = document.getElementById("country-input").value.trim();
    
    if (!countryName) {
        alert("Please enter a country name to begin search.");
        return;
    }

    const countryInfoSection = document.getElementById("country-info");
    const borderingCountriesSection = document.getElementById("bordering-countries");

    countryInfoSection.innerHTML = "";
    borderingCountriesSection.innerHTML = "";

    try {
        const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);
        if (!response.ok) throw new Error("Country not found. Please try again.");
        
        const countryData = await response.json();
        const country = countryData[0];

        const { name, capital, population, region, flags, borders } = country;

        countryInfoSection.innerHTML = `
            <h2>${name.common}</h2>
            <img class="country-flag" src="${flags.png}" alt="Flag of ${name.common}">
            <p><strong>Capital:</strong> ${capital ? capital[0] : "N/A"}</p>
            <p><strong>Population:</strong> ${population.toLocaleString()}</p>
            <p><strong>Region:</strong> ${region}</p>
        `;

        if (borders && borders.length > 0) {
            borderingCountriesSection.innerHTML = `<h3>Bordering Countries:</h3>`;
            for (let border of borders) {
                fetchNeighboringCountry(border);
            }
        } else {
            borderingCountriesSection.innerHTML = `<p>This country has no land borders.</p>`;
        }
    } catch (error) {
        countryInfoSection.innerHTML = `<p style="color: red;">${error.message}</p>`;
    }
}

async function fetchNeighboringCountry(countryCode) {
    try {
        const response = await fetch(`https://restcountries.com/v3.1/alpha/${countryCode}`);
        const data = await response.json();
        const country = data[0];

        // Append bordering country information
        document.getElementById("bordering-countries").innerHTML += `
            <div class="bordering-country">
                <img src="${country.flags.png}" alt="Flag of ${country.name.common}">
                <p>${country.name.common}</p>
            </div>
        `;
    } catch (error) {
        console.error(`Error fetching neighboring country ${countryCode}:`, error);
    }
}
