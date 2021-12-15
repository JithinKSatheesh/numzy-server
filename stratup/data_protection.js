const helmet = require('helmet');
const compression = require('compression');
const mongoSanitize = require('express-mongo-sanitize');
var xss = require('xss-clean');

function initializeProtection(express_app) {
  express_app.use(helmet());
  express_app.use(compression());
  express_app.use(mongoSanitize());
  express_app.use(xss());
}

exports.initializeProtection = initializeProtection;
