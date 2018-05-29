module.exports = function (sequelize, Sequelize) {
  const Portfolio = sequelize.define("Portfolio", {
    id: {
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    userName: {
      type: Sequelize.TEXT,
      allowNull: false,
      validate: {
        len: [1, 50]
      }
    },
    'createdAt': {
      type: Sequelize.DATE(3),
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP(3)')
    },
    'updatedAt': {
      type: Sequelize.DATE(3),
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP(3)')
    },
    balance:{
      type: Sequelize.DECIMAL(10,2),
      allowNull: false,
      defaultValue: 10000,
      validate: {
        min:0
      }
    }
  },
    {
      timestamps: true,
    });
  Portfolio.associate = function (models) {
    Portfolio.hasMany(models.Stock, {
      foreignKey: {
        allowNull: false
      }
    });
    Portfolio.belongsTo(models.User, {
      foreignKey: {
        allowNull: false
      }
    });
  }
  return Portfolio;
};
