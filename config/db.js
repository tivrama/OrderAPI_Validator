var mlab = require('./env.js').mlab;
module.exports = {
  // INSERT YOUR DB URL PARAMETERS HERE

  // url to prod DB (Uncomment for production/go-live)
  url: 'mongodb://' + mlab.dbuser + ':' + mlab.dbpassword + '@ds143241.mlab.com:43241/orderapi'

  // url to testing DB (Comment out when going live)
  // url: 'mongodb://' + mlab.dbuser + ':' + mlab.dbpassword + '@ds143241.mlab.com:43241/orderapi-dev'
};
