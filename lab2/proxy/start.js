const app = require('./app.js');
const config = require('./config.js');

app.listen(config.get('port'), () => {
    console.log('Server start at localhost:' + config.get('port'));
});
