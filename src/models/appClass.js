// @flow


class AppClass {
    VueClass: Object;
    template: Object;
    script: string;
    head: string;
    constructor(VueClass: Object, template: Object, script: string, head: string) {
        this.VueClass = VueClass;
        this.template = template;
        this.script = script;
        this.head = head;
    }
}

module.exports = AppClass;
