/**
 * @swagger
 * tags:
 *   name: Parents
 *   description: Consulta de filhos e dados escolares pelo responsável
 */

/**
 * @swagger
 * /api/parents/list-childrens:
 *   get:
 *     summary: Listar filhos do responsável autenticado
 *     tags: [Parents]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Listagem de filhos.
 *       403:
 *         description: Acesso restrito a responsáveis.
 */

/**
 * @swagger
 * /api/parents/child/{studentId}:
 *   get:
 *     summary: Consultar notas, frequência e turmas de um filho
 *     tags: [Parents]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Dados escolares do aluno vinculado ao responsável.
 *       403:
 *         description: Aluno não vinculado ao responsável.
 *       404:
 *         description: Responsável ou aluno não encontrado.
 */
