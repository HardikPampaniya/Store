const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes');
const morgan = require('morgan');
const { sequelize, testConnection } = require('./config/database');
const cors = require('cors');
const fileUpload = require('express-fileupload');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'))
app.use(cors());
app.use(fileUpload()); 

app.use("/public/assets", express.static(__dirname + '/public/assets'));



// Test the database connection
testConnection()
  .then(() => {
    // Routes
    app.use('/api', userRoutes);
    app.use('/api', categoryRoutes);
    app.use('/api', productRoutes);


    app.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(500).send('Something went wrong!');
    });

    
    // Start the server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Unable to start server:', err);
  });
