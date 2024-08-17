// const chai = require('chai');
const sinon = require('sinon');
const expect = require('chai').expect;
const userHelper = require('../lib/userHelper');
const user = require('../routes/api/user');

describe('User API', () => {
  describe('GET /v4/users', () => {
    let req, res, next;

    beforeEach(() => {
      req = {
        logTokens: 'some-log-token'
      };
      res = {
        json: sinon.spy()
      };
      next = sinon.spy();
    });

    afterEach(() => {
      sinon.restore();
    });

    it('should return users data', (done) => {
      const mockUsers = [{ id: 1, name: 'John Doe' }, { id: 2, name: 'Jane Doe' }];
      const getUsersStub = sinon.stub(userHelper, 'getUsers').callsFake((logTokens, callback) => {
        callback(mockUsers);
      });

      user.getUsers(req, res, next);

      expect(getUsersStub.calledOnceWith(req.logTokens)).to.be.true;
      expect(res.json.calledOnceWith(mockUsers)).to.be.true;
      expect(next.notCalled).to.be.true;
      done();
    });

    it('should handle errors', (done) => {
      const error = new Error('Database error');
      const getUsersStub = sinon.stub(userHelper, 'getUsers').callsFake((logTokens, callback) => {
        callback(error);
      });

      user.getUsers(req, res, next);

      expect(getUsersStub.calledOnceWith(req.logTokens)).to.be.true;
      expect(res.json.calledOnceWith(error)).to.be.true;
      expect(next.notCalled).to.be.true;
      done();
    });
  });
});