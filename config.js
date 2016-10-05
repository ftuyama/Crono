var config = {};

config.redis = {
    host: 'redis-16833.c9.us-east-1-4.ec2.cloud.redislabs.com',
    port: 16833,
    pass: '6s9gf1gLMiqY6TOE'
};
config.web = {
    port: process.env.PORT || 8080,
    cookie_age: 3600000
};

module.exports = config;