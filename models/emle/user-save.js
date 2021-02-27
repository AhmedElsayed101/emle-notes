module.exports = (sequelize, Sequelize) => {
  const User_save = sequelize.define("user_save", {
    date: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    type: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  });

  return Tutorial;
};
