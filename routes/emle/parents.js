const express = require('express')
const authenticate = require('../../authenticate')
// const cors = require('./cors')
const bodyParser = require('body-parser')


const db = require("../../models/index");

const Parent = db.parents;
const Crr_chapter = db.crr_chapters
const Chapter = db.chapters
const Crr_topic = db.crr_topics
const Lesson = db.lesson_uploads
const Chapter_discount = db.chapters_discount

const Op = db.Sequelize.Op;

const parentRouter = express.Router()
parentRouter.use(bodyParser.json())

parentRouter.route('/')
.get((req, res, next) => {

    Parent.findAll({})
        .then(data => {
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.json(data)
        // res.send(data);
    })
    .catch(err => {
        res.status(500).send({
            message:
            err.message || "Some error occurred while retrieving parents."
        });
    });

})
.post((req, res, next) => {
    
    // Create a Parent
    const data = req.body

    const parent = {
        name: data.name,
        nature : data.nature,
        type: data.type 
    };
    
      // Save Parent in the database
    Parent.create(parent)
        .then(data => {
          res.json(data);
        })
        .catch(err => {
          res.status(500).send({
            message:
              err.message || "Some error occurred while creating the Parent."
          });
    });

})
.delete((req, res, next) => {
    
    Parent.destroy({
        where: {},
        truncate: false
      })
        .then(nums => {
          res.send({ message: `${nums} Parents were deleted successfully!` });
        })
        .catch(err => {
          res.status(500).send({
            message:
              err.message || "Some error occurred while removing all parents."
          });
    });

})


parentRouter.route('/:parentId')
.get((req, res, next) => {


    const id = req.params.parentId;

    Parent.findByPk(id)
        .then(data => {
            if(data){
                res.json(data);
            }
            else{
                // err = new Error('Dish ' + id + ' not found');
                // err.status = 404;
                res.status(404).json({
                    error : 'Parent ' + id + ' not found'
                })
            }
            
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Parent with id=" + id
        });
    });

})
.put((req, res, next) => {

    const id = req.params.parentId;
    const data = req.body

    Parent.update(data, {
        where: { id: id }
      })
        .then(num => {
          if (num == 1) {
            res.send({
              message: "Parent was updated successfully."
            });
          } else {
            res.send({
              message: `Cannot update Parent with id=${parentId}. Maybe Parent was not found or req.body is empty!`
            });
          }
        })
        .catch(err => {
          res.status(500).send({
            message: "Error updating Parent with id=" + id
          });
    });

})
.delete((req, res, next) => {

    const id = req.params.parentId;

    Parent.destroy({
        where: { id: id }
      })
        .then(num => {
          if (num == 1) {
            res.send({
              message: "Parent was deleted successfully!"
            });
          } else {
            res.send({
              message: `Cannot delete Parent with id=${id}. Maybe Parent was not found!`
            });
          }
        })
        .catch(err => {
          res.status(500).send({
            message: "Could not delete Parent with id=" + id
          });
    });


})


// crr_chapters

parentRouter.route('/:parentId/crr_chapters')
.get((req, res, next) => {
  const parentId = req.params.parentId
  // console.log('parentId', parentId)
  // request_body = req.body
  Parent.findByPk(parentId, { include: ["crr_chapters"] })
    .then((parent) => {
      if(parent){
        // console.log('parent', parent)
        res.json(parent);
      }
      else{
        res.status(404).json({
          "message" : `Parent ${parentId} not found`
        })
      }
      
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Crr_chapter with id=" + id,
        error : err.message
    });
      
    res.status(500).json(">> Error while finding parent: ");
  });




})
.post((req, res, next) => {
  const parentId = req.params.parentId
  const data = req.body

  Crr_chapter.create({
    name: data.name,
    image: data.image,
    parentId: parentId,
  })
    .then((crr_chapter) => {
      // console.log(">> Created crr_chapter: " + JSON.stringify(crr_chapter, null, 4));
      res.send(crr_chapter);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error while creating crr_chapter " + err,
        error : err.message
      });
      // console.log(">> Error while creating crr_chapter: ", err);
    });


})
.delete((req, res, next) => {

  const parentId = req.params.parentId
  Crr_chapter.destroy({
    where: {parentId : parentId},
    truncate: false
  })
  .then(nums => {
    res.send({ message: `${nums} Crr_chapters were deleted successfully!` });
  })
  .catch(err => {
    res.status(500).send({
      message:
        err.message || "Some error occurred while removing all Crr_chapters."
    });
  });

})


