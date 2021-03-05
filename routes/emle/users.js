const express = require('express')
const authenticate = require('../../authenticate')
// const cors = require('./cors')
const bodyParser = require('body-parser')

const db = require("../../models/index");
const User = db.emleUsers;
const User_purchase = db.users_purchase
const User_save = db.users_save
const User_discount = db.users_discount
const Op = db.Sequelize.Op;

const userRouter = express.Router()
userRouter.use(bodyParser.json())


userRouter.post('/login', async function(req, res, next) { 

    const data = req.body
    console.log('data', data)
    if (data.email && data.password) {
        User.findOne(
            { where: { email: data.email } }
        )
        .then(user => {
            console.log('user', user)
            if(!user){
                res.status(401).json({ msg: 'No such user found', user });
            }
            user.comparePassword(data.password, (err, isMatch) => {
                if(isMatch && !err) {
                    let payload = { id: user.id };
                    const token = authenticate.getToken(payload)
                    res.json({success: true, token: 'Bearer ' + token});
                } else {
                  res.status(401).send({success: false, msg: 'Authentication failed. Wrong password.'});
                }
            })
        })
        .catch(err => {
            res.status(500).send({
                message:
                err.message || "Some error occurred while creating the Tutorial."
            });
        });
//       if (!user) {
//       }
//      if (user.password === password) {
//         // from now on we’ll identify the user by the id and the id is
//   // the only personalized value that goes into our token
//         let payload = { id: user.id };
//         const token = authenticate.getToken(payload)
//         // let token = jwt.sign(payload, jwtOptions.secretOrKey);
//         res.json({ msg: 'ok', token: token });
//       } else {
//         res.status(401).json({ msg: 'Password is incorrect' });
//       }
    }
    else {
        res.status(401).send({
            message: "Email and Password must be provided"
        });
    }
})

userRouter.post('/signup', function(req, res, next) {
    const data = req.body;
    const user = {
        name: data.name,
        email: data.email,
        password: data.password,
        university: data.university,
        grade : data.grade,
        national_id : data.national_id,
        government : data.government,
        city : data.city,
        street : data.street,
        system : data.system,
        image : data.image
    };
    
    // Save Tutorial in the database
    User.create(user)
        .then(data => {
          res.send(data);
        })
        .catch(err => {
          res.status(500).send({
            message:
              err.message || "Some error occurred while creating the Tutorial."
          });
    });

});


// userRouter.get('/logout', authenticate.verifyUser, (req ,res , next) => {
//     console.log('req.user', req.user.id)
//     if ( req.session ){
//       req.session.destroy()
//       res.clearCookie('session-id')
//       res.redirect('/')
//     }
//     else{
//       res.status(400).json({
//           "message": "You are not logged in !"
//       })
//     }
  
// })



userRouter.route('/user_purchase')
.get((req, res, next) => {

    User_purchase.findAll({})
        .then(data => {
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.json(data)
        // res.send(data);
    })
    .catch(err => {
        res.status(500).send({
            message:
            err.message || "Some error occurred while retrieving User_purchases."
        });
    });

})
.post(authenticate.verifyUser, (req, res, next) => {
    
    // Create a user_purchase
    const emleUserId = req.user.id
    const data = req.body

    const user_purchase = {
        discount_value: data.discount_value,
        date : data.date,
        type: data.type,
        purchase_price : data.orignal_price - data.discount_value,
        orignal_price : data.orignal_price,
        emleUserId : emleUserId,
        parentId : data.parentId,
        chapterId : data.chapterId
    };
    
    // Save user_purchase in the database
    User_purchase.create(user_purchase)
        .then(data => {
          res.json(data);
        })
        .catch(err => {
          res.status(500).send({
            message:
              err.message || "Some error occurred while creating the User_purchase."
          });
    });

})
.delete((req, res, next) => {
    
    User_purchase.destroy({
        where: {},
        truncate: false
      })
        .then(nums => {
          res.send({ message: `${nums} Parents were deleted successfully!` });
        })
        .catch(err => {
          res.status(500).send({
            message:
              err.message || "Some error occurred while removing all User_purchases."
          });
    });

})


userRouter.route('/user_purchase/:user_purchaseId')
.get((req, res, next) => {


    const id = req.params.user_purchaseId;

    User_purchase.findByPk(id)
        .then(data => {
            if(data){
                res.json(data);
            }
            else{
                res.status(404).json({
                    error : 'User_purchase ' + id + ' not found'
                })
            }
            
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving User_purchase with id=" + id
        });
    });

})
.put(authenticate.verifyUser, (req, res, next) => {

    const id = req.params.user_purchaseId;
    const data = req.body
    const emleUserId = req.user.id

    const user_purchase = {
        discount_value: data.discount_value,
        date : data.date,
        type: data.type,
        purchase_price : data.orignal_price - data.discount_value,
        orignal_price : data.orignal_price,
        emleUserId : emleUserId,
        parentId : data.parentId,
        chapterId : data.chapterId
    };

    User_purchase.update(user_purchase, {
        where: { id: id }
      })
        .then(num => {
          if (num == 1) {
            res.send({
              message: "User_purchase was updated successfully."
            });
          } else {
            res.send({
              message: `Cannot update User_purchase with id=${id}. Maybe User_purchase was not found or req.body is empty!`
            });
          }
        })
        .catch(err => {
          res.status(500).send({
            message: "Error updating User_purchase with id=" + id
          });
    });

})
.delete((req, res, next) => {

    const id = req.params.user_purchaseId;

    User_purchase.destroy({
        where: { id: id }
      })
        .then(num => {
          if (num == 1) {
            res.send({
              message: "User_purchase was deleted successfully!"
            });
          } else {
            res.send({
              message: `Cannot delete User_purchase with id=${id}. Maybe User_purchase was not found!`
            });
          }
        })
        .catch(err => {
          res.status(500).send({
            message: "Could not delete User_purchase with id=" + id
          });
    });


})



