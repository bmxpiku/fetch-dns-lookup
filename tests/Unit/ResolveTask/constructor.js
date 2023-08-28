'use strict';

const Tangerine = require('tangerine');
const { assert } = require('chai');

const ResolveTask = require('../../../src/ResolveTask');
const addresses = require('../../addresses');

describe('Unit: ResolveTask::constructor', () => {
    const hostname = addresses.INET_HOST1;
    const ipVersions = [4, 6];
    const resolver = new Tangerine();

    ipVersions.forEach(ipVersion => {
        it(`must correct create resolve task for ipVersion === ${ipVersion}`, () => {
            const task = new ResolveTask(hostname, ipVersion);

            assert.strictEqual(task._hostname, hostname);
            assert.strictEqual(task._ipVersion, ipVersion);

            ipVersion === 4 && assert.strictEqual(task._resolver.name, resolver.resolve4.name);
            ipVersion !== 4 && assert.strictEqual(task._resolver.name, resolver.resolve6.name);
        });
    });
});
