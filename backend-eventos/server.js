const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "eventos_comunitarios",
});

db.connect((err) => {
  if (err) {
    console.log("Error conexión MySQL:", err);
  } else {
    console.log("MySQL conectado");
  }
});


// ====================================
// OBTENER EVENTOS
// ====================================

app.get("/api/eventos", (req, res) => {

  const sql = "SELECT * FROM eventos";

  db.query(sql, (err, results) => {

    if (err) {
      console.log(err);
      res.status(500).json({
        mensaje: "Error obteniendo eventos",
      });
    } else {
      res.json(results);
    }

  });

});


// ====================================
// CREAR EVENTO
// ====================================

app.post("/api/eventos", (req, res) => {
  const {
    titulo,
    descripcion,
    fecha,
    hora,
    ubicacion,
    imagen,
    organizador_id,
  } = req.body;

  const sql = `
    INSERT INTO eventos
    (titulo, descripcion, fecha, hora, ubicacion, imagen, organizador_id)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      titulo,
      descripcion,
      fecha,
      hora,
      ubicacion,
      imagen,
      organizador_id,
    ],
    (err, result) => {
      if (err) {
        console.log(err);

        res.status(500).json({
          mensaje: "Error creando evento",
        });
      } else {
        res.json({
          mensaje: "Evento creado correctamente",
          id: result.insertId,
        });
      }
    }
  );
});


// ====================================


// ACTUALIZAR EVENTO
app.put("/api/eventos/:id", (req, res) => {
  const { id } = req.params;
  const { titulo, descripcion, fecha, hora, ubicacion, imagen } = req.body;

  const sql = `
    UPDATE eventos 
    SET titulo = ?, descripcion = ?, fecha = ?, hora = ?, ubicacion = ?, imagen = ?
    WHERE id = ?
  `;

  db.query(
    sql,
    [titulo, descripcion, fecha, hora, ubicacion, imagen, id],
    (err) => {
      if (err) {
        console.log(err);
        res.status(500).json({ mensaje: "Error actualizando evento" });
      } else {
        res.json({ mensaje: "Evento actualizado correctamente" });
      }
    }
  );
});

// ELIMINAR EVENTO
app.delete("/api/eventos/:id", (req, res) => {
  const { id } = req.params;

  const eliminarComentarios = "DELETE FROM comentarios WHERE evento_id = ?";
  const eliminarCalificaciones = "DELETE FROM calificaciones WHERE evento_id = ?";
  const eliminarParticipaciones = "DELETE FROM participaciones WHERE evento_id = ?";
  const eliminarEvento = "DELETE FROM eventos WHERE id = ?";

  db.query(eliminarComentarios, [id], (err) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ mensaje: "Error eliminando comentarios" });
    }

    db.query(eliminarCalificaciones, [id], (err) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ mensaje: "Error eliminando calificaciones" });
      }

      db.query(eliminarParticipaciones, [id], (err) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ mensaje: "Error eliminando participaciones" });
        }

        db.query(eliminarEvento, [id], (err) => {
          if (err) {
            console.log(err);
            return res.status(500).json({ mensaje: "Error eliminando evento" });
          }

          res.json({ mensaje: "Evento eliminado correctamente" });
        });
      });
    });
  });
});


// INSCRIBIR USUARIO A EVENTO
app.post("/api/participaciones", (req, res) => {
  const { usuario_id, evento_id } = req.body;

  const verificarSql = `
    SELECT * FROM participaciones 
    WHERE usuario_id = ? AND evento_id = ?
  `;

  db.query(verificarSql, [usuario_id, evento_id], (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ mensaje: "Error verificando inscripción" });
    }

    if (results.length > 0) {
      return res.status(400).json({ mensaje: "Ya estás inscrito en este evento" });
    }

    const insertarSql = `
      INSERT INTO participaciones (usuario_id, evento_id, estado)
      VALUES (?, ?, 'asistira')
    `;

    db.query(insertarSql, [usuario_id, evento_id], (err) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ mensaje: "Error registrando inscripción" });
      }

      res.json({ mensaje: "Inscripción realizada correctamente" });
    });
  });
});

app.post("/api/login", (req, res) => {
  const { correo, password } = req.body;

  const sql = `
    SELECT id, nombre, correo, rol 
    FROM usuarios 
    WHERE correo = ? AND password = ?
  `;

  db.query(sql, [correo, password], (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ mensaje: "Error en el servidor" });
    }

    if (results.length === 0) {
      return res.status(401).json({ mensaje: "Correo o contraseña incorrectos" });
    }

    res.json({
      mensaje: "Login correcto",
      usuario: results[0],
    });
  });
});

// OBTENER EVENTOS INSCRITOS POR USUARIO
app.get("/api/participaciones/usuario/:usuario_id", (req, res) => {
  const { usuario_id } = req.params;

  const sql = `
    SELECT 
      e.*,
      p.id AS participacion_id,
      p.estado
    FROM participaciones p
    INNER JOIN eventos e ON p.evento_id = e.id
    WHERE p.usuario_id = ?
    ORDER BY e.fecha DESC, e.hora DESC
  `;

  db.query(sql, [usuario_id], (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ mensaje: "Error obteniendo eventos inscritos" });
    }

    res.json(results);
  });
});

// GUARDAR COMENTARIO
app.post("/api/comentarios", (req, res) => {
  const { usuario_id, evento_id, comentario } = req.body;

  const verificarSql = `
    SELECT * FROM comentarios
    WHERE usuario_id = ? AND evento_id = ?
  `;

  db.query(verificarSql, [usuario_id, evento_id], (err, results) => {
    if (err) {
      return res.status(500).json({ mensaje: "Error verificando comentario" });
    }

    if (results.length > 0) {
      return res.status(400).json({
        mensaje: "Ya realizaste un comentario para este evento"
      });
    }

    const sql = `
      INSERT INTO comentarios (usuario_id, evento_id, comentario)
      VALUES (?, ?, ?)
    `;

    db.query(sql, [usuario_id, evento_id, comentario], (err) => {
      if (err) {
        return res.status(500).json({ mensaje: "Error guardando comentario" });
      }

      res.json({ mensaje: "Comentario guardado correctamente" });
    });
  });
});

// GUARDAR CALIFICACIÓN
app.post("/api/calificaciones", (req, res) => {
  const { usuario_id, evento_id, puntuacion } = req.body;

  const verificarSql = `
    SELECT * FROM calificaciones
    WHERE usuario_id = ? AND evento_id = ?
  `;

  db.query(verificarSql, [usuario_id, evento_id], (err, results) => {
    if (err) {
      return res.status(500).json({ mensaje: "Error verificando calificación" });
    }

    if (results.length > 0) {
      return res.status(400).json({
        mensaje: "Ya calificaste este evento",
      });
    }

    const sql = `
      INSERT INTO calificaciones (usuario_id, evento_id, puntuacion)
      VALUES (?, ?, ?)
    `;

    db.query(sql, [usuario_id, evento_id, puntuacion], (err) => {
      if (err) {
        return res.status(500).json({ mensaje: "Error guardando calificación" });
      }

      res.json({ mensaje: "Calificación guardada correctamente" });
    });
  });
});
// OBTENER EVENTOS PASADOS
app.get("/api/eventos-pasados", (req, res) => {
  const sql = `
    SELECT *
    FROM eventos
    WHERE TIMESTAMP(fecha, hora) < NOW()
    ORDER BY fecha DESC, hora DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.log("Error eventos pasados:", err);
      return res.status(500).json({
        mensaje: "Error obteniendo eventos pasados",
      });
    }

    console.log("Eventos pasados encontrados:", results);
    res.json(results);
  });
});

