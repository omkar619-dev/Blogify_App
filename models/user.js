const {Schema,model} = require('mongoose');
const {createHmac,randomBytes} = require('node:crypto');
const {createTokenForUser} = require("../services/authentication");

const userSchema = new Schema({
    fullName:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    salt:{
        type: String,
    },
    password:{
        type: String,
        required: true
    },
    profileImageURL:{
        type: String,
        default: "./public/blue-circle-with-white-user_78370-4707.png"
    },
    role:{
        type: String,
        enum:['USER','ADMIN'],
        default: 'USER',
    },   
},{timestamps: true});

userSchema.pre("save", function(next) {
    try {
        const user = this;
        if(!user.isModified("password")) {
            return next();
        }
        const salt = randomBytes(16).toString();
        const hashedPassword = createHmac("sha256", salt)
            .update(user.password)
            .digest("hex");
        this.salt = salt;
        this.password = hashedPassword;
        next();
    } catch (error) {
        next(error);
    }
});

userSchema.static('matchPasswordAndGenerateToken',async function(email,password){
    const user = await this.findOne({email});
    if(!user) throw new Error("User not found");
    const salt = user.salt;
    const hashedPassword = user.password;
    const userProvidedPassword = createHmac("sha256", salt).update(password).digest("hex");
    if(hashedPassword !== userProvidedPassword) throw new Error("Password is incorrect");
    
    const token = createTokenForUser(user);
    return token; 
});

const User = model('User',userSchema);

module.exports = User;