const apiKey = '238495427757831';
const airtableApiKey = 'patjTtCruaN066dZS.062a9d549877450667ef3dbafb5463225f2e17e72b3f71236220a800f9a483c8';
const airtableBaseId = 'app5SXCJbXkjbyzws';
const tableName = 'Gallery';

// Cloudinary helper function
const createCloudinaryUrl = (url, width = 300) => {
    const baseUrl = 'https://res.cloudinary.com/dkqnfmroc/image/fetch/';
    return `${baseUrl}w_${width},q_auto,f_auto/${encodeURIComponent(url)}`;
};

// Function to fetch records from Airtable
async function fetchRecords() {
    try {
        const url = `https://api.airtable.com/v0/${airtableBaseId}/${tableName}?view=Grid%20view`;
        const response = await fetch(url, {
            headers: { Authorization: `Bearer ${airtableApiKey}` },
        });
        const data = await response.json();

        if (!data.records) {
            console.error('Error fetching data: No records found');
            return;
        }

        displayMedia(data.records);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Function to display media
function displayMedia(records) {
    const gallery = document.getElementById('gallery');
    gallery.innerHTML = '';  // Clear the gallery content

    records.forEach(record => {
        const mediaCard = document.createElement('div');
        mediaCard.classList.add('media-card');

        const imgUrl = record.fields.CloudinaryURL;
        const imgElement = document.createElement('img');
        imgElement.src = createCloudinaryUrl(imgUrl, 300);  // Load optimized Cloudinary URL
        imgElement.alt = record.fields.Title || 'Gallery Image';
        imgElement.classList.add('gallery-image');
        imgElement.loading = 'lazy';  // Enable lazy loading

        mediaCard.appendChild(imgElement);
        gallery.appendChild(mediaCard);
    });

    // Reapply Masonry layout
    const masonryInstance = new Masonry(gallery, {
        itemSelector: '.media-card',
        columnWidth: 200,
        gutter: 10,
    });
}

// Trigger fetching of records on page load
window.addEventListener('load', fetchRecords);