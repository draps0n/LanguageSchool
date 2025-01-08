const verifyRole = (...roles) => {
  return (req, res, next) => {
    console.log("Role ID:", req.roleId);
    console.log("Allowed roles:", roles);
    if (!req || !req.roleId || !roles.includes(req.roleId)) {
      return res.status(403).json({
        message: "You don't have permission to access this resource",
      });
    }
    next();
  };
};

module.exports = verifyRole;
