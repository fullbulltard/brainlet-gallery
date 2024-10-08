document.addEventListener('DOMContentLoaded', function () {
  const apiKey = 'your_airtable_personal_access_token'; // Add your Airtable API token here
  const baseId = 'app5SXCJbXkjbyzws'; // Your Airtable base ID
  const tableName = 'Gallery'; // Your Airtable table name

  const airtableUrl = `https://api.airtable.com/v0/${baseId}/${tableName}`;
  const gallerySection = document.getElementById('gallery');

  // Function to fetch records from Airtable
  async function fetchRecords() {
    try {
      const response = await fetch(airtableUrl, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Fetched data from Airtable:', data);
      displayMedia(data.records);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  // Function to display media records in the gallery
  function displayMedia(records) {
    records.forEach(record => {
      const mediaUrl = record.fields['CloudinaryURL'];
      const title = record.fields['Title'];
      const artist = record.fields['Artist'] || 'unknown';
      const tags = record.fields['Tags'] || 'unknown';
      let clickCount = record.fields['Clicks'] || 0;

      // Check if the mediaUrl exists before using it
      if (mediaUrl && typeof mediaUrl === 'string') {
        let mediaType = 'unknown';

        if (mediaUrl.endsWith('.jpg') || mediaUrl.endsWith('.jpeg') || mediaUrl.endsWith('.png')) {
          mediaType = 'image';
        } else if (mediaUrl.endsWith('.gif')) {
          mediaType = 'gif';
        } else if (mediaUrl.endsWith('.mp4') || mediaUrl.endsWith('.webm')) {
          mediaType = 'video';
        }

        // Create a media card for the gallery
        const mediaCard = document.createElement('div');
        mediaCard.classList.add('media-card');
        mediaCard.innerHTML = `
          <div class="media-content">
            ${mediaType === 'image' ? `<img src="${mediaUrl}" alt="${title}">` : ''}
            ${mediaType === 'gif' ? `<img src="${mediaUrl}" alt="${title}">` : ''}
            ${mediaType === 'video' ? `<video controls><source src="${mediaUrl}" type="video/mp4"></video>` : ''}
          </div>
          <div class="media-info">
            <h3>${title}</h3>
            <p>Artist: ${artist}</p>
            <p>Tags: ${tags}</p>
            <p>Clicks: ${clickCount}</p>
          </div>
        `;

        // Increment click count on click
        mediaCard.addEventListener('click', async () => {
          clickCount++;
          mediaCard.querySelector('.media-info p:nth-child(4)').textContent = `Clicks: ${clickCount}`;
          await updateClickCount(record.id, clickCount);
          showDetailView(title, artist, tags, mediaUrl, mediaType);
        });

        gallerySection.appendChild(mediaCard);
      } else {
        console.warn(`Missing media URL for record: ${title}`);
      }
    });
  }

  // Function to update the click count in Airtable
  async function updateClickCount(recordId, clickCount) {
    try {
      const response = await fetch(`${airtableUrl}/${recordId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fields: {
            Clicks: clickCount
          }
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error updating click count:', error);
    }
  }

  // Function to show the detailed view of the media
  function showDetailView(title, artist, tags, mediaUrl, mediaType) {
    const modal = document.getElementById('detail-modal');
    const modalContent = modal.querySelector('.modal-content');

    modalContent.innerHTML = `
      <h3>${title}</h3>
      <p>Artist: ${artist}</p>
      <p>Tags: ${tags}</p>
      ${mediaType === 'image' || mediaType === 'gif' ? `<img src="${mediaUrl}" alt="${title}">` : ''}
      ${mediaType === 'video' ? `<video controls><source src="${mediaUrl}" type="video/mp4"></video>` : ''}
      <button id="copy-url-button">Copy ${mediaType === 'video' ? 'Video' : 'Image/GIF'} Link</button>
      <button id="download-button">Download</button>
    `;

    modal.style.display = 'block';

    const copyUrlButton = document.getElementById('copy-url-button');
    const downloadButton = document.getElementById('download-button');

    copyUrlButton.onclick = () => copyToClipboard(mediaUrl);
    downloadButton.onclick = () => downloadMedia(mediaUrl);

    modal.onclick = function (event) {
      if (event.target === modal) {
        modal.style.display = 'none';
      }
    };
  }

  // Function to copy the media URL to clipboard
  function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
      alert('Link copied to clipboard!');
    }).catch(err => {
      console.error('Error copying to clipboard:', err);
      alert('Failed to copy link.');
    });
  }

  // Function to download the media
  function downloadMedia(url) {
    const link = document.createElement('a');
    link.href = url;
    link.download = 'download';
    link.click();
  }

  // Fetch records on page load
  fetchRecords();
});