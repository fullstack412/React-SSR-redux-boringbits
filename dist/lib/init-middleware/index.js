"use strict";

var _paths = _interopRequireDefault(require("paths"));

var _requireInjectAll = _interopRequireDefault(require("require-inject-all"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

module.exports =
/*#__PURE__*/
function () {
  var _initMiddleware = _asyncToGenerator(function* (BoringInjections) {
    const {
      boring
    } = BoringInjections;
    const moduleData = yield (0, _requireInjectAll.default)([_paths.default.boring_middleware, _paths.default.server_middleware], boring);
    return Object.keys(moduleData).reduce(function (prev, key) {
      const middlewareExport = moduleData[key];
      let func = middlewareExport;
      let name = key;

      if (typeof middlewareExport != 'function') {
        name = middlewareExport.name;
        func = middlewareExport.middleware || middlewareExport.func || middlewareExport.run;
      }

      prev[name] = func; //    boring.add_middleware(name, func);

      return prev;
    }, {});
  });

  return function initMiddleware(_x) {
    return _initMiddleware.apply(this, arguments);
  };
}();
//# sourceMappingURL=index.js.map