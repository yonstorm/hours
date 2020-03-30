module.exports = {
    chainWebpack: config => {
        config.module
            .rule("eslint")
            .use("eslint-loader")
            .loader("eslint-loader")
            .options({
                fix: true,
            });
    }
};
