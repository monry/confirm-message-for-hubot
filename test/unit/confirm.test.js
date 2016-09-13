/* global before, beforeEach, after, afterEach, it, describe */
'use strict';
import assert from 'assert';
import Confirm from '../../dist/confirm.js';

// Tests may also be written in ES6
describe('Test Suite', () => {
	var confirm;

	beforeEach(() => {
		confirm = new Confirm();
	});

	it('should load app', function(){
		var actual = confirm.name;
		var expected = 'confirm-message-for-Hubot';

		assert(confirm);
		assert.equal(actual, expected);
	});
});
