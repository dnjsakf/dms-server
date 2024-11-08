import { getPath } from '../../utils/pathUtil';

import CommonService from '../../services/common/commonService';

export const getIndex = async (req, res) => {
  try {
    res.sendFile(getPath('public', 'index.html'));
  } catch ( error ) {
    res.status(500).json({
      code: 500,
      data: null,
      message: error.message
    });
  }
}

export const getInitData = async (req, res) => {
  try {
    const initData = await CommonService.getInitData({
      ...req.user,
    });
    res.status(200).json({
      code: 200,
      data: initData,
      message: "Success"
    });
  } catch ( error ) {
    res.status(500).json({
      code: 500,
      data: null,
      message: error.message
    });
  }
}

export default {
  getIndex,
  getInitData,
}
