var con = require("./connections");
const mysql = require('mysql');
const express = require('express');
const bodyparser = require('body-parser');
var app = express();
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

// Establishing the server connection
const port = process.env.PORT || 8080;
app.listen(port, () => console.log('Listening to port ${port}..'));

//Router to INSERT/POST a appointment detail
// THERE ARE TWO PART , THE NEW BOOKING 
app.post('/appointment_new', (req, res) => {
  try {
    const name = req.body.name;
    const gender = req.body.gender;
    const address = req.body.address;
    const number = req.body.number;
    const id = req.body.id;
    //  inserting into patient database
    con.query('INSERT INTO patient(Name,gender,address,phone_number) VALUES(?,?,?,?)', [name, gender, address, number], (err, rows) => {
      if (err) {
        console.log(err);
      }
      else {
        checkAvailability(id, function (err, data) {
          if (err) {
            console.log(err);
          }
          else {
            availability = data;
            if (availability == true) {
              getPatientId(function (err, data) {
                if (err) {
                  console.log(err);
                }
                else {
                  patient_id = data;
                  bookAppointment(id, patient_id);
                  // IF AN APPOINTMENT IS BOOKED THEN THE SCHEDULE OF THAT DOCTOR IS CHANGED
                  availabiltyStatus(id, function (err, data) {
                    if (err) {
                      console.log(err);
                    }
                    else {
                      var count = data;
                      updateSchedule(id, data);
                      if (count >= 2) {
                        changeStatus(id);
                      }
                    }
                  })
                }
              });
            }
            else {
              console.log("FULL!");
              res.send('yes');
            }

          }
        });

      }
    });

  }
  catch (err) {
    console.log(err);
  }

});
function checkAvailability(id, callback) {
  con.query('SELECT available from Doctor_Details WHERE Doctor_id= ?', [id], function (err, result, fields) {
    if (err) {
      callback(null, err);
    }
    else {
      var value = result[0].available;
      callback(null, value);
    }
  });
}
// TO GET PATIENT ID
function getPatientId(callback) {
  con.query('SELECT last_insert_id() as last from patient;', function (err, result, fields) {
    if (err) {
      console.log(err);
      callback(null, err);
    }
    else {
      var value = result[0].last;
      callback(null, value);
    }
  });
}
// TO BOOK APPOINTMENT
function bookAppointment(id, patient_id) {
  availabiltyStatus(id, function (err, data) {
    if (err) {
      console.log(err);
    }
    else {
      var count = data;
      let time = ['4:00am', '5:00am', '6:00am'];
      con.query('INSERT INTO appointment(Patient_id,Doctor_id,Appointment_time,Appointment_date) VALUES(?,?,?,CURDATE())', [patient_id, id, time[count]], (err, rows) => {
        if (err) {
          console.log(err);
        }
        else {
          console.log("YOUR APPOINTMENT IS SUCCESSFUL");
          // alert('YOUR APPOINTMENT IS SUCCESSFUL');
        }
      });
    }
  })
}
// To GET THE NUMBER OF PATIENT THE DOCTOR IS SEEING TODAY 
function availabiltyStatus(id, callback) {
  con.query('SELECT COUNT(Doctor_id) as Number FROM appointment WHERE Doctor_id =?', [id], function (err, result, fields) {
    if (err) {
      callback(null, err);
    }
    else {
      callback(null, result[0].Number);
    }
  });
}
// Changing the status to false 
function changeStatus(id) {
  con.query('UPDATE Doctor_Details SET available = FALSE WHERE Doctor_id = ?', [id], (err, rows) => {
    if (err) {
      console.log(err);
    }
  });
}

// SCHEDULE UPDATE FOR APPOINTED DOCTOR
function updateSchedule(id, count) {
  var time = ['4:00am,', '5:00am,', '6:00am'];
  var stringTime = '';
  if (count != 2) {
    for (let i = count+1; i < time.length; i++) {
      stringTime += time[i];
    }
  }
  else {
    stringTime = null;
  }
  con.query('UPDATE Schedule SET available_time = ? WHERE Doctors_id = ?', [stringTime, id], (err, rows) => {
    if (err) {
      console.log(err);
    }
    else {
      console.log("SUCCESSFULLY UPDATED!");
    }
  });
}
// SECOND PART FOR OLD USER
app.post('/appointment_old', (req, res) => {
  const patient_id = req.body.patient;
  const doctor_id = req.body.id;

  try {
    checkAvailability(doctor_id, function (err, data) {
      if (err) {
        console.log(err);
      }
      else {
        availability = data;
        if (availability == true) {
          bookAppointment(doctor_id, patient_id);
          availabiltyStatus(doctor_id, function (err, data) {
            if (err) {
              console.log(err);
            }
            else {
              var count = data;
              updateSchedule(doctor_id, count);
              if (count >= 2) {
                changeStatus(doctor_id);
              }
            }
          });
        }
        else {
          console.log("FULL!");
        }

      }
    });


  }
  catch (err) {
    console.log(err);
  }
});


// FOR DOCTOR SCHEDULE
// IT'S A ROUTE TO RETRIEVE SCHEDULE DATA FROM THE DATABASE
app.get('/schedule', (req, res) => {
  const id = req.body.schedule_id;
  console.log(id);
  try {
    con.query('SELECT * FROM schedule WHERE Doctors_id =?', [id], function (error, results, fields) {
      if (error) {
        console.log(error);
      }
      else {
        console.log(results);
        // res.send(result);
        res.json(results);
      }

    });
  }
  catch (error) {
    console.log(error);
  }
});

// FOR PATIENT RECORDS
app.get('/patient_records',(req,res)=>{
  const patient_id = req.body.__;
  con.query('SELECT * FROM patient WHERE Patient_id =?',[patient_id],function(error,result,fields){
    if(error){
      console.log(error);
    }
    else{
      var object = results;
      con.query('SELECT Appointment_time,Appointment_date FROM appointment WHERE Patient_id =?',[id],function(error,result,fields){
        if(error){
          console.log(error);
        }
        else{
          var appointment_object = results;
        }
      });
    }
  });

});




