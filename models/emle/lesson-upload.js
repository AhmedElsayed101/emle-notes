module.exports = (sequelize, Sequelize) => {
  const Lesson_upload = sequelize.define("lesson_upload", {
    video: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    video_time: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    free: {
      type: Sequelize.INTEGER,
    },
    arrangement: {
      type: Sequelize.STRING,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    about: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    thumbnail: {
      type: Sequelize.STRING,
    },
  });

  return Lesson_upload;
};
