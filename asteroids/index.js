
// Our express application
var express = require('express'),
    path = require('path'),
    app     = express(); 

app.set("port", process.env.PORT || 2999);


// Express middleware
app
    .use(express.static('./'))
    // Any request not matched so far, send to main.html
    .get('*', function(req, res){
        res.sendFile('src/game.html', {root: path.join(__dirname, './')});
    })
    .listen(app.get('port'), function(){
        console.log('Server is listening on port ' + app.get('port'));
    });
