import RoleService from '../../services/common/roleService';

export const getDataList = async ( req, res ) => {
  try {
    const params = req.query||{};
    if( params ) {
      const list = await RoleService.getDataList(req.query);
      res.json({
        code: 200,
        data: list,
        message: 'Success',
      });
    } else {
      res.json({
        code: 400,
        data: null,
        message: 'Invalid Request Data.',
      });
    }
  } catch ( error ) {
    res.status(500).json({
      code: 500,
      data: null,
      message: error.message
    });
  }
}

export const getDataDetail = async ( req, res ) => {
  try {
    const params = req.query||{};
    if( params ) {
      const detail = await RoleService.getDataDetail(req.query);
      res.json({
        code: 200,
        data: detail,
        message: 'Success',
      });
    } else {
      res.json({
        code: 400,
        data: null,
        message: 'Invalid Request Data.',
      });
    }
  } catch ( error ) {
    res.status(500).json({
      code: 500,
      data: null,
      message: error.message
    });
  }
}

export const createData = async ( req, res ) => {
  try {
    const data = req.body;
    if( data ){
      const result = await RoleService.createData(data);
      res.status(200).json({
        code: 200,
        data: result,
        message: 'Success',
      });
    } else {
      res.status(400).json({
        code: 400,
        data: null,
        message: 'Invalid Request Data.'
      });
    }
  } catch ( error ) {
    res.status(500).json({
      code: 500,
      data: null,
      message: error.message
    });
  }
}

export const updateData = async ( req, res ) => {
  try {
    const data = req.body;
    if( data ){
      const result = await RoleService.updateData(data);
      res.status(200).json({
        code: 200,
        data: result,
        message: 'Success',
      });
    } else {
      res.status(400).json({
        code: 400,
        data: null,
        message: 'Invalid Request Data.'
      });
    }
  } catch ( error ) {
    res.status(500).json({
      code: 500,
      data: null,
      message: error.message
    });
  }
}

export const deleteData = async ( req, res ) => {
  try {
    const data = req.body;
    if( data ){
      const result = await RoleService.deleteData(data);
      res.status(200).json({
        code: 200,
        data: result,
        message: 'Success',
      });
    } else {
      res.status(400).json({
        code: 400,
        data: null,
        message: 'Invalid Request Data.'
      });
    }
  } catch ( error ) {
    res.status(500).json({
      code: 500,
      data: null,
      message: error.message
    });
  }
}

export const deleteAllData = async ( req, res ) => {
  try {
    const data = req.body;
    if( data ){
      const result = await RoleService.deleteAllData(data);
      res.status(200).json({
        code: 200,
        data: result,
        message: 'Success',
      });
    } else {
      res.status(400).json({
        code: 400,
        data: null,
        message: 'Invalid Request Data.'
      });
    }
  } catch ( error ) {
    res.status(500).json({
      code: 500,
      data: null,
      message: error.message
    });
  }
}

export default {
  getDataList,
  getDataDetail,
  createData,
  updateData,
  deleteData,
  deleteAllData,
}
