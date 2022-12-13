import bcryptjs from "bcryptjs";
const validateLoginInputs = (username, password) =>
{
    return username && password;
}

const comparePasswords = (password, hash) =>
{
    return bcryptjs.compareSync(password, hash);
}

export {validateLoginInputs,comparePasswords};