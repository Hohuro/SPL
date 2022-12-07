const mongoose = require("mongoose");
const express = require("express");
const Schema = mongoose.Schema;
const app = express();
const jsonParser = express.json();

const {
    MONGO_DB_HOSTNAME,
    MONGO_DB_PORT,
    MONGO_DB
} = process.env

const options = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false
}

const url = `mongodb://${MONGO_DB_HOSTNAME}:${MONGO_DB_PORT}/${MONGO_DB}`;

const studentScheme = new Schema(
    {
        name: String,
        lastname: String,
        age: Number,
        group: String,
    },
    { versionKey: false }
);


const Student = mongoose.model("Student", studentScheme);

app.use(express.static(__dirname + "/public"));

mongoose.connect(url, options, function (err) {
    if (err) return console.log(err);
    app.listen(3000, function () {
        console.log("Сервер запущено...");
    });
});

app.get("/api/students", function (req, res) {
    Student.find({}, function (err, students) {

        if (err) return console.log(err);
        res.send(students)
    });

});
app.get("/api/students/:id", function (req, res) {
    const id = req.params.id;
    Student.findOne({ _id: id }, function (err, students) {

        if (err) return console.log(err);
        res.send(students);
    });
});

app.post("/api/students", jsonParser, function (req, res) {

    if (!req.body) return res.sendStatus(400);

    const studentName = req.body.name;
    const studentLastName = req.body.lastname;
    const studentAge = req.body.age;
    const studentGroup = req.body.group;

    const student = new Student({ name: studentName, lastname: studentLastName, age: studentAge, group: studentGroup });

    student.save(function (err) {
        if (err) return console.log(err);
        res.send(student);
    });
});

app.delete("/api/students/:id", function (req, res) {
    const id = req.params.id;
    Student.findByIdAndDelete(id, function (err, student) {

        if (err) return console.log(err);
        res.send(student);
    });
});

app.put("/api/students", jsonParser, function (req, res) {

    if (!req.body) return res.sendStatus(400);
    const id = req.body.id;
    const studentName = req.body.name;
    const studentLastName = req.body.lastname;
    const studentAge = req.body.age;
    const studentGroup = req.body.group;

    const newStudent = { age: studentAge, lastname: studentLastName, name: studentName, group: studentGroup };

    Student.findOneAndUpdate({ _id: id }, newStudent, { new: true }, function (err, student) {
        if (err) return console.log(err);
        res.send(student);
    });
});
