const mongoose = require('mongoose');
// const uri = "mongodb://root:password@127.0.0.1/";
const uri = "mongodb+srv://root:rootuser@homecluster.wzpnfhg.mongodb.net/?retryWrites=true&w=majority&appName=HomeCluster";
const connectDB = async () => {
    try {
    //     await mongoose.connect(uri , 
    //     {useNewUrlParser: true, 
    //     useUnifiedTopology: true
    // });
        await mongoose.connect(uri);
    console.log("MongoDB Connected")
    }
    catch (error) {
        console.error(error.message);
        process.exit(1);
    } 
}

export default connectDB;