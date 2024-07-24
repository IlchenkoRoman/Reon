const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path'); 

const { Task, initializeDatabase } = require('./db');

const app = express();
const PORT = 3000;
app.use(express.static(path.join(__dirname, './')));

initializeDatabase();

app.use(cors());
app.use(bodyParser.json());

app.get('/api/tasks', async (req, res) => {
    const tasks = await Task.findAll();
    res.json(tasks);
});

app.post('/api/tasks', async (req, res) => {
    const newTask = await Task.create(req.body);
    res.status(201).json(newTask);
});

app.put('/api/tasks/:id', async (req, res) => {
    const taskId = parseInt(req.params.id, 10);
    const updatedData = req.body;
    const task = await Task.findByPk(taskId);
    if (task) {
        await task.update(updatedData);
        res.status(200).json(task);
    } else {
        res.status(404).json({ message: 'Task not found' });
    }
});

app.delete('/api/tasks/:id', async (req, res) => {
    const taskId = parseInt(req.params.id, 10);
    const task = await Task.findByPk(taskId);
    if (task) {
        await task.destroy();
        res.status(204).send();
    } else {
        res.status(404).json({ message: 'Task not found' });
    }
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});