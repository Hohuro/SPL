const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const objectId = require("mongodb").ObjectID;

const app = express();
const jsonParser = express.json();

const mongoClient = new MongoClient("mongodb://localhost:27017/", { useUnifiedTopology: true });

let mydb;

app.use(express.static(__dirname + "/public"));

mongoClient.connect(function (err, gamer) {
    if (err) return console.log(err);
    mydb = gamer;
    app.locals.collection = gamer.db("mydb").collection("gamers");
    app.listen(3000, function () {
        console.log("Сервер запущено...");
    });
});

app.get("/api/gamers", function (req, res) {

    const collection = req.app.locals.collection;
    collection.find({}).toArray(function (err, gamers) {

        if (err) return console.log(err);
        res.send(gamers)
    });

});
app.get("/api/gamers/:id", function (req, res) {

    const id = new objectId(req.params.id);
    const collection = req.app.locals.collection;
    collection.findOne({ _id: id }, function (err, gamer) {

        if (err) return console.log(err);
        res.send(gamer);
    });
});

app.post("/api/gamers", jsonParser, function (req, res) {

    if (!req.body) return res.sendStatus(400);

    const gamerName = req.body.name;
    const gamerLastName = req.body.lastname;
    const gamerAge = req.body.age;
    const gamerDiscipline = req.body.discipline;

    const gamer = { name: gamerName, lastname: gamerLastName, age: gamerAge, discipline: gamerDiscipline };

    const collection = req.app.locals.collection;
    collection.insertOne(gamer, function (err, result) {

        if (err) return console.log(err);
        res.send(gamer);
    });
});

app.delete("/api/gamers/:id", function (req, res) {

    const id = new objectId(req.params.id);
    const collection = req.app.locals.collection;
    collection.findOneAndDelete({ _id: id }, function (err, result) {

        if (err) return console.log(err);
        let gamer = result.value;
        res.send(gamer);
    });
});

app.put("/api/gamers", jsonParser, function (req, res) {

    if (!req.body) return res.sendStatus(400);
    const id = new objectId(req.body.id);
    const gamerName = req.body.name;
    const gamerLastName = req.body.lastname;
    const gamerAge = req.body.age;
    const gamerDiscipline = req.body.discipline;

    const collection = req.app.locals.collection;
    collection.findOneAndUpdate({ _id: id }, { $set: { name: gamerName, lastname: gamerLastName, age: gamerAge, discipline: gamerDiscipline } },
        { returnOriginal: false }, function (err, result) {

            if (err) return console.log(err);
            const gamer = result.value;
            res.send(gamer);
        });
});

// прослушиваем прерывание работы программы (ctrl-c)
process.on("SIGINT", () => {
    mydb.close();
    process.exit();
});
