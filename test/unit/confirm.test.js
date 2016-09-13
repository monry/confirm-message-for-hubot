/* global before, beforeEach, after, afterEach, it, describe */
'use strict';
import assert from 'assert';
import sinon from 'sinon';
import Confirm from '../../dist/confirm.js';

// Tests may also be written in ES6
describe('Test Suite', () => {
  var confirm;
  var robot;

  beforeEach(() => {
    robot = {
      respond: sinon.spy(),
      hear: sinon.spy(),
    };
    confirm = new Confirm(robot);
  });

  it('should load app', function(){
    var actual = confirm.name;
    var expected = 'confirm-message-for-Hubot';

    assert(confirm);
    assert.equal(actual, expected);
  });
});
