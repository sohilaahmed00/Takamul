import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Permission {
  view: boolean;
  add: boolean;
  edit: boolean;
  delete: boolean;
  misc?: Record<string, boolean>;
}

export interface UserGroup {
  id: string;
  name: string;
  description: string;
  permissions: Record<string, Permission>;
}

interface UserGroupsContextType {
  userGroups: UserGroup[];
  groups: UserGroup[];
  addUserGroup: (group: Omit<UserGroup, 'id'>) => void;
  updateUserGroup: (id: string, group: Partial<UserGroup>) => void;
  deleteUserGroup: (id: string) => void;
}

const UserGroupsContext = createContext<UserGroupsContextType | undefined>(undefined);

const defaultPermissions: Record<string, Permission> = {
  products: { view: true, add: false, edit: false, delete: false },
  sales: { view: true, add: false, edit: false, delete: false },
  purchases: { view: true, add: false, edit: false, delete: false },
  customers: { view: true, add: false, edit: false, delete: false },
  suppliers: { view: true, add: false, edit: false, delete: false },
  reports: { view: true, add: false, edit: false, delete: false },
};

export const UserGroupsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userGroups, setUserGroups] = useState<UserGroup[]>(() => {
    const saved = localStorage.getItem('takamul_user_groups');
    return saved ? JSON.parse(saved) : [
      {
        id: '1',
        name: 'owner',
        description: 'Owner with full access',
        permissions: Object.keys(defaultPermissions).reduce((acc, key) => ({
          ...acc,
          [key]: { view: true, add: true, edit: true, delete: true }
        }), {})
      },
      {
        id: '5',
        name: 'sales',
        description: 'Sales Staff',
        permissions: defaultPermissions
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('takamul_user_groups', JSON.stringify(userGroups));
  }, [userGroups]);

  const addUserGroup = (groupData: Omit<UserGroup, 'id'>) => {
    const newGroup: UserGroup = {
      ...groupData,
      id: Math.random().toString(36).substr(2, 9),
    };
    setUserGroups(prev => [...prev, newGroup]);
  };

  const updateUserGroup = (id: string, groupData: Partial<UserGroup>) => {
    setUserGroups(prev => prev.map(group => group.id === id ? { ...group, ...groupData } : group));
  };

  const deleteUserGroup = (id: string) => {
    setUserGroups(prev => prev.filter(group => group.id !== id));
  };

  return (
    <UserGroupsContext.Provider value={{ userGroups, groups: userGroups, addUserGroup, updateUserGroup, deleteUserGroup }}>
      {children}
    </UserGroupsContext.Provider>
  );
};

export const useUserGroups = () => {
  const context = useContext(UserGroupsContext);
  if (context === undefined) {
    throw new Error('useUserGroups must be used within a UserGroupsProvider');
  }
  return context;
};
