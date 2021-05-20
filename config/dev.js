require('dotenv').config();
module.exports=
    {
        MongoDB:process.env.MONGODB,
        AWSAccessID:process.env.AWSACCESSID,
        AWSSecretKey:process.env.AWSSECRETKEY

    }