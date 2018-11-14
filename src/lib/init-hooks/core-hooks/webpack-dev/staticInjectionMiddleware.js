const logger = require('boring-logger');
const paths = require('paths');
const pathitize = require('./pathitize');

let manifestAssets;

function assetsByManifest() {
  if (manifestAssets) return manifestAssets;
  const manifestPath = paths.asset_manifest;
  const manifest = require(manifestPath);
  logger.info(manifest, `Manifest loaded from path ${manifestPath}`);

  const js = Object.keys(manifest).reduce((collector, name) => {
    const assets = [].concat(manifest[name]).filter(asset => asset.endsWith('.js'));
    if (assets.length === 0) return collector;
    collector[name.split('.').shift()] = assets;
    return collector;
  }, {});

  const css = Object.keys(manifest).reduce((collector, name) => {
    const assets = [].concat(manifest[name]).filter(asset => asset.endsWith('.css'));
    if (assets.length === 0) return collector;
    collector[name.split('.').shift()] = assets;
    return collector;
  }, {});

  manifestAssets = {
    js,
    css,
  };

  return manifestAssets;
}

function assetsByDevserver(webpackStats) {
  const chunks = webpackStats.toJson().assetsByChunkName;

  const js = Object.keys(chunks).reduce((collector, name) => {
    const assets = chunks[name].filter(chunk => chunk.endsWith('.js'));
    if (assets.length === 0) return collector;
    collector[name.split('.').shift()] = assets;
    return collector;
  }, {});

  const css = Object.keys(chunks).reduce((collector, name) => {
    const assets = chunks[name].filter(chunk => chunk.endsWith('.css'));
    if (assets.length === 0) return collector;
    collector[name.split('.').shift()] = assets;
    return collector;
  }, {});

  return {
    js,
    css,
  };
}

module.exports = function getStaticInjections(res, entrypoint) {
  const assets = (res.locals.webpackStats) ? assetsByDevserver(res.locals.webpackStats) : assetsByManifest();
  const asset_key = pathitize(entrypoint);

  const js_files = assets.js[asset_key] || [];
  const css_files = assets.css[asset_key] || [];

  res.locals.js_injections = js_files.map((asset) => {
    if (asset[0] !== '/') asset = `/${asset}`;
    return `\n<script async="true" src="${asset}"></script>`;
  });

  res.locals.css_injections = css_files.map((asset) => {
    if (asset[0] !== '/') asset = `/${asset}`;
    return `\n<link rel="stylesheet" href="${asset}"></link>`;
  });
};
