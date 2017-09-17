'use strict';

var _createClass = function() {
    function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor); } } return function(Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// vue: {
//     head: {
//         title: 'Page Title',
//         meta: [
//             { property:'og:title', content: 'Page Title'},
//             { name:'twitter:title', content: 'Page Title'},
//         ]
//     }
// }
var HeadUtil = function() {
    function HeadUtil(vueObject, styleString) {
        _classCallCheck(this, HeadUtil);

        this.setupStyleString(styleString);
        this.setupMetaTags(vueObject);
        this.setupTitle(vueObject);
        this.setupStructuredData(vueObject);
        this.setupCustomString(vueObject);
    }

    _createClass(HeadUtil, [{
        key: 'setupMetaTags',
        value: function setupMetaTags(vueObject) {
            if (this.metaTags === undefined) {
                this.metaTags = '';
            }
            if (vueObject.head && vueObject.head.meta) {
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = vueObject.head.meta[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var metaItem = _step.value;

                        if (metaItem.name) {
                            this.metaTags += '<meta name="' + metaItem.name + '" content="' + metaItem.content + '"/>\n';
                        } else if (metaItem.property) {
                            this.metaTags += '<meta property="' + metaItem.property + '" content="' + metaItem.content + '"/>\n';
                        } else if (metaItem.script) {
                            var charset = metaItem.charset || 'utf-8';
                            var async = metaItem.async ? ' async=true' : '';
                            this.metaTags += '<script src="' + metaItem.script + '" charset="' + charset + '"' + async + '></script>\n';
                        } else if (metaItem.style) {
                            var type = metaItem.type || 'text/css';
                            var rel = 'stylesheet';
                            this.metaTags += '<link rel="' + rel + '" type="' + type + '" href="' + metaItem.style + '">\n';
                        } else if (metaItem.rel) {
                            // <link rel="icon" type="image/png" href="/assets/favicons/favicon-32x32.png" sizes="32x32"/>
                            var _rel = metaItem.rel ? 'rel="' + metaItem.rel + '" ' : '';
                            var _type = metaItem.type ? 'type="' + metaItem.type + '" ' : '';
                            var href = metaItem.href ? 'href="' + metaItem.href + '" ' : '';
                            var sizes = metaItem.sizes ? 'sizes="' + metaItem.sizes + '" ' : '';
                            this.metaTags += '<link ' + _rel + _type + href + sizes + '>\n';
                        } else if (metaItem.custom) {
                            this.metaTags += metaItem.custom + '\n';
                        }
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                        }
                    } finally {
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }
            }
        }
    }, {
        key: 'setupTitle',
        value: function setupTitle(vueObject) {
            if (vueObject && vueObject.head && vueObject.head.title) {
                this.title = '<title>' + vueObject.head.title + '</title>\n';
            } else {
                this.title = '';
            }
        }
    }, {
        key: 'setupStructuredData',
        value: function setupStructuredData(vueObject) {
            if (vueObject && vueObject.head && vueObject.head.structuredData) {
                this.structuredData = '<script type="application/ld+json">\n' + JSON.stringify(vueObject.head.structuredData) + '\n</script>\n';
            } else {
                this.structuredData = '';
            }
        }
    }, {
        key: 'setupStyleString',
        value: function setupStyleString(styleString) {
            if (styleString) {
                this.style = '<style>' + styleString + '</style>';
            } else {
                this.style = '';
            }
        }
    }, {
        key: 'setupCustomString',
        value: function setupCustomString(customString) {
            if (customString) {
                this.custom = customString;
            } else {
                this.custom = '';
            }
        }
    }, {
        key: 'toString',
        value: function toString() {
            return '<head>\n' + this.title + this.metaTags + this.structuredData + this.style + this.custom + '</head>';
        }
    }]);

    return HeadUtil;
}();

