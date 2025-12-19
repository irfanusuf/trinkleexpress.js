const express = require("express")
const connectDb = require("./config/connectDB")
const cors = require("cors")
const path = require("path")


const {
register,
login,
userDetails,
verifyUser,
updateUser,
updateBio,
uploadProfile,
followUser,
unfollowUser
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
fetchUserposts,
fetchExploreposts,

} = require("./controllers/postControllers")


const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const isAuth = require("./middlewares/IsAuthorised")
const multMid = require("./middlewares/multer")



const app = express()
const port = 4000


connectDb()


app.use(bodyParser.json())
app.use(cookieParser())

app.use(cors({
    origin : "http://localhost:3000",    // accept requests only from this client 
    credentials : true     // ask for cookie   .// cookie is an  identity card  which is  with every request header 
}))

app.use('/uploads', express.static('uploads')) // serve uploaded files

app.get("/", (req, res) => res.sendFile(path.join(__dirname , "views" , "index.html")))


// user
app.post("/user/register", register)
app.post("/user/login", login)


app.get("/user/verifyUser", isAuth, verifyUser)

app.get("/user/userDetails", isAuth, userDetails)
app.put("/user/update", isAuth, updateUser)
app.put("/user/bio", isAuth, updateBio)
app.post("/user/uploadProfile", isAuth, multMid, uploadProfile)
app.post("/user/follow/:targetId", isAuth, followUser)
app.post("/user/unfollow/:targetId", isAuth, unfollowUser)
app.post("/user/report/:userId", isAuth, reportUser) // body: { reportText }


// posts
app.post("/post/create", isAuth, multMid,  createPost)
app.get("/posts/userPosts" , isAuth , fetchUserposts )
app.get("/posts/explore" , isAuth , fetchExploreposts )


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