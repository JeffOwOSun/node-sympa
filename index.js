var j = require("request").jar();
var rp = require("request-promise").defaults({jar: j});
var cheerio = require("cheerio");
var settings = require('./settings.js');

var SYMPA = module.exports = function SYMPA(sympaRoot) {
  this.sympaRoot = sympaRoot;
}
//get cookies
SYMPA.prototype.setup = function (username, password, casRoot) {
  var self = this;
  return rp({
    //click the login button in sympa
    method: 'POST',
    uri: self.sympaRoot,
    resolveWithFullResponse: true,
    simple: false,
    form: {
      action: 'sso_login',
      auth_service_name: 'Login',
      action_sso_login: 'Login',
    },
  }).then(function(res) {
    //get the tickets
    return rp({
      method: 'GET',
      uri: casRoot+'/login?service='+self.sympaRoot+'/sso_login_succeeded/Login',
      resolveWithFullResponse: true,
    });
  })
  .then(function(response) {
    //console.log(j);
    var jsessionId = j.getCookies(casRoot)[0].value;
    //login to cas
    //console.log(j.serializeSync());
    var $ = cheerio.load(response.body);
    var ticket = $('input[name=lt]').attr('value');
    var execution = $('input[name=execution]').attr('value');
    var loginMsg = {
      'username': username,
      'password': password,
      'lt': ticket,
      'execution': execution,
      '_eventId': 'submit',
      'submit': 'LOGIN',
    }
    //console.log(loginMsg);
    return rp({
      method: 'POST',
      uri: casRoot+'/login;jsessionid='+jsessionId+'?service='+self.sympaRoot+'/sso_login_succeeded/Login',
      resolveWithFullResponse: true,
      form: loginMsg,
      simple: false,
    });
  })
  .then(function(response) {
    console.log('success', response);
  })
  .catch(function(err) {
    throw err;
  });
}
SYMPA.prototype.getList = function (mailingList) {
  return rp({
    uri: this.sympaRoot+'/dump/'+mailingList+'/light',
  })
  //.then(function(body) {
  //  return body.split('\n');
  //});
}

var sympa = new SYMPA(settings.sympaRoot);
sympa.setup(settings.username, settings.password, settings.casRoot)
//.then(function() {
//  return sympa.getList('jowos-custom-list');
//})
.then(function(res) {
  console.log(res);
})
.catch(function(err) {
  console.error(err);
})
