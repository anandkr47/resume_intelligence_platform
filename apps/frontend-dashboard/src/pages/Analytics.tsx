import React from 'react';
import { Loading } from '../components/Loading';
import { Card } from '../components/Card';
import { StatCard } from '../components/StatCard';
import { EmptyState } from '../components/EmptyState';
import { SkillsPieChart, EducationBarChart, ExperienceChart } from '../charts';
import { formatMatchScore, formatNumber, normalizeMatchScore } from '../utils/formatters';
import { TrendingUp, Award, GraduationCap, Target, AlertTriangle } from 'lucide-react';
import { useAnalyticsPage } from '../hooks/useAnalyticsPage';
import { COPY } from '../constants';

export const Analytics: React.FC = () => {
  const {
    skills,
    experience,
    education,
    matches,
    uniqueRoles,
    selectedRole,
    setSelectedRole,
    loading,
    error,
    loadAnalytics,
  } = useAnalyticsPage();

  if (loading) {
    return <Loading message={COPY.LOADING.ANALYTICS} />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4 text-center">
        <div className="bg-red-50 p-4 rounded-full">
          <AlertTriangle className="w-12 h-12 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">{COPY.ERRORS.SOMETHING_WRONG}</h2>
        <p className="text-gray-600">{error}</p>
        <button
          onClick={loadAnalytics}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          {COPY.LABELS.RETRY}
        </button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-8 font-sans">
      <div className="mb-8 text-center md:text-left">
        <h1 className="text-5xl font-bold font-display text-white mb-3 drop-shadow-lg">
          {COPY.PAGES.ANALYTICS.TITLE}
        </h1>
        <p className="text-white/90 text-xl font-medium">
          {COPY.PAGES.ANALYTICS.SUBTITLE}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title={COPY.STATS.AVG_EXPERIENCE}
          value={
            experience?.avg_years != null
              ? `${Number(experience.avg_years).toFixed(1)}`
              : '-'
          }
          label={COPY.STATS.YEARS_EXPERIENCE}
          icon={TrendingUp}
          variant="blue"
        />
        <StatCard
          title={COPY.STATS.TOP_SKILLS}
          value={skills.length}
          label={COPY.STATS.UNIQUE_SKILLS}
          icon={Award}
          variant="amber"
        />
        <StatCard
          title={COPY.STATS.UNIVERSITIES}
          value={education.length}
          label={COPY.STATS.UNIQUE_INSTITUTIONS}
          icon={GraduationCap}
          variant="purple"
        />
        <StatCard
          title={COPY.STATS.ROLE_MATCHES}
          value={formatNumber(matches.length)}
          label={COPY.STATS.TOTAL_MATCHES}
          icon={Target}
          variant="secondary"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card
          title={COPY.CHARTS.TOP_SKILLS_DIST}
          description={COPY.CHARTS.TOP_SKILLS_DESC}
          className="animate-slide-up"
          style={{ animationDelay: '400ms' }}
        >
          {skills?.length > 0 ? (
            <SkillsPieChart data={skills} limit={10} />
          ) : (
            <EmptyState icon="📊" title={COPY.EMPTY.NO_SKILLS} />
          )}
        </Card>

        <Card
          title={COPY.CHARTS.TOP_UNIVERSITIES}
          description={COPY.CHARTS.TOP_UNIVERSITIES_DESC}
          className="animate-slide-up"
          style={{ animationDelay: '500ms' }}
        >
          {education?.length > 0 ? (
            <EducationBarChart data={education} />
          ) : (
            <EmptyState icon="🎓" title={COPY.EMPTY.NO_EDUCATION} />
          )}
        </Card>
      </div>

      {experience &&
        (Number(experience.max_years) > 0 || Number(experience.avg_years) > 0) && (
          <Card
            title={COPY.CHARTS.EXPERIENCE_STATS}
            description={COPY.CHARTS.EXPERIENCE_STATS_DESC}
            className="animate-slide-up"
            style={{ animationDelay: '600ms' }}
          >
            <ExperienceChart data={experience} />
          </Card>
        )}

      <Card
        title={COPY.CHARTS.ROLE_MATCHES}
        description={COPY.CHARTS.ROLE_MATCHES_DESC}
        className="animate-slide-up"
        style={{ animationDelay: '700ms' }}
      >
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-semibold text-gray-700">
              {COPY.LABELS.FILTER_BY_ROLE}
            </label>
            <span className="text-xs text-gray-500">
              {COPY.TABLE.SHOWING(Math.min(matches.length, 50), matches.length)}
            </span>
          </div>
          <select
            className="input max-w-xs w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
          >
            <option value="">{COPY.LABELS.ALL_ROLES}</option>
            {uniqueRoles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.title}
              </option>
            ))}
          </select>
        </div>

        {matches.length > 0 ? (
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="table w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left">{COPY.LABELS.ROLE}</th>
                  <th className="px-4 py-3 text-left">{COPY.LABELS.RESUME}</th>
                  <th className="px-4 py-3 text-left">{COPY.LABELS.MATCH_SCORE}</th>
                  <th className="px-4 py-3 text-left">{COPY.LABELS.MATCHED_SKILLS}</th>
                </tr>
              </thead>
              <tbody>
                {matches.slice(0, 50).map((match, index) => {
                  const score = normalizeMatchScore(match.match_score);
                  const scoreClass =
                    score >= 70
                      ? 'match-score-high'
                      : score >= 50
                        ? 'match-score-medium'
                        : 'match-score-low';
                  return (
                    <tr
                      key={index}
                      className="border-t hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3 font-semibold text-gray-800">
                        {match.role_title || '-'}
                      </td>
                      <td className="px-4 py-3 text-gray-600 font-medium">
                        {match.name || match.file_name || 'Unknown Candidate'}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`match-score ${scoreClass} px-2 py-1 rounded text-sm font-bold`}
                        >
                          {formatMatchScore(score)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {(match.matched_skills || []).slice(0, 3).map((skill, idx) => (
                            <span
                              key={idx}
                              className="skill-tag text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded"
                            >
                              {skill}
                            </span>
                          ))}
                          {(match.matched_skills || []).length > 3 && (
                            <span className="skill-tag text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded opacity-70">
                              +{(match.matched_skills || []).length - 3}
                            </span>
                          )}
                          {(!match.matched_skills || match.matched_skills.length === 0) && (
                            <span className="text-gray-400 text-xs italic">
                              {COPY.LABELS.NO_SKILLS_MATCHED}
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            icon="🎯"
            title={COPY.EMPTY.NO_ROLE_MATCHES}
            message={
              selectedRole
                ? COPY.EMPTY.NO_ROLE_MATCHES_FILTER
                : COPY.EMPTY.NO_ROLE_MATCHES_YET
            }
          />
        )}
      </Card>
    </div>
  );
};
