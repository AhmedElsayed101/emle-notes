https://emle-notes2.herokuapp.com/

routes >>>


get , post, delete
(/parents)
get, put, delete
(/parents/:parentId)


get, post, delete
(/parents/:parentId/crr_chapters)
get, put, delete
(/parents/:parentId/crr_chapters/:crr_chapterId)


get, post, delete
(/parents/:parentId/crr_chapters/:crr_chapterId/chapters)
get, put, delete
(/parents/:parentId/crr_chapters/:crr_chapterId/chapters/chapterId)


get, post, delete
(/parents/crr_chapters/:crr_chapterId/chapters/:chapterId/crr_topics)
get, put, delete
(/parents/crr_chapters/:crr_chapterId/chapters/:chapterId/crr_topics/:crr_topicId)


get, post, delete
(/parents/chapters/:chapterId/crr_topics/:crr_topicId/lessons)
get , put , delete
(/parents/chapters/:chapterId/crr_topics/:crr_topicId/lessons/:lessonId)

get , post, delete
(/parents/chapters/:chapterId/chapter_discounts)
get, put, delete
(/parents/chapters/:chapterId/chapter_discounts/:chapter_discountId)


Users


post
(/users/login)

post
(/users/signup)

logout (not important)
(/users/logout)


get, post, delete
(users/user_purchase)
get, put, delete
(users/user_purchase/:user_purchaseId)


get, post, delete
(users/user_save)
get, put, delete
(users/user_save/:user_saveId)

get, post, delete
(users/user_discount)
get, put, delete
(users/user_discount/:user_discountId)


get
(parents/:parentId/chapters)

login required >>>
token >>> lasts for 10 hours



{
    "name": "crr_chapr-6",
    "email": "email-1",
    "password": "123",
    "university": "university-1",
    "grade" : "good",
    "national_id" : "national_id",
    "government" : "government",
    "city" : "city",
    "street" : "street",
    "system" : "system",
    "image" : "image2",
    "price" : 5,
    "about" : "kalsdfklasdfkl;asf;asklf",
    "objective" : "alskdfklasflkasdflkasfdkl",
    "state" : "slkdfklasdfkasklf",
    "rate" : 4,
    "date" : "2021-03-01",
    "qr_code" : "hello from the other side",
    "free" : 1,
    "video" : "video",
    "video_time" : "video_time",
    "arrangement" : "arrangement",
    "thumbnail" : "thumbnail",
    "discount_value" : 5.5,
    "orignal_price" : 200,
    "parentId" : 3,
    "chapterId": 4,
    "type" : "typ",
    "nature" : "naturee"
}

