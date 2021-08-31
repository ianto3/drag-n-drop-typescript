// Workflow for production
const path = require("path");
const CleanPlugin = require("clean-webpack-plugin"); 

module.exports = {
    mode: "production",
    entry: "./src/app.ts",
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "dist"),
        // publicPath: "dist" // not needed for production.
    },
    // Tell webpack there will be source maps generated and should be wired to the bundle.
    // devtool: "inline-source-map", 
    devtool: false, 
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: "ts-loader",
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: [".ts", ".js"] // Look for files with these extensions.
    },
    // Plugins are applied to the entire project, module for specific file levels.
    plugins: [
        // Cleans output directory before a new build.
        new CleanPlugin.CleanWebpackPlugin()
    ]
};