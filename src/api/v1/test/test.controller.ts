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
 *       400:
 *         description: Bad request
 */
router.get('/test', (req, res) => {
  throw new Error('error')
  // res.send('test');
});

export default router;
