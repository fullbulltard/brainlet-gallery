document.addEventListener("DOMContentLoaded", function () {
    const modal = document.getElementById("modal");
    const modalBackground = document.getElementById("modal-background");
    const modalClose = document.getElementById("modal-close");

    // Close the modal when the 'X' is clicked
    modalClose.addEventListener("click", function () {
        modal.style.display = "none";
        modalBackground.style.display = "none";
    });

    // Function to open the modal with content
    function showDetailView(item) {
        const modalTitle = document.getElementById("modal-title");
        const modalArtist = document.getElementById("modal-artist");
        const modalTags = document.getElementById("modal-tags");
        const modalClicks = document.getElementById("modal-clicks");
        const modalImage = document.getElementById("modal-image");

        modalTitle.innerText = item.title;
        modalArtist.innerText = `Artist: ${item.artist || 'Unknown'}`;
        modalTags.innerText = `Tags: ${item.tags || 'None'}`;
        modalClicks.innerText = `Clicks: ${item.clicks || 0}`;
        modalImage.src = item.imageUrl;

        modal.style.display = "block";
        modalBackground.style.display = "block";
    }

    // Add event listeners to gallery items (assuming they are dynamically loaded)
    const gallery = document.getElementById("gallery");

    gallery.addEventListener("click", function (event) {
        const clickedElement = event.target.closest(".gallery-item");
        if (clickedElement) {
            const itemData = {
                title: clickedElement.dataset.title,
                artist: clickedElement.dataset.artist,
                tags: clickedElement.dataset.tags,
                clicks: clickedElement.dataset.clicks,
                imageUrl: clickedElement.dataset.imageUrl
            };
            showDetailView(itemData);
        }
    });

    // Mock function to simulate loading gallery items
    function loadGalleryItems() {
        const mockItems = [
            { title: "Test 1", artist: "Artist 1", tags: "Tag 1", clicks: 5, imageUrl: "image1.jpg" },
            { title: "Test 2", artist: "Artist 2", tags: "Tag 2", clicks: 10, imageUrl: "image2.jpg" }
        ];

        mockItems.forEach(item => {
            const galleryItem = document.createElement("div");
            galleryItem.className = "gallery-item";
            galleryItem.dataset.title = item.title;
            galleryItem.dataset.artist = item.artist;
            galleryItem.dataset.tags = item.tags;
            galleryItem.dataset.clicks = item.clicks;
            galleryItem.dataset.imageUrl = item.imageUrl;
            galleryItem.innerHTML = `<img src="${item.imageUrl}" alt="${item.title}" />`;
            gallery.appendChild(galleryItem);
        });
    }

    loadGalleryItems();
});