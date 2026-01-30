import React, { useState, useMemo } from 'react';
import { JobCard } from '../components/JobCard';
import { Card } from '../components/Card';
import { Loading } from '../components/Loading';
import { EmptyState } from '../components/EmptyState';
import { JobDetailModal } from '../components/JobDetailModal';
import { Search, Filter, Briefcase } from 'lucide-react';
import { useJobs } from '../hooks/useJobs';
import { resumeService } from '../services/resumeService';
import { COPY } from '../constants';

export const Jobs: React.FC = () => {
  const {
    jobs,
    jobMatches,
    loading,
    loadJobMatches,
    loadResumeForView,
    selectedResume,
    clearSelectedResume,
  } = useJobs();

  const [selectedJob, setSelectedJob] = useState<import('../types').Job | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [domainFilter, setDomainFilter] = useState<string>('all');
  const [locationFilter, setLocationFilter] = useState<string>('all');

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearch =
        searchQuery === '' ||
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.skills.some((s) =>
          s.toLowerCase().includes(searchQuery.toLowerCase())
        );
      const matchesDomain =
        domainFilter === 'all' || job.domain === domainFilter;
      const matchesLocation =
        locationFilter === 'all' ||
        job.location.toLowerCase().includes(locationFilter.toLowerCase());
      return matchesSearch && matchesDomain && matchesLocation;
    });
  }, [jobs, searchQuery, domainFilter, locationFilter]);

  const uniqueDomains = useMemo(
    () => Array.from(new Set(jobs.map((j) => j.domain))),
    [jobs]
  );
  const uniqueLocations = useMemo(
    () => Array.from(new Set(jobs.map((j) => j.location))),
    [jobs]
  );

  const handleJobClick = async (job: import('../types').Job) => {
    setSelectedJob(job);
    setIsModalOpen(true);
    if (!jobMatches[job.jobId]) {
      await loadJobMatches(job.jobId);
    }
  };

  if (loading) {
    return <Loading message={COPY.LOADING.JOBS} />;
  }

  return (
    <div className="animate-fade-in space-y-8">
      <div className="mb-8">
        <h1 className="text-5xl font-bold text-white mb-3 drop-shadow-lg">
          {COPY.PAGES.JOBS.TITLE}
        </h1>
        <p className="text-white/90 text-xl">{COPY.PAGES.JOBS.SUBTITLE}</p>
      </div>

      <Card title={COPY.LABELS.FILTERS} className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Search className="w-4 h-4 inline mr-2" />
              {COPY.LABELS.SEARCH}
            </label>
            <input
              type="text"
              placeholder={COPY.LABELS.SEARCH_JOBS}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Filter className="w-4 h-4 inline mr-2" />
              {COPY.LABELS.DOMAIN}
            </label>
            <select
              value={domainFilter}
              onChange={(e) => setDomainFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">{COPY.LABELS.ALL_DOMAINS}</option>
              {uniqueDomains.map((domain) => (
                <option key={domain} value={domain}>
                  {domain}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Briefcase className="w-4 h-4 inline mr-2" />
              {COPY.LABELS.LOCATION}
            </label>
            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">{COPY.LABELS.ALL_LOCATIONS}</option>
              {uniqueLocations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {filteredJobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => {
            const match = jobMatches[job.jobId];
            return (
              <JobCard
                key={job.jobId}
                job={job}
                matchCount={match?.matchedResumes?.length ?? 0}
                avgMatchScore={match?.matchScore ?? 0}
                onClick={() => handleJobClick(job)}
              />
            );
          })}
        </div>
      ) : (
        <EmptyState icon="💼" title={COPY.EMPTY.NO_JOBS} />
      )}

      {selectedJob && (
        <JobDetailModal
          job={selectedJob}
          matchDetail={jobMatches[selectedJob.jobId]}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedJob(null);
          }}
          onViewResume={loadResumeForView}
          selectedResume={selectedResume}
          onCloseResumeDetail={clearSelectedResume}
          getResumeFileUrl={resumeService.getResumeFileUrl}
        />
      )}
    </div>
  );
};
