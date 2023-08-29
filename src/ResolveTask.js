'use strict';

/**
 * @typedef {Object} Address
 * @property {string} address - IPv4 or IPv6 address
 * @property {number} ttl - IP DNS TTL
 * @property {number} family - IP family
 * @property {number} expiredTime - DNS TTL expiration timestamp
 */

const assert = require('assert');
const Tangerine = require('tangerine');
const { EventEmitter } = require('events');

class ResolveTask extends EventEmitter {
    /**
     * @returns {number}
     */
    static get IPv4() {
        return 4;
    }

    /**
     * @returns {number}
     */
    static get IPv6() {
        return 6;
    }

    /**
     * @param {string} hostname
     * @param {number} ipVersion
     */
    constructor(hostname, ipVersion) {
        super();

        assert(
            typeof hostname === 'string' && hostname.length > 0,
            `hostname must be not empty string, '${hostname}' has been provided.`
        );

        assert(
            ipVersion === ResolveTask.IPv4 || ipVersion === ResolveTask.IPv6,
            `ipVersion must be 4 or 6. '${ipVersion}' has been provided.`
        );

        this._callbacks = [];
        this._hostname = hostname;
        this._ipVersion = ipVersion;
        const resolver = new Tangerine();
        this._resolver =
            ipVersion === ResolveTask.IPv4 ? resolver.resolve4 : resolver.resolve6;

    }

    /**
     * @param {Function} callback
     */
    addResolvedCallback(callback) {
        this._callbacks.push(callback);
    }

    async run() {
        let error = null;
        let addresses;
        try {
            addresses = await this._resolver(this._hostname, { ttl: true, cache: true });
        } catch (err) {
            error = err;
        }
        assert(this._callbacks.length > 0, 'callbacks array cannot be empty.');

        if (!error) {
            assert(Array.isArray(addresses), 'addresses must be an array.');

            addresses.forEach(address => {
                address.family = this._ipVersion;
                address.expiredTime = Date.now() + address.ttl * 1000;
            });

            this.emit('addresses', addresses);
        }

        this._callbacks.forEach(callback => {
            setImmediate(() => callback(error, addresses));
        });

        this._callbacks = [];

        this.emit('done');
    }

}

module.exports = ResolveTask;
