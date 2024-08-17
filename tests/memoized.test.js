const chai = require('chai');
const sinon = require('sinon');
const {
  memoizePromise,
  deleteMemoizedEntry,
  addMemoizedReset,
  resetMemoized
} = require('../lib/memoized');

const { expect } = chai;

describe('memoized.js', () => {
  describe('memoizePromise', () => {
    it('should memoize a promise-returning function', async () => {
      const getPromise = sinon.stub().resolves('result');
      const memoized = memoizePromise(getPromise);

      const result1 = await memoized('arg1');
      const result2 = await memoized('arg1');

      expect(result1).to.equal('result');
      expect(result2).to.equal('result');
      expect(getPromise.calledOnce).to.be.true;
    });

    it('should delete cache entry on promise rejection', async () => {
      const getPromise = sinon.stub().rejects(new Error('error'));
      const memoized = memoizePromise(getPromise);

      try {
        await memoized('arg1');
      } catch (e) {
        expect(e.message).to.equal('error');
      }

      expect(memoized.cache.has('arg1')).to.be.false;
    });
  });

  describe('deleteMemoizedEntry', () => {
    it('should delete a specific cache entry', () => {
      const getPromise = sinon.stub().resolves('result');
      const memoized = memoizePromise(getPromise);

      memoized('arg1');
      deleteMemoizedEntry(memoized, 'arg1');

      expect(memoized.cache.has('arg1')).to.be.false;
    });
  });

  describe('addMemoizedReset', () => {
    it('should add a reset function to the memoized function', () => {
      const getPromise = sinon.stub().resolves('result');
      const memoized = memoizePromise(getPromise);

      const reset = sinon.spy();
      addMemoizedReset(memoized, reset);

      memoized.reset();

      expect(reset.calledOnce).to.be.true;
      expect(memoized.cache.size).to.equal(0);
    });
  });

  describe('resetMemoized', () => {
    it('should reset the memoized function cache', () => {
      const getPromise = sinon.stub().resolves('result');
      const memoized = memoizePromise(getPromise);

      memoized('arg1');
      resetMemoized(memoized);

      expect(memoized.cache.size).to.equal(0);
    });

    it('should throw an error if not cached', () => {
      const getPromise = sinon.stub().resolves('result');
      const memoized = memoizePromise(getPromise);

      delete memoized.cache;

      expect(() => resetMemoized(memoized)).to.throw('Not cached.');
    });
  });
});