/**
 * This model is for storing logs of all stations assigned in all rooms.
 */
const { DataTypes } = require('sequelize');

// We export a function that defines the model.
// This function will automatically receive as parameter the Sequelize connection object.
module.exports = (sequelize) => {
  sequelize.define('telemetrystationlog', {
    // Station Assignment ID
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.STRING,
    },
    // Telemetry Session ID (FK)
    session_id: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    // Room ID it was assigned to (FK)
    room_id: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    // The name of the station that was assigned
    station_name: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    // Time the station was assigned to the room
    start_time: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    // Time the station was unassigned from the room (is the time completed, if it was completed)
    end_time: {
      allowNull: true,
      type: DataTypes.DATE,
    },
    // True if the station was completed AKA considered "Passed", if false, it means the task was "Failed"
    completed: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  });
};
