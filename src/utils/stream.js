// @flow
'use strict';

const stream = require('stream');

class RenderStreamTransform extends stream.Transform {
    head: string;
    tail: string;
    flag: boolean;
    constructor(head: string, tail: string, options: Object = {}) {
        super(options);
        this.head = head;
        this.tail = tail;
        this.flag = true;
    }
    _transform(chunk: any, encoding: string, callback: Function) {
        if (this.flag) {
            this.push(new Buffer(this.head));
            this.flag = false;
        }
        this.push(chunk);
        callback();
    }
    end() {
        this.push(new Buffer(this.tail));
        this.push(null);
    }
}

module.exports = RenderStreamTransform;
