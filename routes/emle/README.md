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