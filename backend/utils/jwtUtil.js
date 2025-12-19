import jwt from 'jsonwebtoken';

export const generateToken = ({ userId, companyId, role }) => {
  if (!companyId) {
    throw new Error('Company context missing');
  }

  return jwt.sign(
    { userId, companyId, role },
    process.env.JWT_SECRET,
    { expiresIn: '8h' }
  );
};