parentRouter.route('/:parentId/crr_chapters/:crr_chapterId')
.get((req, res, next) => {
  const parentId = req.params.parentId
  const crr_chapterId = req.params.crr_chapterId

  console.log('crr_chapterId', crr_chapterId)
  Crr_chapter.findOne({
      where : {
        id : crr_chapterId,
        parentId : parentId
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
                error : 'Crr_chapter ' + crr_chapterId + ' not found'
            })
        }
        
    })
    .catch(err => {
        res.status(500).send({
            message: "Error retrieving Crr_chapter with id=" + crr_chapterId
    });
  });


})
.put((req, res, next) => {
  const parentId = req.params.parentId
  const crr_chapterId = req.params.crr_chapterId

  // console.log('crr_chapterId', crr_chapterId)
  const data = req.body
  const crr_chapter = {
    name: data.name,
    image: data.image,
    parentId: parentId,
  }

  Crr_chapter.update(crr_chapter, {
    where: {
      id: crr_chapterId,
      parentId
    }
  })
  .then(num => {
    if (num == 1) {
      res.send({
        message: "Crr_chapter was updated successfully."
      });
    } else {
      res.send({
        message: `Cannot update Crr_chapter with id=${parentId}. Maybe Crr_chapter was not found or req.body is empty!`
      });
    }
  })
  .catch(err => {
    res.status(500).send({
      message: "Error updating Crr_chapter with id=" + id
    });
});



})
.delete((req, res, next) => {
  const parentId = req.params.parentId
  const crr_chapterId = req.params.crr_chapterId

  Crr_chapter.destroy({
      where: {
        id: crr_chapterId,
        parentId : parentId
      }
    })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Crr_chapter was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Crr_chapter with id=${id}. Maybe Crr_chapter was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Crr_chapter with id=" + id
      });
  });

})



// chapters

parentRouter.route('/:parentId/crr_chapters/:crr_chapterId/chapters')
.get((req, res, next) => {

  const parentId = req.params.parentId
  const crr_chapterId = req.params.crr_chapterId
  // console.log('parentId', parentId)
  // request_body = req.body
  // Parent.findOne({
  //   where: {
  //     id : parentId
  //   },
  //     include: [{
  //       model: Crr_chapter,
  //       as : "crr_chapters",
  //       include: [{
  //         model : Chapter,
  //         as : "chapters"
  //       }]
  //     }]
  //   })
  Crr_chapter.findOne({
    where: {
      id : crr_chapterId,
      parentId : parentId
    },
      include: [{
        model: Chapter,
        as : "chapters",
      }]
    })
    .then((parent) => {
      if(parent){
        // console.log('parent', parent)
        res.json(parent);
      }
      else{
        res.status(404).json({
          "message" : `Parent ${parentId} not found`
        })
      }
      
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Crr_chapter with id=" + parentId,
        error : err.message
    });
      
    res.status(500).json(">> Error while finding parent: ");
  });




})
.post(authenticate.verifyUser, (req, res, next) => {
  const parentId = req.params.parentId
  const crr_chapterId = req.params.crr_chapterId
  const emleUserId = req.user.id

  const data = req.body

  Chapter.create({
    name: data.name,
    price: data.price,
    about: data.about,
    objective : data.objective,
    state : data.state,
    image : data.image,
    rate : data.rate,
    date : data.date,
    crrChapterId : crr_chapterId,
    emleUserId : emleUserId
  })
    .then((crr_chapter) => {
      // console.log(">> Created crr_chapter: " + JSON.stringify(crr_chapter, null, 4));
      res.send(crr_chapter);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error while creating crr_chapter " + err,
        error : err.message
      });
      // console.log(">> Error while creating crr_chapter: ", err);
    });


})
.delete((req, res, next) => {

  const parentId = req.params.parentId
  const crr_chapterId = req.params.crr_chapterId
  Chapter.destroy({
    where: {crrChapterId : crr_chapterId},
    truncate: false
  })
  .then(nums => {
    res.send({ message: `${nums} Crr_chapters were deleted successfully!` });
  })
  .catch(err => {
    res.status(500).send({
      message:
        err.message || "Some error occurred while removing all Crr_chapters."
    });
  });

})


