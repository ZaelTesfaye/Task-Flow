import React from 'react';
import { useRouter } from 'next/router';
import { ArrowLeft, Settings, Users } from 'lucide-react';
import { ProjectHeaderProps } from '@/types/project';

const ProjectHeader: React.FC<ProjectHeaderProps> = ({
  project,
  userRole,
  onToggleSettings,
  onToggleMembers,
  isMembersPaneOpen,
  isSettingsPaneOpen,
}) => {
  const router = useRouter();

  return (
  <div className="bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] border-b border-[hsl(var(--border))]">
      <div
        className={`max-w-7xl mx-auto px-6 py-6 transition-all duration-300 ${
          isMembersPaneOpen ? 'mr-80' : ''
        } ${isSettingsPaneOpen ? 'ml-80' : ''}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/dashboard')}
              className="p-2 hover:bg-[hsl(var(--accent))] rounded-lg transition"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{project?.title}</h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">{project?.description}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {(userRole === 'owner' || userRole === 'admin') && (
              <>
                {userRole === 'owner' && (
                  <button
                    onClick={onToggleSettings}
                    className={`p-2 border rounded-lg transition ${
                      isSettingsPaneOpen
                        ? 'border-[hsl(var(--ring))] bg-[hsl(var(--accent))]'
                        : 'border-[hsl(var(--border))] hover:bg-[hsl(var(--accent))]'
                    }`}
                    title={isSettingsPaneOpen ? 'Hide Settings' : 'Show Settings'}
                  >
                    <Settings className="w-5 h-5" />
                  </button>
                )}
              </>
            )}
            <button
              onClick={onToggleMembers}
              className={`p-2 border rounded-lg transition ${
                isMembersPaneOpen 
                  ? 'border-[hsl(var(--ring))] bg-[hsl(var(--accent))]' 
                  : 'border-[hsl(var(--border))] hover:bg-[hsl(var(--accent))]'
              }`}
              title={isMembersPaneOpen ? 'Hide Members' : 'Show Members'}
            >
              <Users className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectHeader;