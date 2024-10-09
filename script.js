const baseId = 'app5SXCJbXkjbyzws'; // Replace with your Airtable base ID
const tableName = 'Gallery'; // Replace with your Airtable table name
const viewName = 'Grid view'; // Replace with your Airtable view name
const apiKey = 'patjTtCruaN066dZS.062a9d549877450667ef3dbafb5463225f2e17e72b3f71236220a800f9a483c8'; // Replace with your Airtable PAT

const url = `https://api.airtable.com/v0/${baseId}/${tableName}?view=${viewName}`;

const options = {
  headers: {
    Authorization: `Bearer ${apiKey}`,  // Send the PAT as a Bearer token
  },
};

fetch(url, options)
  .then(response => response.json())
  .then(data => {
    console.log('Fetched data from Airtable:', data);
    // Process the fetched data
  })
  .catch(error => console.error('Error fetching data:', error));

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