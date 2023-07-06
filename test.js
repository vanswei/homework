const should = require('should')
const request = require('supertest');

const app = require('./homework3')

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
        it('当number<R时，smaller', (done) => {
            const R = 50 // 假设R的值为50

            request(app)
                .get('/25')
                .expect(200)
                .end((err, res) => {
                    should.not.exist(err)
                    res.text.should.equal('smaller')
                    done();
                });
        });

        it('当number>R时，bigger', (done) => {
            const R = 50 // 假设R的值为50

            request(app)
                .get('/75')
                .expect(200)
                .end((err, res) => {
                    should.not.exist(err);
                    res.text.should.equal('bigger')
                    done();
                });
        });

        it('当number=R时，equal', (done) => {
            const R = 50 // 假设R的值为50

            request(app)
                .get('/50')
                .expect(200)
                .end((err, res) => {
                    should.not.exist(err)
                    res.text.should.equal('equal')
                    done();
                });
        });
    });
});