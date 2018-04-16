
module.exports = function(sequelize, Sequelize) {
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
      createdAt: {
        type:Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        type:Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      quantity:{
        type: Sequelize.INTEGER,
        allowNull: false,
    }
    },
    {
        timestamps: true,
    });
    Stock.associate = function(models){
        Stock.belongsTo(models.Portfolio,{
            foreignKey: {
                allowNull: false
              }
        });
    };
    return Stock;
  };
  