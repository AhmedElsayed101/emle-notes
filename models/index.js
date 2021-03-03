const dbConfig = require("../config/db-config");

const Sequelize = require("sequelize");
// const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD,
//     {
//       host: dbConfig.HOST,
//       dialect: dbConfig.dialect,
//       operatorsAliases: "0",

//       pool: {
//         max: dbConfig.pool.max,
//         min: dbConfig.pool.min,
//         acquire: dbConfig.pool.acquire,
//         idle: dbConfig.pool.idle,
//       },
//       logging: false
//     }
// );

const DATABASE_URL = process.env.DATABASE_URL
// const DATABASE = process.env.DATABASE
// const HOST = process.env.HOST
// const USER = process.env.USER
// const PASSWORD = process.env.PASSWORD

const sequelize = new Sequelize(
  DATABASE_URL,
  {
    url: process.env.DATABASE_URL,
    dialect: 'postgres',
    "dialectOptions": {
      ssl: {
        require: true,
        rejectUnauthorized: false // <<<<<<< YOU NEED THIS
      }
    },
    pool: {
      max: dbConfig.pool.max,
      min: dbConfig.pool.min,
      acquire: dbConfig.pool.acquire,
      idle: dbConfig.pool.idle,
    },
    logging: false
  }
);



// const DATABASE_URL = 'postgres://localhost:5432/YOUR_DB_NAME'


const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// db.tutorials = require("./tutorial.js")(sequelize, Sequelize);
// db.comments = require("./comment.js")(sequelize, Sequelize);
// db.tags = require("./tag.js")(sequelize, Sequelize);
// db.users = require("./user.js")(sequelize, Sequelize);
db.emleUsers = require("./emle/user")(sequelize, Sequelize);
db.users_purchase = require("./emle/user-purchase")(sequelize, Sequelize);
db.users_save = require("./emle/user-save")(sequelize, Sequelize);
db.users_discount = require("./emle/user-discount")(sequelize, Sequelize);
db.parents = require("./emle/parent")(sequelize, Sequelize);
db.crr_chapters = require("./emle/ccr-chapter")(sequelize, Sequelize);
db.chapters = require("./emle/chapter")(sequelize, Sequelize);
db.chapters_discount = require("./emle/chapter-discount")(sequelize, Sequelize);
db.crr_topics = require("./emle/crr-topic")(sequelize, Sequelize);
db.lesson_uploads = require("./emle/lesson-upload")(sequelize, Sequelize);

//  parent >> crr_chapter
db.parents.hasMany(db.crr_chapters, { as: "crr_chapters" });
db.crr_chapters.belongsTo(db.parents, {
  foreignKey: "parentId",
  as: "parent",
});

// crr_chapter >>> chapter
db.crr_chapters.hasMany(db.chapters, { as: "chapters" });
db.chapters.belongsTo(db.crr_chapters, {
  foreignKey: "crrChapterId",
  as: "crr_chapter",
});

// crr_chapter >>> crr_topic
db.crr_chapters.hasMany(db.crr_topics, { as: "crr_topics" });
db.crr_topics.belongsTo(db.crr_chapters, {
  foreignKey: "crrChapterId",
  as: "crr_chapter",
});

// chapter >>> crr_topic
db.chapters.hasMany(db.crr_topics, { as: "crr_topics" });
db.crr_topics.belongsTo(db.chapters, {
  foreignKey: "chapterId",
  as: "chapter",
});

// chapter >>> lesson
db.chapters.hasMany(db.lesson_uploads, { as: "lesson_uploads" });
db.lesson_uploads.belongsTo(db.chapters, {
  foreignKey: "chapterId",
  as: "chapter",
});

// crr_topic >>> lesson
db.crr_topics.hasMany(db.lesson_uploads, { as: "lesson_uploads" });
db.lesson_uploads.belongsTo(db.crr_topics, {
  foreignKey: "crrTopicId",
  as: "crr_topic",
});

// chapter >> chapters_discount
db.chapters.hasMany(db.chapters_discount, { as: "chapters_discount" });
db.chapters_discount.belongsTo(db.chapters, {
  foreignKey: "chapterId",
  as: "chapter",
});

// chapter >>> user_discount
db.chapters.hasMany(db.users_discount, { as: "users_discount" });
db.users_discount.belongsTo(db.chapters, {
  foreignKey: "chapterId",
  as: "chapter",
});

// parent >>> user_purchase
db.parents.hasMany(db.users_purchase, { as: "users_purchase" });
db.users_purchase.belongsTo(db.parents, {
  foreignKey: "parentId",
  as: "parent",
});

// user >>> user_purchase
db.emleUsers.hasMany(db.users_purchase, { as: "users_purchase" });
db.users_purchase.belongsTo(db.emleUsers, {
  foreignKey: "emleUserId",
  as: "emleUser",
});

// chapter >>> user_purchase
db.chapters.hasMany(db.users_purchase, { as: "users_purchase" });
db.users_purchase.belongsTo(db.chapters, {
  foreignKey: "chapterId",
  as: "chapter",
});

// parent >>> user_save
db.parents.hasMany(db.users_save, { as: "users_save" });
db.users_save.belongsTo(db.parents, {
  foreignKey: "parentId",
  as: "parent",
});

// user >>> user_save
db.emleUsers.hasMany(db.users_save, { as: "users_save" });
db.users_save.belongsTo(db.emleUsers, {
  foreignKey: "emleUserId",
  as: "emleUser",
});

// user >>> chapter
db.emleUsers.hasMany(db.chapters, { as: "chapters" });
db.chapters.belongsTo(db.emleUsers, {
  foreignKey: "emleUserId",
  as: "emleUser",
});

// chapter >>> user_save
db.chapters.hasMany(db.users_save, { as: "users_save" });
db.users_save.belongsTo(db.chapters, {
  foreignKey: "chapterId",
  as: "chapter",
});

// db.tutorials.hasMany(db.comments, { as: "comments" });
// db.comments.belongsTo(db.tutorials, {
//   foreignKey: "tutorialId",
//   as: "tutorial",
// });

// db.tags.belongsToMany(db.tutorials, {
//   through: "tutorial_tag",
//   as: "tutorials",
//   foreignKey: "tag_id",
// });

// db.tutorials.belongsToMany(db.tags, {
//   through: "tutorial_tag",
//   as: "tags",
//   foreignKey: "tutorial_id",
// });

module.exports = db;
