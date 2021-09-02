import express from 'express';

const router = express.Router();

/**
 * @swagger
 * /test:
 *   get:
 *     summary: test
 *     description: Test api
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/test', (req, res) => {
  res.send('test');
});

export default router;
