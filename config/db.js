if (process.env.NODE_ENV == "production") {
    module.exports = { mongoURI: "mongodb+srv://admin:admin@cadstabs-db-57usd.gcp.mongodb.net/test?retryWrites=true&w=majority"};
} else {
    //module.exports = { mongoURI: "mongodb://localhost/cadstabs" };
    module.exports = { mongoURI: "mongodb+srv://admin:admin@cadstabs-db-57usd.gcp.mongodb.net/test?retryWrites=true&w=majority"};
}