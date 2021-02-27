module.exports = (sequelize, Sequelize) => {
  const Chapter = sequelize.define("chapter", {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    price: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
    },
    about: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    objective: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    state: {
      type: Sequelize.STRING,
    },
    image : {
        type : Sequelize.STRING
    },
    rate : {
        type : Sequelize.INTEGER
    },
    date : {
        type : Sequelize.DATE
    }
  });

  return Tutorial;
};
