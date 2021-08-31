const path = require("path");

module.exports = {
    mode: "development", // Makes fewer optimizations and more meaningful feedback
    entry: "./src/app.ts",
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "dist"),
        publicPath: "dist" // Needed for webpack-dev-server to understand where the output is written to
    },
    // Tell webpack there will be source maps generated and should be wired to the bundle
    devtool: "inline-source-map", 
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
        extensions: [".ts", ".js"] // Look for files with these extensions
    }
};