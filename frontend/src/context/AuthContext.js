import React, { createContext, useContext, useState, useEffect } from "react";
import { loginApi, selectCompanyApi } from "../api/authApi";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("token") || null);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Safe load companies from sessionStorage
    try {
      const storedCompanies = sessionStorage.getItem("companies");
      setCompanies(storedCompanies ? JSON.parse(storedCompanies) : []);
    } catch (err) {
      console.error("Failed to parse companies from sessionStorage", err);
      setCompanies([]);
    }
    setLoading(false);
  }, []);

  // Login: calls existing loginApi and updates state
  const login = async (email, password) => {
    const res = await loginApi({ email, password });

    if (!res?.data) throw new Error("Invalid response from server");

    if (res.data.autoSelected) {
      localStorage.setItem("token", res.data.token);
      setToken(res.data.token);
      return { autoSelected: true, token: res.data.token };
    }

    const companyList = res.data.companies || [];
    setCompanies(companyList);

    try {
      sessionStorage.setItem("companies", JSON.stringify(companyList));
    } catch (err) {
      console.error("Failed to store companies in sessionStorage", err);
    }

    return { autoSelected: false, companies: companyList };
  };

  // Select a company
  const selectCompany = async (companyId) => {
    const res = await selectCompanyApi({ companyId });
    if (!res?.data?.token) throw new Error("Invalid response from server");

    localStorage.setItem("token", res.data.token);
    setToken(res.data.token);

    sessionStorage.removeItem("companies");
    setCompanies([]);

    return res.data.token;
  };

  const logout = () => {
    localStorage.clear();
    sessionStorage.clear();
    setToken(null);
    setCompanies([]);
  };

  return (
    <AuthContext.Provider value={{ token, login, logout, selectCompany, companies, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
