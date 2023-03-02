/**
 * This model is for storing logs of all telemetry errors thrown in different rooms.
 */
const { DataTypes } = require('sequelize');

// We export a function that defines the model.
// This function will automatically receive as parameter the Sequelize connection object.
module.exports = (sequelize) => {
  sequelize.define('telemetryerrorlog', {
    // Error session ID (PK)
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    // ID of the room where the error was thrown (FK)
    room_id: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    // Time the error log was added to the database
    create_time: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    // Time the error was thrown
    start_time: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    // Time the error stopped (is the time resolved, if it was resolved)
    end_time: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    // True if the error was resolved, false if not
    resolved: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  });
};
