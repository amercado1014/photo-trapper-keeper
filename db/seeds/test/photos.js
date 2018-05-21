exports.seed = function(knex, Promise) {
  return knex('photos').del()
    .then(function () {
      return knex('photos').insert([
        { 
          title: 'Dog',
          photo_link: 'https://i.imgur.com/MA2D0.jpg'
        },
        { 
          title: 'Cat Snake',
          photo_link: 'http://thecatapi.com/?id=624'
        },
        { 
          title: 'Mouse',
          photo_link: 'https://bitemywordsdotcom.files.wordpress.com/2014/07/url-11.jpeg'
        }
      ]);
    });
};
