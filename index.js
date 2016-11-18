var rp = require("request-promise").defaults({jar: true});
var cheerio = require("cheerio");
var settings = require('./settings.js');

var browserMsg = {
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.98 Safari/537.36',
  'Content-Type':'application/x-www-form-urlencoded',
};

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

//urllib.request(settings.loginUrl)
//.then(function(res){
//  var $ = cheerio.load(res.data);
//  ticket = $('input[name=lt]').attr('value');
//  execution = $('input[name=execution]').attr('value');
//
//  loginMsg = {
//    'username': settings.username,
//    'password': settings.password,
//    'lt': ticket,
//    'execution': execution,
//    'warn': true,
//    '_eventId': 'submit',
//    'submit': 'LOGIN',
//  }
//  console.log(loginMsg);
//  return urllib.request(settings.loginUrl, {
//    method: 'POST',
//    headers: browserMsg,
//    data: loginMsg,
//    //followRedirect: true,
//  });
//})
//.then(function(res) {
//  cookie = res.headers['set-cookie'];
//  redirectedUrl = res.headers['location'];
//  var header = {
//    'User-Agent': browserMsg['User-Agent'],
//    'Content-Type': browserMsg['Content-Type'],
//    'Cookie': cookie,
//    'Referer': settings.loginUrl,
//  }
//
//  return urllib.request(redirectedUrl, {
//    method: 'POST',
//    headers: header,
//    data: loginMsg,
//  });
//})
//.then(function(res) {
//  console.log('success', res);
//})
//.catch(function(err) {
//  console.error(err);
//})

//superagent.get(settings.loginUrl).set(browserMsg)
//.then(function(res) {
//  //get cas tickets
//  var $ = cheerio.load(res.text);
//  ticket = $('input[name=lt]').attr('value');
//  execution = $('input[name=execution]').attr('value');
//
//  var loginMsg = {
//    'username': settings.username,
//    'password': settings.password,
//    'lt': ticket,
//    'execution': execution,
//    'warn': true,
//    '_eventId': 'submit',
//    'submit': 'LOGIN',
//  }
//  //login by post
//  return superagent.post(settings.loginUrl).set(browserMsg).send(loginMsg).redirects(5)
//})
//.then(function(res) {
//  //set cookie
//  cookie = res.headers["set-cookie"];
//  //console.dir(res);
//  var loginMsg = {
//    'username': settings.username,
//    'password': settings.password,
//    'lt': ticket,
//    'execution': execution,
//    'warn': true,
//    '_eventId': 'submit',
//    'submit': 'LOGIN',
//  }
//  return superagent.post(settings.loginUrl).set('Cookie', cookie).send(loginMsg).redirects(0)
//})
//.then(function(res) {
//  console.log('success!');
//  console.dir(res);
//})
//.catch(function(err) {
//  console.error(err);
//})
