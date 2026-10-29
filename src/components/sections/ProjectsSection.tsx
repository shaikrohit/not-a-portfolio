'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Github, ExternalLink, Star, ArrowRight, Sparkles, FolderGit2 } from 'lucide-react';
import { projects as verifiedProjects } from '@/content/config';
import type { Project } from '@/types';
import type { CMSProject } from '@/types/cms';
import { TiltCard } from '@/components/ui/TiltCard';
import { ProjectModal } from '@/components/projects/ProjectModal';
import { getGitHubProjects } from '@/app/_actions/github';

interface ProjectsSectionProps {
  projects?: CMSProject[];
}

export function ProjectsSection({ projects }: ProjectsSectionProps = {}) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const initialProjects: Project[] =
    projects && projects.length > 0
      ? projects.map((cp) => ({
          id: cp.slug || cp.id,
          title: cp.title,
          description: cp.tagline,
          longDescription: cp.long_description,
          problemSolved: cp.problem_solved,
          architectureNotes: cp.architecture_notes,
          techStack: cp.tech_stack,
          githubUrl: cp.github_url,
          liveUrl: cp.live_url || undefined,
          featured: cp.is_featured,
          visibleTo: ['developer', 'recruiter', 'student', 'explorer'],
          metrics: {
            stars: cp.stars_count,
            forks: cp.forks_count,
            commits: cp.commits_count,
          },
        }))
      : verifiedProjects;

  const [projectList, setProjectList] = useState<Project[]>(initialProjects);

  useEffect(() => {
    // Merge live GitHub star counts into verified projects if available
    async function enhanceWithGitHub() {
      try {
        const ghRepos = await getGitHubProjects('shaikrohit');
        if (ghRepos && ghRepos.length > 0) {
          const repoMap = new Map(ghRepos.map((r) => [r.name.toLowerCase(), r]));

          setProjectList((prev) =>
            prev.map((p) => {
              const matched =
                repoMap.get(p.title.toLowerCase()) ||
                repoMap.get(p.id.toLowerCase()) ||
                repoMap.get(p.title.toLowerCase().replace(/\s+/g, '-'));

              if (matched) {
                return {
                  ...p,
                  metrics: {
                    stars: Math.max(matched.stargazers_count, p.metrics?.stars || 0),
                    forks: Math.max(matched.forks_count ?? 0, p.metrics?.forks || 0),
                    commits: p.metrics?.commits || 30,
                  },
                };
              }
              return p;
            })
          );
        }
      } catch {
        // Fallback silently to verified project list
      }
    }
    enhanceWithGitHub();
  }, []);

  const filterTabs = [
    { id: 'all', label: 'All Projects' },
    { id: 'featured', label: 'Featured' },
    { id: 'web-docker', label: 'Full-Stack & Docker' },
    { id: 'ai', label: 'GenAI & AI Tools' },
  ];

  const handleTabKeyDown = (e: React.KeyboardEvent, currentId: string) => {
    const currentIndex = filterTabs.findIndex((t) => t.id === currentId);
    let nextIndex = -1;

    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      nextIndex = (currentIndex + 1) % filterTabs.length;
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      nextIndex = (currentIndex - 1 + filterTabs.length) % filterTabs.length;
    } else if (e.key === 'Home') {
      e.preventDefault();
      nextIndex = 0;
    } else if (e.key === 'End') {
      e.preventDefault();
      nextIndex = filterTabs.length - 1;
    }

    if (nextIndex !== -1) {
      const nextTab = filterTabs[nextIndex];
      if (nextTab) {
        setActiveFilter(nextTab.id);
        document.getElementById(`project-tab-${nextTab.id}`)?.focus();
      }
    }
  };

  const filteredProjects = projectList.filter((project) => {
    if (activeFilter === 'featured') return project.featured;
    if (activeFilter === 'web-docker') {
      return (
        project.techStack.includes('Docker') ||
        project.techStack.includes('React') ||
        project.techStack.includes('Next.js 16') ||
        project.techStack.includes('Python')
      );
    }
    if (activeFilter === 'ai') {
      return (
        project.techStack.includes('GenAI') ||
        project.techStack.includes('AI/NLP') ||
        project.title.toLowerCase().includes('ai')
      );
    }
    return true;
  });

  return (
    <section id="projects" className="relative px-4 py-20 sm:px-6 sm:py-28 md:py-36">
      <div className="mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
          >
            <span className="mb-3 inline-block rounded-full bg-blue-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400">
              Portfolio of Work
            </span>
            <h2 className="font-serif text-4xl font-bold tracking-tight text-[var(--text-primary)] md:text-5xl">
              Featured Projects & Systems
            </h2>
            <p className="mt-3 max-w-xl text-base text-[var(--text-secondary)]">
              Containerized applications, generative AI tools, and full-stack solutions built with
              practical engineering rigor.
            </p>
          </motion.div>

          <a
            href="https://github.com/shaikrohit"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-card)] px-5 py-2.5 text-sm font-semibold text-[var(--text-primary)] backdrop-blur-md transition-all hover:border-blue-500/40 hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:hover:text-blue-400"
            aria-label="View all 17 repositories on GitHub"
          >
            <FolderGit2 className="h-4 w-4 text-blue-500" aria-hidden="true" />
            <span>All 17 Repos on GitHub</span>
            <ArrowRight
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
              aria-hidden="true"
            />
          </a>
        </div>

        {/* Accessible Filter Tabs (WAI-ARIA Tablist) */}
        <div
          role="tablist"
          aria-label="Project categories"
          className="mb-10 flex flex-wrap gap-2.5"
        >
          {filterTabs.map((tab) => {
            const isSelected = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                id={`project-tab-${tab.id}`}
                role="tab"
                aria-selected={isSelected}
                aria-controls="projects-grid"
                tabIndex={isSelected ? 0 : -1}
                onClick={() => setActiveFilter(tab.id)}
                onKeyDown={(e) => handleTabKeyDown(e, tab.id)}
                className={`rounded-full px-5 py-2 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 ${
                  isSelected
                    ? 'border border-blue-500/40 bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'border border-[var(--border-subtle)] bg-[var(--surface-card)] text-[var(--text-secondary)] hover:border-blue-500/20 hover:text-[var(--text-primary)]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Project Cards Grid (WAI-ARIA Tabpanel) */}
        <div
          id="projects-grid"
          role="tabpanel"
          aria-labelledby={`project-tab-${activeFilter}`}
          className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          {filteredProjects.map((project, index) => (
            <motion.article
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="h-full"
            >
              <TiltCard
                onClick={() => setSelectedProject(project)}
                aria-label={`View case study for ${project.title}`}
                className="group cursor-pointer rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-5 backdrop-blur-xl transition-all duration-300 focus-within:ring-2 focus-within:ring-blue-500/50 hover:border-blue-500/40 hover:shadow-2xl hover:shadow-blue-500/10 sm:p-7"
              >
                <div className="flex h-full flex-col justify-between">
                  <div>
                    {/* Article Header: Badges & Metrics */}
                    <header className="mb-5 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {project.featured && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400">
                            <Sparkles className="h-3 w-3" aria-hidden="true" /> Featured
                          </span>
                        )}
                      </div>

                      {project.metrics?.stars !== undefined && project.metrics.stars > 0 && (
                        <span
                          className="inline-flex items-center gap-1 text-xs font-semibold text-amber-500"
                          aria-label={`${project.metrics.stars} GitHub stars`}
                        >
                          <Star className="h-3.5 w-3.5 fill-amber-500" aria-hidden="true" />
                          {project.metrics.stars}
                        </span>
                      )}
                    </header>

                    {/* Article Main: Title & Tagline */}
                    <h3 className="text-2xl font-bold tracking-tight text-[var(--text-primary)] transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400">
                      {project.title}
                    </h3>

                    <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-[var(--text-secondary)]">
                      {project.description}
                    </p>
                  </div>

                  {/* Article Footer: Tech Badges & Action Links */}
                  <footer className="mt-8">
                    <ul
                      className="mb-6 flex flex-wrap gap-1.5"
                      aria-label={`Technologies used in ${project.title}`}
                    >
                      {project.techStack.slice(0, 4).map((tech) => (
                        <li
                          key={tech}
                          className="rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-base)] px-2.5 py-1 text-xs font-medium text-[var(--text-secondary)]"
                        >
                          {tech}
                        </li>
                      ))}
                      {project.techStack.length > 4 && (
                        <li className="rounded-lg border border-transparent px-1.5 py-1 text-xs font-medium text-[var(--text-muted)]">
                          +{project.techStack.length - 4}
                        </li>
                      )}
                    </ul>

                    <div className="flex items-center justify-between border-t border-[var(--border-subtle)] pt-4 text-xs font-semibold">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedProject(project);
                        }}
                        className="rounded text-blue-600 transition-colors hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-blue-400"
                        aria-label={`Open interactive case study for ${project.title}`}
                      >
                        Click for Case Study ↗
                      </button>

                      <div
                        className="flex items-center gap-2 text-[var(--text-muted)]"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-lg p-1.5 transition-colors hover:text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                          aria-label={`View source code for ${project.title} on GitHub`}
                        >
                          <Github className="h-4 w-4" aria-hidden="true" />
                        </a>
                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-lg p-1.5 transition-colors hover:text-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                            aria-label={`Open live demonstration for ${project.title}`}
                          >
                            <ExternalLink className="h-4 w-4" aria-hidden="true" />
                          </a>
                        )}
                      </div>
                    </div>
                  </footer>
                </div>
              </TiltCard>
            </motion.article>
          ))}
        </div>

        {/* Project Modal */}
        <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
      </div>
    </section>
  );
}

export default ProjectsSection;
