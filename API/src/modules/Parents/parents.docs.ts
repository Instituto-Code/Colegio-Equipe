/**
 * @swagger
 * tags:
 *   name: Parents
 *   description: Atribuições de pais dos alunos
 */

/**
 * @swagger
 * /api/parents/list-childrens:
 *   post:
 *     summary: Listar filhos
 *     tags: [Parents]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userId]
 *             properties:
 *               userId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Listagem de filhos.
 */