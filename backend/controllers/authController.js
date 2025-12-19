// import * as AuthService from '../service/authService.js';

// // 1️⃣ Login API

// export const login = async (req, res) => {
//   const { email, password } = req.body;

//   const result = await AuthService.login(email, password);

//   return res.json(result);
// };


// // 2️⃣ Get User Companies
// export const getUserCompanies = async (req, res) => {
//   try {
//     const companies = await AuthService.getCompanies(req.user.userId);
//     res.json(companies);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // 3️⃣ Select Company (Mandatory if multiple)
// export const selectCompany = async (req, res) => {
//   try {
//     const { companyId } = req.body;
//     const result = await AuthService.selectCompany(req.user.userId, companyId);
//     res.json(result);
//   } catch (err) {
//     res.status(403).json({ message: err.message });
//   }
// };

// // 4️⃣ Switch Company (After login)
// export const switchCompany = async (req, res) => {
//   try {
//     const { companyId } = req.body;
//     const result = await AuthService.switchCompany(req.user.userId, companyId);
//     res.json(result);
//   } catch (err) {
//     res.status(403).json({ message: err.message });
//   }
// };


import * as AuthService from '../service/authService.js';

// 1️⃣ Login
export const login = async (req, res) => {
  try {
    console.log("login")
    const { email, password } = req.body;
    const result = await AuthService.login(email, password);
    res.json(result);
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
};

// 2️⃣ Get User Companies
export const getUserCompanies = async (req, res) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const companies = await AuthService.getCompanies(req.user.userId);
    res.json(companies);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch companies' });
  }
};

// 3️⃣ Select Company
export const selectCompany = async (req, res) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { companyId } = req.body;
    const result = await AuthService.selectCompany(req.user.userId, companyId);
    res.json(result);
  } catch (err) {
    res.status(403).json({ message: err.message });
  }
};

// 4️⃣ Switch Company
export const switchCompany = async (req, res) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { companyId } = req.body;
    const result = await AuthService.switchCompany(req.user.userId, companyId);
    res.json(result);
  } catch (err) {
    res.status(403).json({ message: err.message });
  }
};
