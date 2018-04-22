const source = require('../def.json')
const depends = require('../depend.json')

const superagent = require('superagent');
require('superagent-retry-delay')(superagent);

const supertest = require('supertest')
const request = supertest('http://localhost:4000');

const flowDefinition = {
  "template": source.name,
  "name": "Source Template Test",
  "description": "An instance of the Source Template for testing.",
  "index": "source-template-test",
  "parameters": []
}

// A simple example test
describe('Validating Source Installation', () => {
  it('Source must exist.', () => {
    return request.get('/flowTemplate/' + source.name)
      .set('Accept', 'application/json')
      .expect(200)
      .then((res) => {
        expect(res.body.name).toEqual(source.name)
      })
  })

  for (var i in depends) {
    it('Required module ' + depends[i] + ' must be installed.', () => {
      return supertest('http://localhost:1880').get('/nodes/' + depends[i])
        .set('Accept', 'application/json')
        .expect(200)
        .then((res) => {
          expect(res.body.name).toEqual(depends[i])
        })
    })
  }
})

// A simple example test
describe('Testing channel operations.', () => {

  afterAll(() => {
    return request.delete('/flow/' + flowDefinition.name)
  })

  it('should create a channel', () => {
    return request.post('/flow')
      .send(flowDefinition)
      .expect(200)
      .then((res) => {
        expect(res.body).toHaveProperty('id');
        expect(res.body.name).toEqual(flowDefinition.name);
        expect(res.body.description).toEqual(flowDefinition.description);
        expect(res.body.index).toEqual(flowDefinition.index);
        expect(res.body).toHaveProperty('nodeRedId');
      })
  })

  it('shouldn\'t allow duplicate channels with the same name', () => {

    return request.post('/flow')
      .send(flowDefinition)
      .expect(400)
      .then((res) => {
        expect(res.body.error).toEqual('Bad Request')
        expect(res.body.message).toEqual('A flow with the same name already exists')
      })
  })

  it('should create an ES index pattern', () => {

    return supertest('http://localhost:5601').get('/api/saved_objects/index-pattern/' + flowDefinition.index)
      .expect(200)
      .retry(5, 1000)
      .then((res) => {
        expect(res.body).toHaveProperty('id');
        expect(res.body.type).toEqual('index-pattern');
        expect(res.body.attributes.title).toEqual(flowDefinition.index);
      })
  })
})
