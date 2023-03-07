import { DataTypes } from 'sequelize';
// We export a function that defines the model.
// This function will automatically receive as parameter the Sequelize connection object.
const simulationfailure = (sequelize: any): void => {
  sequelize.define('simulationfailure', {
    // The following specification of the 'id' attribute could be omitted
    // since it is the default.
    room: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    started_at: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    o2_error: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    pump_error: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    power_error: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    fan_error: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    o2_error_id: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    pump_error_id: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    power_error_id: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    fan_error_id: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    // o2_error_start: {
    //     allowNull: false,
    //     type: DataTypes.STRING,
    //     defaultValue: ''
    // },
    // pump_error_start: {
    //     allowNull: false,
    //     type: DataTypes.STRING,
    //     defaultValue: ''
    // },
    // power_error_start: {
    //     allowNull: false,
    //     type: DataTypes.STRING,
    //     defaultValue: ''
    // },
    // fan_error_start: {
    //     allowNull: false,
    //     type: DataTypes.STRING,
    //     defaultValue: ''
    // },
    // o2_error_end: {
    //     allowNull: false,
    //     type: DataTypes.STRING,
    //     defaultValue: ''
    // },
    // pump_error_end: {
    //     allowNull: false,
    //     type: DataTypes.STRING,
    //     defaultValue: ''
    // },
    // power_error_end: {
    //     allowNull: false,
    //     type: DataTypes.STRING,
    //     defaultValue: ''
    // },
    // fan_error_end: {
    //     allowNull: false,
    //     type: DataTypes.STRING,
    //     defaultValue: ''
    // }
  });
};

export default simulationfailure;
