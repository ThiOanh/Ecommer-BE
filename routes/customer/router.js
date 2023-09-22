const express = require('express');
const router = express.Router();
const passport = require('passport');

const { validateSchema } = require('../../helper');
const {
  getDetailSchema,
  createSchema,
} = require('./validations');
const {
  getAll,
  getDetail,
  create,
  remove,
  update,
} = require('./controller');

router.route('/')
  .get(getAll)
  .post(validateSchema(createSchema), create) // ADMIN TẠO TÀI KHOẢN CHO NGƯỜI DÙNG

router.route('/register')
  .post(validateSchema(createSchema), create) // ADMIN TẠO TÀI KHOẢN CHO NGƯỜI DÙNG

router.route('/:id')
  .get(validateSchema(getDetailSchema), getDetail)
  .patch(validateSchema(createSchema), update)
  .delete(validateSchema(getDetailSchema), remove)

module.exports = router;
