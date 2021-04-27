var bodyParser = require('body-parser')

const Joi = require('joi');             
const express = require('express');    
const app = express();                  
var path = require('path');

app.use(express.json());
app.use(express.static("public"));

let courses = [
    { id: 1, name: 'course1', code:'cse123' ,description:'electrical testing course'},
    { id: 2, name: 'course2', code:'cse412', description:'multimedia course'}
];

let students = [
    { id: 1, name: 'student1', code: '1600524'},
    { id: 2, name: 'student2', code: 'abc1234'}
];
var jsonParser = bodyParser.json()
 
var urlencodedParser = bodyParser.urlencoded({ extended: false })




app.get('/', (req, res) => {
    res.sendFile("home.html", { root: __dirname });
});

// to get all courses
app.get('/api/courses', (req, res) => {
    res.send(courses);
});
// to get all students
app.get('/api/students', (req, res) => {
    res.send(students);
});



// to get single course
app.get('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) // error 404 object not found
    {
        res.status(404).send('THe course with the given id was not found.');
        return;
    }
    res.send(course);
});

// to get single student
app.get('/api/students/:id', (req, res) => {
    const student = students.find(c => c.id === parseInt(req.params.id));
    if (!student) // error 404 object not found
    {
        res.status(404).send('THe student with the given id was not found.');
        return;
    }
    res.send(student);
});

app.get('/web/courses/create',(req, res) => {
    res.sendFile(path.join(__dirname + '/courses.html'));
});

app.get('/web/students/create',(req, res) => {
    res.sendFile(path.join(__dirname + '/students.html'));
});


// Add course
app.post('/api/courses', urlencodedParser, (req, res) => {
    // validate request
    const schema = Joi.object({
        name: Joi.string().min(5).required(),
        code: Joi.string().regex(new RegExp("^[a-zA-Z]{3}[0-9]{3}$")).required(),
        description: Joi.string().max(200)
    });
    const result = schema.validate(req.body);
    
    if (result.error) {
        res.status(400).send(result.error);
        return;
    }
    
    const course = {
        id: courses.length + 1,
        name: req.body.name,
        code:req.body.code,
        description:req.body.description
    };
    courses.push(course);
    res.send(course);
});

// Add student
app.post('/api/students', urlencodedParser, (req, res) => {
    
    const schema = Joi.object({
        name: Joi.string().regex(new RegExp("^[a-zA-Z'-]*$")).required(),
        code: Joi.string().length(7).required()
    });

    const result = schema.validate(req.body);

    if (result.error) {
        res.status(400).send(result.error);
        return;
    }

    const student = {
        id: students.length + 1,
        name: req.body.name,
        code:req.body.code,
    };
    students.push(student);
    res.send(student);
});


// Updating resources
app.put('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) 
    {
        res.status(404).send('THe course with the given id was not found.');
        return;
    }

    const schema = Joi.object({
        name: Joi.string().min(5).required(),
        code: Joi.string().regex(new RegExp("^[a-zA-Z]{3}[0-9]{3}$")).required(),
        description: Joi.string().max(200)
    });

    const result = schema.validate(req.body);

    if (result.error) {
        res.status(400).send(result.error);
        return;
    }

    // Update the course 
    // Return the updated course
    course.name = req.body.name;
    course.code = req.body.code;
    course.description = req.body.description;
    res.send(course);
});



app.put('/api/students/:id', (req, res) => {
 
    const student = students.find(c => c.id === parseInt(req.params.id));
    if (!student) 
    {
        res.status(404).send('THe student with the given id was not found.');
        return;
    }

    const schema = Joi.object({
        name: Joi.string().regex(new RegExp("^[a-zA-Z'-]*$")).required(),
        code: Joi.string().length(7).required()
    });

    const result = schema.validate(req.body);

    if (result.error) {
        res.status(400).send(result.error);
        return;
    }

    // Update the student
    // Return the updated student
    student.name = req.body.name;
    student.code = req.body.code;

    res.send(student);
});



// Deleting a course
app.delete('/api/courses/:id', (req, res) => {
  
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) 
    {
        res.status(404).send('THe course with the given id was not found.');
        return;
    }
    // Delete
    const index = courses.indexOf(course);
    courses.splice(index, 1);

    // Return the same course
    res.send(course);
});


//deleting a student
app.delete('/api/students/:id', (req, res) => {

    const student = students.find(c => c.id === parseInt(req.params.id));
    if (!student) 
    {
        res.status(404).send('THe student with the given id was not found.');
        return;
    }

    // Delete
    const index = students.indexOf(student);
    students.splice(index, 1);

    // Return the same student
    res.send(student);
});


// Environment variable
const port = process.env.port || 3000

app.listen(port , () => console.log(`Listeneing on port ${port}......`));