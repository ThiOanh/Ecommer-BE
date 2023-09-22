const yup = require('yup');
const ObjectId = require('mongodb').ObjectId;

const validationSchema = yup.object().shape({
  body: yup.object({
    name: yup.string().max(50, "Tên sản phẩm quá dài").required("Tên không được bỏ trống"),

    price: yup.number().min(0, "Giá không thể âm").integer().required(({ path }) => `${path.split(".")[1]} không được bỏ trống`),

    discount: yup.number().min(0, "Giảm giá không thể âm").max(75, "Giảm giá quá lớn").integer().required(({ path }) => `${path.split(".")[1]} không được bỏ trống`),

    stock: yup.number().min(0, "Số lượng không hợp lệ").integer().required(({ path }) => `${path.split(".")[1]} không được bỏ trống`),

    description: yup.string().max(3000, "Mô tả quá dài").required(({ path }) => `${path.split(".")[1]} không được bỏ trống`),

    // isDeleted: yup.boolean().required(({ path }) => `${path.split(".")[1]} không được bỏ trống`),
    categoryId: yup.string().required().test('Validate ObjectID', '${path} is not valid ObjectID', (value) => {
      if (!value) return true;
      return ObjectId.isValid(value);
    }),

    supplierId: yup.string().required().test('Validate ObjectID', '${path} is not valid ObjectID', (value) => {
      if (!value) return true;
      return ObjectId.isValid(value);
    }),
  }),
});

const validationQuerySchema = yup.object().shape({
  query: yup.object({
    categoryId: yup.string().test('Validate ObjectID', '${path} is not valid ObjectID', (value) => {
      if (!value) return true;
      return ObjectId.isValid(value);
    }),

    priceStart: yup.number().test('Giá không hợp lệ', (value, context) => {
      if (!value) return true; // Không điền giá kết thúc

      if (context.parent.priceEnd) {
        return value < context.parent.priceEnd // Giá kết thúc phải lớn hơn giá bắt đầu (nếu có)
      };

      return value > 0;
    }),

    priceEnd: yup.number().test('Giá không hợp lệ', (value, context) => {
      if (!value) return true; // Không điền giá kết thúc

      if (context.parent.priceStart) {
        return value > context.parent.priceStart; // Giá kết thúc phải lớn hơn giá bắt đầu (nếu có)
      }

      return value > 0;
    }),
    page: yup.number().min(0),

    limit: yup.number().min(2),

    supplierId: yup.string().test('Validate ObjectID', '${path} is not valid ObjectID', (value) => {
      if (!value) return true;
      return ObjectId.isValid(value);
    }),

    name: yup.string(),

    stockStart: yup.number().min(0),

    stockEnd: yup.number(),

    discountStart: yup.number().min(0),

    discountEnd: yup.number().max(50),

    skip: yup.number(),

    limit: yup.number(),
  }),
});

module.exports = {
  validationSchema,
  validationQuerySchema,
}