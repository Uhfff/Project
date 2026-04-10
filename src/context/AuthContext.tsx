import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
  changePassword: (oldPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Проверяем сохраненную сессию
    const savedUserId = localStorage.getItem('currentUserId');
    if (savedUserId) {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const foundUser = users.find((u: User) => u.id === savedUserId);
      if (foundUser) {
        const { password, ...userWithoutPassword } = foundUser;
        setUser(userWithoutPassword as User);
      }
    }
  }, []);

  const register = async (email: string, password: string, name: string) => {
    // Валидация
    if (!email || !password || !name) {
      return { success: false, error: 'Все поля обязательны для заполнения' };
    }

    if (password.length < 6) {
      return { success: false, error: 'Пароль должен содержать минимум 6 символов' };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { success: false, error: 'Некорректный email адрес' };
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Проверка на существующего пользователя
    if (users.some((u: User) => u.email === email)) {
      return { success: false, error: 'Пользователь с таким email уже существует' };
    }

    const newUser: User = {
      id: Date.now().toString(),
      email,
      password, // В реальном приложении пароль должен быть хешированным!
      name,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUserId', newUser.id);

    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword as User);

    return { success: true };
  };

  const login = async (email: string, password: string) => {
    if (!email || !password) {
      return { success: false, error: 'Email и пароль обязательны' };
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const foundUser = users.find((u: User) => u.email === email && u.password === password);

    if (!foundUser) {
      return { success: false, error: 'Неверный email или пароль' };
    }

    localStorage.setItem('currentUserId', foundUser.id);
    const { password: _, ...userWithoutPassword } = foundUser;
    setUser(userWithoutPassword as User);

    return { success: true };
  };

  const logout = () => {
    localStorage.removeItem('currentUserId');
    setUser(null);
  };

  const updateProfile = (data: Partial<User>) => {
    if (!user) return;

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex((u: User) => u.id === user.id);

    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...data };
      localStorage.setItem('users', JSON.stringify(users));
      
      const { password: _, ...userWithoutPassword } = users[userIndex];
      setUser(userWithoutPassword as User);
    }
  };

  const changePassword = async (oldPassword: string, newPassword: string) => {
    if (!user) return { success: false, error: 'Пользователь не авторизован' };

    if (newPassword.length < 6) {
      return { success: false, error: 'Новый пароль должен содержать минимум 6 символов' };
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex((u: User) => u.id === user.id);

    if (userIndex === -1) {
      return { success: false, error: 'Пользователь не найден' };
    }

    if (users[userIndex].password !== oldPassword) {
      return { success: false, error: 'Неверный текущий пароль' };
    }

    users[userIndex].password = newPassword;
    localStorage.setItem('users', JSON.stringify(users));

    return { success: true };
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateProfile, changePassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
