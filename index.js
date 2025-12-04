const express = require("express")
const connectDb = require("./config/connectDB")
const cors = require("cors")


const {
registerHandler,
loginhandler,
fetchUserhandler,
updateUserHandler,
updateBioHandler,
uploadProfilePicHandler,
followUserHandler,
unfollowUserHandler
} = require("./controllers/userController")


const {
createPost,
likePost,
commentOnPost,
replyOnComment,
editComment,
reportComment,
reportPost,
reportUser,
uploadStory,
uploadMultipleStories,
fetchposts
} = require("./controllers/postControllers")


const bodyParser = require("body-parser")
const isAuth = require("./middlewares/IsAuthorised")
const multMid = require("./middlewares/multer")


const app = express()
const port = 4000


connectDb()


app.use(bodyParser.json())

app.use(cors({
    origin : "http://localhost:3000",    // accept requests only from this client 
    credentials : true     // ask for cookie   .// cookie is an  identity card  which is  with every request header 
}))

app.use('/uploads', express.static('uploads')) // serve uploaded files

app.get("/", (req, res) => res.send("hello from the server "))


// user
app.post("/user/register", registerHandler)
app.post("/user/login", loginhandler)
app.get("/user/verify", isAuth, fetchUserhandler)
app.put("/user/update", isAuth, updateUserHandler)
app.put("/user/bio", isAuth, updateBioHandler)
app.post("/user/profile-pic", isAuth, multMid, uploadProfilePicHandler)
app.post("/user/follow/:targetId", isAuth, followUserHandler)
app.post("/user/unfollow/:targetId", isAuth, unfollowUserHandler)
app.post("/user/report/:userId", isAuth, reportUser) // body: { reportText }


// posts
app.post("/post/create", isAuth, multMid,  createPost)
app.get("/fetch/posts" , isAuth ,  fetchposts)


app.post("/post/like/:postId", isAuth, likePost)
app.post("/post/comment/:postId", isAuth, commentOnPost)
app.post("/post/comment/:postId/reply/:commentId", isAuth, replyOnComment)
app.put("/post/comment/:postId/edit/:commentId", isAuth, editComment)
app.post("/post/comment/:postId/report/:commentId", isAuth, reportComment)
app.post("/post/report/:postId", isAuth, reportPost)


// stories
app.post('/story/upload', isAuth, multMid, uploadStory)
app.post('/story/upload-multiple', isAuth, multMid, uploadMultipleStories)   // watch out 


app.listen(port, () => { console.log(`server listening on port ${port}`) })