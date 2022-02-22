const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv/config');
const authJwt = require('./helpers/jwt');
const errorHandler = require('./helpers/error-handler');

var AWS = require('aws-sdk');

const ssm = new AWS.SSM({
    region: 'us-east-1',
});

// function getParameterFromStore(param){
//     return new Promise(function(resolve, reject){
//         console.log('++ ' + param.Path);
//         ssm.getParametersByPath(param, function(err, data){
//             if(err){
//                 reject(console.log('Error getting parameter: ' + err, err.stack));
//             } else {
//                 resolve(data);
//             }
//         });
//     });
// }

// const connection_uri =  { Path : '/eshops/dev/'}
// getParameterFromStore(connection_uri).then((data)=> {

// })

const api = process.env.API_URL;
const port = process.env.PORT;
const connection_uri = process.env.CONNECTION_STRING;


//middleware
app.use(cors());
app.options('*', cors());
app.use(express.json());
app.use(morgan('tiny'));
app.use(authJwt());
app.use('/public/uploads', express.static(__dirname + '/public/uploads'))
app.use(errorHandler);

//Routes
const categoriesRoutes = require('./routes/categories');
const productsRoutes = require('./routes/products');
const usersRoutes = require('./routes/users');
const ordersRoutes = require('./routes/orders');
const healthRoutes = require('./routes/health');

app.use(`${api}/categories`, categoriesRoutes);
app.use(`${api}/products`, productsRoutes);
app.use(`${api}/users`, usersRoutes);
app.use(`${api}/orders`, ordersRoutes);
app.use(`${api}/health`, healthRoutes);

//http://localhost:3000/api/v1/products


app.listen(port, ()=> {
    //console.log(api);
    console.log(`Server is running on ${port}`);
    mongoose.connect(connection_uri).then(()=> {console.log('Database Connected')}).catch((err)=> {console.log(err)});


})