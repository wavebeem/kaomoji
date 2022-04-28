const util = require("util");

module.exports = function (config) {
  config.addPassthroughCopy("src/_redirects");
  config.addPassthroughCopy("src/static");
  config.addFilter("inspect", function (value) {
    return util.inspect(value, {});
  });
  return {
    dir: {
      input: "src",
      output: "dist",
    },
  };
};
