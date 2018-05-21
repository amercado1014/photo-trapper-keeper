$('.add-button').on('click', displayPhoto);

function displayPhoto(event) {
  event.preventDefault();
  const photoTitle = $('.title').val();
  const photoLink = $('.photo-link').val();

  $('.album').prepend(`
    <article class='photo-container'>
      <img class='photo' src=${photoLink} alt=${photoTitle}>
      <h2>${photoTitle}</h2>
    </article>
  `);
}

