const apiKey = 'patjTtCruaN066dZS.062a9d549877450667ef3dbafb5463225f2e17e72b3f71236220a800f9a483c8'; // Airtable API key
const baseId = 'app5SXCJbXkjbyzws'; // Airtable Base ID
const tableName = 'Gallery'; // Airtable Table name
const viewName = 'Grid view'; // Airtable view
const url = `https://api.airtable.com/v0/${baseId}/${tableName}?view=${viewName}&api_key=${apiKey}`;

let mediaRecords = [];
let mediaClicks = {};

async function fetchRecords(offset = '') {
    const fetchUrl = offset ? `${url}&offset=${offset}` : url;
    try {
        console.log(`Fetching from URL: ${fetchUrl}`); // Log the fetch URL for debugging
        const response = await fetch(fetchUrl);
        const data = await response.json();
        console.log('Fetched data from Airtable:', data); // Log the fetched data

        mediaRecords = [...mediaRecords, ...data.records];
        if (data.offset) {
            await fetchRecords(data.offset); // Paginate and fetch all records
        } else {
            displayMedia(mediaRecords);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function displayMedia(records) {
    const gallery = document.getElementById('gallery');
    gallery.innerHTML = ''; // Clear previous records

    records.forEach(record => {
        const fields = record.fields;
        console.log('Processing record:', fields); // Log each record's fields

        if (!fields.CloudinaryURL) {
            console.warn(`Missing media URL for record: ${fields.Title}`);
            return;
        }

        const mediaItem = document.createElement('div');
        mediaItem.classList.add('media-item');
        mediaItem.innerHTML = `
            <img src="${fields.CloudinaryURL}" alt="${fields.Title}" class="media-thumb">
            <p>${fields.Title}</p>
        `;

        mediaItem.onclick = () => showDetailView(fields, record.id);
        gallery.appendChild(mediaItem);

        // Initialize click count
        if (!mediaClicks[record.id]) {
            mediaClicks[record.id] = 0;
        }
    });
}

function showDetailView(fields, recordId) {
    const modal = document.getElementById('detailModal');
    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    const modalArtist = document.getElementById('modalArtist');
    const modalTags = document.getElementById('modalTags');
    const modalClicks = document.getElementById('modalClicks');

    modalTitle.textContent = fields.Title || 'Unknown Title';
    modalArtist.textContent = `Artist: ${fields.Artist || 'Unknown'}`;
    modalTags.textContent = `Tags: ${fields.Tags || 'None'}`;
    modalClicks.textContent = `Clicks: ${mediaClicks[recordId]}`;

    modalImage.src = fields.CloudinaryURL;
    modal.style.display = 'block';

    mediaClicks[recordId] += 1;
    modalClicks.textContent = `Clicks: ${mediaClicks[recordId]}`;
}

function closeModal() {
    const modal = document.getElementById('detailModal');
    modal.style.display = 'none';
}

window.onclick = function (event) {
    const modal = document.getElementById('detailModal');
    if (event.target === modal) {
        closeModal();
    }
};

// Call to fetch records on page load
fetchRecords();