/**
 * @swagger
 * tags:
 *   name: Teacher
 *   description: Atribuições de professor
 */

/**
 * @swagger
 * /api/teacher/insert-grades:
 *   post:
 *     summary: Inserir notas de alunos
 *     tags: [Teacher]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userId, disciplinaId, studentId, tipo, nota, data]
 *             properties:
 *               userId:
 *                 type: string
 *               disciplinaId:
 *                 type: string
 *               studentId:
 *                 type: string
 *               tipo:
 *                 type: string
 *               nota:
 *                 type: number
 *               data:
 *                 type: date
 *     responses:
 *       201:
 *         description: Nota registrada.
 */

/**
 * @swagger
 * /api/teacher/insert-attendance:
 *   patch:
 *     summary: Inserir frequência de alunos
 *     tags: [Teacher]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userId, studentId, tipo, nota, data]
 *             properties:
 *               userId:
 *                 type: string
 *               studentId:
 *                 type: string
 *               tipo:
 *                 type: string
 *               nota:
 *                 type: number
 *               data:
 *                 type: date
 *     responses:
 *       201:
 *         description: Nota registrada.
 */
/**
 * @swagger
 * /api/teacher/list-classes:
 *   get:
 *     summary: Listagem de turmas de um professor
 *     tags: [Teacher]
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
 *       201:
 *         description: listagem de classes.
 */
/**
 * @swagger
 * /api/teacher/notes:
 *   patch:
 *     summary: Inserir anotações para alunos
 *     tags: [Teacher]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userId, studentId, anotacao]
 *             properties:
 *               userId:
 *                 type: string
 *               studentId:
 *                 type: string
 *               anotacao:
 *                 type: string
 *     responses:
 *       201:
 *         description: Anotação feita com sucesso.
 */