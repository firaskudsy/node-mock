// Import necessary modules
const sinon = require('sinon');
const { expect } = require('chai');
const { getPreparedStatementInputs } = require('../lib/dbHelper'); // Correct import
const sql = require('mssql');
const { getConnection } = require('../lib/dbHelper');

describe('dbHelper', () => {

  describe('getPreparedStatementInputs', () => {
    it('should prepare statement inputs correctly', () => {
      const preparedStatement = {
        input: sinon.stub() // Mock the input method
      };
      const values = [{ name: 'test', type: 'String', value: 'value' }];
      const replaceValue = { name: 'test', value: 'replace' };
      const logTokens = 'logTokens';

      const result = getPreparedStatementInputs(preparedStatement, values, replaceValue, logTokens);

      expect(result).to.be.an('object');
      expect(preparedStatement.input.calledOnceWith('test', 'String')).to.be.true;
      expect(result).to.have.property('test', 'value');
    });
  });

  describe('getConnection', () => {
    it('should create a connection pool and handle errors', async () => {
      const poolStub = sinon.stub(sql, 'ConnectionPool').returns({
        connect: sinon.stub().resolves(),
        on: sinon.stub()
      });

      await getConnection();

      expect(poolStub.calledOnce).to.be.true;
      expect(poolStub().on.calledWith('error')).to.be.true;

      poolStub.restore();
    });
  });
});
// Your function to be tested
function executeStatement(ps, statement, values, logTokens) {
  let data = getPreparedStatementInputs(ps, values, null, logTokens);

  return ps.prepare(statement).then(() => {
    return ps.execute(data)
      .then((result) => {
        return result;
      })
      .finally(() => {
        ps.unprepare();
      });
  });
}

// Test case
describe('executeStatement', () => {
  let ps;
  const mockResult = { /* mock result */ }; // Define mockResult

  beforeEach(() => {
    ps = {
      prepare: sinon.stub().resolves(),
      execute: sinon.stub().resolves(mockResult),
      unprepare: sinon.stub().resolves(),
      input: sinon.stub() // Add the input method
    };
  });

  it('should prepare, execute, and unprepare the statement', async () => {
    const statement = 'SELECT * FROM table';
    const values = [/* some values */];
    const logTokens = [/* some log tokens */];

    const result = await executeStatement(ps, statement, values, logTokens);

    expect(ps.prepare.calledOnceWith(statement)).to.be.true;
    expect(ps.execute.calledOnce).to.be.true;
    expect(ps.unprepare.calledOnce).to.be.true;
    expect(result).to.deep.equal(mockResult);
  });

  it('should handle errors', async () => {
    const query = 'SELECT * FROM users';
    const values = [{ name: 'id', type: sql.Int, value: 1 }];

    // Correctly mock the ps object with prepare, execute, and unprepare methods
    ps.prepare = sinon.stub().resolves();
    ps.execute = sinon.stub().rejects(new Error('Database error'));
    ps.unprepare = sinon.stub().resolves();

    try {
      await executeStatement(ps, query, values);
    } catch (err) {
      expect(err.message).to.equal('Database error');
    }
  });
});