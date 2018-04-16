module.exports = function (sequelize, Sequelize) {

    var User = sequelize.define('User', {

        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        username: {
            type: Sequelize.TEXT
        },

        email: {
            type: Sequelize.STRING,
            validate: {
                isEmail: true
            }
        },

        password: {
            type: Sequelize.STRING,
            allowNull: false
        },

        status: {
            type: Sequelize.ENUM('active', 'inactive'),
            defaultValue: 'active'
        },
        createdAt: {
            type:Sequelize.DATE,
            defaultValue: Sequelize.NOW
          },
          updatedAt: {
            type:Sequelize.DATE,
            defaultValue: Sequelize.NOW
          },
    },
    {
        timestamps: true,
    });
    return User;
}