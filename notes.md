Notes to self
created a MongoDB Atlas account

create heroku
-in terminal, type:
heroku create

locate the file in heroku page, in settings under config Vars
Key: MONGODB_URI
Value: under Mongodb file that has been created copy the mongodb connection string, replace username and password with the one that access that mongodb file

make sure server.js has the following:
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pizza-hunt', {
useNewUrlParser: true,
useUnifiedTopology: true
});

run the following in terminal to push to heroku

you may not have to do these if you haven't made any changes!

git add -A
git commit -m 'Deploying'

deploy to heroku

git push heroku main

heroku open

https://radiant-wildwood-83459.herokuapp.com/
