'use client';

/**
 * ============================================================================
 * PROJECTS SECTION
 * ============================================================================
 *
 * @description Displays portfolio projects with deep technical details.
 *              Part of the Developer path.
 *
 * @usage
 * ```tsx
 * import { ProjectsSection } from '@/components/sections/developer';
 *
 * <ProjectsSection />
 * ```
 * ============================================================================
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ExternalLink, Star, GitFork, GitBranch } from 'lucide-react';
import { Text, Card, FadeIn, StaggerChildren, StaggerItem, Reveal } from '@/components/ui';
import { projects } from '@/content';

// ============================================================================
// TYPES
// ============================================================================

interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  problemSolved: string;
  architectureNotes: string;
  techStack: string[];
  githubUrl: string;
  liveUrl?: string;
  featured: boolean;
  metrics?: {
    stars: number;
    forks: number;
    commits: number;
  };
}

interface ProjectCardProps {
  project: Project;
}

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

/**
 * TechBadge
 *
 * Small badge showing a technology name.
 */
function TechBadge({ name }: { name: string }) {
  return (
    <span className="rounded bg-neutral-100 px-2.5 py-1 text-xs text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400">
      {name}
    </span>
  );
}

/**
 * ProjectMetrics
 *
 * GitHub stats (stars, forks, commits).
 */
function ProjectMetrics({ metrics }: { metrics: Project['metrics'] }) {
  if (!metrics) return null;

  return (
    <div className="flex items-center gap-4 text-sm text-neutral-500">
      <span className="flex items-center gap-1">
        <Star className="h-4 w-4" />
        {metrics.stars}
      </span>
      <span className="flex items-center gap-1">
        <GitFork className="h-4 w-4" />
        {metrics.forks}
      </span>
      <span className="flex items-center gap-1">
        <GitBranch className="h-4 w-4" />
        {metrics.commits}
      </span>
    </div>
  );
}

/**
 * ProjectCard
 *
 * Expandable card showing a project with technical details.
 */
function ProjectCard({ project }: ProjectCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card padding="none">
      <div className="p-6 md:p-8">
        {/* Header: Title + Metrics */}
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <Text variant="h3" className="mb-2">
              {project.title}
            </Text>
            <Text variant="body" muted>
              {project.description}
            </Text>
          </div>
          <ProjectMetrics metrics={project.metrics} />
        </div>

        {/* Tech Stack */}
        <div className="mb-6 flex flex-wrap gap-2">
          {project.techStack.map((tech) => (
            <TechBadge key={tech} name={tech} />
          ))}
        </div>

        {/* Problem Solved */}
        <div className="mb-6 rounded-lg bg-neutral-50 p-4 dark:bg-neutral-900/50">
          <Text variant="caption" className="mb-1 uppercase tracking-wider">
            Problem Solved
          </Text>
          <Text variant="body-small">{project.problemSolved}</Text>
        </div>

        {/* Expand/Collapse Button */}
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm text-neutral-600 transition-colors hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
        >
          {isExpanded ? 'Less details' : 'More details'}
          <motion.span animate={{ rotate: isExpanded ? 180 : 0 }}>
            <ChevronDown className="h-4 w-4" />
          </motion.span>
        </button>

        {/* Expandable: Deep Dive */}
        <Reveal show={isExpanded}>
          <div className="mt-6 space-y-6 border-t border-neutral-200 pt-6 dark:border-neutral-800">
            <div>
              <Text variant="caption" className="mb-2 uppercase tracking-wider">
                Deep Dive
              </Text>
              <Text variant="body-small" className="whitespace-pre-line">
                {project.longDescription}
              </Text>
            </div>
            <div>
              <Text variant="caption" className="mb-2 uppercase tracking-wider">
                Architecture Notes
              </Text>
              <Text variant="body-small" className="whitespace-pre-line">
                {project.architectureNotes}
              </Text>
            </div>
          </div>
        </Reveal>

        {/* Action Links */}
        <div className="mt-6 flex gap-3 border-t border-neutral-200 pt-6 dark:border-neutral-800">
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-neutral-300 px-3 py-1.5 text-sm text-neutral-700 transition-colors hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
          >
            View Code
            <ExternalLink className="h-3 w-3" />
          </a>
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm text-neutral-600 transition-colors hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
            >
              Live Demo
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
      </div>
    </Card>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

/**
 * ProjectsSection
 *
 * Displays featured projects with expandable technical details.
 * Designed for developers who want to see architecture decisions.
 */
export function ProjectsSection() {
  // Only show featured projects
  const featuredProjects = projects.filter((p) => p.featured);

  return (
    <section className="section">
      <div className="container-narrow">
        {/* Header */}
        <FadeIn>
          <Text variant="overline" className="mb-4">
            What I've Built
          </Text>
          <Text variant="h2" className="mb-4" balance>
            Selected Projects
          </Text>
          <Text variant="body-large" className="mb-12 max-w-2xl" muted>
            Deep dives into engineering decisions, not a gallery of screenshots.
          </Text>
        </FadeIn>

        {/* Projects List */}
        <StaggerChildren className="space-y-8">
          {featuredProjects.map((project) => (
            <StaggerItem key={project.id}>
              <ProjectCard project={project} />
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>
    </section>
  );
}

export default ProjectsSection;
