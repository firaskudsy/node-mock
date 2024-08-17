const _ = require('lodash');

const getCacheKey = (...args) => args.length ? args.join('|') : undefined;

function memoizePromise(getPromise) {
  const memoized = _.memoize(
    function (...args) {
      return Promise.resolve(getPromise.apply(this, args)).catch(e => {
        deleteMemoizedEntry(memoized, ...args);
        throw e;
      });
    },
    getCacheKey
  );

  return memoized;
}

function deleteMemoizedEntry(memoized, ...args) {
  memoized.cache.delete(getCacheKey(...args));
}

function addMemoizedReset(memoized, reset) {
  if (!memoized.reset) {
    memoized.reset = () => {
      memoized.reset?._list?.forEach(reset => reset && reset());
      memoized.cache && memoized.cache.clear();
    };
    memoized.reset._list = [reset];
  } else {
    memoized.reset._list.push(reset);
  }
}

function resetMemoized(memoized) {
  if (memoized.reset) {
    memoized.reset();
  } else if (memoized.cache) {
    memoized.cache.clear();
  } else {
    throw 'Not cached.';
  }
}

module.exports = {
  memoizePromise,
  deleteMemoizedEntry,
  addMemoizedReset,
  resetMemoized
};
