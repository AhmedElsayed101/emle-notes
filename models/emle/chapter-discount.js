module.exports = (sequelize, Sequelize) => {
  const Chapter_discount = sequelize.define("chapter_discount", {
    discount_value: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
    },
    type: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    date: {
      type: Sequelize.DATE,
    },
  });

  return Chapter_discount;
};
