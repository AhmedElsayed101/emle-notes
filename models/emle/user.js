const bcrypt = require('bcrypt-nodejs');


module.exports = (sequelize, Sequelize) => {
  const Emle_user = sequelize.define("emle_user", {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
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
  Emle_user.beforeSave((user, options) => {
    if (user.changed('password')) {
      user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10), null);
    }
  });
  Emle_user.prototype.comparePassword = function (passw, cb) {
    bcrypt.compare(passw, this.password, function (err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
  }
  return Emle_user;
};
