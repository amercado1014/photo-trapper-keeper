const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.set('port', process.env.PORT || 3000);
app.locals.title = 'Photo Trapper Keeper';

app.get('/api/v1/photos', (request, response) => {
  database('photos').select()
    .then(photos => response.status(200).json(photos))
    .catch(error => response.status(500).json(error));
});

app.post('/api/v1/photos', (request, response) => {
  const photo = request.body;

  for (let requiredParameter of ['title', 'photo_link']) {
    if (!photo[requiredParameter]) {
      return response
        .status(422)
        .send({ error: `You're missing a ${requiredParameter} property.`});
    }
  }

    database('photos').insert(photo, 'id')
    .then(photo => response.status(201).json({ id: photo[0]}))
    .catch(error => response.status(500).json({ error }));
});

app.delete('/api/v1/photos/:id', (request, response) => {
  const id = request.params.id;

  database('photos').where('id', id).del()
    .then((id) => {
      if (id) {
        response.status(200).json({ message: `Deleted photo with id ${id}.`})
      } else {
        response.status(404).json({ message: `Id does not exist.`})
      }
    })
    .catch(error => response.status(500).json({ error }));
});

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});

module.exports = app;