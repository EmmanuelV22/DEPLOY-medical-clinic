const { sendNotificationEmail } = require("../auth/auth");
const connectDB = require("../server");

/* patient_id will be used from store loged data*/

exports.getAppointmentPatients = async (req, res, next) => {
  const patient_id = req.params.patient_id;

  const query = "SELECT * FROM agenda WHERE patient_id = ?";

  const values = [patient_id];

  connectDB.query(query, values, (error, results, fields) => {
    if (error) {
      return res
        .status(400)
        .json({ message: "Error , no hay resultados de la busqueda", error: error.message });
    }

    const agenda = results;
    return res
      .status(200)
      .json({ message: "Citas obtenidas con exito", patient_id, agenda });
  });
};

exports.getAppointmenByIdPatient = async (req, res, next) => {
  const patient_id = req.params.patient_id;

  const query = "SELECT * FROM agenda WHERE id = ?";

  const values = [patient_id];

  connectDB.query(query, values, (error, results, fields) => {
    if (error) {
      return res
        .status(400)
        .json({ message: "Error , no hay resultados de citas en la busqueda", error: error.message });
    }
    const agenda = results[0];
    return res.status(200).json({ message: "Cita obtenida con exito", agenda });
  });
};

exports.getAppointmentById = async (req, res, next) => {
  const id = req.params.id;

  const query = "SELECT * FROM agenda WHERE id = ?";

  const values = [id];

  connectDB.query(query, values, (error, results, fields) => {
    if (error) {
      return res
        .status(400)
        .json({ message: "Error, no hay resultados de la busqueda", error: error.message });
    }

    const agenda = results[0];
    return res.status(200).json({ message: "Cita obtenida con exito", agenda });
  });
};

/////////////////////////////////////////////
exports.getAllAppointment = async (req, res, next) => {
  const query = "SELECT * FROM agenda";

  connectDB.query(query, (error, results, fields) => {
    if (error) {
      return res
        .status(400)
        .json({ message: "Error obteniendo todas la citas", error: error.message });
    }

    return res
      .status(200)
      .json({ message: "Citas obtenidas con exito", results });
  });
};

/////////////////////////////

exports.createAppointment = async (req, res, next) => {
  const { date, month, year, day, time, medical_id } = req.body;
  const patient_id = req.params.id;
  const available = 0;
  const state = "confirmado";
  const query =
    "INSERT INTO agenda (date, month, year, day, time, state, patient_id, medical_id, available) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
  const values = [
    date,
    month,
    year,
    day,
    time,
    state,
    patient_id,
    medical_id,
    available,
  ];

  connectDB.query(query, values, async (error, results, fields) => {
    if (error) {
      return res
        .status(400)
        .json({ message: "Error creando cita", error: error.message });
    }

    const appointmentId = results.insertId;

    const msg = `¡Turno confirmado para el dia ${date}/${month}/${year} , a las ${time} horas. 
    Te esperamos!`;

    sendNotificationEmail(patient_id, msg, medical_id, res);

    const notificationQueryPatient =
      "INSERT INTO notifications (patient_id, medical_id, agenda_id, appointment_message_patient) VALUES (?, ?, ?, ?)";

    const notificationValuesPatient = [
      patient_id,
      medical_id,
      appointmentId,
      `¡Turno confirmado para el dia ${date}/${month}/${year} a las ${time} horas!`,
    ];

    try {
      await connectDB.query(
        notificationQueryPatient,
        notificationValuesPatient
      );
    } catch (notificationError) {
      return res.status(500).json({
        message: "Error creando cita",
        error: notificationError.message,
      });
    }

    
    const doctorNotificationQuery =
      "INSERT INTO notifications (patient_id, medical_id, agenda_id, appointment_message_employee) VALUES (?, ?, ?, ?)";

    const doctorNotificationValues = [
      patient_id,
      medical_id,
      appointmentId,
      `¡Nuevo turno agendado por el paciente ${patient_id} el dia ${date}/${month}/${year} a las ${time} horas!`,
    ];

    try {
      await connectDB.query(doctorNotificationQuery, doctorNotificationValues);

      return res.status(201).json({
        message: "Cita creada con exito",
        appointment: appointmentId,
      });
    } catch (doctorNotificationError) {
     
      return res.status(500).json({
        message: "Error creando cita",
        error: doctorNotificationError.message,
      });
    }
  });
};

////////////////////////////////////

(exports.changeAppointment = async (req, res, next) => {
  const id = req.params.id;
  const { date, month, year, day, time, medical_id, patient_id } = req.body;
  const state = "confirmado";
  const updatedAt = new Date();

  const query =
    "UPDATE agenda SET date=?, month=?, year=?, day=?, time=?, state=?, medical_id=?, patient_id=?, updatedAt=? WHERE id=?";

  const values = [
    date,
    month,
    year,
    day,
    time,
    state,
    medical_id,
    patient_id,
    updatedAt,
    id,
  ];

  connectDB.query(query, values, (error, results, fields) => {
    if (error) {
      return res
        .status(400)
        .json({ message: "Error cambiando cita", error: error });
    }
    return res
      .status(200)
      .json({ message: "Cita cambiada con exito", appointment: id });
  });
}),
  ////////////////////////////////////

  exports.deleteAppointment = async (req, res, next) => {
    const id = req.params.id;

    connectDB.beginTransaction((err) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Error eliminando cita", error: err.message });
      }

      const deleteNotificationsQuery =
        "DELETE FROM notifications WHERE agenda_id = ?";
      const notificationsValues = [id];

      connectDB.query(
        deleteNotificationsQuery,
        notificationsValues,
        (error, results, fields) => {
          if (error) {
            connectDB.rollback(() => {
              return res.status(400).json({
                message: "Error eliminando notificaciones",
                error: error.message,
              });
            });
          }

          const deleteAgendaQuery = "DELETE FROM agenda WHERE id = ?";
          const agendaValues = [id];

          connectDB.query(
            deleteAgendaQuery,
            agendaValues,
            (error, results, fields) => {
              if (error) {
                connectDB.rollback(() => {
                  return res.status(400).json({
                    message: "Error eliminando cita",
                    error: error.message,
                  });
                });
              }

              connectDB.commit((err) => {
                if (err) {
                  connectDB.rollback(() => {
                    return res.status(500).json({
                      message: "Error haciendo comentario en la bd",
                      error: err.message,
                    });
                  });
                }

                return res.status(200).json({ message: "Eliminado con exito" });
              });
            }
          );
        }
      );
    });
  };

/////////////////////////////////////////

exports.getMedicalAppointments = async (req, res, next) => {
  const medical_id = req.params.medical_id;
  const query = "SELECT * FROM agenda WHERE medical_id = ?";
  const values = [medical_id];

  connectDB.query(query, values, (error, results, fields) => {
    if (error) {
      return res
        .status(400)
        .json({ message: "Error obteniendo agenda del especialista", error: error.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "Agenda no encontrada" });
    }
    const agenda = results;
    return res.status(200).json({ message: "Agenda obtenida con exito", agenda });
  });
};

//////////////////////////////////////

exports.ConfirmationAgendaById = async (req, res, next) => {
  const appointmentId = req.params.appointmentId;
  const newState = req.body.state; 
  const query = "UPDATE agenda SET state = ? WHERE id = ?";
  const values = [newState, appointmentId];

  connectDB.query(query, values, (error, results) => {
    if (error) {
      return res.status(400).json({
        message: "Error al actualizar el estado de la cita",
        error: error.message,
      });
    }
    return res
      .status(200)
      .json({ message: "Estado de la cita actualizado con exito", results });
  });
};
