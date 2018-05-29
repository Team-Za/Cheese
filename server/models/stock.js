
module.exports = function (sequelize, Sequelize) {
  const Stock = sequelize.define("Stock", {
    id: {
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    name: {
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
    quantity: {
      type: Sequelize.INTEGER,
      allowNull: false,
      validate: {
        len: [1]
      }
    },
    symbol:{
      type: Sequelize.TEXT,
      allowNull: false,
      validate: {
        len: [1, 50]
      }
    },
    imageLink:{
      type: Sequelize.TEXT,
      allowNull: false,
      validate: {
        len: [1]
      }
    },
    price:{
      type: Sequelize.DECIMAL(10,2),
      allowNull: false,
      validate: {
        min:0
      }
    }
  },
    {
      timestamps: true,
    });
  Stock.associate = function (models) {
    Stock.belongsTo(models.Portfolio, {
      foreignKey: {
        allowNull: false
      }
    });
  };
  return Stock;
};
