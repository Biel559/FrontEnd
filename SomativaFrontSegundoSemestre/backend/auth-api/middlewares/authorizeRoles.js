function authorizeRoles(...allowedRoles) {
    return (req, res, next) => {
      // Supondo que `req.user` contém os dados do usuário após autenticação (via JWT)
      const userRole = req.user?.role; // Verifica se `req.user` existe e obtém a role
      
      if (!userRole) {
        return res.status(401).json({ message: "User not authenticated" });
      }
  
      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({ message: "Access denied: insufficient permissions" });
      }
  
      next(); // Usuário autorizado
    };
  }
  
  module.exports = authorizeRoles;
  