const express = require('express')
// const authenticate = require('../authenticate')
// const cors = require('./cors')
const bodyParser = require('body-parser')


const db = require("../models/index");
const Tutorial = db.tutorials;
const Op = db.Sequelize.Op;
const Comment = db.comments


const tutorialRouter = express.Router()
tutorialRouter.use(bodyParser.json())

tutorialRouter.route('/')
.get((req, res, next) => {

    const title = req.query.title;
    var condition = title ? { title: { [Op.like]: `%${title}%` } } : null;

    Tutorial.findAll({ where: condition })
        .then(data => {
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.json(data)
        // res.send(data);
    })
    .catch(err => {
        res.status(500).send({
            message:
            err.message || "Some error occurred while retrieving tutorials."
        });
    });

})
.post((req, res, next) => {
    
    // if (!req.body.title) {
    //     res.status(400).send({
    //       message: "Content can not be empty!"
    //     });
    //     return;
    // }
    
      // Create a Tutorial
    const tutorial = {
        title: req.body.title,
        description: req.body.description,
        published: req.body.published ? req.body.published : false
    };
    
      // Save Tutorial in the database
    Tutorial.create(tutorial)
        .then(data => {
          res.send(data);
        })
        .catch(err => {
          res.status(500).send({
            message:
              err.message || "Some error occurred while creating the Tutorial."
          });
    });

})
.delete((req, res, next) => {
    
    Tutorial.destroy({
        where: {},
        truncate: false
      })
        .then(nums => {
          res.send({ message: `${nums} Tutorials were deleted successfully!` });
        })
        .catch(err => {
          res.status(500).send({
            message:
              err.message || "Some error occurred while removing all tutorials."
          });
    });

})


tutorialRouter.route('/:tutorialId')
.get((req, res, next) => {


    const id = req.params.tutorialId;

    Tutorial.findByPk(id)
        .then(data => {
            if(data){
                res.send(data);
            }
            else{
                // err = new Error('Dish ' + id + ' not found');
                // err.status = 404;
                res.status(404).json({
                    error : 'Dish ' + id + ' not found'
                })
            }
            
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Tutorial with id=" + id
        });
    });

})
.put((req, res, next) => {

    const id = req.params.tutorialId;
    Tutorial.update(req.body, {
        where: { id: id }
      })
        .then(num => {
          if (num == 1) {
            res.send({
              message: "Tutorial was updated successfully."
            });
          } else {
            res.send({
              message: `Cannot update Tutorial with id=${tutorialId}. Maybe Tutorial was not found or req.body is empty!`
            });
          }
        })
        .catch(err => {
          res.status(500).send({
            message: "Error updating Tutorial with id=" + id
          });
    });

})
.delete((req, res, next) => {

    const id = req.params.tutorialId;

    Tutorial.destroy({
        where: { id: id }
      })
        .then(num => {
          if (num == 1) {
            res.send({
              message: "Tutorial was deleted successfully!"
            });
          } else {
            res.send({
              message: `Cannot delete Tutorial with id=${id}. Maybe Tutorial was not found!`
            });
          }
        })
        .catch(err => {
          res.status(500).send({
            message: "Could not delete Tutorial with id=" + id
          });
    });


})


tutorialRouter.route('/:tutorialId/comments')
.get((req, res, next) => {
  const tutorialId = req.params.tutorialId

  // request_body = req.body
  Tutorial.findByPk(tutorialId, { include: ["comments"] })
    .then((tutorial) => {
      res.send(tutorial);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Tutorial with id=" + id,
        error : err.message
      });
      
      console.log(">> Error while finding tutorial: ", err);
  });




})
.post((req, res, next) => {
  const tutorialId = req.params.tutorialId
  const comment = req.body

  Comment.create({
    name: comment.name,
    text: comment.text,
    tutorialId: tutorialId,
  })
    .then((comment) => {
      console.log(">> Created comment: " + JSON.stringify(comment, null, 4));
      res.send(comment);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error while creating comment " + err,
        error : err.message
      });
      console.log(">> Error while creating comment: ", err);
    });


})
.delete((req, res, next) => {

  const tutorialId = req.params.tutorialId
  Comment.destroy({
    where: {tutorialId : tutorialId},
    truncate: false
  })
  .then(nums => {
    res.send({ message: `${nums} Comments were deleted successfully!` });
  })
  .catch(err => {
    res.status(500).send({
      message:
        err.message || "Some error occurred while removing all Comments."
    });
  });

})


tutorialRouter.route('/:tutorialId/comments/:commentId')
.get((req, res, next) => {
  const tutorialId = req.params.tutorialId
  const commentId = req.params.commentId

  console.log('commentId', commentId)
  Comment.findOne({
      where : {
        id : commentId,
        tutorialId : tutorialId
      }
    })
    .then(data => {
        if(data){
            res.send(data);
        }
        else{
            // err = new Error('Dish ' + id + ' not found');
            // err.status = 404;
            res.status(404).json({
                error : 'Comment ' + commentId + ' not found'
            })
        }
        
    })
    .catch(err => {
        res.status(500).send({
            message: "Error retrieving Tutorial with id=" + commentId
    });
  });


})
.put((req, res, next) => {
  const tutorialId = req.params.tutorialId
  const commentId = req.params.commentId

  console.log('commentId', commentId)

  Comment.update(req.body, {
    where: {
      id: commentId,
      tutorialId
    }
  })
  .then(num => {
    if (num == 1) {
      res.send({
        message: "Tutorial was updated successfully."
      });
    } else {
      res.send({
        message: `Cannot update Tutorial with id=${tutorialId}. Maybe Tutorial was not found or req.body is empty!`
      });
    }
  })
  .catch(err => {
    res.status(500).send({
      message: "Error updating Tutorial with id=" + id
    });
});



})
.delete((req, res, next) => {
  const tutorialId = req.params.tutorialId
  const commentId = req.params.commentId


  Comment.destroy({
      where: {
        id: commentId,
        tutorialId : tutorialId
      }
    })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Comment was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Comment with id=${id}. Maybe Tutorial was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Comment with id=" + id
      });
  });

})

// tutorialRouter.route('/new')


module.exports = tutorialRouter