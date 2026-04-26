'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Github, ExternalLink, Star, ArrowRight } from 'lucide-react';
import { getGitHubProjects, GitHubRepo } from '@/app/_actions/github';

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
    <section id="projects" className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block text-blue-400 text-sm font-medium uppercase tracking-widest mb-4">
            Projects
          </span>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-neutral-900">
              Featured work
            </h2>
            <a 
              href="https://github.com/shaikrohit" 
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 text-neutral-600 hover:text-neutral-900 transition-colors"
              aria-label="View all projects on GitHub"
            >
              View all on GitHub
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
          
          <div className="space-y-8">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                <p className="text-neutral-500 text-sm animate-pulse">Fetching latest from GitHub...</p>
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
                    className="group relative p-8 md:p-10 rounded-3xl bg-white border border-gray-200 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-500 overflow-hidden"
                    whileHover={{ y: -5 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                      <div className="flex-1">
                        {project.stargazers_count > 0 && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-600 text-xs font-medium mb-4">
                            <Star className="w-3 h-3" />
                            {project.stargazers_count} Stars
                          </span>
                        )}
                        
                        <h3 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-3 group-hover:text-blue-600 transition-colors">
                          {project.name.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                        </h3>
                        
                        <p className="text-neutral-600 mb-6 max-w-xl leading-relaxed">
                          {project.description || 'No description provided for this repository.'}
                        </p>
                        
                        <div className="flex flex-wrap gap-2">
                          {[project.language, ...(project.topics || [])].filter(Boolean).slice(0, 5).map((t, i) => (
                            <span 
                              key={i} 
                              className="px-3 py-1.5 text-sm rounded-lg bg-blue-50 text-blue-600 border border-blue-100"
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
                          className="p-4 rounded-xl bg-gray-50 border border-gray-100 hover:border-gray-300 transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          aria-label={`View ${project.name} source on GitHub`}
                        >
                          <Github className="w-5 h-5 text-neutral-600" />
                        </motion.a>
                        {project.homepage && (
                          <motion.a
                            href={project.homepage}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-4 rounded-xl bg-blue-600 hover:bg-blue-500 transition-colors shadow-lg shadow-blue-500/20"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            aria-label={`Visit ${project.name} live demo`}
                          >
                            <ExternalLink className="w-5 h-5 text-white" />
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
