const mongoose=require("mongoose")
const bcrypt=require("bcryptjs")

const userSchema=new mongoose.Schema({
    email:{
        type:String,
        required:[true,"Please enter email.It's mandatory to fill."],
        trim:true,
        lowercase:true,
        match:[ /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/ ,
            'Invalid Email Address'
          ],
        unique:[true,"Email already exists"]
    },
    name:{
        type:String,
        required:[true,'Name is mandatory to fill. '],
    },
    password:{
        type:String,
        required:[true,'Password is mandatory to fill. '],
        minlength:[6,'Password should contain more than 6 character.'],
        select:false
    },
    systemUser:{
        type:Boolean,
        default:false,
        immutable:true,
        select:false
    }
},{
    timestamps:true
})

userSchema.pre("save",async function (next){

    if(!this.isModified("password")){
        return next()
    }

    const hash=await bcrypt.hash(this.password,10)
    this.password=hash
})

userSchema.methods.comparePassword=async function(password){
    return await bcrypt.compare(password,this.password)
}

module.exports=mongoose.model('user',userSchema)