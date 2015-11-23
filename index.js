var Hapi = require('hapi'),
Good = require('good'),
Handlebars = require('handlebars'),
Path = require('path'),
Request = require('request');

var server = new Hapi.Server();
server.connection({ port: 3000 });
server.views({
    engines: {
        html: Handlebars
    },
    relativeTo: __dirname,
    path: './public/views',
    layout: true,
    layoutPath: Path.join(__dirname,'./public/views/layout'),
});
server.r
server.route({
  method: 'GET',
  path: '/{filename*}',
  handler: {
    directory: {
      path:    __dirname + '/public',
      listing: false,
      index:   false
    }
  }
});
server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
        var url = "http://m.lowes.com/IntegrationServices/resources/productList"+
        "/json/v3_0/4294857975?langId=-1&storeId=10702&catalogId=10051&n"+
        "Value=4294857975&storeNumber=0595&pageSize=20&firstRecord=0&refinements=5003703";
        Request({
            url: url,
            json: true
        }, function (error, response, body) {
                if (!error && response.statusCode === 200) {
                    console.log(body.ProductsList) // Print the json response
                    reply.view('index',{message:"Don't worry be Hapi!!!",data:body.ProductsList});
                }
            })
    }
});
server.register({
    register: Good,
    options: {
        reporters: [{
            reporter: require('good-console'),
            events: {
                response: '*',
                log: '*'
            }
        }]
    }
}, function (err) {
    if (err) {
        throw err; // something bad happened loading the plugin
    }

    server.start(function () {
        server.log('info', 'Server running at: ' + server.info.uri);
    });
});
