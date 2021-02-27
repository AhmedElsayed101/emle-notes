module.exports = (sequelize, Sequelize) => {
  const User_discount = sequelize.define("user_discount", {
    discount_value: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
    },
    type: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  });

  return Tutorial;
};
