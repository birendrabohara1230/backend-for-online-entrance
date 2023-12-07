import mongoose, { Schema } from "mongoose";
import bcryptjs from 'bcryptjs'

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    fatherName: {
        type: String,
        required: true,
        trim: true,
    },
    motherName: {
        type: String,
        required: true,
        trim: true,
    },
    dateOfBirth: {
        type: String,
        required: true
    },
    email:{
        type: String,
        unique: true,
        lowercase: true,
        index: true
    },
    seeSymbolNumber: {
        type: String,
        required: true,
        trim: true
    },
    gpaSEE: {
        type: Number,
        required: true,
        trim: true
    },
    seePassedYear: {
        type: String,
        required: true,
        trim: true
    },
    nebSymbolNumber: {
        type: String,
        required: true,
        trim: true
    },
    gpaNEB: {
        type: Number,
        required: true,
        trim: true
    },
    nebPassedYear: {
        type: String,
        required: true,
        trim: true
    },
    schoolType: {
        type: String,
        enum: ["Government", "Community", "Private"]
    },
    studentImage: {
        type: String,  // cloudinary URL
        required: true
    },
    course: {
        type: String,  // dropdown field
        required: true
    },
    username: {    // auto generated 
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        index: true
    },
    password: {  // auto generated 
        type: String,
        required: true,
    }
},
    {
        timestamps: true
    }
)
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next()
    this.password = await bcryptjs.hash(this.password, 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcryptjs.compare(password, this.password)
}
export const User = mongoose.model("User", userSchema)