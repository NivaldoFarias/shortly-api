import Joi from 'joi';

const pattern = /^[a-zA-Z0-9]{3,30}$/;
const SignInSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().pattern(pattern).required(),
});

export default SignInSchema;
