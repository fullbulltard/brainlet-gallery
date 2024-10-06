const gallery = document.getElementById('gallery');
const mediaUrls = [
    'https://res.cloudinary.com/YOUR_CLOUDINARY_CLOUD_NAME/image/upload/v1615123456/sample.jpg', // Example image
    'https://res.cloudinary.com/YOUR_CLOUDINARY_CLOUD_NAME/video/upload/v1615123456/sample.mp4', // Example video
    'https://res.cloudinary.com/YOUR_CLOUDINARY_CLOUD_NAME/image/upload/v1615123456/sample.gif'  // Example gif
];

// Function to display media in the gallery
function displayMedia(mediaUrls) {
    mediaUrls.forEach(url => {
        const mediaCard = document.createElement('div');
        mediaCard.classList.add('image-card');

        if (url.endsWith('.mp4')) {
            const videoElement = document.createElement('video');
            videoElement.src = url;
            videoElement.controls = true;
            mediaCard.appendChild(videoElement);
        } else {
            const imgElement = document.createElement('img');
            imgElement.src = url;
            mediaCard.appendChild(imgElement);
        }

        gallery.appendChild(mediaCard);
    });
}

// Initialize gallery with media
displayMedia(mediaUrls);