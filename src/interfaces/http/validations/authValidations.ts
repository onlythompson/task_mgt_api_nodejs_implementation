import { body, header } from 'express-validator';

export const registerValidator = [
  body('username').isString().isLength({ min: 3, max: 30 }).trim(),
  body('email').isEmail().normalizeEmail(),
  body('password').isString().isLength({ min: 8 }).matches(/\d/).matches(/[a-zA-Z]/)
];

export const loginValidator = [
  body('email').isEmail().normalizeEmail(),
  body('password').isString().notEmpty()
];

export const changePasswordValidator = [
  body('currentPassword').isString().notEmpty(),
  body('newPassword').isString().isLength({ min: 8 }).matches(/\d/).matches(/[a-zA-Z]/)
];

export const tokenValidator = [
  header('authorization').isString().notEmpty().custom((value) => {
    if (!value.startsWith('Bearer ')) {
      throw new Error('Authorization header must start with Bearer');
    }
    return true;
  })
];