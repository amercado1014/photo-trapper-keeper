window.onload = () => {
  getPhotos();
};

$('.add-button').on('click', displayPhoto);
$('.album').on('click', '.delete', deletePhoto);

async function displayPhoto(event) {
  event.preventDefault();
  const title = $('.title').val();
  const photo_link = $('.photo-link').val();

  const photoData = {
    title,
    photo_link
  }

  const postedPhoto = await postPhoto(photoData);

  $('.album').prepend(`
    <article data-id=${postedPhoto.id} class='photo-container'>
      <img class='photo' src=${photo_link} alt=${title}>
      <h2>${title}</h2>
      <img class='delete' src='../images/trash.svg' alt='trash can'>
    </article>
  `);
}

async function getPhotos() {
  const url = '/api/v1/photos';

  try {
    const response = await fetch(url);
    const photos = await response.json();
    prependPhotosFromDb(photos);
  } catch (error) {
    return { error: error.message };
  }
}

function prependPhotosFromDb(photos) {
  photos.forEach(photo => {
    const { id, title, photo_link } = photo;

    $(".album").prepend(`
    <article data-id=${id} class='photo-container'>
      <img class='photo' src=${photo_link} alt=${title}>
      <h2>${title}</h2>
      <img class='delete' src='../images/trash.svg' alt='trash can'>
    </article>
  `);
  });
}

async function postPhoto(photoData) {
  const url = '/api/v1/photos';

  try {
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(photoData),
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
    const photoId = await response.json();
    return photoId;
  } catch (error) {
    return { error: error.message };
  }
}

function deletePhoto(event) {
  event.target.closest('article').remove();
  const id = { id: $(this).parent().data('id') };
  deletePhotoFromDb(id);
}

async function deletePhotoFromDb(photoId) {
  const url = '/api/v1/photos';

  try {
    const response = await fetch(url, {
      method: 'DELETE',
      body: JSON.stringify(photoId),
      headers: { 'Content-Type': 'application/json' }
    });
    const status = await response.json();
  } catch (error) {
    return { error: error.message };
  }
}

