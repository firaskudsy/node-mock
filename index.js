const express = require('express');
const sqldbRouter = require('./routes/sqldb');




const app = express();

app.use('/v4', sqldbRouter);

app.listen(process.env.PORT, () => {
  console.log('Server is running on port'+ process.env.PORT);
}
);