userRouter.route('/user_save')
.get((req, res, next) => {

    User_save.findAll({})
        .then(data => {
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.json(data)
        // res.send(data);
    })
    .catch(err => {
        res.status(500).send({
            message:
            err.message || "Some error occurred while retrieving User_saves."
        });
    });

})
.post(authenticate.verifyUser, (req, res, next) => {
    
    // Create a user_purchase
    const emleUserId = req.user.id
    const data = req.body

    const user_save = {
        discount_value: data.discount_value,
        date : data.date,
        type: data.type,
        emleUserId : emleUserId,
        parentId : data.parentId,
        chapterId : data.chapterId
    };    
      // Save user_purchase in the database
    User_save.create(user_save)
      .then(data => {
        res.json(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the User_save."
        });
    });

})
.delete((req, res, next) => {
    
    User_save.destroy({
        where: {},
        truncate: false
      })
        .then(nums => {
          res.send({ message: `${nums} User_saves were deleted successfully!` });
        })
        .catch(err => {
          res.status(500).send({
            message:
              err.message || "Some error occurred while removing all User_saves."
          });
    });

})


userRouter.route('/user_save/:user_saveId')
.get((req, res, next) => {


    const id = req.params.user_saveId;

    User_save.findByPk(id)
        .then(data => {
            if(data){
                res.json(data);
            }
            else{
                res.status(404).json({
                    error : 'User_save ' + id + ' not found'
                })
            }
            
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving User_save with id=" + id
        });
    });

})
.put(authenticate.verifyUser, (req, res, next) => {

    const id = req.params.user_saveId;
    const data = req.body
    const emleUserId = req.user.id

    const user_save = {
        discount_value: data.discount_value,
        date : data.date,
        type: data.type,
        emleUserId : emleUserId,
        parentId : data.parentId,
        chapterId : data.chapterId
    };

    User_save.update(user_save, {
        where: { id: id }
      })
        .then(num => {
          if (num == 1) {
            res.send({
              message: "User_save was updated successfully."
            });
          } else {
            res.send({
              message: `Cannot update User_save with id=${id}. Maybe User_save was not found or req.body is empty!`
            });
          }
        })
        .catch(err => {
          res.status(500).send({
            message: "Error updating User_save with id=" + id
          });
    });

})
.delete((req, res, next) => {

    const id = req.params.user_saveId;

    User_save.destroy({
        where: { id: id }
      })
        .then(num => {
          if (num == 1) {
            res.send({
              message: "User_save was deleted successfully!"
            });
          } else {
            res.send({
              message: `Cannot delete User_save with id=${id}. Maybe User_save was not found!`
            });
          }
        })
        .catch(err => {
          res.status(500).send({
            message: "Could not delete User_save with id=" + id
          });
    });


})

userRouter.route('/user_discount')
.get((req, res, next) => {

    User_discount.findAll({})
        .then(data => {
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.json(data)
        // res.send(data);
    })
    .catch(err => {
        res.status(500).send({
            message:
            err.message || "Some error occurred while retrieving User_discounts."
        });
    });

})
.post(authenticate.verifyUser, (req, res, next) => {
 
    const data = req.body

    const user_discount = {
        chapterId: data.chapterId,
        date : data.date,
        discount_value: data.discount_value,
    };    
      // Save user_purchase in the database
      User_discount.create(user_discount)
        .then(data => {
          res.json(data);
        })
        .catch(err => {
          res.status(500).send({
            message:
              err.message || "Some error occurred while creating the User_discount."
          });
    });

})
.delete((req, res, next) => {
    
    User_discount.destroy({
        where: {},
        truncate: false
      })
        .then(nums => {
          res.send({ message: `${nums} User_discounts were deleted successfully!` });
        })
        .catch(err => {
          res.status(500).send({
            message:
              err.message || "Some error occurred while removing all User_discounts."
          });
    });

})


userRouter.route('/user_discount/:user_discountId')
.get((req, res, next) => {


    const id = req.params.user_discountId;

    User_discount.findByPk(id)
        .then(data => {
            if(data){
                res.json(data);
            }
            else{
                res.status(404).json({
                    error : 'User_discount ' + id + ' not found'
                })
            }
            
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving User_discount with id=" + id
        });
    });

})
.put((req, res, next) => {

    const id = req.params.user_discountIdId;
    const data = req.body

    const user_discount = {
        chapterId: data.chapterId,
        date : data.date,
        discount_value: data.discount_value,
    };

    User_discount.update(user_discount, {
        where: { id: id }
      })
        .then(num => {
          if (num == 1) {
            res.send({
              message: "User_discount was updated successfully."
            });
          } else {
            res.send({
              message: `Cannot update User_discount with id=${id}. Maybe User_discount was not found or req.body is empty!`
            });
          }
        })
        .catch(err => {
          res.status(500).send({
            message: "Error updating User_discount with id=" + id
          });
    });

})
.delete((req, res, next) => {

    const id = req.params.user_discountId;

    User_discount.destroy({
        where: { id: id }
      })
        .then(num => {
          if (num == 1) {
            res.send({
              message: "User_discount was deleted successfully!"
            });
          } else {
            res.send({
              message: `Cannot delete User_discount with id=${id}. Maybe User_discount was not found!`
            });
          }
        })
        .catch(err => {
          res.status(500).send({
            message: "Could not delete User_discount with id=" + id
          });
    });


})

module.exports = userRouter