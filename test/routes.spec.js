const chai = require('chai');
const server = require('../server')
const chaiHttp = require('chai-http');
const environment = 'test';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

chai.use(chaiHttp);
chai.should();

describe('Client Routes', () => {
  it('should return the home page', done => {
    chai.request(server)
      .get('/')
      .end((error, response) => {
        response.should.have.status(200);
        response.should.be.html;
        done();
      });
  });

  it('should return a 404 for a route that does not exist', done => {
    chai.request(server)
      .get('/sad')
      .end((error, response) => {
        response.should.have.status(404);
        done();
      });
  });
});

describe('API Routes', () => {
  beforeEach( done => {
    database.migrate.rollback().then(() => {
      database.migrate.latest().then(() => {
        return database.seed.run().then(() => {
          done();
        });
      });
    });
  });

  it('GET photos should return all the photos', done => {
    chai.request(server)
      .get('/api/v1/photos')
      .end((error, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.an('array');
        response.body.length.should.equal(3);
        response.body[0].should.have.property('id');
        response.body[0].id.should.equal(1);
        response.body[0].should.have.property('title');
        response.body[0].title.should.equal('Dog');
        response.body[0].should.have.property('photo_link');
        response.body[0].photo_link.should.equal('https://i.imgur.com/MA2D0.jpg');
        done();
      });
  });
});