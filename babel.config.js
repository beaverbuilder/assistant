module.exports = function (api) {

    const isTest = api.env('test');

    api.cache(true);

    const presets = [
        "@babel/preset-env",
        "@babel/preset-react"
    ];
    const plugins = [
        "@babel/plugin-transform-runtime",
        "@babel/plugin-proposal-object-rest-spread",
        "@babel/plugin-proposal-class-properties"
    ];

    return {
        presets,
        plugins
    };
}
