var rp = require("request-promise").defaults({jar: true});
var cheerio = require("cheerio");
var settings = require('./settings.js');

var cookie, ticket, execution, recirectedUrl, loginMsg;

rp({
  method: 'POST',
  uri: settings.sympaRoot,
  resolveWithFullResponse: true,
  form: {
    action: 'sso_login',
    auth_service_name: 'Login',
    action_sso_login: 'Login',
  },
}).then(function(res) {
  return rp({
    method: 'GET',
    uri: settings.loginUrl,
    resolveWithFullResponse: true,
  });
})
.then(function(response) {
  var $ = cheerio.load(response.body);
  ticket = $('input[name=lt]').attr('value');
  execution = $('input[name=execution]').attr('value');

  loginMsg = {
    'username': settings.username,
    'password': settings.password,
    'lt': ticket,
    'execution': execution,
    '_eventId': 'submit',
    'submit': 'LOGIN',
  }
  console.log(loginMsg);
  return rp({
    method: 'POST',
    uri: settings.loginUrl,
    resolveWithFullResponse: true,
    form: loginMsg,
  });
})
.then(function(response) {
  console.log('success', response);
})
.catch(function(err) {
  console.error(err);
});
