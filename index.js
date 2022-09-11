const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config();

//middleware
app.use(bodyParser.json())
app.use(cookieParser());
app.use(cors())

// database connection
const MONGO_URI = process.env.MONGO_URI
mongoose.connect( MONGO_URI, { useNewUrlParser: true})
.then(() => console.log('Database connected'))
.catch((err) => console.log(err))

app.get('/', (req, res) => {
  res.send('Hello World')
})

//routes -------------------
const AdminRoutes = require('./routes/adminRoutes')
const UserRoutes = require('./routes/userRoutes')
const CategoryRoutes = require('./routes/categoryRoutes')
const ProductRoutes = require('./routes/productRoutes')

app.use('/admin', AdminRoutes)
app.use('/user', UserRoutes)
app.use('/category', CategoryRoutes)
app.use('/product', ProductRoutes)

const PORT = process.env.PORT || 4000;
app.listen(PORT,console.log(`Server is running on PORT ${PORT}`))
// let today = '4:30:30'
// let expiredDate = '3:30:30'
// today = today.split(':')
// expiredDate = expiredDate.split(':')
// console.log(today, expiredDate)

// if ( today[0] == expiredDate[0]) {
//   if ( today[1] == expiredDate[1]) {
//     if ( today[2] == expiredDate[2]) {
//       console.log('same')
//     } else if ( today[2] > expiredDate[2]) {
//       console.log('expired')
//     } else { console.log('avaliable') }
//   } else if ( today[1] > expiredDate[1]) {
//     console.log('expired')
//   } else {
//     console.log('avaliable')
//   }
// } else if (today[0] > expiredDate[0]) {
//   console.log('expired')
// } else {
//   console.log('avaliable')
// }