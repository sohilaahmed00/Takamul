import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useGroups, Group } from '@/context/GroupsContext';
import ResponsiveModal from './ResponsiveModal';

interface EditGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  group: Group;
}

const EditGroupModal: React.FC<EditGroupModalProps> = ({ isOpen, onClose, group }) => {
  const { t, direction } = useLanguage();
  const { updateGroup } = useGroups();
  const [name, setName] = useState(group.name);
  const [description, setDescription] = useState(group.description);

  useEffect(() => {
    setName(group.name);
    setDescription(group.description);
  }, [group]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateGroup(group.id, { name, description });
    onClose();
  };

  return (
    <ResponsiveModal
      isOpen={isOpen}
      onClose={onClose}
      title={t('edit_user_group')}
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="p-6 space-y-6" dir={direction}>
        <p className="text-sm text-[var(--text-muted)] text-center">
          {t('mandatory_fields')}
        </p>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="takamol-label">
              {t('group_name')} *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="takamol-input"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="takamol-label">
              {t('description')} *
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="takamol-input"
              required
            />
          </div>
        </div>

        <div className="pt-6 border-t border-[var(--border)]">
          <button
            type="submit"
            className="btn-primary w-full"
          >
            {t('edit_user_group')}
          </button>
        </div>
      </form>
    </ResponsiveModal>
  );
};

export default EditGroupModal;