module.exports = HeadUtil;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9oZWFkLmpzIl0sIm5hbWVzIjpbIkhlYWRVdGlsIiwidnVlT2JqZWN0Iiwic3R5bGVTdHJpbmciLCJzZXR1cFN0eWxlU3RyaW5nIiwic2V0dXBNZXRhVGFncyIsInNldHVwVGl0bGUiLCJzZXR1cFN0cnVjdHVyZWREYXRhIiwibWV0YVRhZ3MiLCJ1bmRlZmluZWQiLCJoZWFkIiwibWV0YSIsIm1ldGFJdGVtIiwibmFtZSIsImNvbnRlbnQiLCJwcm9wZXJ0eSIsInNjcmlwdCIsImNoYXJzZXQiLCJhc3luYyIsInN0eWxlIiwidHlwZSIsInJlbCIsImhyZWYiLCJzaXplcyIsInRpdGxlIiwic3RydWN0dXJlZERhdGEiLCJKU09OIiwic3RyaW5naWZ5IiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBU0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0lBQ01BLFE7QUFLRixzQkFBWUMsU0FBWixFQUFzQ0MsV0FBdEMsRUFBMkQ7QUFBQTs7QUFDdkQsYUFBS0MsZ0JBQUwsQ0FBc0JELFdBQXRCO0FBQ0EsYUFBS0UsYUFBTCxDQUFtQkgsU0FBbkI7QUFDQSxhQUFLSSxVQUFMLENBQWdCSixTQUFoQjtBQUNBLGFBQUtLLG1CQUFMLENBQXlCTCxTQUF6QjtBQUNIOzs7O3NDQUNhQSxTLEVBQW1CO0FBQzdCLGdCQUFJLEtBQUtNLFFBQUwsS0FBa0JDLFNBQXRCLEVBQWlDO0FBQzdCLHFCQUFLRCxRQUFMLEdBQWdCLEVBQWhCO0FBQ0g7QUFDRCxnQkFBSU4sVUFBVVEsSUFBVixJQUFrQlIsVUFBVVEsSUFBVixDQUFlQyxJQUFyQyxFQUEyQztBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUN2Qyx5Q0FBcUJULFVBQVVRLElBQVYsQ0FBZUMsSUFBcEMsOEhBQTBDO0FBQUEsNEJBQWpDQyxRQUFpQzs7QUFDdEMsNEJBQUlBLFNBQVNDLElBQWIsRUFBbUI7QUFDZixpQ0FBS0wsUUFBTCxxQkFBZ0NJLFNBQVNDLElBQXpDLG1CQUEyREQsU0FBU0UsT0FBcEU7QUFDSCx5QkFGRCxNQUVPLElBQUlGLFNBQVNHLFFBQWIsRUFBdUI7QUFDMUIsaUNBQUtQLFFBQUwseUJBQW9DSSxTQUFTRyxRQUE3QyxtQkFBbUVILFNBQVNFLE9BQTVFO0FBQ0gseUJBRk0sTUFFQSxJQUFJRixTQUFTSSxNQUFiLEVBQXFCO0FBQ3hCLGdDQUFNQyxVQUFVTCxTQUFTSyxPQUFULElBQW9CLE9BQXBDO0FBQ0EsZ0NBQU1DLFFBQVFOLFNBQVNNLEtBQVQsR0FBaUIsYUFBakIsR0FBaUMsRUFBL0M7QUFDQSxpQ0FBS1YsUUFBTCxzQkFBaUNJLFNBQVNJLE1BQTFDLG1CQUE4REMsT0FBOUQsU0FBeUVDLEtBQXpFO0FBQ0gseUJBSk0sTUFJQSxJQUFJTixTQUFTTyxLQUFiLEVBQW9CO0FBQ3ZCLGdDQUFNQyxPQUFPUixTQUFTUSxJQUFULElBQWlCLFVBQTlCO0FBQ0EsZ0NBQU1DLE1BQU0sWUFBWjtBQUNBLGlDQUFLYixRQUFMLG9CQUErQmEsR0FBL0IsZ0JBQTZDRCxJQUE3QyxnQkFBNERSLFNBQVNPLEtBQXJFO0FBQ0gseUJBSk0sTUFJQSxJQUFJUCxTQUFTUyxHQUFiLEVBQWtCO0FBQ3JCO0FBQ0EsZ0NBQU1BLE9BQU1ULFNBQVNTLEdBQVQsYUFBdUJULFNBQVNTLEdBQWhDLFVBQTBDLEVBQXREO0FBQ0EsZ0NBQU1ELFFBQU9SLFNBQVNRLElBQVQsY0FBeUJSLFNBQVNRLElBQWxDLFVBQTZDLEVBQTFEO0FBQ0EsZ0NBQU1FLE9BQU9WLFNBQVNVLElBQVQsY0FBeUJWLFNBQVNVLElBQWxDLFVBQTZDLEVBQTFEO0FBQ0EsZ0NBQU1DLFFBQVFYLFNBQVNXLEtBQVQsZUFBMkJYLFNBQVNXLEtBQXBDLFVBQWdELEVBQTlEO0FBQ0EsaUNBQUtmLFFBQUwsZUFBMEJhLElBQTFCLEdBQWdDRCxLQUFoQyxHQUF1Q0UsSUFBdkMsR0FBOENDLEtBQTlDO0FBQ0g7QUFDSjtBQXRCc0M7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQXVCMUM7QUFDSjs7O21DQUNVckIsUyxFQUFtQjtBQUMxQixnQkFBSUEsYUFBYUEsVUFBVVEsSUFBdkIsSUFBK0JSLFVBQVVRLElBQVYsQ0FBZWMsS0FBbEQsRUFBeUQ7QUFDckQscUJBQUtBLEtBQUwsZUFBdUJ0QixVQUFVUSxJQUFWLENBQWVjLEtBQXRDO0FBQ0gsYUFGRCxNQUVPO0FBQ0gscUJBQUtBLEtBQUwsR0FBYSxFQUFiO0FBQ0g7QUFDSjs7OzRDQUNtQnRCLFMsRUFBbUI7QUFDbkMsZ0JBQUlBLGFBQWFBLFVBQVVRLElBQXZCLElBQStCUixVQUFVUSxJQUFWLENBQWVlLGNBQWxELEVBQWtFO0FBQzlELHFCQUFLQSxjQUFMLDZDQUE4REMsS0FBS0MsU0FBTCxDQUFlekIsVUFBVVEsSUFBVixDQUFlZSxjQUE5QixDQUE5RDtBQUNILGFBRkQsTUFFTztBQUNILHFCQUFLQSxjQUFMLEdBQXNCLEVBQXRCO0FBQ0g7QUFDSjs7O3lDQUNnQnRCLFcsRUFBcUI7QUFDbEMsZ0JBQUlBLFdBQUosRUFBaUI7QUFDYixxQkFBS2dCLEtBQUwsZUFBdUJoQixXQUF2QjtBQUNILGFBRkQsTUFFTztBQUNILHFCQUFLZ0IsS0FBTCxHQUFhLEVBQWI7QUFDSDtBQUNKOzs7bUNBQ2tCO0FBQ2YsbUJBQU8sYUFBYSxLQUFLSyxLQUFsQixHQUEwQixLQUFLaEIsUUFBL0IsR0FBMEMsS0FBS2lCLGNBQS9DLEdBQWdFLEtBQUtOLEtBQXJFLEdBQTZFLFNBQXBGO0FBQ0g7Ozs7OztBQUdMUyxPQUFPQyxPQUFQLEdBQWlCNUIsUUFBakIiLCJmaWxlIjoiaGVhZC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIEBmbG93XG5cbnR5cGUgVnVlT2JqZWN0VHlwZSA9IHtcbiAgICBoZWFkOiB7XG4gICAgICAgIHRpdGxlOiBzdHJpbmcsXG4gICAgICAgIG1ldGE6IE9iamVjdFtdLFxuICAgICAgICBzdHJ1Y3R1cmVkRGF0YTogT2JqZWN0XG4gICAgfVxufVxuLy8gdnVlOiB7XG4vLyAgICAgaGVhZDoge1xuLy8gICAgICAgICB0aXRsZTogJ1BhZ2UgVGl0bGUnLFxuLy8gICAgICAgICBtZXRhOiBbXG4vLyAgICAgICAgICAgICB7IHByb3BlcnR5OidvZzp0aXRsZScsIGNvbnRlbnQ6ICdQYWdlIFRpdGxlJ30sXG4vLyAgICAgICAgICAgICB7IG5hbWU6J3R3aXR0ZXI6dGl0bGUnLCBjb250ZW50OiAnUGFnZSBUaXRsZSd9LFxuLy8gICAgICAgICBdXG4vLyAgICAgfVxuLy8gfVxuY2xhc3MgSGVhZFV0aWwge1xuICAgIG1ldGFUYWdzOiBzdHJpbmc7XG4gICAgdGl0bGU6IHN0cmluZztcbiAgICBzdHJ1Y3R1cmVkRGF0YTogc3RyaW5nO1xuICAgIHN0eWxlOiBzdHJpbmc7XG4gICAgY29uc3RydWN0b3IodnVlT2JqZWN0OiBWdWVPYmplY3RUeXBlLCBzdHlsZVN0cmluZzogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuc2V0dXBTdHlsZVN0cmluZyhzdHlsZVN0cmluZyk7XG4gICAgICAgIHRoaXMuc2V0dXBNZXRhVGFncyh2dWVPYmplY3QpO1xuICAgICAgICB0aGlzLnNldHVwVGl0bGUodnVlT2JqZWN0KTtcbiAgICAgICAgdGhpcy5zZXR1cFN0cnVjdHVyZWREYXRhKHZ1ZU9iamVjdCk7XG4gICAgfVxuICAgIHNldHVwTWV0YVRhZ3ModnVlT2JqZWN0OiBPYmplY3QpIHtcbiAgICAgICAgaWYgKHRoaXMubWV0YVRhZ3MgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhpcy5tZXRhVGFncyA9ICcnO1xuICAgICAgICB9XG4gICAgICAgIGlmICh2dWVPYmplY3QuaGVhZCAmJiB2dWVPYmplY3QuaGVhZC5tZXRhKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBtZXRhSXRlbSBvZiB2dWVPYmplY3QuaGVhZC5tZXRhKSB7XG4gICAgICAgICAgICAgICAgaWYgKG1ldGFJdGVtLm5hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tZXRhVGFncyArPSBgPG1ldGEgbmFtZT1cIiR7bWV0YUl0ZW0ubmFtZX1cIiBjb250ZW50PVwiJHttZXRhSXRlbS5jb250ZW50fVwiLz5cXG5gO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAobWV0YUl0ZW0ucHJvcGVydHkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tZXRhVGFncyArPSBgPG1ldGEgcHJvcGVydHk9XCIke21ldGFJdGVtLnByb3BlcnR5fVwiIGNvbnRlbnQ9XCIke21ldGFJdGVtLmNvbnRlbnR9XCIvPlxcbmA7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChtZXRhSXRlbS5zY3JpcHQpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY2hhcnNldCA9IG1ldGFJdGVtLmNoYXJzZXQgfHwgJ3V0Zi04JztcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYXN5bmMgPSBtZXRhSXRlbS5hc3luYyA/ICcgYXN5bmM9dHJ1ZScgOiAnJztcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tZXRhVGFncyArPSBgPHNjcmlwdCBzcmM9XCIke21ldGFJdGVtLnNjcmlwdH1cIiBjaGFyc2V0PVwiJHtjaGFyc2V0fVwiJHthc3luY30+PC9zY3JpcHQ+XFxuYDtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKG1ldGFJdGVtLnN0eWxlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHR5cGUgPSBtZXRhSXRlbS50eXBlIHx8ICd0ZXh0L2Nzcyc7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHJlbCA9ICdzdHlsZXNoZWV0JztcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tZXRhVGFncyArPSBgPGxpbmsgcmVsPVwiJHtyZWx9XCIgdHlwZT1cIiR7dHlwZX1cIiBocmVmPVwiJHttZXRhSXRlbS5zdHlsZX1cIj5cXG5gO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAobWV0YUl0ZW0ucmVsKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIDxsaW5rIHJlbD1cImljb25cIiB0eXBlPVwiaW1hZ2UvcG5nXCIgaHJlZj1cIi9hc3NldHMvZmF2aWNvbnMvZmF2aWNvbi0zMngzMi5wbmdcIiBzaXplcz1cIjMyeDMyXCIvPlxuICAgICAgICAgICAgICAgICAgICBjb25zdCByZWwgPSBtZXRhSXRlbS5yZWwgPyBgcmVsPVwiJHttZXRhSXRlbS5yZWx9XCIgYCA6ICcnO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB0eXBlID0gbWV0YUl0ZW0udHlwZSA/IGB0eXBlPVwiJHttZXRhSXRlbS50eXBlfVwiIGAgOiAnJztcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgaHJlZiA9IG1ldGFJdGVtLmhyZWYgPyBgaHJlZj1cIiR7bWV0YUl0ZW0uaHJlZn1cIiBgIDogJyc7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHNpemVzID0gbWV0YUl0ZW0uc2l6ZXMgPyBgc2l6ZXM9XCIke21ldGFJdGVtLnNpemVzfVwiIGAgOiAnJztcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tZXRhVGFncyArPSBgPGxpbmsgJHtyZWx9JHt0eXBlfSR7aHJlZn0ke3NpemVzfT5cXG5gO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBzZXR1cFRpdGxlKHZ1ZU9iamVjdDogT2JqZWN0KSB7XG4gICAgICAgIGlmICh2dWVPYmplY3QgJiYgdnVlT2JqZWN0LmhlYWQgJiYgdnVlT2JqZWN0LmhlYWQudGl0bGUpIHtcbiAgICAgICAgICAgIHRoaXMudGl0bGUgPSBgPHRpdGxlPiR7dnVlT2JqZWN0LmhlYWQudGl0bGV9PC90aXRsZT5cXG5gO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy50aXRsZSA9ICcnO1xuICAgICAgICB9XG4gICAgfVxuICAgIHNldHVwU3RydWN0dXJlZERhdGEodnVlT2JqZWN0OiBPYmplY3QpIHtcbiAgICAgICAgaWYgKHZ1ZU9iamVjdCAmJiB2dWVPYmplY3QuaGVhZCAmJiB2dWVPYmplY3QuaGVhZC5zdHJ1Y3R1cmVkRGF0YSkge1xuICAgICAgICAgICAgdGhpcy5zdHJ1Y3R1cmVkRGF0YSA9IGA8c2NyaXB0IHR5cGU9XCJhcHBsaWNhdGlvbi9sZCtqc29uXCI+XFxuJHtKU09OLnN0cmluZ2lmeSh2dWVPYmplY3QuaGVhZC5zdHJ1Y3R1cmVkRGF0YSl9XFxuPC9zY3JpcHQ+XFxuYDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuc3RydWN0dXJlZERhdGEgPSAnJztcbiAgICAgICAgfVxuICAgIH1cbiAgICBzZXR1cFN0eWxlU3RyaW5nKHN0eWxlU3RyaW5nOiBzdHJpbmcpIHtcbiAgICAgICAgaWYgKHN0eWxlU3RyaW5nKSB7XG4gICAgICAgICAgICB0aGlzLnN0eWxlID0gYDxzdHlsZT4ke3N0eWxlU3RyaW5nfTwvc3R5bGU+YDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuc3R5bGUgPSAnJztcbiAgICAgICAgfVxuICAgIH1cbiAgICB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gJzxoZWFkPlxcbicgKyB0aGlzLnRpdGxlICsgdGhpcy5tZXRhVGFncyArIHRoaXMuc3RydWN0dXJlZERhdGEgKyB0aGlzLnN0eWxlICsgJzwvaGVhZD4nO1xuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBIZWFkVXRpbDtcbiJdfQ==
