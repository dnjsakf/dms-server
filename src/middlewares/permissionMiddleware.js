import MenuService from "../services/common/menuService";

const permissionMiddleware = async (req, res, next) => {
  const path = req.path;
  const user = req;

  console.log(path, req.url, req.user);

  return next();
}

export default permissionMiddleware;
