const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Puneeth@1234',
  database: 'hostel_management'
});

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Connected to database');
});

const validateRequestBody = (requiredFields, body) => {
  for (const field of requiredFields) {
    if (!body[field]) {
      return `Field ${field} is required`;
    }
  }
  return null;
};

// Student form submission
app.post('/submit-student-form', (req, res) => {
  const { student_id, name, email, contact_number, warden_id, room_id, block_id, mess_id } = req.body;
  const validationError = validateRequestBody(['student_id', 'name', 'email', 'contact_number', 'warden_id', 'room_id', 'block_id', 'mess_id'], req.body);

  if (validationError) {
    return res.status(400).send(validationError);
  }

  const checkWardenSql = 'SELECT * FROM warden WHERE warden_id = ?';
  db.query(checkWardenSql, [warden_id], (err, wardenResults) => {
    if (err) {
      return res.status(500).send(`Error checking warden: ${err.message}`);
    }

    if (wardenResults.length === 0) {
      return res.status(400).send(`Warden ID ${warden_id} does not exist in warden table`);
    }

    const checkRoomSql = 'SELECT * FROM rooms WHERE room_id = ?';
    db.query(checkRoomSql, [room_id], (err, roomResults) => {
      if (err) {
        return res.status(500).send(`Error checking room: ${err.message}`);
      }

      if (roomResults.length === 0) {
        return res.status(400).send(`Room ID ${room_id} does not exist in rooms table`);
      }

      const checkBlockSql = 'SELECT * FROM block WHERE block_id = ?';
      db.query(checkBlockSql, [block_id], (err, blockResults) => {
        if (err) {
          return res.status(500).send(`Error checking block: ${err.message}`);
        }

        if (blockResults.length === 0) {
          return res.status(400).send(`Block ID ${block_id} does not exist in block table`);
        }

        const checkMessSql = 'SELECT * FROM mess WHERE mess_id = ?';
        db.query(checkMessSql, [mess_id], (err, messResults) => {
          if (err) {
            return res.status(500).send(`Error checking mess: ${err.message}`);
          }

          if (messResults.length === 0) {
            return res.status(400).send(`Mess ID ${mess_id} does not exist in mess table`);
          }

          const insertStudentSql = 'INSERT INTO student (student_id, name, email, contact_number, warden_id, room_id, block_id, mess_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
          db.query(insertStudentSql, [student_id, name, email, contact_number, warden_id, room_id, block_id, mess_id], (err, result) => {
            if (err) {
              return res.status(500).send(`Error inserting data: ${err.message}`);
            }
            console.log('Data Submitted');
            return res.redirect('http://127.0.0.1:5000/StudentPage.html');
          });
        });
      });
    });
  });
});

// Warden form submission
app.post('/submit-warden-form', (req, res) => {
  const { warden_id, name, age, block_incharge } = req.body;
  const validationError = validateRequestBody(['warden_id', 'name', 'age', 'block_incharge'], req.body);

  if (validationError) {
    return res.status(400).send(validationError);
  }

  const sql = 'INSERT INTO warden (warden_id, name, age, block_incharge) VALUES (?, ?, ?, ?)';
  db.query(sql, [warden_id, name, age, block_incharge], (err, result) => {
    if (err) {
      return res.status(500).send(`Error inserting data: ${err.message}`);
    }
    console.log('Data Submitted');
    return res.redirect('http://127.0.0.1:5000/WardenPage.html');
  });
});

// Room form submission
app.post('/submit-room-form', (req, res) => {
  const { room_id, room_no, type, capacity, cleaning_incharge } = req.body;
  const validationError = validateRequestBody(['room_id', 'room_no', 'type', 'capacity', 'cleaning_incharge'], req.body);

  if (validationError) {
    return res.status(400).send(validationError);
  }

  const sql = 'INSERT INTO rooms (room_id, room_no, type, capacity, cleaning_incharge) VALUES (?, ?, ?, ?, ?)';
  db.query(sql, [room_id, room_no, type, capacity, cleaning_incharge], (err, result) => {
    if (err) {
      return res.status(500).send(`Error inserting data: ${err.message}`);
    }
    console.log('Data Submitted');
    return res.redirect('http://127.0.0.1:5000/RoomPage.html');
  });
});

// Mess form submission
app.post('/submit-mess-form', (req, res) => {
  const { mess_id, mess_name, floor_number } = req.body;
  const validationError = validateRequestBody(['mess_id', 'mess_name', 'floor_number'], req.body);

  if (validationError) {
    return res.status(400).send(validationError);
  }

  const sql = 'INSERT INTO mess (mess_id, mess_name, floor_number) VALUES (?, ?, ?)';
  db.query(sql, [mess_id, mess_name, floor_number], (err, result) => {
    if (err) {
      return res.status(500).send(`Error inserting data: ${err.message}`);
    }
    console.log('Data Submitted');
    return res.redirect('http://127.0.0.1:5000/MessPage.html');
  });
});

// Block form submission
app.post('/submit-block-form', (req, res) => {
  const { block_id, block_name, warden_name } = req.body;
  const validationError = validateRequestBody(['block_id', 'block_name', 'warden_name'], req.body);

  if (validationError) {
    return res.status(400).send(validationError);
  }

  const sql = 'INSERT INTO block (block_id, block_name, warden_name) VALUES (?, ?, ?)';
  db.query(sql, [block_id, block_name, warden_name], (err, result) => {
    if (err) {
      return res.status(500).send(`Error inserting data: ${err.message}`);
    }
    console.log('Data Submitted');
    return res.redirect('http://127.0.0.1:5000/BlockPage.html');
  });
});

// Serve static files
app.use(express.static(path.join(__dirname)));

// API endpoints to get, update, and delete students
app.get('/students', (req, res) => {
  const query = 'SELECT * FROM student';
  db.query(query, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

app.put('/students/:id', (req, res) => {
  const studentId = req.params.id;
  const { name, email, contact_number, warden_id, room_id, block_id, mess_id } = req.body;
  const sql = 'UPDATE student SET name = ?, email = ?, contact_number = ?, warden_id = ?, room_id = ?, block_id = ?, mess_id = ? WHERE student_id = ?';
  const values = [name, email, contact_number, warden_id, room_id, block_id, mess_id, studentId];

  db.query(sql, values, (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json({ message: 'Student updated successfully.' });
    }
  });
});

app.delete('/students/:id', (req, res) => {
  const studentId = req.params.id;
  const deleteQuery = 'DELETE FROM student WHERE student_id = ?';
  db.query(deleteQuery, [studentId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: `Error deleting student: ${err.message}` });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json({ message: 'Student deleted successfully' });
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log('Please use frontend');
});
