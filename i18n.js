var i18n = require('i18n');

i18n.configure({
  // setup two locales 
  locales:['en','az'],

  // where to store json files 
  directory: __dirname + '/locales',
  
  //default locale
  defaultLocale: 'en',
  
  // sets a custom cookie name to parse locale settings from  - defaults to NULL
  cookie: 'lang',
});

module.exports = function(req, res, next) {

  i18n.init(req, res);
  res.locals.__= res.__;

  var current_locale = i18n.getLocale();

  return next();
};