'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Github, ExternalLink, Star, ArrowRight } from 'lucide-react';
import type { GitHubRepo } from '@/app/_actions/github';
import { getGitHubProjects } from '@/app/_actions/github';

export function ProjectsSection() {
  const [githubProjects, setGithubProjects] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const data = await getGitHubProjects('shaikrohit');
        setGithubProjects(data);
      } catch (error) {
        console.error('Error loading projects:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  return (
    <section id="projects" className="px-6 py-32">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
        >
          <span className="mb-4 inline-block text-sm font-medium uppercase tracking-widest text-blue-400">
            Projects
          </span>
          <div className="mb-16 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <h2 className="text-4xl font-bold text-neutral-900 md:text-5xl">Featured work</h2>
            <a
              href="https://github.com/shaikrohit"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 text-neutral-600 transition-colors hover:text-neutral-900"
              aria-label="View all projects on GitHub"
            >
              View all on GitHub
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
          </div>

          <div className="space-y-8">
            {loading ? (
              <div className="flex flex-col items-center justify-center gap-4 py-20">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500/20 border-t-blue-500" />
                <p className="animate-pulse text-sm text-neutral-500">
                  Fetching latest from GitHub...
                </p>
              </div>
            ) : (
              githubProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <motion.div
                    className="group relative overflow-hidden rounded-3xl border border-gray-200 bg-white p-8 transition-all duration-500 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-500/5 md:p-10"
                    whileHover={{ y: -5 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                    <div className="relative z-10 flex flex-col justify-between gap-8 md:flex-row md:items-center">
                      <div className="flex-1">
                        {project.stargazers_count > 0 && (
                          <span className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-yellow-500/10 px-3 py-1 text-xs font-medium text-yellow-600">
                            <Star className="h-3 w-3" />
                            {project.stargazers_count} Stars
                          </span>
                        )}

                        <h3 className="mb-3 text-2xl font-bold text-neutral-900 transition-colors group-hover:text-blue-600 md:text-3xl">
                          {project.name
                            .split('-')
                            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                            .join(' ')}
                        </h3>

                        <p className="mb-6 max-w-xl leading-relaxed text-neutral-600">
                          {project.description || 'No description provided for this repository.'}
                        </p>

                        <div className="flex flex-wrap gap-2">
                          {[project.language, ...(project.topics || [])]
                            .filter(Boolean)
                            .slice(0, 5)
                            .map((t, i) => (
                              <span
                                key={i}
                                className="rounded-lg border border-blue-100 bg-blue-50 px-3 py-1.5 text-sm text-blue-600"
                              >
                                {t}
                              </span>
                            ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <motion.a
                          href={project.html_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-xl border border-gray-100 bg-gray-50 p-4 transition-colors hover:border-gray-300"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          aria-label={`View ${project.name} source on GitHub`}
                        >
                          <Github className="h-5 w-5 text-neutral-600" />
                        </motion.a>
                        {project.homepage && (
                          <motion.a
                            href={project.homepage}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-xl bg-blue-600 p-4 shadow-lg shadow-blue-500/20 transition-colors hover:bg-blue-500"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            aria-label={`Visit ${project.name} live demo`}
                          >
                            <ExternalLink className="h-5 w-5 text-white" />
                          </motion.a>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
