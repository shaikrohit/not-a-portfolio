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
    <span className="px-2.5 py-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 text-xs rounded">
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
        <Star className="w-4 h-4" />
        {metrics.stars}
      </span>
      <span className="flex items-center gap-1">
        <GitFork className="w-4 h-4" />
        {metrics.forks}
      </span>
      <span className="flex items-center gap-1">
        <GitBranch className="w-4 h-4" />
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
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
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
        <div className="flex flex-wrap gap-2 mb-6">
          {project.techStack.map((tech) => (
            <TechBadge key={tech} name={tech} />
          ))}
        </div>

        {/* Problem Solved */}
        <div className="mb-6 p-4 bg-neutral-50 dark:bg-neutral-900/50 rounded-lg">
          <Text variant="caption" className="uppercase tracking-wider mb-1">
            Problem Solved
          </Text>
          <Text variant="body-small">{project.problemSolved}</Text>
        </div>

        {/* Expand/Collapse Button */}
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="inline-flex items-center gap-2 px-3 py-1.5 text-sm text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
        >
          {isExpanded ? 'Less details' : 'More details'}
          <motion.span animate={{ rotate: isExpanded ? 180 : 0 }}>
            <ChevronDown className="w-4 h-4" />
          </motion.span>
        </button>

        {/* Expandable: Deep Dive */}
        <Reveal show={isExpanded}>
          <div className="mt-6 pt-6 border-t border-neutral-200 dark:border-neutral-800 space-y-6">
            <div>
              <Text variant="caption" className="uppercase tracking-wider mb-2">
                Deep Dive
              </Text>
              <Text variant="body-small" className="whitespace-pre-line">
                {project.longDescription}
              </Text>
            </div>
            <div>
              <Text variant="caption" className="uppercase tracking-wider mb-2">
                Architecture Notes
              </Text>
              <Text variant="body-small" className="whitespace-pre-line">
                {project.architectureNotes}
              </Text>
            </div>
          </div>
        </Reveal>

        {/* Action Links */}
        <div className="flex gap-3 mt-6 pt-6 border-t border-neutral-200 dark:border-neutral-800">
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3 py-1.5 text-sm border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
          >
            View Code
            <ExternalLink className="w-3 h-3" />
          </a>
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-1.5 text-sm text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
            >
              Live Demo
              <ExternalLink className="w-3 h-3" />
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
