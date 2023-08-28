'use strict';

const dns = require('dns');

const { assert, expect } = require('chai');
const sinon = require('sinon');

const Lookup = require('../../../src/Lookup');

describe('Unit: Lookup::_resolveTaskBuilder', () => {
    const hostname = Symbol();
    const options = Symbol();

    let lookup;

    beforeEach(() => {
        lookup = new Lookup();
    });

    it('must return new Promise every call', () => {
        const resolveTask1 = lookup._resolveTaskBuilder();
        const resolveTask2 = lookup._resolveTaskBuilder();

        assert.instanceOf(resolveTask1, Promise);
        assert.instanceOf(resolveTask2, Promise);

        assert.notStrictEqual(resolveTask1, resolveTask2);
    });

    it(`must return function that calls '_resolve' under the hood and for ${
        dns.NOTFOUND
    } error returns empty array`, async () => {
        const error = new Error('some error');
        error.code = dns.NOTFOUND;

        const resolveSpy = sinon
            .stub(lookup, '_resolve')
            .callsFake((hostname, options, cb) => {
                assert.strictEqual(resolveSpy.getCall(0).args[0], hostname);
                assert.strictEqual(resolveSpy.getCall(0).args[1], options);

                cb(error);
            });

        const resolveTask = await lookup._resolveTaskBuilder(hostname, options);


        assert.isTrue(resolveSpy.calledOnce);
        assert.strictEqual(resolveSpy.getCall(0).args[0], hostname);
        assert.strictEqual(resolveSpy.getCall(0).args[1], options);
        assert.instanceOf(resolveSpy.getCall(0).args[2], Function);

        assert.isEmpty(resolveTask);
    });

    it("must return function that calls '_resolve' under the hood and in case error calls callback with an error",
        async () => {
            const error = new Error('some error');

            const resolveSpy = sinon
                .stub(lookup, '_resolve')
                .callsFake((hostname, options, cb) => {
                    assert.strictEqual(resolveSpy.getCall(0).args[0], hostname);
                    assert.strictEqual(resolveSpy.getCall(0).args[1], options);

                    cb(error);
                });

            await lookup._resolveTaskBuilder(hostname, options)
                .then(function (m) {
                    throw new Error('was not supposed to succeed');
                })
                .catch(function (m) {
                    expect(m).to.equal(error);
                });

            assert.isTrue(resolveSpy.calledOnce);
            assert.strictEqual(resolveSpy.getCall(0).args[0], hostname);
            assert.strictEqual(resolveSpy.getCall(0).args[1], options);
            assert.instanceOf(resolveSpy.getCall(0).args[2], Function);
        });

    it("must return function that calls '_resolve' under the" +
        'hood and in case no error calls callback with results', async () => {
        const error = null;
        const results = [Symbol(), Symbol()];

        const resolveSpy = sinon
            .stub(lookup, '_resolve')
            .callsFake((hostname, options, cb) => {
                assert.strictEqual(resolveSpy.getCall(0).args[0], hostname);
                assert.strictEqual(resolveSpy.getCall(0).args[1], options);

                cb(error, ...results);
            });

        const resolveTask = await lookup._resolveTaskBuilder(hostname, options);


        assert.isTrue(resolveSpy.calledOnce);
        assert.strictEqual(resolveSpy.getCall(0).args[0], hostname);
        assert.strictEqual(resolveSpy.getCall(0).args[1], options);
        assert.instanceOf(resolveSpy.getCall(0).args[2], Function);

        assert.deepEqual(resolveTask, results[0]);
        // assert.deepEqual(cbSpy.getCall(0).args.slice(1), results);
    });
});
