const bcryptjs = require("bcryptjs")
const { StatusCodes } = require("http-status-codes")
const { slugify, randomDigits } = require("~/utils/slugify")
import { v4 as uuidv4 } from 'uuid';
import Role from '~/models/role.model';
import User from '~/models/user.model';
import { pickUser } from '~/utils/algorithms';
import ApiError from '~/utils/ApiError';
import { WEBSITE_DOMAIN } from '~/utils/constants';
import { FormMail } from '~/utils/format.send.email';
import { sendEmail } from '~/utils/sendMail';

const createUser = async (data) => {
    try {
        //1 .check email exit 
        const userExist = await User.findOne({ usr_email: data.email }).lean()

        if (userExist) {
            throw new ApiError(StatusCodes.BAD_REQUEST, "User already exist")
        }

        //2. create slug
        let slug;
        do {
            slug = slugify(data.userName.split('@')[0]) + '.' + randomDigits;
        } while (await User.exists({ usr_slug: slug }).lean());

        const roleUser = await Role.findOne({ rol_name: 'user' }).lean();

        //3. create user
        const newData = {
            usr_slug: slug,
            usr_email: data.email,
            usr_name: data.userName,
            usr_password: data.password,
            usr_salt: bcryptjs.hashSync(data.password, 8),
            usr_verify_token: uuidv4(),
            usr_role: roleUser._id
        }

        const result = await User.create(newData)

        const newUser = await User.findById(result._id).populate('usr_role').lean()

        const link_verify = `${WEBSITE_DOMAIN}/verify?token=${result.usr_verify_token}`

        sendEmail('P-Shop',
            result.usr_email,
            'Xác thực tài khoản',
            FormMail('P-Shop', link_verify, result.usr_email, result.usr_expired_at)
        )

        return pickUser(newUser)
    } catch (error) {
        throw error
    }
}

const login = async (data) => {
    try {

        //1. check user exist
        const userExits = await User.findOne({ usr_email: data.email }).populate('usr_role').lean()

        if (!userExits) throw new ApiError(StatusCodes.BAD_REQUEST, 'User not exist !')

        //2. check password
        const checkPassword = bcryptjs.compareSync(data.password, userExits.usr_salt)
        if (!checkPassword) {
            throw new ApiError(StatusCodes.BAD_REQUEST, 'Password not match !')
        }

        //3. check status
        if (userExits.usr_status === 'pending') throw new ApiError(StatusCodes.BAD_REQUEST, 'User is not active, please check your email !')

        if (userExits.usr_status === 'block') throw new ApiError(StatusCodes.BAD_REQUEST, 'User is banned !')


        return pickUser(userExits)
    } catch (error) {
        throw error
    }
}

export const userService = {
    createUser,
    login
}