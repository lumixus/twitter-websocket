import bcryptjs from "bcryptjs";
const validateLoginInputs = (username, password) =>
{
    return username && password;
}

const comparePasswords = (password, hash) =>
{
    return bcryptjs.compareSync(password, hash);
}

const validateInputs = (...inputs) =>
{
    for(var i of inputs)
    {
        if(!i)
        {
            return false;
        }
    }
    return true;
}
export {validateLoginInputs,comparePasswords,validateInputs};