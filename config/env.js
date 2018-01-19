module.exports = {
  mlab: {
    dbuser: process.env.MLAB_DBUSER || require('./config.js').mlab.dbuser,
    dbpassword: process.env.MLAB_DBPASSWORD || require('./config.js').mlab.dbpassword,
  }
};
