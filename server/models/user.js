module.exports = function (sequelize, Sequelize) {

    var User = sequelize.define('User', {

        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        username: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        email: {
            type: Sequelize.TEXT,
            validate: {
                isEmail: true
            }
        },
        password: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        status: {
            type: Sequelize.ENUM('active', 'inactive'),
            defaultValue: 'active'
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
          }
    },
        {
            timestamps: true,
        });
        User.associate = function(models){
            User.hasOne(models.Portfolio,{
                foreignKey: {
                    allowNull: false
                  }
            }); 
        };
    return User;
}