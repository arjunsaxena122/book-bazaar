import bcrypt from "bcryptjs"

export const hashedPassword = async(password:string) =>{
    return await bcrypt.hash(password,10)
}