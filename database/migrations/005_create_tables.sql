CREATE TABLE IF NOT EXISTS mesas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    numero INT NOT NULL UNIQUE,
    capacidad INT NOT NULL DEFAULT 4,
    ubicacion VARCHAR(100),
    estado ENUM('libre', 'ocupada', 'reservada') DEFAULT 'libre'
);