// REGISTRAR USUARIO
app.post("/api/register", (req, res) => {
  const { nombre, correo, password } = req.body;

  if (!nombre || !correo || !password) {
    return res.status(400).json({
      mensaje: "Todos los campos son obligatorios",
    });
  }

  const verificarSql = `
    SELECT * FROM usuarios
    WHERE correo = ?
  `;

  db.query(verificarSql, [correo], (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        mensaje: "Error verificando usuario",
      });
    }

    if (results.length > 0) {
      return res.status(400).json({
        mensaje: "El correo ya está registrado",
      });
    }

    const insertarSql = `
      INSERT INTO usuarios (nombre, correo, password, rol)
      VALUES (?, ?, ?, 'usuario')
    `;

    db.query(insertarSql, [nombre, correo, password], (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          mensaje: "Error registrando usuario",
        });
      }

      res.json({
        mensaje: "Usuario registrado correctamente",
        usuarioId: result.insertId,
      });
    });
  });
});

// DASHBOARD ADMIN
app.get("/api/dashboard", (req, res) => {

  const dashboard = {};

  // TOTAL EVENTOS
  db.query(
    "SELECT COUNT(*) AS totalEventos FROM eventos",
    (err, eventosResult) => {

      if (err) {
        console.log(err);
        return res.status(500).json({
          mensaje: "Error obteniendo eventos",
        });
      }

      dashboard.totalEventos = eventosResult[0].totalEventos;

      // TOTAL USUARIOS
      db.query(
        "SELECT COUNT(*) AS totalUsuarios FROM usuarios",
        (err, usuariosResult) => {

          if (err) {
            console.log(err);
            return res.status(500).json({
              mensaje: "Error obteniendo usuarios",
            });
          }

          dashboard.totalUsuarios = usuariosResult[0].totalUsuarios;

          // TOTAL INSCRIPCIONES
          db.query(
            "SELECT COUNT(*) AS totalInscripciones FROM participaciones",
            (err, participacionesResult) => {

              if (err) {
                console.log(err);
                return res.status(500).json({
                  mensaje: "Error obteniendo participaciones",
                });
              }

              dashboard.totalInscripciones =
                participacionesResult[0].totalInscripciones;

              // EVENTOS PASADOS
              db.query(
                `
                SELECT COUNT(*) AS eventosPasados
                FROM eventos
                WHERE TIMESTAMP(fecha, hora) < NOW()
                `,
                (err, pasadosResult) => {

                  if (err) {
                    console.log(err);
                    return res.status(500).json({
                      mensaje: "Error obteniendo eventos pasados",
                    });
                  }

                  dashboard.eventosPasados =
                    pasadosResult[0].eventosPasados;

                  // EVENTO MÁS POPULAR
                  db.query(
                    `
                    SELECT e.titulo, COUNT(p.id) AS inscritos
                    FROM eventos e
                    LEFT JOIN participaciones p
                    ON e.id = p.evento_id
                    GROUP BY e.id
                    ORDER BY inscritos DESC
                    LIMIT 1
                    `,
                    (err, popularResult) => {

                      if (err) {
                        console.log(err);
                        return res.status(500).json({
                          mensaje: "Error obteniendo evento popular",
                        });
                      }

                      dashboard.eventoPopular =
                        popularResult.length > 0
                          ? popularResult[0]
                          : null;

                      res.json(dashboard);
                    }
                  );
                }
              );
            }
          );
        }
      );
    }
  );
});

// OBTENER COMENTARIOS Y CALIFICACIONES POR EVENTO
app.get("/api/eventos/:id/opiniones", (req, res) => {
  const { id } = req.params;

  const sqlComentarios = `
    SELECT 
      c.id,
      c.comentario,
      c.fecha_comentario,
      u.nombre AS usuario
    FROM comentarios c
    INNER JOIN usuarios u ON c.usuario_id = u.id
    WHERE c.evento_id = ?
    ORDER BY c.fecha_comentario DESC
  `;

  const sqlPromedio = `
    SELECT AVG(puntuacion) AS promedio, COUNT(*) AS totalCalificaciones
    FROM calificaciones
    WHERE evento_id = ?
  `;

  db.query(sqlComentarios, [id], (err, comentarios) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ mensaje: "Error obteniendo comentarios" });
    }

    db.query(sqlPromedio, [id], (err, calificaciones) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ mensaje: "Error obteniendo calificaciones" });
      }

      res.json({
        comentarios,
        promedio: calificaciones[0].promedio || 0,
        totalCalificaciones: calificaciones[0].totalCalificaciones || 0,
      });
    });
  });
});

// OBTENER TODAS LAS OPINIONES PARA ADMIN
app.get("/api/admin/opiniones", (req, res) => {
  const sql = `
    SELECT 
      c.id AS comentario_id,
      u.nombre AS usuario,
      e.titulo AS evento,
      c.comentario,
      cal.puntuacion,
      c.fecha_comentario
    FROM comentarios c
    INNER JOIN usuarios u ON c.usuario_id = u.id
    INNER JOIN eventos e ON c.evento_id = e.id
    LEFT JOIN calificaciones cal 
      ON cal.usuario_id = c.usuario_id 
      AND cal.evento_id = c.evento_id
    ORDER BY c.fecha_comentario DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        mensaje: "Error obteniendo opiniones",
      });
    }

    res.json(results);
  });
});
app.listen(3000, () => {
  console.log("Servidor corriendo en puerto 3000");
});