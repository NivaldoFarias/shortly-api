import Joi from 'joi';
import * as regex from './../blueprints/regex.js';

const UrlSchema = Joi.object({
  url: Joi.string().pattern(regex.url).required(),
});

export default UrlSchema;
