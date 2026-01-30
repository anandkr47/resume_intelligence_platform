import React, { useState } from 'react';
import { useResumes } from '../hooks/useResumes';
import { useRoles } from '../hooks/useRoles';
import { Loading } from '../components/Loading';
import { Card } from '../components/Card';
import { EmptyState } from '../components/EmptyState';
import { ResumeTable } from '../components/ResumeTable';
import { ResumeDetailModal } from '../components/ResumeDetailModal';
import { exportResumesToCSV } from '../utils/csvExport';
import { resumeService } from '../services/resumeService';
import { Download, Search, X, Filter } from 'lucide-react';
import type { Resume } from '../types';
import { COPY } from '../constants';

export const Resumes: React.FC = () => {
  const { resumes, loading, error, filters, updateFilters, refresh } = useResumes();
  const roles = useRoles();
  const [selectedResume, setSelectedResume] = useState<Resume | null>(null);
  const [selectedRoleId, setSelectedRoleId] = useState<string>('');

  const handleFilterChange = (key: string, value: string | number | undefined) => {
    updateFilters({ [key]: value });
  };

  const applyFilters = () => refresh();

  const clearFilters = () => {
    updateFilters({ keyword: '', location: '', minScore: 0, roleId: undefined });
    setSelectedRoleId('');
    setTimeout(applyFilters, 100);
  };

  const handleExport = () => {
    exportResumesToCSV(
      resumes,
      `resumes_${new Date().toISOString().split('T')[0]}.csv`
    );
  };

  const handleDeleteResume = async (resumeId: string) => {
    if (!window.confirm(COPY.ERRORS.CONFIRM_DELETE)) return;
    try {
      await resumeService.deleteResume(resumeId);
      if (selectedResume?.id === resumeId) setSelectedResume(null);
      refresh();
    } catch (err) {
      console.error('Failed to delete resume:', err);
      alert(COPY.ERRORS.DELETE_RESUME);
    }
  };

  if (loading && resumes.length === 0) {
    return <Loading message={COPY.LOADING.RESUMES} />;
  }

  if (error) {
    return (
      <Card>
        <div className="text-center py-8">
          <p className="text-red-600 text-lg font-semibold mb-2">
            {COPY.ERRORS.LOAD_RESUMES}
          </p>
          <p className="text-gray-500">{error}</p>
        </div>
      </Card>
    );
  }

  const hasActiveFilters = Object.values(filters).some((v) => v && v !== 0);

  return (
    <div className="animate-fade-in space-y-6">
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-5xl font-bold text-white mb-3 drop-shadow-lg">
            {COPY.PAGES.RESUMES.TITLE}
          </h1>
          <p className="text-white/90 text-xl">{COPY.PAGES.RESUMES.SUBTITLE}</p>
        </div>
        {resumes.length > 0 && (
          <button
            className="btn btn-success shadow-lg hover:shadow-xl"
            onClick={handleExport}
          >
            <Download className="w-5 h-5" />
            {COPY.LABELS.EXPORT_CSV}
          </button>
        )}
      </div>

      <Card
        title={COPY.LABELS.FILTERS}
        description={COPY.LABELS.REFINE_SEARCH}
        className="mb-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Search className="w-4 h-4 inline mr-1" />
              {COPY.LABELS.SEARCH_KEYWORD}
            </label>
            <input
              type="text"
              className="input"
              placeholder={COPY.LABELS.SEARCH_PLACEHOLDER}
              value={filters.keyword ?? ''}
              onChange={(e) => handleFilterChange('keyword', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {COPY.LABELS.LOCATION}
            </label>
            <input
              type="text"
              className="input"
              placeholder={COPY.LABELS.LOCATION_PLACEHOLDER}
              value={filters.location ?? ''}
              onChange={(e) => handleFilterChange('location', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {COPY.LABELS.JOB_ROLE}
            </label>
            <select
              className="input"
              value={selectedRoleId}
              onChange={(e) => {
                setSelectedRoleId(e.target.value);
                handleFilterChange('roleId', e.target.value || undefined);
              }}
            >
              <option value="">{COPY.LABELS.ALL_ROLES}</option>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.title}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {COPY.LABELS.MIN_MATCH_SCORE}
            </label>
            <input
              type="number"
              className="input"
              placeholder="0"
              min={0}
              max={100}
              value={filters.minScore ?? 0}
              onChange={(e) =>
                handleFilterChange('minScore', parseFloat(e.target.value) || 0)
              }
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button className="btn btn-primary" onClick={applyFilters}>
            <Filter className="w-4 h-4" />
            {COPY.LABELS.APPLY_FILTERS}
          </button>
          {hasActiveFilters && (
            <button className="btn btn-secondary" onClick={clearFilters}>
              <X className="w-4 h-4" />
              {COPY.LABELS.CLEAR}
            </button>
          )}
        </div>
      </Card>

      <Card
        title={COPY.LABELS.RESUME_LIST}
        description={COPY.LABELS.RESUMES_FOUND(resumes.length)}
      >
        {resumes.length > 0 ? (
          <ResumeTable
            resumes={resumes}
            onRowClick={setSelectedResume}
            onDelete={handleDeleteResume}
            getResumeFileUrl={resumeService.getResumeFileUrl}
          />
        ) : (
          <EmptyState
            icon="📄"
            title={COPY.EMPTY.NO_RESUMES}
            message={
              hasActiveFilters
                ? COPY.EMPTY.TRY_FILTERS
                : COPY.EMPTY.UPLOAD_TO_START
            }
          />
        )}
      </Card>

      <ResumeDetailModal
        resume={selectedResume}
        onClose={() => setSelectedResume(null)}
        getResumeFileUrl={resumeService.getResumeFileUrl}
      />
    </div>
  );
};
