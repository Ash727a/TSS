/**
 * This model is for storing logs of all telemetry sessions "START" and "STOP" in all rooms.
 */
const { DataTypes } = require('sequelize');

// We export a function that defines the model.
// This function will automatically receive as parameter the Sequelize connection object.
module.exports = (sequelize) => {
  sequelize.define('telemetrysessionlog', {
    // Telemetry session ID (PK)
    session_id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.STRING,
    },
    // Room ID it was assigned to (FK)
    room_id: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    // Time the telemetry session was started AKA "START" button was pressed
    start_time: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    // Time the telemetry session was stopped AKA "STOP" button was pressed
    end_time: {
      allowNull: true,
      type: DataTypes.DATE,
    },
  });
};
