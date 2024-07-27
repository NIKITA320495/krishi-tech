document.addEventListener('DOMContentLoaded', () => {
    fetchSchemes();
});

function fetchSchemes() {
    // Example static data, replace with API call if available
    const schemes = [
        {
            title: 'PM-KISAN',
            description: 'The Pradhan Mantri Kisan Samman Nidhi (PM-KISAN) is a central sector scheme with 100% funding from the Government of India.',
            apply: 'Farmers can apply for PM-KISAN through the official website or visit the nearest Common Service Centre (CSC).',
            link: 'https://www.pmkisan.gov.in/'
        },
        {
            title: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
            description: 'Pradhan Mantri Fasal Bima Yojana (PMFBY) is an insurance service for farmers for their yields.',
            apply: 'Farmers can apply for PMFBY through the official website, local agriculture department offices, or authorized insurance agents.',
            link: 'https://www.pmfby.gov.in/'
        },
        {
            title: 'Kisan Credit Card (KCC)',
            description: 'The Kisan Credit Card (KCC) scheme aims to provide timely credit to farmers for their cultivation and other needs.',
            apply: 'Farmers can apply for a Kisan Credit Card at their nearest bank branch or through the official website of the respective bank.',
            link: 'https://www.kisancreditcard.com/'
        },
        {
            title: 'Soil Health Card Scheme',
            description: 'The Soil Health Card Scheme provides farmers with soil nutrient status of their land and advice on soil management practices.',
            apply: 'Farmers can apply for the Soil Health Card Scheme through their local agriculture department or via the official website.',
            link: 'https://soilhealth.dac.gov.in/'
        },
        {
            title: 'Paramparagat Krishi Vikas Yojana (PKVY)',
            description: 'Paramparagat Krishi Vikas Yojana (PKVY) aims to promote organic farming and improve soil health.',
            apply: 'Farmers can join PKVY by contacting their local agriculture department or visiting the official website.',
            link: 'https://pkvy.nic.in/'
        },
        {
            title: 'Pradhan Mantri Krishi Sinchai Yojana (PMKSY)',
            description: 'Pradhan Mantri Krishi Sinchai Yojana (PMKSY) aims to improve farm productivity and ensure better utilization of the resources in the country.',
            apply: 'Farmers can apply for PMKSY through their local agriculture department or via the official website.',
            link: 'https://pmksy.gov.in/'
        },
        {
            title: 'National Agriculture Market (e-NAM)',
            description: 'The e-NAM initiative aims to create a unified national market for agricultural commodities.',
            apply: 'Farmers can register on the e-NAM platform through the official website or by visiting the nearest market yard.',
            link: 'https://www.enam.gov.in/'
        }
    ];

    const schemesContainer = document.getElementById('schemes');
    schemesContainer.innerHTML = schemes.map(scheme => `
        <article class="scheme">
            <h2>${scheme.title}</h2>
            <p>${scheme.description}</p>
            <h3>How to Apply</h3>
            <p>${scheme.apply}</p>
            <a href="${scheme.link}" target="_blank">Learn More</a>
        </article>
    `).join('');
}