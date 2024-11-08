import CodeItemService from '../../services/common/codeItemService';

export const getDataList = async ( req, res ) => {
  try {
    const params = req.query||{};
    if( params ) {
      const list = await CodeItemService.getDataList(req.query);
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

export const getDataPage = async ( req, res ) => {
  try {
    const params = req.query||{};
    if( params ) {
      const list = await CodeItemService.getDataPage(req.query);
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
      const detail = await CodeItemService.getDataDetail(req.query);
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
      const result = await CodeItemService.createData(data);
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
      const result = await CodeItemService.updateData(data);
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
      const result = await CodeItemService.deleteData(data);
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
      const result = await CodeItemService.deleteAllData(data);
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
  getDataPage,
  getDataDetail,
  createData,
  updateData,
  deleteData,
  deleteAllData,
}
