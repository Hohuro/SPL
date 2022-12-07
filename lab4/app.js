const mongoose = require("mongoose");
const express = require("express");
const Schema = mongoose.Schema;
const app = express();
const jsonParser = express.json();

const gamerScheme = new Schema(
    {
        name: String,
        lastname: String,
        age: Number,
        discipline: String,
    },
    { versionKey: false }
);
const Gamer = mongoose.model("Gamer", gamerScheme);

app.use(express.static(__dirname + "/public"));

mongoose.connect("mongodb://localhost:27017/gamersdb", { useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false }, function (err) {
    if (err) return console.log(err);
    app.listen(3000, function () {
        console.log("Сервер запущено...");
    });
});

app.get("/api/gamers", function (req, res) {
    Gamer.find({}, function (err, gamers) {

        if (err) return console.log(err);
        res.send(gamers)
    });

});
app.get("/api/gamers/:id", function (req, res) {
    const id = req.params.id;
    Gamer.findOne({ _id: id }, function (err, gamers) {

        if (err) return console.log(err);
        res.send(gamers);
    });
});

app.post("/api/gamers", jsonParser, function (req, res) {

    if (!req.body) return res.sendStatus(400);

    const gamerName = req.body.name;
    const gamerLastName = req.body.lastname;
    const gamerAge = req.body.age;
    const gamerDiscipline = req.body.discipline;

    const gamer = new Gamer({ name: gamerName, lastname: gamerLastName, age: gamerAge, discipline: gamerDiscipline });

    gamer.save(function (err) {
        if (err) return console.log(err);
        res.send(gamer);
    });
});

app.delete("/api/gamers/:id", function (req, res) {
    const id = req.params.id;
    Gamer.findByIdAndDelete(id, function (err, gamer) {

        if (err) return console.log(err);
        res.send(gamer);
    });
});

app.put("/api/gamers", jsonParser, function (req, res) {

    if (!req.body) return res.sendStatus(400);
    const id = req.body.id;
    const gamerName = req.body.name;
    const gamerLastName = req.body.lastname;
    const gamerAge = req.body.age;
    const gamerDiscipline = req.body.discipline;

    const newGamer = { age: gamerAge, lastname: gamerLastName, name: gamerName, discipline: gamerDiscipline };

    Gamer.findOneAndUpdate({ _id: id }, newGamer, { new: true }, function (err, gamer) {
        if (err) return console.log(err);
        res.send(gamer);
    });
});
