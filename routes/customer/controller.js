
const { Customer } = require('../../models');

module.exports = {
  getAll: async (req, res, next) => {
    try {
      let results = await Customer.find({
        isDeleted: false,
      })
  
      return res.send({ code: 200, payload: results });
    } catch (err) {
      return res.status(500).json({ code: 500, error: err });
    }
  },
  
  getDetail: async (req, res, next) => {
    try {
      const { id } = req.params;
  
      let result = await Customer.findOne({
        _id: id,
        isDeleted: false,
      })
  
      if (result) {
        return res.send({ code: 200, payload: result });
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

      const { email, phoneNumber } = data;

      const getEmailExits = Customer.findOne({ email });
      const getPhoneExits = Customer.findOne({ phoneNumber });

      const [foundEmail, foundPhoneNumber] = await Promise.all([getEmailExits, getPhoneExits]);

      const errors = [];
      if (foundEmail) errors.push('Email đã tồn tại');
      // if (!isEmpty(foundEmail)) errors.push('Email đã tồn tại');
      if (foundPhoneNumber) errors.push('Số điện thoại đã tồn tại');

      if (errors.length > 0) {
        return res.status(404).json({
          code: 404,
          message: "Không thành công",
          errors,
        });
      }

      const newItem = new Customer(data);
  
      let result = await newItem.save();
  
      return res.send({ code: 200, message: 'Tạo thành công', payload: result });
    } catch (err) {
      console.log('««««« err »»»»»', err);
      return res.status(500).json({ code: 500, error: err });
    }
  },

  remove: async function (req, res, next) {
    try {
      const { id } = req.params;
  
      let result = await Customer.findOneAndUpdate(
        { _id: id,isDeleted: false },
        { isDeleted: true },
        { new: true },
      );
  
      if (result) {
        return res.send({ code: 200, payload: result, message: 'Xóa thành công' });
      }
  
      return res.status(410).send({ code: 404, message: 'Không tìm thấy' });
    } catch (err) {
      return res.status(500).json({ code: 500, error: err });
    }
  },

  update: async function (req, res, next) {
    try {
      const { id } = req.params;  
      const updateData = req.body;
      
      const { email, phoneNumber } = updateData;

      const getEmailExits = Customer.find({ 
        email,
        _id: { $ne: id }
      });

      const getPhoneExits = Customer.find({
        phoneNumber,
        _id: { $ne: id }
      });

      const [foundEmail, foundPhoneNumber] = await Promise.all([getEmailExits, getPhoneExits]);

      const errors = [];
      if (foundEmail && foundEmail.length > 0) errors.push('Email đã tồn tại');
      // if (!isEmpty(foundEmail)) errors.push('Email đã tồn tại');
      if (foundPhoneNumber && foundPhoneNumber.length > 0) errors.push('Số điện thoại đã tồn tại');

      if (errors.length > 0) {
        return res.status(404).json({
          code: 404,
          message: "Không thành công",
          errors,
        });
      }

      const found = await Customer.findByIdAndUpdate(id, updateData, {
        new: true,
      });
  
      if (found) {
        return res.send({
          code: 200,
          message: 'Cập nhật thành công',
          payload: found,
        });
      }
  
      return res.status(404).send({ code: 404, message: 'Không tìm thấy' });
    } catch (error) {
      return res.status(500).json({ code: 500, error: err });
    }
  },
};
