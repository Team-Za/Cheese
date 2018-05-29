const bcrypt = require('bcrypt');
module.exports = function (sequelize, Sequelize) {

    var User = sequelize.define('User', {

        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        username: {
            type: Sequelize.TEXT,
            allowNull: false,
            isUnique: true
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
            hooks: { beforeSave: (user, options) => {
                


                return new Promise((resolve, reject) => {
                    bcrypt.genSalt((saltError, salt) => {
                        if (saltError) { resolve(saltError); }
                    
                        return bcrypt.hash(user.password, salt, (hashError, hash) => {
                          if (hashError) { resolve(hashError); }
                    
                          // replace a password string with hash value
                          user.set("password", hash);
                    
                          resolve();
                        });
                      });
                }) 
            }

            }
        });
        User.associate = function(models){
            User.hasOne(models.Portfolio,{
                foreignKey: {
                    allowNull: false
                  }
            }); 
        };
        User.prototype.comparePassword = function comparePassword(password, callback) {
            bcrypt.compare(password, this.password, callback);
          };
    return User;
}