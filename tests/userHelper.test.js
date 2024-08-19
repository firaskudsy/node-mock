const { expect } = require('chai');
const sinon = require('sinon');
const userHelper = require('../lib/userHelper');
const userDB = require('../lib/db/user.db');

describe('userHelper', () => {
  describe('getUsers', () => {
    it('should call callback with data from userDB.getUsers', (done) => {
      const logTokens = 'someLogTokens';
      const data = [{ id: 1, name: 'John Doe' }];

      sinon.stub(userDB, 'getUsers').resolves(data);

      const callback = sinon.spy((result) => {
        try {
          expect(result).to.equal(data);
          expect(callback.calledOnce).to.be.true;
          expect(callback.calledWith(data)).to.be.true;
          done();
        } catch (error) {
          done(error);
        } finally {
          userDB.getUsers.restore();
        }
      });

      userHelper.getUsers(logTokens, callback);
    });
  });
  describe('getUser', () => {
    it('should call callback with data from userDB.getUser', (done) => {
      const logTokens = 'someLogTokens';
      const request = { id: 1 };
      const data = { id: 1, name: 'John Doe' };

      sinon.stub(userDB, 'getUser').resolves(data);

      const callback = sinon.spy((result) => {
        try {
          expect(result).to.equal(data);
          expect(callback.calledOnce).to.be.true;
          expect(callback.calledWith(data)).to.be.true;
          done();
        } catch (error) {
          done(error);
        } finally {
          userDB.getUser.restore();
        }
      });

      userHelper.getUser(logTokens, request, callback);
    });

    it('should call callback with error if userDB.getUser fails', (done) => {
      const logTokens = 'someLogTokens';
      const request = { id: 1 };
      const error = new Error('Database error');

      sinon.stub(userDB, 'getUser').rejects(error);

      const callback = sinon.spy((result) => {
        try {
          expect(result).to.equal(error);
          expect(callback.calledOnce).to.be.true;
          expect(callback.calledWith(error)).to.be.true;
          done();
        } catch (err) {
          done(err);
        } finally {
          userDB.getUser.restore();
        }
      });

      userHelper.getUser(logTokens, request, callback);
    });
  });

});