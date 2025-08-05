const adminOnly = (req, res, next) => {
    
  if (req.userRole !== 'admin') {
    return res.status(403).json({ message: 'Admins only!' });
  }
  next();
};

module.exports = {adminOnly};