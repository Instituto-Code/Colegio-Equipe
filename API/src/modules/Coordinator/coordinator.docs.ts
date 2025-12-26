/**
 * @swagger
 * tags:
 *   name: Coordinator
 *   description: Atribuições comuns a coordenadores
 */


/**
 * @swagger
 * /api/coordenador/register-classes:
 *   post:
 *     summary: Criar Turmas
 *     tags: [Coordinator]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nome, turno, anoLetivo]
 *             properties:
 *               nome:
 *                 type: string
 *               turno:
 *                 type: string
 *               anoLetivo:
 *                 type: string
 *     responses:
 *       201:
 *         description: Turma criada com sucesso.
 */

/**
 * @swagger
 * /api/coordenador/register-students:
 *   post:
 *     summary: Matricular aluno
 *     tags: [Coordinator]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nome, matricula, dataNasc, sexo, cpf]
 *             properties:
 *               nome:
 *                 type: string
 *               matricula:
 *                 type: string
 *               dataNasc:
 *                 type: date
 *               sexo:
 *                 type: string
 *               cpf:
 *                 type: string
 *     responses:
 *       201:
 *         description: Turma criada com sucesso.
 */