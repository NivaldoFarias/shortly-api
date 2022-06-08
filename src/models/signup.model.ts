import Joi from 'joi';

const pattern = /^[a-zA-Z0-9]{3,30}$/;
const SignUpSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().pattern(pattern).required(),
});

export default SignUpSchema;
