document.addEventListener('DOMContentLoaded', function() {
    const apiKey = 'patcI4PGCeVfINiqC.8107e7c1fc6982557edb794d1628257a275ea1100779df9303d49a944e255453';  // Airtable Personal Access Token
    const baseId = 'app5SXCJbXkjbyzws'; // Airtable Base ID
    const tableName = 'Gallery'; // The table name in Airtable
    const airtableUrl = `https://api.airtable.com/v0/${baseId}/${tableName}`;

    const gallery = document.getElementById('gallery');
    const modal = document.getElementById('mediaModal');
    const modalImage = document.getElementById('modalImage');
    const modalVideo = document.getElementById('modalVideo');
    const modalTitle = document.getElementById('modalTitle');
    const modalArtist = document.getElementById('modalArtist');
    const modalTags = document.getElementById('modalTags');
    const copyButton = document.getElementById('copyButton');
    const downloadButton = document.getElementById('downloadButton');
    const copyImageButton = document.getElementById('copyImageButton'); // New Copy Image Button

    // Close the modal when clicking the "X" button
    const closeModal = document.querySelector('#mediaModal .close');
    closeModal.onclick = () => {
        modal.style.display = 'none';
    };

    // Close the modal when clicking outside of it
    window.onclick = (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };

    // Create an object to track if an item has been clicked during the current session
    let clickTracker = {};

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
            const mediaUrl = record.fields.CloudinaryURL;
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
                // Only increment if this item hasn't been clicked in the current session
                if (!clickTracker[recordId]) {
                    const updatedCount = incrementClickCount(recordId);  // Increment the click count
                    clickCounter.textContent = `Clicks: ${updatedCount}`;  // Update displayed count
                    clickTracker[recordId] = true;  // Mark this item as clicked for the session
                }

                // Populate modal with data
                showDetailedView(record);
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

    // Show detailed view in modal
    function showDetailedView(record) {
        const mediaUrl = record.fields.CloudinaryURL;
        const title = record.fields.Title;
        const artist = record.fields.Artist;
        const tags = record.fields.Tags ? record.fields.Tags.join(', ') : '';

        // Populate modal with metadata
        modalTitle.textContent = title;
        modalArtist.textContent = `Artist: ${artist}`;
        modalTags.textContent = `Tags: ${tags}`;

        // Show image or video in the modal
        if (mediaUrl.endsWith('.mp4')) {
            modalImage.style.display = 'none';
            modalVideo.style.display = 'block';
            modalVideo.src = mediaUrl;
            copyImageButton.style.display = 'none';  // Hide the copy button for videos
        } else {
            modalVideo.style.display = 'none';
            modalImage.style.display = 'block';
            modalImage.src = mediaUrl;
            copyImageButton.style.display = 'inline-block';  // Show the copy button for images/GIFs
            copyImageButton.textContent = mediaUrl.endsWith('.gif') ? 'Copy GIF' : 'Copy Image';  // Set button text
        }

        // Set the URL for copy/download functionality
        copyButton.onclick = () => copyToClipboard(mediaUrl);
        downloadButton.onclick = () => downloadMedia(mediaUrl, title);

        // Handle copying the image/GIF directly
        copyImageButton.onclick = () => copyMedia(mediaUrl);

        // Show the modal
        modal.style.display = 'block';
    }

    // Copy URL to clipboard
    function copyToClipboard(url) {
        navigator.clipboard.writeText(url).then(() => {
            alert('URL copied to clipboard');
        });
    }

    // Copy media (image/GIF) to clipboard
    async function copyMedia(url) {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const item = new ClipboardItem({ [blob.type]: blob });
            await navigator.clipboard.write([item]);
            alert('Image/GIF copied to clipboard');
        } catch (error) {
            console.error('Error copying media to clipboard:', error);
            alert('Failed to copy image/GIF');
        }
    }

    // Download media file
    function downloadMedia(url, title) {
        const a = document.createElement('a');
        a.href = url;
        a.download = title;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    // Initialize the gallery by fetching media from Airtable
    fetchMedia();
});