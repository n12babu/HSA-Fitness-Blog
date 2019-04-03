var express   = require("express"),
    bParser   = require("body-parser"),
    methodoverride = require("method-override"),
    expressSanitizer = require("express-sanitizer"),
    mongoose  = require("mongoose"),
    app = express();


//APP CONFIG
mongoose.connect("mongodb://localhost:27017/restful_blog_app", { useNewUrlParser: true });
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodoverride("_method"));


//MONGOOSE/ MODEL CONFIG

var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
    
});
var Blog = mongoose.model("Blog", blogSchema);


//RESTFUL ROUTES

app.get("/", function(request, response){
    response.redirect("/blogs");
})



// INDEX ROUTE
app.get("/blogs", function(request, response){
    Blog.find({}, function(err, blogs){
     if(err){
        console.log("ERROR");
        }else {
            response.render("index", {blogs: blogs});
        }
    
    });

});


//NEW ROUTE


app.get("/blogs/new", function(request, response){
    response.render("new");
    
});



//CREATE ROUTE

app.post("/blogs", function(request, response){
    // Create blog 
    request.body.blog.body = request.sanitize(request.body.blog.body)
    Blog.create(request.body.blog, function(err, newBlog){
        if(err){
            response.render("new")
        }else {
            // Then, redirect to the index
            response.redirect("/blogs");
        }
    });
});


//Show Route 

app.get("/blogs/:id", function(require, response){
    Blog.findById(require.params.id, function(err, foundBlog){
        if(err){
            response.redirect("/blogs")
        }else{
            response.render("show", {blog: foundBlog});
            
        }
    });
});


//Edit Route
app.get("/blogs/:id/edit", function(require, response){
    Blog.findById(require.params.id, function(err, foundBlog){
        if(err){
            response.redirect("/blogs");
        }else {
            response.render("edit",  {blog: foundBlog});
        }
    });
});

//Update Routes
app.put("/blogs/:id", function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body)
   Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
      if(err){
          res.redirect("/blogs");
      }  else {
          res.redirect("/blogs/" + req.params.id);
      }
   });
});




// DELETE ROUTE
app.delete("/blogs/:id", function(require, response){
    Blog.findByIdAndRemove(require.params.id, function(err){
        if(err){
            response.redirect("/blogs");
        }else {
            response.redirect("/blogs");
        }
    });
});




// Added listeners to the Apllication

app.listen(process.env.PORT, process.env.IP,function(){
        console.log("The server is Online!");
});
 