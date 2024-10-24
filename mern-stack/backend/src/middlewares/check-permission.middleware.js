import { TypeRole } from '../common/type.common.js';

export const checkPermission = (req, res, next) => {
  const { user } = req;

  // check permission
  switch (user.role) {
    case TypeRole.ADMIN:
      req.permission = TypeRole.ADMIN;
      break;
    case TypeRole.STAFF:
      req.permission = TypeRole.STAFF;
      break;
    case TypeRole.USER:
    default:
      return res.status(403).json({ message: 'Permission denied!', success: false });
  }

  next();
};
