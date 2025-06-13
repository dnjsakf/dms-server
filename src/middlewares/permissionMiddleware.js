
const permissionMiddleware = async (req, res, next) => {
  const path = req.path;
  const session = req.session;

  return next();
}

export default permissionMiddleware;
