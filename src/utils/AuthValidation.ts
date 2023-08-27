import JOI from "joi";

export const RegistrationValidation = (data: object) => {
  const schema = JOI.object({
    name: JOI.string().required().messages({
      "string.required": "{{#label}} is required can not be left empty",
    }),
    email: JOI.string().required().email().messages({
      "string.required": "{{#label}} is required can not be left empty",
      "string.email": "{{#label}} is not a valid email",
    }),
    password: JOI.string().required().min(8).messages({
      "string.required": "{{#label}} is required can not be left empty",
      "string.min": "{{#label}} can not be less than 8 characters",
    }),
    role: JOI.string(),
  });
  return schema.validate(data);
};

/**
 * @param data data to be validated
 * @description method is responsible for validating incoming request made
 *  to the server for user login
 */
export const LoginValidation = (data: object) => {
  const schema = JOI.object({
    email: JOI.string().required().email().messages({
      "string.required": "{{#label}} is required can not be left empty",
      "string.email": "{{#label}} is not a valid email",
    }),
    password: JOI.string().required().min(8).messages({
      "string.required": "{{#label}} is required can not be left empty",
      "string.min": "{{#label}} can not be less than 8 characters",
    }),
  });
  return schema.validate(data);
};
