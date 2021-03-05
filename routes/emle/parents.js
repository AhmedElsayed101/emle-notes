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
const User_save = db.users_save
const User_purchase = db.users_purchase
const User = db.emleUsers

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


// Your route

parentRouter.route('/:parentId/chapters')
.get(authenticate.verifyUser, (req, res, next) => {
  const parentId = req.params.parentId
  const emleUserId = req.user.id
  
  Crr_chapter.findAll({
    where : {
      parentId : parentId
    },
  })
  .then((data) => {
    if(data){
      return data.map(crr => crr.id)
    }
  })
  .then(async (crr_ids) => {
    const chapters_res = []
    for(const id of crr_ids){
      await Chapter.findAll({
        where: {
          crrChapterId : id
        },
        attributes: 
          [
            ['id', 'chapterId'],
            ['name', 'chapterName'],
            ['image', 'chapterImage'],
            ['price', 'oldPrice'],
            'emleUserId'
          ],
        
      })
      .then(async chapters => {
        for(const chapter of chapters){
          await Chapter_discount.findOne({
            where:{
              chapterId : chapter.dataValues.chapterId
            },
        
          })
          .then(chapter_dis => {
            if(chapter_dis){
              chapter.dataValues.newPrice = chapter_dis.discount_value * chapter.dataValues.oldPrice
              chapter.dataValues.discount = chapter_dis.discount_value
            }
            else{
              chapter.dataValues.newPrice = chapter.dataValues.oldPrice
              chapter.dataValues.discount = 1
            }

          })
          .catch((err) => res.status(404).json({
            err : err.message
          }))
          await User_save.findOne({
            where:{
              chapterId : chapter.dataValues.chapterId,
              emleUserId : emleUserId
            },
          })
          .then(user_save => {
            if(user_save){
              chapter.dataValues.favorite = 1
            }
            else{
              chapter.dataValues.favorite = 0
            }

          })
          .catch((err) => res.status(500).json({
            err : err.message
          }))
          await User_purchase.findOne({
            where:{
              chapterId : chapter.dataValues.chapterId,
              emleUserId : emleUserId
            },
          })
          .then(user_purchase => {
            if(user_purchase){
              chapter.dataValues.enrolled = 1
            }
            else{
              chapter.dataValues.enrolled = 0
            }

          })
          .catch((err) => res.status(500).json({
            err : err.message
          }))
          await User.findOne({
            where:{
              id : chapter.emleUserId
            },
          })
          .then(user => {
            if(user){
              chapter.dataValues.DoctorName = user.name
              chapter.dataValues.DoctorImage = user.image
            }
            else{
              chapter.dataValues.enrolled = 0
            }

          })
          .catch((err) => res.status(500).json({
            err : err.message
          }))
          await Crr_topic.findAll({
            where:{
              chapterId : chapter.dataValues.chapterId
            },
          })
          .then(topics => {
            chapter.dataValues.numOfTopics = topics.length
          })
          .catch((err) => res.status(500).json({
            err : err.message
          }))



          chapters_res.push(chapter)
        }
      })
    }

    return chapters_res
  })
  .then(chapters_res => {
    Parent.findByPk(parentId,{
      
      attributes: [
          ['id', 'moduleId'],
          ['name', 'moduleName']
        ]
      }
    )
    .then((parent) => {
      if(parent){
        parent.dataValues.chapters = chapters_res
        res.json(parent);
      }
      else{
        res.status(404).json({
          err : `Parent ${parentId} not found!`
        })
      }
    })
    .catch((err) => res.status(500).json({
      err : err.message
    }))
    
  })
  .catch((err) => res.status(500).json({
    err : err.message
  }))

})


// crr_chapters

parentRouter.route('/:parentId/crr_chapters')
.get((req, res, next) => {
  const parentId = req.params.parentId

  Parent.findByPk(parentId, { include: ["crr_chapters"] })
    .then((parent) => {
      if(parent){
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
      res.send(crr_chapter);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error while creating crr_chapter " + err,
        error : err.message
      });
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
          "message" : `Crr_chapter ${parentId} not found`
        })
      }
      
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error finding Crr_chapter with id=" + parentId,
        error : err.message
    });
      
    res.status(500).json(">> Error while finding Crr_chapter: ");
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
      res.send(crr_chapter);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error while creating chapter ",
        error : err.message
      });
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
    res.send({ message: `${nums} chapters were deleted successfully!` });
  })
  .catch(err => {
    res.status(500).send({
      message:
        err.message || "Some error occurred while removing all chapters."
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
                error : 'Chapter ' + crr_chapterId + ' not found'
            })
        }
        
    })
    .catch(err => {
        res.status(500).send({
            message: "Error retrieving Chapter with id=" + crr_chapterId
    });
  });


})
.put(authenticate.verifyUser, (req, res, next) => {

  const chapaterId = req.params.chapaterId
  const crr_chapterId = req.params.crr_chapterId
  const emleUserId = req.user.id

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
        message: "Chapter was updated successfully."
      });
    } else {
      res.send({
        message: `Cannot update Chapter with id=${chapaterId}. Maybe Chapter was not found or req.body is empty!`
      });
    }
  })
  .catch(err => {
    res.status(500).send({
      message: "Error updating Chapter with id=" + chapaterId
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
          message: "Chapter was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Chapter with id=${chapaterId}. Maybe Chapter was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Chapter with id=" + chapaterId
      });
  });

})


