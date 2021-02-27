const express = require('express')
// const authenticate = require('../authenticate')
// const cors = require('./cors')
const bodyParser = require('body-parser')


const db = require("../models/index");
const Tag = db.tags;
const Tutorial = db.tutorials

const Op = db.Sequelize.Op;

const TagRouter = express.Router()
TagRouter.use(bodyParser.json())



// const amidala = await User.create({ username: 'p4dm3', points: 1000 });
// const queen = await Profile.create({ name: 'Queen' });
// await amidala.addProfile(queen, { through: { selfGranted: false } });
// const result = await User.findOne({
//   where: { username: 'p4dm3' },
//   include: Profile
// });
// console.log(result);


TagRouter.route('/')
.get((req, res, next) => {

    const name = req.query.name;
    var condition = name ? { name: { [Op.like]: `%${name}%` } } : null;

    Tag.findAll(

        {
          include: [
            {
              model: Tutorial,
              as: "tutorials",
              attributes: ["id", "title", "description"],
              through: {
                attributes: [],
              }
            },
          ],
        }
      
      )
        .then(data => {
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.json(data)
        // res.send(data);
    })
    .catch(err => {
        res.status(500).send({
            message:
            err.message || "Some error occurred while retrieving tags."
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
    
      // Create a Tag
    

    const tag = {
        name: req.body.name,
    };
    
      // Save Tag in the database
    Tag.create(tag)
        .then(data => {
          res.send(data);
        })
        .catch(err => {
          res.status(500).send({
            message:
              err.message || "Some error occurred while creating the Tag."
          });
    });

})
.delete((req, res, next) => {
    
    Tag.destroy({
        where: {},
        truncate: false
      })
        .then(nums => {
          res.send({ message: `${nums} Tags were deleted successfully!` });
        })
        .catch(err => {
          res.status(500).send({
            message:
              err.message || "Some error occurred while removing all tags."
          });
    });

})



TagRouter.route('/:tagId')
.get((req, res, next) => {


    const id = req.params.tagId;

    Tag.findByPk(id)
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
                message: "Error retrieving Tag with id=" + id
        });
    });

})
.put((req, res, next) => {

    const id = req.params.tagId;

    const tag = {
        name: req.body.name,
    };

    Tag.update(tag, {
        where: { id: id }
      })
        .then(num => {
          if (num == 1) {
            res.send({
              message: "Tag was updated successfully."
            });
          } else {
            res.send({
              message: `Cannot update Tag with id=${tagId}. Maybe Tag was not found or req.body is empty!`
            });
          }
        })
        .catch(err => {
          res.status(500).send({
            message: "Error updating Tag with id=" + id
          });
    });

})
.delete((req, res, next) => {

    const id = req.params.tagId;

    Tag.destroy({
        where: { id: id }
      })
        .then(num => {
          if (num == 1) {
            res.send({
              message: "Tag was deleted successfully!"
            });
          } else {
            res.send({
              message: `Cannot delete Tag with id=${id}. Maybe Tag was not found!`
            });
          }
        })
        .catch(err => {
          res.status(500).send({
            message: "Could not delete Tag with id=" + id
          });
    });


})