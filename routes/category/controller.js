const { Category } = require('../../models');
const { fuzzySearch } = require('../../helper');

module.exports = {
  getAll: async (req, res, next) => {
    const result = await Category.find({ isDeleted: false });

    res.send(200, {
      message: "Thành công",
      payload: result,
    });
  },

  search: async (req, res, next) => {
    const { name } = req.query;

    const conditionFind = { isDeleted: false };

    if (name) conditionFind.name = fuzzySearch(name);

    const result = await Category.find(conditionFind)

    res.send(200, {
      message: "Thành công",
      payload: result,
    });
  },

  getDetail: async (req, res, next) => {
    const { id } = req.params;

    // const result = await Category.findById(id);
    const result = await Category.findOne({
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
  },

  create: async (req, res, next) => {
    try {
      const { name, description } = req.body;
      const newRecord = new Category({
        name, description,
      });

      let result = await newRecord.save();

      return res.send(200, {
        message: "Thành công",
        payload: result,
      });
    } catch (err) {
      return res.send(400, {
        message: "Thất bại",
        errors: err,
      });
    }
  },

  update: async (req, res, next) => {
    const { id } = req.params;
    const { name, description, isDeleted } = req.body;

    try {
      // Cập nhật khi tìm được
      // const result = await Category.findByIdAndUpdate(
      //   id,
      //   { name, description, isDeleted },
      //   { new: true },
      // );

      const result = await Category.findOneAndUpdate(
        { _id: id, isDeleted: false },
        { name, description, isDeleted },
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
    } catch (err) {
      return res.send(400, {
        message: "Thất bại",
        errors: err,
      });
    }
  },

  softDelete: async (req, res, next) => {
    const { id } = req.params;

    const result = await Category.findByIdAndUpdate(
      id,
      { isDeleted: true },
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
  },
};