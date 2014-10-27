var server = require('./server.js'),
    controller = require('./controller.js'),
    app = server();

app.get('/', function(req, res) {
    res.send("OK");
});
app.get('/all_chirps', controller.getAllChirps);
app.get('/all_users', controller.getAllUsers);
app.get('/my_chirps', controller.getMyChirps);
app.get('/chirps', controller.getChirps);

app.post('/chirp', controller.postChirp);
app.post('/register', controller.postRegister);

app['delete']('/chirp', controller.deleteChirt);

app.listen(3030);
console.log("Server listen at port: " + 3030);