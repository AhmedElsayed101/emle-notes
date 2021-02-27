module.exports = (sequelize, Sequelize) => {
  const User_purchase = sequelize.define("user_purchase", {
    discount_value: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
    },
    date: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    type: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    purchase_price: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
    },
    orignal_price: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
    },
  });

  return Tutorial;
};
