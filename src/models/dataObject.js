// @flow
const Types = require('./types');

const types = new Types();

class DataObject {
    data: Object;
    constructor(componentData: Object, defaultData: Object, type: string) {
        switch (type) {
            case types.COMPONENT:
                this.data = Object.assign({}, componentData, defaultData);
                break;
            case types.SUBCOMPONENT:
                this.data = componentData;
                break;
        }
    }
}

module.exports = DataObject;
