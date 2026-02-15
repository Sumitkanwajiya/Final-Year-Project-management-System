import app from './app.js';
import connectDB from './config/db.js';


//Connect to Database
connectDB();

const PORT = process.env.PORT || 5000;

//Start the server
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

//error handling

process.on('uncaughtException', (err) => {
  console.error(`Uncaught Exception: ${err.message}`);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection: ${err}`);
  server.close(() => {
    process.exit(1);
  });
});


export default server;
