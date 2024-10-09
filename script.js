// Airtable configuration
const apiKey = 'patjTtCruaN066dZS.062a9d549877450667ef3dbafb5463225f2e17e72b3f71236220a800f9a483c8'; 
const baseId = 'app5SXCJbXkjbyzws'; 
const tableName = 'Gallery';
const viewName = 'Grid view';

async function fetchRecords() {
    const url = `https://api.airtable.com/v0/${baseId}/${tableName}?view=${viewName}`;

    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${apiKey}`
        }
    });

    if (!response.ok) {
        console.error('Error fetching data:', response.statusText);
        return;
    }

    const data = await response.json();
    console.log('Fetched data from Airtable:', data);

    // Ensure data.records exists and is iterable
    if (data.records && Array.isArray(data.records)) {
        displayMedia(data.records);
    } else {
        console.error('Error fetching data: data.records is not iterable or missing');
    }
}

function displayMedia(records) {
    const gallery = document.getElementById('gallery');
    gallery.innerHTML = ''; // Clear the gallery

    records.forEach(record => {
        const mediaUrl = record.fields['CloudinaryURL'];
        const title = record.fields['Title'];
        const artist = record.fields['Creator'];
        const tags = record.fields['Tags'];
        const clicks = record.fields['Clicks'] || 0;

        if (mediaUrl) {
            const mediaCard = document.createElement('div');
            mediaCard.classList.add('media-card');

            const imgElement = document.createElement('img');
            imgElement.src = mediaUrl;
            imgElement.alt = title;
            imgElement.classList.add('gallery-image');
            imgElement.onclick = () => showDetailView(title, artist, tags, clicks, mediaUrl);

            mediaCard.appendChild(imgElement);
            gallery.appendChild(mediaCard);
        }
    });
}

function showDetailView(artist, tags, clicks, mediaUrl) {
    const modal = document.getElementById('detailModal');
    const modalArtist = document.getElementById('modalArtist');
    const modalTags = document.getElementById('modalTags');
    const modalClicks = document.getElementById('modalClicks');
    const modalImage = document.getElementById('modalImage');

    modalArtist.textContent = `Creator: ${artist || 'Unknown'}`;
    modalTags.textContent = `Tags: ${tags ? tags.join(', ') : 'None'}`;
    modalClicks.textContent = `Views: ${clicks}`;
    modalImage.src = mediaUrl;

    modal.style.display = 'block';
}

// Close modal
function closeModal() {
    const modal = document.getElementById('detailModal');
    modal.style.display = 'none';
}

// Ensure DOM content is loaded before attaching event listeners
document.addEventListener("DOMContentLoaded", function () {
    const closeModalBtn = document.getElementById('closeModal');
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    } else {
        console.error('Modal close button not found!');
    }

    // Fetch Airtable records once the DOM is ready
    fetchRecords();
});