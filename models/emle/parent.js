module.exports = (sequelize, Sequelize) => {
  const Parent = sequelize.define("parent", {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    nature: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    type: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  });

  return Parent;
};
