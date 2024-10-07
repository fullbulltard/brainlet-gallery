const apiKey = 'patcI4PGCeVfINiqC.8107e7c1fc6982557edb794d1628257a275ea1100779df9303d49a944e255453';  // Airtable Personal Access Token
const baseId = 'app5SXCJbXkjbyzws'; // Airtable Base ID
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
        console.log('Fetched data from Airtable:', data);  // Logs the full Airtable response
        displayMedia(data.records);  // Display media items in the gallery
    })
    .catch(error => console.error('Error fetching data:', error));
}

// Get click count from localStorage
function getClickCount(id) {
    const count = localStorage.getItem(id);
    return count ? parseInt(count) : 0;  // Return 0 if no count exists
}

// Increment click count and store in localStorage
function incrementClickCount(id) {
    let count = getClickCount(id);
    count++;
    localStorage.setItem(id, count);
    return count;
}

// Display media in the gallery
function displayMedia(mediaRecords) {
    gallery.innerHTML = '';  // Clear previous gallery content

    mediaRecords.forEach(record => {
        const title = record.fields.Title;
        const artist = record.fields.Artist;
        const tags = record.fields.Tags ? record.fields.Tags.join(', ') : '';
        const mediaUrl = record.fields.CloudinaryURL;  // Check if this matches your Airtable field name exactly
        const recordId = record.id;  // Unique record ID to use as click counter key

        console.log('Processing record:', title, mediaUrl);  // Logs every record processed

        const mediaCard = document.createElement('div');
        mediaCard.classList.add('image-card');

        // Create media elements
        if (mediaUrl) {
            if (mediaUrl.endsWith('.mp4')) {
                const videoElement = document.createElement('video');
                videoElement.src = mediaUrl;
                videoElement.controls = true;
                mediaCard.appendChild(videoElement);
            } else {
                const imgElement = document.createElement('img');
                imgElement.src = mediaUrl;
                mediaCard.appendChild(imgElement);
            }
        } else {
            console.warn('Missing media URL for record:', title);
        }

        const titleElement = document.createElement('h3');
        titleElement.textContent = title;

        const artistElement = document.createElement('p');
        artistElement.textContent = `Artist: ${artist}`;

        const tagsElement = document.createElement('p');
        tagsElement.textContent = `Tags: ${tags}`;

        // Click counter display
        const clickCounter = document.createElement('p');
        clickCounter.classList.add('click-counter');
        clickCounter.textContent = `Clicks: ${getClickCount(recordId)}`;

        // Add click event listener to media card
        mediaCard.addEventListener('click', () => {
            const updatedCount = incrementClickCount(recordId);  // Increment the click count
            clickCounter.textContent = `Clicks: ${updatedCount}`;  // Update displayed count
        });

        // Append elements to media card
        mediaCard.appendChild(titleElement);
        mediaCard.appendChild(artistElement);
        mediaCard.appendChild(tagsElement);
        mediaCard.appendChild(clickCounter);

        // Append media card to gallery
        gallery.appendChild(mediaCard);
    });
}

// Initialize the gallery by fetching media from Airtable
fetchMedia();