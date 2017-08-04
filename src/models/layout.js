// @flow

class HTML {
    start: string;
    end: string;
    constructor(html: Object = {}) {
        this.start = html.start ? html.start : '<!DOCTYPE html><html>';
        this.end = html.end ? html.end : '</html>';
    }
}

class Body {
    start: string;
    end: string;
    constructor(body: Object = {}) {
        this.start = body.start ? body.start : '<body>';
        this.end = body.end ? body.end : '</body>';
    }
}

class Template {
    start: string;
    end: string;
    constructor(template: Object = {}) {
        this.start = template.start ? template.start : '<div id="app">';
        this.end = template.end ? template.end : '</div>';
    }
}

class Layout {
    html: HTML;
    body: Body;
    template: Template;
    constructor(obj: Object = {}) {
        this.html = new HTML(obj.html);
        this.body = new Body(obj.body);
        this.template = new Template(obj.template);
    }
}

module.exports.Layout = Layout;
module.exports.HTML = HTML;
module.exports.Body = Body;
module.exports.Template = Template;