parentRouter.route('/:parentId/crr_chapters/:crr_chapterId/chapters/:chapaterId')
.get((req, res, next) => {

  const parentId = req.params.parentId
  const crr_chapterId = req.params.crr_chapterId
  const chapaterId = req.params.chapaterId


  console.log('crr_chapterId', crr_chapterId)
  Chapter.findOne({
      where : {
        id : chapaterId,
        crrChapterId : crr_chapterId
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
                error : 'Crr_chapter ' + crr_chapterId + ' not found'
            })
        }
        
    })
    .catch(err => {
        res.status(500).send({
            message: "Error retrieving Crr_chapter with id=" + crr_chapterId
    });
  });


})
.put(authenticate.verifyUser, (req, res, next) => {

  const chapaterId = req.params.chapaterId
  const crr_chapterId = req.params.crr_chapterId
  const emleUserId = req.user.id

  // console.log('crr_chapterId', crr_chapterId)
  const data = req.body
  const crr_chapter = {
    name: data.name,
    price: data.price,
    about: data.about,
    objective : data.objective,
    state : data.state,
    image : data.image,
    rate : data.rate,
    date : data.date,
    crrChapterId : crr_chapterId,
    emleUserId : emleUserId
  }

  Chapter.update(crr_chapter, {
    where: {
      id : chapaterId,
      crrChapterId : crr_chapterId
    }
  })
  .then(num => {
    if (num == 1) {
      res.send({
        message: "Crr_chapter was updated successfully."
      });
    } else {
      res.send({
        message: `Cannot update Crr_chapter with id=${parentId}. Maybe Crr_chapter was not found or req.body is empty!`
      });
    }
  })
  .catch(err => {
    res.status(500).send({
      message: "Error updating Crr_chapter with id=" + id
    });
});



})
.delete((req, res, next) => {
  const chapaterId = req.params.chapaterId
  const crr_chapterId = req.params.crr_chapterId

  Chapter.destroy({
      where: {
        id : chapaterId,
        crrChapterId : crr_chapterId
      }
    })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Crr_chapter was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Crr_chapter with id=${id}. Maybe Crr_chapter was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Crr_chapter with id=" + id
      });
  });

})


// crr_topics


parentRouter.route('/crr_chapters/:crr_chapterId/chapters/:chapterId/crr_topics')
.get((req, res, next) => {

  const chapterId = req.params.chapterId
  const crr_chapterId = req.params.crr_chapterId
  // console.log('parentId', parentId)
  // request_body = req.body
  // Parent.findOne({
  //   where: {
  //     id : parentId
  //   },
  //     include: [{
  //       model: Crr_chapter,
  //       as : "crr_chapters",
  //       include: [{
  //         model : Chapter,
  //         as : "chapters"
  //       }]
  //     }]
  //   })
  Chapter.findOne({
    where: {
      id : chapterId,
      crrChapterId : crr_chapterId
    },
      include: [{
        model: Crr_topic,
        as : "crr_topics",
      }]
    })
    .then((parent) => {
      if(parent){
        // console.log('parent', parent)
        res.json(parent);
      }
      else{
        res.status(404).json({
          "message" : `Parent ${parentId} not found`
        })
      }
      
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Crr_chapter with id=" + chapterId,
        error : err.message
    });
      
    res.status(500).json(">> Error while finding parent: ");
  });




})
.post((req, res, next) => {

  const chapterId = req.params.chapterId
  const crr_chapterId = req.params.crr_chapterId

  const data = req.body

  Crr_topic.create({
    name: data.name,
    chapterId : chapterId,
    crrChapterId : crr_chapterId,
    qr_code : data.qr_code
  })
    .then((crr_chapter) => {
      // console.log(">> Created crr_chapter: " + JSON.stringify(crr_chapter, null, 4));
      res.send(crr_chapter);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error while creating crr_chapter " + err,
        error : err.message
      });
      // console.log(">> Error while creating crr_chapter: ", err);
    });


})
.delete((req, res, next) => {

  const chapterId = req.params.chapterId
  const crr_chapterId = req.params.crr_chapterId
  
  Crr_topic.destroy({
    where: {
      crrChapterId : crr_chapterId,
      chapterId : chapterId
    },
    truncate: false
  })
  .then(nums => {
    res.send({ message: `${nums} Crr_chapters were deleted successfully!` });
  })
  .catch(err => {
    res.status(500).send({
      message:
        err.message || "Some error occurred while removing all Crr_chapters."
    });
  });

})


