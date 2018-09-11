const request = require('supertest');
let server;

describe('/object/mykey', () => {
    beforeEach(() => { server = require('../..'); });
    afterEach(() => { server.close(); });
 
    describe('POST /', () => {
        it('it should save data to db', async () => {
            const res = await request(server)
                .post('/object')
                .send({mykey: "new data"})
                .then((res => {
                    expect(res.status).toBe(200);
                }))
        });
    });

    describe('GET /', () => {
        it('should return the correct value', async () => {
            const res = await request(server).get('/object/mykey');
            expect(res.status).toBe(200);
        })
    });
});