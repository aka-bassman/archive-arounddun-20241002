const { withBase } = require(process.env.NX_CLI_SET ? "../../pkgs/core/next/next.base" : "./next.base");

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {};

module.exports = withBase("syrs", nextConfig);
