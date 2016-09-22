var assert = require('assert');
var global = require('./../web/script/global.js');

describe('script/Global', function() {

    describe('global.js', function() {
        it('colorInRange() should range color value', function() {
            assert.equal(0, global._colorInRange(-1));
            assert.equal(0, global._colorInRange(0));
            assert.equal(100, global._colorInRange(100));
            assert.equal(255, global._colorInRange(255));
            assert.equal(255, global._colorInRange(300));
        });
        it('sameDay() should check if two days are equal', function() {
            assert.ok(new Date().sameDay(new Date()));
            assert.ok(new Date("1994-11-10").sameDay(new Date("1994-11-10")));
            assert.ok(new Date("1994-11-10 03:00").sameDay(new Date("1994-11-10 08:00")));
            assert.ok(!new Date("1994-11-10 03:00").sameDay(new Date("1994-11-11 03:00")));
        });
    });

});