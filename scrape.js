const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');
const writeStream = fs.createWriteStream('data.csv');

// Write Headers
writeStream.write(`Countires,Total Cases,New Cases,Total Deaths,New Deaths,Total Recovered,Active Cases,Serious/Critical,Cases Per Million,Deaths Per Million,Total Tests,Tests Per Million \n`)

request('https://www.worldometers.info/coronavirus/', (error, response, html) => {
    if (!error && response.statusCode == 200) {
        const $ = cheerio.load(html);

        const content = $('#main_table_countries_today tbody')[0];

        const header = $('#main_table_countries_today thead tr' )

        const rows = $(content).find('tr'); // it is an array
        
        for (let i = 8; i < rows.length; i++) {

            const rowData = $(rows[i]).find('td');
            const country = $(rows[i]).find('td a').text();

            const totalCases = $(rowData[1]).text().replace(/,/,'');
            const newCases = $(rowData[2]).text().replace(/,/, '');
            const totalDeaths = $(rowData[3]).text().replace(/,/, '');
            const newDeaths = $(rowData[4]).text().replace(/,/, '');
            const totalRecovered = $(rowData[5]).text().replace(/,/, '');
            const activeCases = $(rowData[6]).text().replace(/,/, '');
            const seriousCritical = $(rowData[7]).text().replace(/,/, '');
            const casesPerMillion = $(rowData[8]).text().replace(/,/, '');
            const deathsPerMillion = $(rowData[9]).text().replace(/,/, '');
            const totalTests = $(rowData[10]).text().replace(/,/, '').replace(/,/, '');
            const testsPerMillion = $(rowData[11]).text().replace(/,/, '');

            // Write row to CSV 
            writeStream.write(`${country}, ${totalCases}, ${newCases}, ${totalDeaths}, ${newDeaths}, ${totalRecovered}, ${activeCases}, ${seriousCritical}, ${casesPerMillion}, ${deathsPerMillion}, ${totalTests}, ${testsPerMillion} \n`)
            
            //console.log(country, totalCases, newCases, totalDeaths, newDeaths, totalRecovered, activeCases, seriousCritical,casesPerMillion, deathsPerMillion, totalTests, testsPerMillion);

        }
        console.log("File Created Successfully.");
        
    }

}); 