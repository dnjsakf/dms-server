import runeService from '../../services/mobinogi/RuneService';

export const getDataList = async ( req, res ) => {
  try {
    const params = req.query||{};
    if( params ) {
      const list = await runeService.getDataList(req.query);
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

export default {
  getDataList,
}
