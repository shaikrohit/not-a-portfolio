'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Award, BookOpen, Calendar, MapPin, CheckCircle2 } from 'lucide-react';
import type { CMSEducation } from '@/types/cms';

interface EducationSectionProps {
  education?: CMSEducation[];
}

export function EducationSection({ education }: EducationSectionProps = {}) {
  const activeEduList =
    education && education.length > 0
      ? education
      : [
          {
            id: 'edu-mits',
            institution: 'Madanapalle Institute of Technology & Science',
            degree: 'B.Tech - CSE (Cyber Security)',
            field_of_study: 'Computer Science & Engineering (Cyber Security)',
            period: '2026 - 2029',
            location: 'Madanapalle, Andhra Pradesh, India',
            grade: 'Pursuing',
            status: 'pursuing' as const,
            coursework: [
              'Cybersecurity & Network Defense',
              'Ethical Hacking & Penetration Testing',
              'Digital Forensics & Incident Response',
              'Data Structures & Algorithms',
              'Operating Systems & Linux Shell',
              'Object-Oriented Programming (Java / Python)',
            ],
            honors: [
              'Second-Year B.Tech Student in Cyber Security',
              'OWASP Open-Source Security Contributor',
              'Active CTF Challenge Competitor',
            ],
          },
          {
            id: 'edu-polytechnic',
            institution: 'Dr. Y.C. James Yen Govt Polytechnic, Kuppam',
            degree: 'Diploma in Computer Engineering (DCME)',
            field_of_study: 'Computer Engineering',
            period: '2023 - 2026',
            location: 'Kuppam, Andhra Pradesh, India',
            grade: '88.5%',
            status: 'completed' as const,
            coursework: [
              'Data Structures & Algorithms',
              'Object-Oriented Programming (Java / C++)',
              'Computer Networks & Protocols',
              'Operating Systems & Linux Shell',
              'Database Management & SQL',
              'Web Technologies & Development',
            ],
            honors: [
              '88.5% Distinction in State Technical Board Examinations',
              '1st Prize in Regional Technical Innovation Hackathon',
            ],
          },
          {
            id: 'edu-ssc',
            institution: 'Elena Bettini English Medium High School',
            degree: 'Secondary School Certificate (SSC)',
            field_of_study: 'General High School Curriculum',
            period: '2022 - 2023',
            location: 'Palamaner, Andhra Pradesh, India',
            grade: '78.8%',
            status: 'completed' as const,
            coursework: [
              'Mathematics & Analytics',
              'Physical & Biological Sciences',
              'Information & Computer Basics',
              'English & Languages',
            ],
            honors: ['First Class Academic Completion'],
          },
        ];

  return (
    <section id="education" className="relative px-4 py-20 sm:px-6 sm:py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <span className="mb-3 inline-block rounded-full bg-blue-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400">
            Academic Foundation
          </span>
          <h2 className="font-serif text-4xl font-bold tracking-tight text-[var(--text-primary)] md:text-5xl">
            Education & Coursework
          </h2>
        </motion.div>

        <div className="space-y-8">
          {activeEduList.map((activeEdu, eduIdx) => {
            const coursework = activeEdu.coursework || [];
            const isPursuing =
              activeEdu.status === 'pursuing' ||
              (activeEdu.grade && activeEdu.grade.toLowerCase().includes('pursuing')) ||
              (activeEdu.period && activeEdu.period.toLowerCase().includes('pursuing'));

            return (
              <motion.div
                key={activeEdu.id || eduIdx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: eduIdx * 0.1 }}
                className="relative overflow-hidden rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-5 backdrop-blur-xl sm:p-8 md:p-12"
              >
                {/* Subtle background glow */}
                <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-purple-500/10 blur-3xl" />

                <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-3">
                  {/* Institution info (2 cols on lg) */}
                  <div className="lg:col-span-2">
                    <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
                          <GraduationCap className="h-7 w-7" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-[var(--text-primary)] sm:text-3xl">
                            {activeEdu.institution}
                          </h3>
                          <p className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                            <MapPin className="h-3.5 w-3.5 text-blue-500" />{' '}
                            {activeEdu.location || 'Andhra Pradesh, India'}
                          </p>
                        </div>
                      </div>

                      {/* LinkedIn-style Status Badge */}
                      {isPursuing ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                          Currently Pursuing
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400">
                          <CheckCircle2 className="h-3.5 w-3.5 text-blue-500" />
                          Completed
                        </span>
                      )}
                    </div>

                    <div className="mb-6 inline-flex flex-wrap items-center gap-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-base)] px-4 py-2 text-sm font-semibold text-[var(--text-primary)]">
                      <Calendar className="h-4 w-4 text-blue-500" />
                      <span>
                        {activeEdu.degree} ({activeEdu.period})
                      </span>
                    </div>

                    <p className="text-base leading-relaxed text-[var(--text-secondary)]">
                      {isPursuing
                        ? 'Enrolled in an intensive engineering curriculum specializing in Cybersecurity, ethical hacking, digital forensics, and network defenses, complemented by open-source contributions and hands-on CTF security challenges.'
                        : activeEdu.degree.includes('Diploma')
                          ? 'Comprehensive three-year computer engineering diploma program combining core software logic, algorithms, operating systems, networking, and practical web applications. Graduated with 88.5% academic distinction.'
                          : 'Secondary school curriculum establishing strong mathematical, analytical, and physical science foundations, completed with first-class academic excellence.'}
                    </p>

                    {/* Coursework chips */}
                    {coursework.length > 0 && (
                      <div className="mt-8">
                        <h4 className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                          <BookOpen className="h-4 w-4 text-blue-500" />
                          Key Academic Coursework
                        </h4>
                        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                          {coursework.map((course) => (
                            <div
                              key={course}
                              className="flex items-center gap-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-base)] p-3 text-xs font-medium text-[var(--text-primary)]"
                            >
                              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                              <span>{course}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Scorecard Banner (1 col on lg) */}
                  <div className="flex flex-col items-center justify-center rounded-2xl border border-emerald-500/20 bg-gradient-to-b from-emerald-500/10 via-emerald-500/5 to-transparent p-6 text-center sm:p-8 lg:h-full">
                    {isPursuing ? (
                      <>
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-500">
                          <GraduationCap className="h-6 w-6" />
                        </div>
                        <div className="mt-4 text-3xl font-extrabold tracking-tight text-[var(--text-primary)] sm:text-4xl">
                          In Progress
                        </div>
                        <p className="mt-1 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                          Currently Enrolled
                        </p>
                        <p className="mt-3 text-xs leading-relaxed text-[var(--text-secondary)]">
                          Second-year undergraduate studying CSE (Cyber Security) at Madanapalle
                          Institute of Technology & Science.
                        </p>
                        <div className="mt-6 w-full border-t border-[var(--border-subtle)] pt-4 text-xs font-medium text-[var(--text-muted)]">
                          Expected Graduation: 2029
                        </div>
                      </>
                    ) : (
                      <>
                        <Award className="h-10 w-10 text-emerald-500" />
                        <div className="mt-4 text-4xl font-extrabold tracking-tight text-[var(--text-primary)] md:text-5xl">
                          {activeEdu.grade || '88.5%'}
                        </div>
                        <p className="mt-1 text-sm font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                          Aggregate Score
                        </p>
                        <p className="mt-3 text-xs leading-relaxed text-[var(--text-secondary)]">
                          {activeEdu.honors?.[0] || 'State Technical Board Examination Honors.'}
                        </p>
                        {activeEdu.honors?.[1] && (
                          <div className="mt-6 w-full border-t border-[var(--border-subtle)] pt-4 text-xs font-medium text-[var(--text-muted)]">
                            {activeEdu.honors[1]}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default EducationSection;
