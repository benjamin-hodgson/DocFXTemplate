// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE file in the project root for full license information.
var common = require('./common.js');
var pathUtil = common.path;

exports.setToc = function (model) {
  if (!model.__global || !model.__global._shared) return;

  if (model._tocKey) {
    var toc = model.__global._shared[model._tocKey];
    var path = model._path;
    if (toc) {
      var tocDir = pathUtil.getDirectoryName(toc._path);
      normalize(toc, pathUtil.getDirectoryName(model._tocRel), function (item) {
        return item.href && (tocDir + decodeURIComponent(item.href) === path);
      });

      model._toc = toc;
    }
  }
  return model;
}

function normalize(toc, rel, comparer) {
  if (!toc) {
    return;
  }
  toc.level = 1;
  toc.path = "0";
  toc.active = true;
  if (toc.items && toc.items.length > 0) {
    toc.leaf = false;
    for (var i = toc.items.length - 1; i >= 0; i--) {
      normalizeCore(toc.items[i], rel, 2, "0_" + i, comparer);
    };
  } else {
    toc.items = [];
    toc.leaf = true;
  }
  return toc;
}

function normalizeCore(item, rel, level, path, comparer) {
  item.active = false;
  item.level = level;
  item.path = path;
  if (comparer && comparer(item)) {
    item.active = true;
  }

  if (rel && common.isRelativePath(item.href)) {
    item.href = rel + item.href;
  }

  if (rel && common.isRelativePath(item.topicHref)) {
    item.topicHref = rel + item.topicHref;
  }

  if (item.items && item.items.length > 0) {
    item.leaf = false;
    for (var i = item.items.length - 1; i >= 0; i--) {
      normalizeCore(item.items[i], rel, level + 1, path + "_" + i, comparer);
      if (item.items[i].active) {
        item.active = true;
      }
    };
  } else {
    item.items = [];
    item.leaf = true;
  }
}