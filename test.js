const should = require('should')
const redis = require('redis')
const request = require('supertest')
const { promisify } = require('util')

const app = require('./homework3')

const client = redis.createClient()


describe('API测试', () => {

    describe('GET /start', () => {
        it('OK', (done) => {
            request(app)
                .get('/start')
                .expect(200)
                .end((err, res) => {
                    should.not.exist(err)
                    res.text.should.equal('OK')
                    done();
                });
        });
    });

    describe('GET /:number', () => {
        before(async() => {
            await client.set('R', 50)
        });
        it('当number<R时，smaller', async() => {
            const res = await request(app).get('/25').expect(200)
            res.text.should.equal('smaller')
        });

        it('当number>R时，bigger', async() => {
            const res = await request(app).get('/75').expect(200)
            res.text.should.equal('bigger')
        });

        it('当number=R时，equal', async() => {
            const res = await request(app).get('/50').expect(200)
            res.text.should.equal('equal')
        });
    });

    after(async() => {
        await client.quit()
    });
});