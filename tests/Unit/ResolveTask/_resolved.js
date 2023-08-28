'use strict';

const { assert } = require('chai');
const sinon = require('sinon');

const ResolveTask = require('../../../src/ResolveTask');

const addresses = require('../../addresses');

describe('Unit: ResolveTask::_resolved', () => {
    const error = new Error('error');

    const hostname = addresses.INET_HOST1;
    const ipVersion = 4;

    let onAddressesSpy;
    let onDoneSpy;

    beforeEach(() => {
        onAddressesSpy = sinon.spy();
        onDoneSpy = sinon.spy();
    });

    it(`must correct call callbacks with appropriate error object, IPv${ipVersion} version`, async () => {
        const expectedError = error;
        const expectedAddresses = undefined;

        const task = new ResolveTask(hostname, ipVersion);

        task.on('addresses', onAddressesSpy);
        task.on('done', onDoneSpy);

        const resolvedCallback = sinon.spy();

        task._callbacks.push(resolvedCallback);
        const resolverStub = sinon.stub(
            task,
            '_resolver'
        );
        resolverStub.onCall(0).returns(
            new Promise((resolve, reject) => {
                reject(error);
            })
        );

        await task.run();
        assert.isTrue(onDoneSpy.calledOnce);
        assert.isTrue(onDoneSpy.calledWithExactly());

        assert.isEmpty(task._callbacks);

        setImmediate(() => {
            assert.isTrue(resolvedCallback.calledOnce);
            assert.isTrue(
                resolvedCallback.calledWithExactly(
                    expectedError,
                    expectedAddresses
                )
            );

            assert.isTrue(onAddressesSpy.notCalled);
        });
    });

    it(`must correct emit all events and run callbacks for IPv${ipVersion}`, async () => {
        const task = new ResolveTask(hostname, ipVersion);

        task.on('addresses', onAddressesSpy);
        task.on('done', onDoneSpy);

        const addresses = [{}];
        const resolvedCallback = sinon.spy();

        task._callbacks.push(resolvedCallback);

        const resolverStub = sinon.stub(
            task,
            '_resolver'
        );
        resolverStub.onCall(0).returns(
            new Promise((resolve, reject) => {
                resolve(addresses);
            })
        );

        await task.run();

        assert.isTrue(onAddressesSpy.calledOnce);
        assert.isTrue(onAddressesSpy.calledWithExactly(addresses));

        assert.isTrue(onDoneSpy.calledOnce);
        assert.isTrue(onDoneSpy.calledWithExactly());

        assert.isEmpty(task._callbacks);

        setImmediate(() => {
            assert.isTrue(resolvedCallback.calledOnce);
            assert.isTrue(resolvedCallback.calledWithExactly(null, addresses));
        });
    });
});
