module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("user", {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    university: {
      type: Sequelize.STRING,
    },
    grade: {
      type: Sequelize.STRING,
    },
    national_id: {
      type: Sequelize.STRING,
    },
    government: {
      type: Sequelize.STRING,
    },
    city: {
      type: Sequelize.STRING,
    },
    street: {
      type: Sequelize.STRING,
    },
    system: {
      type: Sequelize.STRING,
    },
    image: {
      type: Sequelize.STRING,
    },
  });

  return Tutorial;
};
