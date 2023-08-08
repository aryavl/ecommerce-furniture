const inputElement = document.getElementById('profilePictureInput');
const previewElement = document.getElementById('profilePicturePreview');
let croppedImage ;
let cropper;

    inputElement.addEventListener('change', (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
        const imgSrc = reader.result;
        previewElement.src = imgSrc;

        // Initialize Cropper.js
        cropper = new Cropper(previewElement, {
        aspectRatio: 1, // Set the desired aspect ratio for cropping
        // Additional options can be set here
        });
    };

reader.readAsDataURL(file);
});

        const cropButton = document.getElementById('cropButton');
        const form = document.getElementById('form');
const croppedImageInput = document.getElementById('profilePictureInput');
cropButton.addEventListener('click', () => {
// Get the cropped canvas data
const croppedCanvas = cropper.getCroppedCanvas();

// Retrieve the cropped image as a data URL
 croppedImage = croppedCanvas.toDataURL('image/jpeg');

// You can now use the croppedImage data as needed (e.g., upload to a server, display on the page, etc.)
 // Set the value of the hidden input field
//   croppedImageInput.value = croppedImage;

// Submit the form


});
function uploadImage(){
    document.getElementById("up").style.display = "none";
    document.getElementById("form").style.display = "block";
}

function cancelImage(){
 location.reload();
}

function uploadImage1(){
    document.getElementById("up").style.display = "none";
    document.getElementById("form").style.display = "block";
}
function upload(){
const fileInput = document.getElementById('form');
const file = fileInput.file;

// Create a new FormData object
const formData = new FormData();

// Append the file to the FormData object with the desired field name
formData.append('croppedimage', file);
form.submit();
}