const sinon = require('sinon');
const { expect } = require('chai');
const dbHelper = require('../lib/dbHelper');
const { getUsers } = require('../lib/db/user.db.js');

describe('user.db.js', () => {
  describe('getUsers', () => {
    it('should return users', async () => {
      const mockResult = { recordset: [{ id: 1, name: 'John Doe' }] };
      sinon.stub(dbHelper, 'preparedStatement').resolves(mockResult);

      const result = await getUsers('logToken');
      expect(result).to.deep.equal(mockResult.recordset);

      dbHelper.preparedStatement.restore();
    });

    it('should throw an error if the query fails', async () => {
      sinon.stub(dbHelper, 'preparedStatement').rejects(new Error('Query failed'));

      try {
        await getUsers('logToken');
      } catch (err) {
        expect(err.message).to.equal('Query failed');
      }

      dbHelper.preparedStatement.restore();
    });
  });
});