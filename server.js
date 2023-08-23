const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const PORT = 5050
const path = require('path')

require('dotenv').config();

const app = express();

/* require routes */
const authorsRoute = require('./routes/authors')
const postsRoute = require('./routes/posts')
const resourcesRoute = require('./routes/resources')
const commentRoute = require('./routes/comments')
const loginRoute = require('./routes/login')
const githubRoute = require('./routes/gitHub')

/* middleware */
app.use(express.json());
app.use(cors())

/* routes */
app.use('/',authorsRoute)
app.use('/',postsRoute)
app.use('/',resourcesRoute)
app.use('/',commentRoute)
app.use('/',loginRoute)
app.use('/',githubRoute)

mongoose.connect(process.env.MOONGO_DB_URL);

const db = mongoose.connection;
db.on('error', console.error.bind(console, "errore di connessione al server"));
db.once('open', ()=>{ console.log('database MongoDb connesso')});

app.listen(PORT, ()=> console.log(`server avviato ed in ascolto sulla porta ${PORT}`));
