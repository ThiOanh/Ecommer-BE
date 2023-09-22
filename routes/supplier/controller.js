const { Supplier } = require('../../models');
const { fuzzySearch } = require('../../helper');

module.exports = {
  getAll: async (req, res, next) => {
    try {
      const result = await Supplier.find({ isDeleted: false });

      res.send(200, {
        message: "Thành công",
        payload: result,
      });
    } catch (error) {
      return res.send(404, {
        message: "Không tìm thấy",
      })
    }
  },

  search: async (req, res, next) => {
    try {
      const { name, address } = req.query;
      const conditionFind = { isDeleted: false };

      if (name) conditionFind.name = fuzzySearch(name);
      if (address) conditionFind.address = fuzzySearch(address);

      const result = await Supplier.find(conditionFind)

      res.send(200, {
        message: "Thành công",
        payload: result,
      });
    } catch (error) {
      return res.send(404, {
        message: "Không tìm thấy",
      })
    }
  },

  getDetail: async (req, res, next) => {
    try {
      const { id } = req.params;

      const result = await Supplier.findOne({
        _id: id,
        isDeleted: false,
      });

      if (result) {
        return res.send(200, {
          message: "Thành công",
          payload: result,
        });
      }

      return res.send(404, {
        message: "Không tìm thấy",
      })
    } catch (error) {
      return res.send(404, {
        message: "Không tìm thấy",
      })
    }
  },

  create: async (req, res, next) => {
    try {
      const { name, email, phoneNumber, address } = req.body;

      const newRecord = new Supplier({
        name, email, phoneNumber, address,
      });

      let result = await newRecord.save();

      return res.send(200, {
        message: "Thành công",
        payload: result,
      });
    } catch (error) {
      return res.send(404, {
        message: "Không tìm thấy",
        error,
      })
    }
  },

  update: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { name, email, phoneNumber, address } = req.body;

      const result = await Supplier.findOneAndUpdate(
        { _id: id, isDeleted: false },
        { name, email, phoneNumber, address },
        { new: true },
      );

      if (result) {
        return res.send(200, {
          message: "Cập nhật thành công",
          payload: result,
        });
      }

      return res.send(400, {
        message: "Thất bại",
      });
    } catch (error) {
      return res.send(404, {
        message: "Không tìm thấy",
        error,
      });
    }
  },

  softDelete: async (req, res, next) => {
    try {
      const { id } = req.params;

      const result = await Supplier.findByIdAndUpdate(
        id,
        { isDeleted: true },
        { new: true },
      );

      if (result) {
        return res.send(200, {
          message: "Xóa thành công",
          payload: result,
        });
      }

      return res.send(400, {
        message: "Thất bại",
      });
    } catch (error) {
      return res.send(404, {
        message: "Không tìm thấy",
        error,
      });
    }
  },
};