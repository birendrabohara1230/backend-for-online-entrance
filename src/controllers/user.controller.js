import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";
const registerUser = asyncHandler(async (req, res) => {
    // get user details from frontend
    // validation 
    // check if user already exist
    // check for student images
    // upload them to cloudinary, student image
    // create user object - create entry in db
    // remove password from response
    // check for user creation
    // return response

    const {
        firstName, lastName, fatherName, motherName, dateOfBirth, seeSymbolNumber, gpaSEE, seePassedYear, nebSymbolNumber, gpaNEB, nebPassedYear, schoolType, course, email
    } = req.body
    if (
        [firstName, lastName, fatherName, motherName, dateOfBirth, seeSymbolNumber, gpaSEE, seePassedYear, nebSymbolNumber, gpaNEB, nebPassedYear, schoolType, course, email].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All Fields are required")
    }

    const existedUser = await User.findOne({ email })
    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists")
    }

    const studentImageLocalPath = req.files?.studentImage[0]?.path;
    if (!studentImageLocalPath) {
        throw new ApiError(400, "Student file is required")
    }

    const studentImage = await uploadOnCloudinary(studentImageLocalPath)

    if (!studentImage) {
        throw new ApiError(400, "Student file is required")
    }

    // create username for student (Needed while during entrace exam)
    function generateRandomString(baseString) {
        // Get the current date and time
        const currentDate = new Date();
        const year = currentDate.getFullYear()
        const day = currentDate.getDate();
        const hour = currentDate.getHours();
        const minute = currentDate.getMinutes();
        const second = currentDate.getSeconds();

        // Create a random string by appending date, hour, and second to the base string
        const randomString = `${baseString}${year}${day}${hour}${minute}${second}`;

        return randomString;
    }
    const username = generateRandomString(firstName);



    // creating password for student
    function generatePassword(length) {
        const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+";
        let password = "";

        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * charset.length);
            password += charset.charAt(randomIndex);
        }

        return password;
    }
    const generatedPassword = generatePassword(8);



    const user = await User.create({
        firstName,
        lastName,
        fatherName,
        motherName,
        dateOfBirth,
        seeSymbolNumber,
        gpaSEE,
        seePassedYear,
        nebSymbolNumber,
        gpaNEB,
        nebPassedYear,
        schoolType,
        course,
        email,
        studentImage: studentImage.url,
        username: username,
        password: generatedPassword
    })
    const createdUser = await User.findById(user._id)

    if (!createdUser) {
        throw new ApiError(500, "Student not registed successfully.")
    }
    createdUser.password = generatedPassword  //replacing the encrypted password with short auto generated password
    return res.status(201).json(
        new ApiResponse( 200, createdUser, "Student Registred Successfully.")
    )
})


export { registerUser }