parentRouter.route('/crr_chapters/:crr_chapterId/chapters/:chapaterId/crr_topics/:crr_topicId')
.get((req, res, next) => {

  const crr_topicId = req.params.crr_topicId
  const crr_chapterId = req.params.crr_chapterId
  const chapterId = req.params.chapaterId


  console.log('crr_chapterId', crr_chapterId)
  Crr_topic.findOne({
      where : {
        id : crr_topicId,
        chapterId : chapterId,
        crrChapterId : crr_chapterId
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
                error : 'Crr_chapter ' + crr_chapterId + ' not found'
            })
        }
        
    })
    .catch(err => {
        res.status(500).send({
            message: "Error retrieving Crr_chapter with id=" + crr_chapterId
    });
  });


})
.put((req, res, next) => {

  const crr_topicId = req.params.crr_topicId
  const crr_chapterId = req.params.crr_chapterId
  const chapterId = req.params.chapaterId

  // console.log('crr_chapterId', crr_chapterId)
  const data = req.body
  const crr_topic = {
    name: data.name,
    chapterId : chapterId,
    crrChapterId : crr_chapterId,
    qr_code : data.qr_code
  }

  Crr_topic.update(crr_topic, {
    where: {
      id : crr_topicId,
      chapterId : chapterId,
      crrChapterId : crr_chapterId
    }
  })
  .then(num => {
    if (num == 1) {
      res.send({
        message: "Crr_chapter was updated successfully."
      });
    } else {
      res.send({
        message: `Cannot update Crr_chapter with id=${parentId}. Maybe Crr_chapter was not found or req.body is empty!`
      });
    }
  })
  .catch(err => {
    res.status(500).send({
      message: "Error updating Crr_chapter with id=" + id
    });
});



})
.delete((req, res, next) => {
  const crr_topicId = req.params.crr_topicId
  const crr_chapterId = req.params.crr_chapterId
  const chapterId = req.params.chapaterId

  Crr_topic.destroy({
      where: {
        id : crr_topicId,
        chapterId : chapterId,
        crrChapterId : crr_chapterId
      }
    })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Crr_chapter was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Crr_chapter with id=${id}. Maybe Crr_chapter was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Crr_chapter with id=" + id
      });
  });

})



// lessons

parentRouter.route('/chapters/:chapterId/crr_topics/:crr_topicId/lessons')
.get((req, res, next) => {

  const chapterId = req.params.chapterId
  const crr_topicId = req.params.crr_topicId

  Crr_topic.findOne({
    where: {
      id : crr_topicId,
      chapterId : chapterId
    },
      include: [{
        model: Lesson,
        as : "lesson_uploads",
      }]
    })
    .then((parent) => {
      if(parent){
        // console.log('parent', parent)
        res.json(parent);
      }
      else{
        res.status(404).json({
          "message" : `Parent ${parentId} not found`
        })
      }
      
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Crr_chapter with id=" + chapterId,
        error : err.message
    });
      
    res.status(500).json(">> Error while finding parent: ");
  });




})
.post((req, res, next) => {

  const chapterId = req.params.chapterId
  const crr_topicId = req.params.crr_topicId

  const data = req.body

  Lesson.create({
    chapterId : chapterId,
    crrTopicId : crr_topicId,
    video: data.video,
    video_time : data.video_time,
    free : data.free,
    arrangement : data.arrangement,
    name : data.name,
    about : data.about,
    thumbnail : data.thumbnail,
   
  })
    .then((crr_chapter) => {
      // console.log(">> Created crr_chapter: " + JSON.stringify(crr_chapter, null, 4));
      res.send(crr_chapter);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error while creating crr_chapter " + err,
        error : err.message
      });
      // console.log(">> Error while creating crr_chapter: ", err);
    });


})
.delete((req, res, next) => {

  const chapterId = req.params.chapterId
  const crr_topicId = req.params.crr_topicId
  
  Lesson.destroy({
    where: {
      chapterId : chapterId,
      crr_topicId : crr_topicId
    },
    truncate: false
  })
  .then(nums => {
    res.send({ message: `${nums} Crr_chapters were deleted successfully!` });
  })
  .catch(err => {
    res.status(500).send({
      message:
        err.message || "Some error occurred while removing all Crr_chapters."
    });
  });

})


