const jwt = require("jsonwebtoken");
const { AuthenticationError } = require("apollo-server");

const { SECRET_KEY } = require("../config");

module.exports = (context) => {
  const authHeader = context.req.headers.authorization;
  const role = context.req.headers.role;
  if (authHeader) {
    const token = authHeader.split("Bearer ")[1];
    if (token) {
      try {
        const user = jwt.verify(token, SECRET_KEY);
        if (role) {
          if (role === "admin") {
            return user;
          }
          throw new Error("Không có quyền truy cập");
        }
        throw new Error("Không có vai trò phù hợp");
      } catch (err) {
        throw new AuthenticationError("Token đã hết hạn hoặc không đúng");
      }
    }
    throw new Error('Auth token phải ở định dạng "Bearer [token]"');
  }
  throw new Error("Không tìm thấy Authorization header");
};
