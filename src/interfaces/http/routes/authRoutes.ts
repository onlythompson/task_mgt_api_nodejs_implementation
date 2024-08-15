import express from 'express';
import { container }  from '../../../container'
import { AuthenticationController } from '../controllers/AuthenticationController';
import { registerValidator, loginValidator, changePasswordValidator, tokenValidator } from '../validations/authValidations';
import { validate } from '../middlewares/validationMiddleware';


/**
 * @openapi
 * components:
 *   schemas:
 *     User:
 *       type: objectS
 *       required:
 *         - id
 *         - username
 *         - email
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the user
 *         username:
 *           type: string
 *           description: The username of the user
 *         email:
 *           type: string
 *           format: email
 *           description: The email of the user
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date the user was added
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date the user was last updated
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

const router = express.Router();
const authController = container.resolve(AuthenticationController);

  /**
   * @openapi
   * /auth/register:
   *   post:
   *     summary: Register a new user
   *     tags: [Authentication]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - username
   *               - email
   *               - password
   *             properties:
   *               username:
   *                 type: string
   *                 minLength: 3
   *                 maxLength: 30
   *               email:
   *                 type: string
   *                 format: email
   *               password:
   *                 type: string
   *                 minLength: 8
   *                 description: Must contain at least one number and one letter
   *     responses:
   *       201:
   *         description: User registered successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                 userId:
   *                   type: string
   *       400:
   *         description: Registration failed
   */
  router.post('/register', validate(registerValidator), (req, res) => authController.register(req, res));

  /**
   * @openapi
   * /auth/login:
   *   post:
   *     summary: Log in a user
   *     tags: [Authentication]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - email
   *               - password
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *               password:
   *                 type: string
   *     responses:
   *       200:
   *         description: Login successful
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 token:
   *                   type: string
   *       401:
   *         description: Authentication failed
   */
  router.post('/login', validate(loginValidator), (req, res) => authController.login(req, res));

  /**
   * @openapi
   * /auth/logout:
   *   post:
   *     summary: Log out a user
   *     tags: [Authentication]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Logged out successfully
   *       400:
   *         description: Logout failed
   *       401:
   *         description: Unauthorized
   */
  router.post('/logout', validate(tokenValidator), (req, res) => authController.logout(req, res));

  /**
   * @openapi
   * /auth/refresh-token:
   *   post:
   *     summary: Refresh JWT token
   *     tags: [Authentication]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Token refreshed successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 token:
   *                   type: string
   *       401:
   *         description: Token refresh failed
   */
  router.post('/refresh-token', validate(tokenValidator), (req, res) => authController.refreshToken(req, res));

  /**
   * @openapi
   * /auth/change-password:
   *   post:
   *     summary: Change user password
   *     tags: [Authentication]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - currentPassword
   *               - newPassword
   *             properties:
   *               currentPassword:
   *                 type: string
   *               newPassword:
   *                 type: string
   *                 minLength: 8
   *                 description: Must contain at least one number and one letter
   *     responses:
   *       200:
   *         description: Password changed successfully
   *       400:
   *         description: Password change failed
   *       401:
   *         description: Unauthorized
   */
  router.post('/change-password', validate(changePasswordValidator), (req, res) => authController.changePassword(req, res));

  /**
   * @openapi
   * /auth/profile:
   *   get:
   *     summary: Get user profile
   *     tags: [Authentication]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: User profile retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/User'
   *       400:
   *         description: Failed to retrieve user profile
   *       401:
   *         description: Unauthorized
   */
  router.get('/profile', (req, res) => authController.getUserProfile(req, res));

export default router;