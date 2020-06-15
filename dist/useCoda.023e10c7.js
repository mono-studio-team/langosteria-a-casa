// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"Negm":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.coda = void 0;

const camelize = str => str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function (match, index) {
  if (+match === 0) return ''; // or if (/\s+/.test(match)) for white spaces

  return index === 0 ? match.toLowerCase() : match.toUpperCase();
});

const mapRowsAndCols = (row, columns) => {
  const valuesArray = Object.entries(row.values).map(([key, value]) => ({
    name: columns[key],
    value
  }));
  const values = valuesArray.reduce((res, curr) => ({ ...res,
    [camelize(curr.name)]: curr.value
  }), {});
  return { ...values
  };
};

const coda = instance => {
  const getTableColumns = ({
    docId,
    tableIdOrName
  }) => instance.get(`/docs/${docId}/tables/${tableIdOrName}/columns`);

  const getTableRows = ({
    docId,
    tableIdOrName
  }) => instance.get(`/docs/${docId}/tables/${tableIdOrName}/rows`, {
    params: {
      sortBy: 'natural'
    }
  });

  const getViewColumns = ({
    docId,
    viewIdOrName
  }) => instance.get(`/docs/${docId}/views/${viewIdOrName}/columns`);

  const getViewRows = ({
    docId,
    viewIdOrName
  }) => instance.get(`/docs/${docId}/views/${viewIdOrName}/rows`, {
    params: {
      sortBy: 'natural'
    }
  });

  const getTableData = async ({
    docId,
    tableIdOrName
  }) => {
    const {
      data: dataColumns
    } = await getTableColumns({
      docId,
      tableIdOrName
    });
    const {
      data: dataRows
    } = await getTableRows({
      docId,
      tableIdOrName
    });
    const columns = dataColumns.items.reduce((res, curr) => ({ ...res,
      [curr.id]: curr.name
    }), {});
    return dataRows.items.map(row => mapRowsAndCols(row, columns));
  };

  const getViewData = async ({
    docId,
    viewIdOrName
  }) => {
    const {
      data: dataColumns
    } = await getViewColumns({
      docId,
      viewIdOrName
    });
    const {
      data: dataRows
    } = await getViewRows({
      docId,
      viewIdOrName
    });
    const columns = dataColumns.items.reduce((res, curr) => ({ ...res,
      [curr.id]: curr.name
    }), {});
    return dataRows.items.map(row => mapRowsAndCols(row, columns));
  };

  return {
    getTableData,
    getViewData
  };
};

exports.coda = coda;
},{}]},{},["Negm"], null)
//# sourceMappingURL=/useCoda.023e10c7.js.map