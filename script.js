const apiKey = 'patcI4PGCeVfINiqC.8107e7c1fc6982557edb794d1628257a275ea1100779df9303d49a944e255453';  // Replace with your new Airtable Personal Access Token
const baseId = 'app5SXCJbXkjbyzws'; // Your Airtable Base ID
const tableName = 'Gallery'; // The table name in Airtable
const airtableUrl = `https://api.airtable.com/v0/${baseId}/${tableName}`;

const gallery = document.getElementById('gallery');

// Fetch data from Airtable using Personal Access Token
function fetchMedia() {
    fetch(airtableUrl, {
        headers: {
            Authorization: `Bearer ${apiKey}`,
        },
    })
    .then(response => response.json())
    .then(data => {
        displayMedia(data.records);  // Display media items in the gallery
    })
    .catch(error => console.error('Error fetching data:', error));
}

// Display media in the gallery
function displayMedia(mediaRecords) {
    gallery.innerHTML = '';  // Clear previous gallery content

    mediaRecords.forEach(record => {
        const title = record.fields.Title;
        const artist = record.fields.Artist;
        const tags = record.fields.Tags ? record.fields.Tags.join(', ') : '';
        const mediaUrl = record.fields.CloudinaryURL;  // Cloudinary URL from Airtable

        const mediaCard = document.createElement('div');
        mediaCard.classList.add('image-card');

        const imgElement = document.createElement('img');
        imgElement.src = mediaUrl;

        const titleElement = document.createElement('h3');
        titleElement.textContent = title;

        const artistElement = document.createElement('p');
        artistElement.textContent = `Artist: ${artist}`;

        const tagsElement = document.createElement('p');
        tagsElement.textContent = `Tags: ${tags}`;

        mediaCard.appendChild(imgElement);
        mediaCard.appendChild(titleElement);
        mediaCard.appendChild(artistElement);
        mediaCard.appendChild(tagsElement);
        gallery.appendChild(mediaCard);
    });
}

// Initialize the gallery by fetching media from Airtable
fetchMedia();