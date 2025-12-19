// import bcrypt from 'bcrypt';
// import User from '../models/UserModel.js';
// import CompanyUser from '../models/CompanyUserModel.js';
// import Company from '../models/CompanyModel.js';
// import { generateToken } from '../utils/jwtUtil.js';


// export const login = async (email, password) => {
//   const user = await User.findOne({ where: { email, isActive: true } });
//   if (!user) throw new Error('Invalid credentials');

//   const match = await bcrypt.compare(password, user.passwordHash);
//   if (!match) throw new Error('Invalid credentials');

//   const companies = await CompanyUser.findAll({
//     where: { UserId: user.id, isActive: true },
//     include: [Company]
//   });

//   if (!companies.length) throw new Error('No company access assigned');

//   // AUTO SELECT
//   if (companies.length === 1) {
//     const companyUser = companies[0];

//     const token = generateToken({
//       userId: user.id,
//       companyId: companyUser.CompanyId,
//       role: companyUser.role
//     });

//     return {
//       autoSelected: true,
//       token,
//       company: {
//         id: companyUser.CompanyId,
//         name: companyUser.Company.name,
//         role: companyUser.role
//       }
//     };
//   }

//   // FORCE MANUAL SELECTION
//   return {
//     autoSelected: false,
//     companies: companies.map(cu => ({
//       companyId: cu.CompanyId,
//       companyName: cu.Company.name,
//       role: cu.role
//     }))
//   };
// };

// export  const getCompanies = async (userId) => {
//   return CompanyUser.findAll({
//     where: { userId, isActive: true },
//     include: [Company]
//   });
// };

// export const selectCompany = async (userId, companyId) => {
//   const mapping = await CompanyUser.findOne({
//     where: { userId, companyId, isActive: true }
//   });

//   if (!mapping) {
//     throw new Error('Unauthorized company access');
//   }

//   const token = jwtUtil.generateToken({
//     userId,
//     companyId,
//     role: mapping.role
//   });

//   return {
//     token,
//     companyId,
//     role: mapping.role
//   };
// };

// export const switchCompany = async (userId, companyId) => {
//   return exports.selectCompany(userId, companyId);
// };

// import bcrypt from 'bcrypt';
// import User from '../models/UserModel.js';
// import CompanyUser from '../models/CompanyUserModel.js';
// import Company from '../models/CompanyModel.js';
// import { generateToken } from '../utils/jwtUtil.js';

// export const login = async (email, password) => {
//   const user = await User.findOne({ where: { email, isActive: true } });
//   console.log(user)
//   console.log({ email, isActive: true })
//   if (!user) throw new Error('Invalid credentials');

//   const match = await bcrypt.compare(password, user.passwordHash);
//   if (!match) throw new Error('Invalid credentials1');

//   const companies = await CompanyUser.findAll({
//     where: { UserId: user.id, isActive: true },
//     include: [Company]
//   });

//   if (!companies.length) {
//     throw new Error('No company access assigned');
//   }

//   if (companies.length === 1) {
//     const cu = companies[0];

//     const token = generateToken({
//       userId: user.id,
//       companyId: cu.CompanyId,
//       role: cu.role
//     });

//     return {
//       autoSelected: true,
//       token,
//       company: {
//         id: cu.CompanyId,
//         name: cu.Company?.name,
//         role: cu.role
//       }
//     };
//   }

//   return {
//     autoSelected: false,
//     companies: companies.map(cu => ({
//       companyId: cu.CompanyId,
//       companyName: cu.Company?.name,
//       role: cu.role
//     }))
//   };
// };
import bcrypt from 'bcrypt';
import User from '../models/UserModel.js';
import CompanyUser from '../models/CompanyUserModel.js';
import Company from '../models/CompanyModel.js';
import Role from '../models/RoleModel.js';
import { generateToken } from '../utils/jwtUtil.js';

export const login = async (email, password) => {
  const user = await User.findOne({ email, isActive: true });
  if (!user) throw new Error('Invalid credentials');

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) throw new Error('Invalid credentials');

  const mappings = await CompanyUser.find({
    userId: user.id,
    isActive: true
  });
console.log("mappings",mappings)
  if (!mappings.length) {
    throw new Error('No company access assigned');
  }

  // Fetch companies & roles in parallel
  const companyIds = mappings.map(m => m.companyId);
  const roleIds = mappings.map(m => m.roleId);
console.log("roleid",roleIds)
  const [companies, roles] = await Promise.all([
    Company.find({ id: { $in: companyIds } }),
    Role.find({ id: { $in: roleIds } })
  ]);
    console.log("companies",companies)
    console.log("Roles",roles)
  const companyMap = new Map(companies.map(c => [c.id, c]));
  const roleMap = new Map(roles.map(r => [r.id, r]));

  if (mappings.length === 1) {
    const m = mappings[0];
    const company = companyMap.get(m.companyId);
    const role = roleMap.get(m.roleId);

    if (!company || !role) {
      throw new Error('Invalid role or company configuration');
    }

    const token = generateToken({
      userId: user.id,
      companyId: company.id,
      roleId: role.id
    });

    return {
      autoSelected: true,
      token,
      company: {
        id: company.id,
        name: company.name,
        role: role.name
      }
    };
  }

  return {
    autoSelected: false,
    companies: mappings.map(m => {
      const company = companyMap.get(m.companyId);
      const role = roleMap.get(m.roleId);

      return {
        companyId: company?.id,
        companyName: company?.name,
        role: role?.name
      };
    })
  };
};

export const getCompanies = async (userId) => {
  const mappings = await CompanyUser.find({
    userId,
    isActive: true
  });

  if (!mappings.length) return [];

  const companyIds = mappings.map(m => m.companyId);
  const roleIds = mappings.map(m => m.roleId);

  const [companies, roles] = await Promise.all([
    Company.find({ id: { $in: companyIds } }),
    Role.find({ id: { $in: roleIds } })
  ]);

  const companyMap = new Map(companies.map(c => [c.id, c]));
  const roleMap = new Map(roles.map(r => [r.id, r]));

  return mappings.map(m => ({
    companyId: m.companyId,
    companyName: companyMap.get(m.companyId)?.name,
    role: roleMap.get(m.roleId)?.name
  }));
};



export const selectCompany = async (userId, companyId) => {
  const mapping = await CompanyUser.findOne({
    userId,
    companyId,
    isActive: true
  });

  if (!mapping) {
    throw new Error('Unauthorized company access');
  }

  const role = await Role.findOne({ id: mapping.roleId });
  if (!role) {
    throw new Error('Invalid role configuration');
  }

  const token = generateToken({
    userId,
    companyId,
    roleId: role.id
  });

  return {
    token,
    companyId,
    role: role.name
  };
};



export const switchCompany = async (userId, companyId) => {
  return selectCompany(userId, companyId);
};