parentRouter.route('/chapters/:chapaterId/crr_topics/:crr_topicId/lessons/:lessonId')
.get((req, res, next) => {


  const crr_topicId = req.params.crr_topicId
  const lessonId = req.params.lessonId
  const chapterId = req.params.chapaterId


  console.log('crr_chapterId', crr_chapterId)
  Lesson.findOne({
      where : {
        id : lessonId,
        chapterId : chapterId,
        crrTopicId : crr_topicId
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
                error : 'Crr_chapter ' + crr_chapterId + ' not found'
            })
        }
        
    })
    .catch(err => {
        res.status(500).send({
            message: "Error retrieving Crr_chapter with id=" + crr_chapterId
    });
  });


})
.put((req, res, next) => {

  const crr_topicId = req.params.crr_topicId
  const lessonId = req.params.lessonId
  const chapterId = req.params.chapaterId

  // console.log('crr_chapterId', crr_chapterId)
  const data = req.body
  const lesson = {
    chapterId : chapterId,
    crrTopicId : crr_topicId,
    video: data.video,
    video_time : data.video_time,
    free : data.free,
    arrangement : data.arrangement,
    name : data.name,
    about : data.about,
    thumbnail : data.thumbnail,
  }

  Lesson.update(lesson, {
    where: {
      id : lessonId,
      chapterId : chapterId,
      crrTopicId : crr_topicId
    }
  })
  .then(num => {
    if (num == 1) {
      res.send({
        message: "Crr_chapter was updated successfully."
      });
    } else {
      res.send({
        message: `Cannot update Crr_chapter with id=${parentId}. Maybe Crr_chapter was not found or req.body is empty!`
      });
    }
  })
  .catch(err => {
    res.status(500).send({
      message: "Error updating Crr_chapter with id=" + id
    });
});



})
.delete((req, res, next) => {
  const crr_topicId = req.params.crr_topicId
  const lessonId = req.params.lessonId
  const chapterId = req.params.chapaterId

  Lesson.destroy({
      where: {
        id : lessonId,
        chapterId : chapterId,
        crrTopicId : crr_topicId
      }
    })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Crr_chapter was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Crr_chapter with id=${id}. Maybe Crr_chapter was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Crr_chapter with id=" + id
      });
  });

})



parentRouter.route('/chapters/:chapterId/chapter_discounts')
.get((req, res, next) => {

    const chapterId = req.params.chapterId

    Chapter_discount.findAll({
      where : {
        chapterId : chapterId
      }
    })
    .then(data => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(data)
    // res.send(data);
    })
    .catch(err => {
        res.status(500).send({
            message:
            err.message || "Some error occurred while retrieving parents."
        });
    });

})
.post(authenticate.verifyUser, (req, res, next) => {
    
    // Create a user_purchase
    // const emleUserId = req.user.id
    const chapterId = req.params.chapterId
    const data = req.body

    const chapter_discount = {
        chapterId: chapterId,
        date : data.date,
        discount_value: data.discount_value,
    };
    // console.log('user_purchase', user_purchase)
    
      // Save user_purchase in the database
      Chapter_discount.create(chapter_discount)
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
    
    const chapterId = req.params.chapterId


    User_discount.destroy({
        where: {
          chpaterId : chapterId
        },
        truncate: false
      })
        .then(nums => {
          res.send({ message: `${nums} Parents were deleted successfully!` });
        })
        .catch(err => {
          res.status(500).send({
            message:
              err.message || "Some error occurred while removing all parents."
          });
    });

})


parentRouter.route('chapters/:chapterId/chapter_discounts/:chapter_discountId')
.get((req, res, next) => {

    const chapterId = req.params.chapterId
    const id = req.params.chapter_discountId;

    Chapter_discount.findOne({where : {
      id : id,
      chapterId : chapterId
    }})
        .then(data => {
            if(data){
                res.json(data);
            }
            else{
                // err = new Error('Dish ' + id + ' not found');
                // err.status = 404;
                res.status(404).json({
                    error : 'chapter_discount ' + id + ' not found'
                })
            }
            
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving chapter_discount with id=" + id
        });
    });

})
.put((req, res, next) => {

    const chapterId = req.params.chapterId
    const id = req.params.chapter_discountId;
    const data = req.body
    // const emleUserId = req.user.id

    const chapter_discount = {
      chapterId: chapterId,
      date : data.date,
      discount_value: data.discount_value,
    };

    Chapter_discount.update(chapter_discount, {
        where: { id: id }
      })
        .then(num => {
          if (num == 1) {
            res.send({
              message: "User_discount was updated successfully."
            });
          } else {
            res.send({
              message: `Cannot update User_discount with id=${user_purchaseId}. Maybe User_purchase was not found or req.body is empty!`
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

    const id = req.params.chapter_discountId;

    Chapter_discount.destroy({
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

module.exports = parentRouter