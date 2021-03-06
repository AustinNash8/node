'use strict';
const common = require('../common');
const fs = require('fs');
const callbackThrowValues = [null, true, false, 0, 1, 'foo', /foo/, [], {}];
const warn = 'Calling an asynchronous function without callback is deprecated.';

function testMakeStatsCallback(cb) {
  return function() {
    // fs.stat() calls makeStatsCallback() on its second argument
    fs.stat(__filename, cb);
  };
}

common.expectWarning('DeprecationWarning', warn);

// Verify the case where a callback function is provided
testMakeStatsCallback(common.mustCall())();

// Passing undefined/nothing calls rethrow() internally, which emits a warning
testMakeStatsCallback()();

function invalidCallbackThrowsTests() {
  callbackThrowValues.forEach((value) => {
    common.expectsError(testMakeStatsCallback(value), {
      code: 'ERR_INVALID_CALLBACK',
      type: TypeError
    });
  });
}

invalidCallbackThrowsTests();
