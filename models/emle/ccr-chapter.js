module.exports = (sequelize, Sequelize) => {
  const Crr_chapter = sequelize.define("crr_chapter", {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    image: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  });

  return Tutorial;
};
