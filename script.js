const apiKey = 'patjTtCruaN066dZS.062a9d549877450667ef3dbafb5463225f2e17e72b3f71236220a800f9a483c8'; 
const baseId = 'app5SXCJbXkjbyzws';
const tableName = 'Gallery';
const viewName = 'Grid view';
const url = `https://api.airtable.com/v0/${baseId}/${tableName}?view=${viewName}&api_key=${apiKey}`;

const gallery = document.getElementById('gallery');
const detailModal = document.getElementById('detailModal');
const modalImage = document.getElementById('modalImage');
const modalArtist = document.getElementById('modalArtist');
const modalTags = document.getElementById('modalTags');
const modalClicks = document.getElementById('modalClicks');
const closeModal = document.getElementById('closeModal');

closeModal.addEventListener('click', () => {
    detailModal.style.display = 'none';
});

async function fetchRecords(offset = '') {
    let fetchUrl = url;
    if (offset) {
        fetchUrl += `&offset=${offset}`;
    }

    const response = await fetch(fetchUrl);
    const data = await response.json();

    displayMedia(data.records);

    if (data.offset) {
        fetchRecords(data.offset);
    }
}

function displayMedia(records) {
    if (!records) return;

    records.forEach(record => {
        const fields = record.fields;

        const card = document.createElement('div');
        card.classList.add('media-card');

        const img = document.createElement('img');
        img.src = fields.CloudinaryURL;
        img.alt = fields.Title;
        img.classList.add('gallery-image');
        img.loading = 'lazy'; // Lazy loading attribute

        img.addEventListener('click', () => {
            modalImage.src = fields.CloudinaryURL;
            modalArtist.textContent = `Creator: ${fields.Creator}`;
            modalTags.textContent = `Tags: ${fields.Tags || 'None'}`;
            modalClicks.textContent = `Views: ${fields.Clicks || 0}`;
            detailModal.style.display = 'block';
        });

        card.appendChild(img);
        gallery.appendChild(card);
    });

    // Reinitialize Masonry after new images are added
    new Masonry(gallery, {
        itemSelector: '.media-card',
        columnWidth: 200
    });
}

fetchRecords();