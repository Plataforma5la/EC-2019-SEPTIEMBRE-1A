const S = require("sequelize");
const db = require("../config/db");

class Review extends S.Model {}
Review.init(
  {
    title: {
      type: S.STRING,
      allowNull: false
    },
    content: S.TEXT,
    estrellas: {
      type: S.INTEGER
    },
    autor: {
      type: S.TEXT,
      defaultValue: "Anónimo"
    }
  },
  { sequelize: db, modelName: "review" }
);

module.exports = Review;
