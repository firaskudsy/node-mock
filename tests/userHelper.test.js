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
});