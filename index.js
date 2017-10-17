var express = require('express');

var app = express();
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/couponValidator', function (req, res) {
  var data = {
    "bestAnimals": [
      "wombat",
      "corgi",
      "puffer fish",
      "owl",
      "crow"
    ]
  };

  res.json(data);
});

app.get('/',function(req,res){
  res.send('hello world')
})

var server = app.listen(process.env.PORT, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

});