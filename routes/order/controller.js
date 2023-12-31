const { Order, Customer, Employee, Product } = require('../../models');
const { asyncForEach } = require('../../helper');

module.exports = {
  getAll: async (req, res, next) => {
    try {
      let results = await Order.find();

      return res.send({ code: 200, payload: results });
    } catch (err) {
      return res.status(500).json({ code: 500, error: err });
    }
  },

  getDetail: async (req, res, next) => {
    try {
      const { id } = req.params;

      let found = await Order.findById(id);

      if (found) {
        return res.send({ code: 200, payload: found });
      }

      return res.status(410).send({ code: 404, message: 'Không tìm thấy' });
    } catch (err) {
      res.status(404).json({
        message: 'Get detail fail!!',
        payload: err,
      });
    }
  },

  create: async function (req, res, next) {
    try {
      const data = req.body;

      const { customerId, employeeId, orderDetails } = data;

      const getCustomer = Customer.findOne({
        _id: customerId,
        isDeleted: false,
      });

      const getEmployee = Employee.findOne({
        _id: employeeId,
        isDeleted: false,
      });

      const [customer, employee] = await Promise.all([
        getCustomer,
        getEmployee,
      ]);

      const errors = [];
      if (!customer || customer.isDelete)
        errors.push('Khách hàng không tồn tại');
      if (!employee || employee.isDelete)
        errors.push('Nhân viên không tồn tại');

      await asyncForEach(orderDetails, async (item) => {
        const product = await Product.findOne({
          _id: item.productId,
          isDeleted: false,
          // stock: { $gte : item.quantity },
        });

        if (!product) errors.push(`Sản phẩm ${item.productId} không khả dung`);

        if (product && product.stock < item.quantity) errors.push(`Số lượng sản phẩm ${item.productId} không khả dụng`);
      });

      if (errors.length > 0) {
        return res.status(404).json({
          code: 404,
          message: 'Lỗi',
          errors,
        });
      }

      const newItem = new Order(data);

      let result = await newItem.save();

      await asyncForEach(result.orderDetails, async (item) => {
        await Product.findOneAndUpdate(
          { _id: item.productId },
          { $inc: { stock: -item.quantity } }
        );
      });

      return res.send({
        code: 200,
        message: 'Tạo thành công',
        payload: result,
      });
    } catch (err) {
      console.log('««««« err »»»»»', err);
      return res.status(500).json({ code: 500, error: err });
    }
  },

  updateStatus: async function (req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      let found = await Order.findOne({
        _id: id,
        $nor: [{ status: 'CANCELED' }, { status: 'REJECTED' }, { status: 'COMPLETED' }]
      });

      if (found) {
        const result = await Order.findByIdAndUpdate(
          found._id,
          { status },
          { new: true },
        );

        return res.send({
          code: 200,
          payload: result,
          message: 'Cập nhật trạng thái thành công',
        });
      }

      return res.status(410).send({ code: 404, message: 'Thất bại' });
    } catch (err) {
      return res.status(500).json({ code: 500, error: err });
    }
  },

  updateEmployee: async function (req, res, next) {
    try {
      const { id } = req.params;
      const { employeeId } = req.body;

      let checkOrder = await Order.findOne({
        _id: id,
        $or: [{ status: 'DELIVERING' }, { status: 'WAITING' }]
      });

      if (!checkOrder) {
        return res.status(404).json({
          code: 404,
          message: 'Đơn hàng không khả dụng',
        });
      }

      if (checkOrder.employeeId !== employeeId) {
        const employee = await Employee.findOne({
          _id: employeeId,
          isDeleted: false,
        });

        if (!employee) {
          return res.status(404).json({
            code: 404,
            message: 'Nhân viên không tồn tại',
          });
        }

        const updateOrder = await Order.findByIdAndUpdate(id, { employeeId }, {
          new: true,
        });

        if (updateOrder) {
          return res.send({
            code: 200,
            message: 'Cập nhật thành công',
            payload: updateOrder,
          });
        }

        return res.status(404).send({ code: 404, message: 'Không tìm thấy' });
      }

      return res.send({ code: 400, message: 'Không thể cập nhật' });
    } catch (error) {
      return res.status(500).json({ code: 500, error: err });
    }
  },

  updateShippingDate: async function (req, res, next) {
    try {
      const { id } = req.params;
      const { shippedDate } = req.body;

      const updateOrder = await Order.findByIdAndUpdate(id, { shippedDate }, { new: true });

      if (!updateOrder) {
        return res.status(404).send({ code: 404, message: 'Không tìm thấy' });
      }

      return res.send({
        code: 200,
        message: 'Cập nhật thành công',
        payload: updateOrder,
      });
    } catch (error) {
      return res.status(500).json({ code: 500, error });
    }
  }
};
