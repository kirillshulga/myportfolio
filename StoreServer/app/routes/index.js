const adminRoutes = require('./admin_routes');
const mainRoutes = require('./main_routes');
module.exports = function(app, db) {
  adminRoutes(app, db);
  mainRoutes(app, db);
};