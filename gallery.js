// gallery.js

// Set the path to the folder containing the pin images
const pinFolderPath = 'images/pins/';

// Array of image file names
const imageFiles = [
    'Azathoth.png', 
    'Baby_Dagon.png',
    'Cthulhu-for-President.png', 
    'Cthulhu-Why_Settle.png',
    'Darkness.png',
    'Fhtagn.png',
    'Hastur.png',
    'Mi-go.png',
    'Moonbeast.png',
    'Nameless_Mist.png',
    'Necronomicon.png',
    'Night-gaunt.png',
    'Nyarlathotep.png',
    'Shantak.png',
    'Shoggoth.png',
    'Shub-Niggurath.png',
    'Tsathoggua.png',
    'Yog-Sothoth.png'
];

// Get the gallery container element
const galleryContainer = document.getElementById('gallery-container');

// Function to create a pin element
function createPinElement(imageFile) {
  const pinContainer = document.createElement('div');
  pinContainer.classList.add('pin-container');

  const pinImage = document.createElement('img');
  pinImage.src = pinFolderPath + imageFile;
  pinImage.alt = 'Pin Image';
  pinImage.classList.add('pin-image');

  const pinCaption = document.createElement('p');
  pinCaption.textContent = imageFile.split('.')[0].replace(/_/g, ' ');
  pinCaption.classList.add('pin-caption');

  pinContainer.appendChild(pinImage);
  pinContainer.appendChild(pinCaption);

  pinImage.addEventListener('click', () => openLightbox(pinFolderPath + imageFile, pinCaption.textContent));

  return pinContainer;
}

// Function to open the lightbox with the clicked image
function openLightbox(imageFile, caption) {
  const lightbox = document.createElement('div');
  lightbox.classList.add('lightbox');

  const lightboxContent = document.createElement('div');
  lightboxContent.classList.add('lightbox-content');

  const lightboxImage = document.createElement('img');
  lightboxImage.src = imageFile;
  lightboxImage.alt = 'Lightbox Image';
  lightboxImage.classList.add('lightbox-image');

  const lightboxCaption = document.createElement('p');
  lightboxCaption.textContent = caption;
  lightboxCaption.classList.add('lightbox-caption');

  const closeButton = document.createElement('span');
  closeButton.classList.add('lightbox-close');
  closeButton.textContent = '×';
  closeButton.addEventListener('click', closeLightbox);

  lightboxContent.appendChild(lightboxImage);
  lightboxContent.appendChild(lightboxCaption);
  lightboxContent.appendChild(closeButton);

  lightbox.appendChild(lightboxContent);
  document.body.appendChild(lightbox);

  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });
}

// Function to close the lightbox
function closeLightbox() {
  const lightbox = document.querySelector('.lightbox');
  if (lightbox) {
    lightbox.remove();
  }
}

// Function to initialize the gallery
function initializeGallery() {
  imageFiles.forEach(imageFile => {
    const pinElement = createPinElement(imageFile);
    galleryContainer.appendChild(pinElement);
  });
}

// Call the initialize function when the page loads
window.addEventListener('load', initializeGallery);