/**
 * @swagger
 * tags:
 *   name: Notification
 *   description: Notificações para responsáveis, professores ou grupos
 */

/**
 * @swagger
 * /api/note/create-note:
 *   post:
 *     summary: Criar notificações
 *     tags: [Notification]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [authorId, conteudo, tipo, pessoa, grupo]
 *             properties:
 *               userId:
 *                 type: string
 *               conteudo:
 *                 type: string
 *               tipo:
 *                 type: string
 *               pessoa:
 *                 type: string
 *               grupo:
 *                 type: string
 *     responses:
 *       201:
 *         description: Listagem de filhos.
 */

/**
 * @swagger
 * /api/note/delete-note/:id:
 *   delete:
 *     summary: Deletar notificação
 *     tags: [Notification]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [notificationId]
 *             properties:
 *               notificationId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Listagem de filhos.
 */

/**
 * @swagger
 * /api/note/list-note-groups:
 *   get:
 *     summary: Listar notificações de um grupo para um usuário
 *     tags: [Notification]
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
 *         description: Listagem de notificações por grupo.
 */

/**
 * @swagger
 * /api/note/view/:noteId:
 *   patch:
 *     summary: Visualização em notificações
 *     tags: [Notification]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userId, noteId]
 *             properties:
 *               userId:
 *                 type: string
 *               notiId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Listagem de notificações.
 */

/**
 * @swagger
 * /api/note/list-note/:userId/user:
 *   patch:
 *     summary: Listar notificações de um usuário
 *     tags: [Notification]
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
 *         description: Listagem de notificações do usuário logado.
 */

/**
 * @swagger
 * /api/note/list-all/notifications:
 *   patch:
 *     summary: Listar todas as notificações
 *     tags: [Notification]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Listagem de notificações do usuário logado.
 */