// crr_topics


parentRouter.route('/crr_chapters/:crr_chapterId/chapters/:chapterId/crr_topics')
.get((req, res, next) => {

  const chapterId = req.params.chapterId
  const crr_chapterId = req.params.crr_chapterId

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
        res.json(parent);
      }
      else{
        res.status(404).json({
          "message" : `Chapter ${chapterId} not found`
        })
      }
      
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Chapter with id=" + chapterId,
        error : err.message
    });
      
    res.status(500).json(">> Error while finding Chapter: ");
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
    .then((crr_topic) => {
      res.send(crr_topic);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error while creating crr_topic ",
        error : err.message
      });
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
    res.send({ message: `${nums} crr_topics were deleted successfully!` });
  })
  .catch(err => {
    res.status(500).send({
      message:
        err.message || "Some error occurred while removing all crr_topics."
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
      
            res.status(404).json({
                error : 'Crr_topic ' + crr_topicId + ' not found'
            })
        }
        
    })
    .catch(err => {
        res.status(500).send({
            message: "Error retrieving Crr_topic with id=" + crr_topicId
    });
  });


})
.put((req, res, next) => {

  const crr_topicId = req.params.crr_topicId
  const crr_chapterId = req.params.crr_chapterId
  const chapterId = req.params.chapaterId

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
        message: "Crr_topic was updated successfully."
      });
    } else {
      res.send({
        message: `Cannot update Crr_topic with id=${crr_topicId}. Maybe Crr_topic was not found or req.body is empty!`
      });
    }
  })
  .catch(err => {
    res.status(500).send({
      message: "Error updating Crr_topic with id=" + crr_topicId
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
          message: "Crr_topic was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Crr_topic with id=${crr_topicId}. Maybe Crr_topic was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Crr_topic with id=" + crr_topicId
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
          "message" : `Crr_topic ${crr_topicId} not found`
        })
      }
      
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error finding Crr_topic with id=" + crr_topicId,
        error : err.message
    });
      
    res.status(500).json(">> Error while finding Crr_topic: ");
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
    .then((lesson) => {
      res.send(lesson);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error while creating Lesson ",
        error : err.message
      });
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
    res.send({ message: `${nums} Lessons were deleted successfully!` });
  })
  .catch(err => {
    res.status(500).send({
      message:
        err.message || "Some error occurred while removing all Lessons."
    });
  });

})


parentRouter.route('/chapters/:chapaterId/crr_topics/:crr_topicId/lessons/:lessonId')
.get((req, res, next) => {


  const crr_topicId = req.params.crr_topicId
  const lessonId = req.params.lessonId
  const chapterId = req.params.chapaterId


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
            res.status(404).json({
                error : 'Lesson ' + lessonId + ' not found'
            })
        }
        
    })
    .catch(err => {
        res.status(500).send({
            message: "Error retrieving Lesson with id=" + lessonId
    });
  });


})
.put((req, res, next) => {

  const crr_topicId = req.params.crr_topicId
  const lessonId = req.params.lessonId
  const chapterId = req.params.chapaterId

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
        message: "Lesson was updated successfully."
      });
    } else {
      res.send({
        message: `Cannot update Lesson with id=${lessonId}. Maybe Lesson was not found or req.body is empty!`
      });
    }
  })
  .catch(err => {
    res.status(500).send({
      message: "Error updating Lesson with id=" + lessonId
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
          message: "Lesson was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Lesson with id=${lessonId}. Maybe Lesson was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Lesson with id=" + lessonId
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
    })
    .catch(err => {
        res.status(500).send({
            message:
            err.message || "Some error occurred while retrieving Chapter_discounts."
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
        type : data.type
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
              err.message || "Some error occurred while creating the Chapter_discounts."
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
          res.send({ message: `${nums} Chapter_discounts were deleted successfully!` });
        })
        .catch(err => {
          res.status(500).send({
            message:
              err.message || "Some error occurred while removing all Chapter_discount."
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
              message: "Chapter_discount was updated successfully."
            });
          } else {
            res.send({
              message: `Cannot update Chapter_discount with id=${id}. Maybe Chapter_discount was not found or req.body is empty!`
            });
          }
        })
        .catch(err => {
          res.status(500).send({
            message: "Error updating Chapter_discount with id=" + id
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
              message: "Chapter_discount was deleted successfully!"
            });
          } else {
            res.send({
              message: `Cannot delete Chapter_discount with id=${id}. Maybe Chapter_discount was not found!`
            });
          }
        })
        .catch(err => {
          res.status(500).send({
            message: "Could not delete Chapter_discount with id=" + id
          });
    });


})

module.exports = parentRouter



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