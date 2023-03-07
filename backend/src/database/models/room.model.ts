import { DataTypes } from 'sequelize';

// We export a function that defines the model.
// This function will automatically receive as parameter the Sequelize connection object.
const room = (sequelize: any): void => {
  sequelize.define('room', {
    // The following specification of the 'id' attribute could be omitted
    // since it is the default.
    name: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    session_id: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    users: {
      allowNull: false,
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    stationName: {
      allowNull: false,
      type: DataTypes.STRING,
      defaultValue: '',
    },
    // Station Log ID (FK)
    station_id: {
      allowNull: false,
      type: DataTypes.STRING,
      defaultValue: '',
    },
  });
};

export default room;
