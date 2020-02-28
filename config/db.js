if (process.env.NODE_ENV == "production") {
    module.exports = {
        mongoURI: "mongodb+srv://MarcusAdmin:5824679315@blognodejs-bd-57usd.gcp.mongodb.net/test?authSource=admin&replicaSet=BlogNodeJS-BD-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass%20Community&retryWrites=true&ssl=true"
    };
} else {
    module.exports = { mongoURI: "mongodb://localhost/blogapp" };
}