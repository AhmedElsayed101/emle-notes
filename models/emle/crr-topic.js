module.exports = (sequelize, Sequelize) => {
    const Crr_topic = sequelize.define("crr_topic", {
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      qr_code: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    });
  
    return Crr_topic;
  };
  