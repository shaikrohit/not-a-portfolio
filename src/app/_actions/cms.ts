'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@supabase/supabase-js';
import { verifyAdmin } from './adminTrivia';
import { getGitHubProjects } from './github';
import { uploadAsset, type StorageProviderType } from '@/lib/storage';
import {
  DEFAULT_PROFILE,
  DEFAULT_PROJECTS,
  DEFAULT_EXPERIENCE,
  DEFAULT_EDUCATION,
  DEFAULT_SKILLS,
  DEFAULT_ACHIEVEMENTS,
} from '@/lib/cms/getContent';
import type {
  CMSProfile,
  CMSProject,
  CMSExperience,
  CMSEducation,
  CMSSkill,
  CMSAchievement,
  CMSContentDraft,
  CMSMediaItem,
} from '@/types/cms';

function getAdminSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) return null;
  return createClient(supabaseUrl, supabaseKey);
}

// ---------------------------------------------------------------------------
// 1. MASTER CMS DATA FOR ADMIN HQ
// ---------------------------------------------------------------------------
export async function getAdminCMSData() {
  const isAdmin = await verifyAdmin();
  if (!isAdmin) return { success: false, error: 'Unauthorized', data: null };

  const supabase = getAdminSupabaseClient();
  if (!supabase) {
    return {
      success: true,
      error: null,
      data: {
        profile: DEFAULT_PROFILE,
        projects: DEFAULT_PROJECTS,
        experience: DEFAULT_EXPERIENCE,
        education: DEFAULT_EDUCATION,
        skills: DEFAULT_SKILLS,
        achievements: DEFAULT_ACHIEVEMENTS,
        drafts: [] as CMSContentDraft[],
      },
    };
  }

  try {
    const [profileRes, projectsRes, expRes, eduRes, skillsRes, achRes, draftsRes] =
      await Promise.all([
        supabase.from('cms_profile').select('*').limit(1).maybeSingle(),
        supabase.from('cms_projects').select('*').order('sort_order', { ascending: true }),
        supabase.from('cms_experience').select('*').order('sort_order', { ascending: true }),
        supabase.from('cms_education').select('*').order('sort_order', { ascending: true }),
        supabase.from('cms_skills').select('*').order('sort_order', { ascending: true }),
        supabase.from('cms_achievements').select('*').order('sort_order', { ascending: true }),
        supabase.from('cms_content_drafts').select('*'),
      ]);

    return {
      success: true,
      error: null,
      data: {
        profile: (profileRes?.data as CMSProfile) || DEFAULT_PROFILE,
        projects: projectsRes?.data?.length ? (projectsRes.data as CMSProject[]) : DEFAULT_PROJECTS,
        experience: expRes?.data?.length ? (expRes.data as CMSExperience[]) : DEFAULT_EXPERIENCE,
        education: eduRes?.data?.length ? (eduRes.data as CMSEducation[]) : DEFAULT_EDUCATION,
        skills: skillsRes?.data?.length ? (skillsRes.data as CMSSkill[]) : DEFAULT_SKILLS,
        achievements: achRes?.data?.length
          ? (achRes.data as CMSAchievement[])
          : DEFAULT_ACHIEVEMENTS,
        drafts: (draftsRes?.data as CMSContentDraft[]) || [],
      },
    };
  } catch (error: any) {
    console.error('Error fetching admin CMS data:', error);
    return { success: false, error: error.message || 'Failed to fetch CMS data', data: null };
  }
}

// ---------------------------------------------------------------------------
// 2. DRAFT & PUBLISH ACTIONS
// ---------------------------------------------------------------------------
export async function saveDraftAction(section: string, data: unknown) {
  const isAdmin = await verifyAdmin();
  if (!isAdmin) return { success: false, error: 'Unauthorized' };

  const supabase = getAdminSupabaseClient();
  if (!supabase) return { success: false, error: 'Database not configured' };

  try {
    const { error } = await supabase.from('cms_content_drafts').upsert(
      {
        section,
        draft_data: data,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'section' }
    );

    if (error) throw error;
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to save draft' };
  }
}

export async function discardDraftAction(section: string) {
  const isAdmin = await verifyAdmin();
  if (!isAdmin) return { success: false, error: 'Unauthorized' };

  const supabase = getAdminSupabaseClient();
  if (!supabase) return { success: false, error: 'Database not configured' };

  try {
    const { error } = await supabase.from('cms_content_drafts').delete().eq('section', section);
    if (error) throw error;
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to discard draft' };
  }
}

export async function publishDraftAction(section: string) {
  const isAdmin = await verifyAdmin();
  if (!isAdmin) return { success: false, error: 'Unauthorized' };

  const supabase = getAdminSupabaseClient();
  if (!supabase) return { success: false, error: 'Database not configured' };

  try {
    const { data: draftRow, error: draftErr } = await supabase
      .from('cms_content_drafts')
      .select('draft_data')
      .eq('section', section)
      .maybeSingle();

    if (draftErr || !draftRow) {
      return { success: false, error: 'No staged draft found for this section.' };
    }

    const draftData = draftRow.draft_data as any;

    if (section === 'profile') {
      await supabase.from('cms_profile').upsert({
        ...draftData,
        updated_at: new Date().toISOString(),
      });
    } else if (section === 'projects' && Array.isArray(draftData)) {
      for (const item of draftData) {
        await supabase.from('cms_projects').upsert({
          ...item,
          updated_at: new Date().toISOString(),
        });
      }
    } else if (section === 'experience' && Array.isArray(draftData)) {
      for (const item of draftData) {
        await supabase.from('cms_experience').upsert({
          ...item,
          updated_at: new Date().toISOString(),
        });
      }
    } else if (section === 'education' && Array.isArray(draftData)) {
      for (const item of draftData) {
        await supabase.from('cms_education').upsert({
          ...item,
          updated_at: new Date().toISOString(),
        });
      }
    } else if (section === 'skills' && Array.isArray(draftData)) {
      for (const item of draftData) {
        await supabase.from('cms_skills').upsert({
          ...item,
          updated_at: new Date().toISOString(),
        });
      }
    } else if (section === 'achievements' && Array.isArray(draftData)) {
      for (const item of draftData) {
        await supabase.from('cms_achievements').upsert({
          ...item,
          updated_at: new Date().toISOString(),
        });
      }
    }

    // Delete draft after publication
    await supabase.from('cms_content_drafts').delete().eq('section', section);
    revalidatePath('/');

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to publish draft' };
  }
}

export async function publishAllDraftsAction() {
  const isAdmin = await verifyAdmin();
  if (!isAdmin) return { success: false, error: 'Unauthorized' };

  const supabase = getAdminSupabaseClient();
  if (!supabase) return { success: false, error: 'Database not configured' };

  try {
    const { data: drafts } = await supabase.from('cms_content_drafts').select('*');
    if (!drafts || drafts.length === 0) {
      return { success: true, message: 'No drafts pending.' };
    }

    for (const draft of drafts) {
      await publishDraftAction(draft.section);
    }

    revalidatePath('/');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to publish all drafts' };
  }
}

// ---------------------------------------------------------------------------
// 3. PROFILE CRUD
// ---------------------------------------------------------------------------
export async function updateProfileAction(profileData: Partial<CMSProfile>) {
  const isAdmin = await verifyAdmin();
  if (!isAdmin) return { success: false, error: 'Unauthorized' };

  const supabase = getAdminSupabaseClient();
  if (!supabase) return { success: false, error: 'Database not configured' };

  try {
    const { error } = await supabase.from('cms_profile').upsert({
      ...profileData,
      id: profileData.id || DEFAULT_PROFILE.id,
      updated_at: new Date().toISOString(),
    });

    if (error) throw error;
    revalidatePath('/');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to update profile' };
  }
}

// ---------------------------------------------------------------------------
// 4. PROJECTS CRUD & GITHUB SYNC
// ---------------------------------------------------------------------------
export async function saveProjectAction(project: CMSProject) {
  const isAdmin = await verifyAdmin();
  if (!isAdmin) return { success: false, error: 'Unauthorized' };

  const supabase = getAdminSupabaseClient();
  if (!supabase) return { success: false, error: 'Database not configured' };

  try {
    const { error } = await supabase.from('cms_projects').upsert({
      ...project,
      updated_at: new Date().toISOString(),
    });

    if (error) throw error;
    revalidatePath('/');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to save project' };
  }
}

export async function deleteProjectAction(id: string) {
  const isAdmin = await verifyAdmin();
  if (!isAdmin) return { success: false, error: 'Unauthorized' };

  const supabase = getAdminSupabaseClient();
  if (!supabase) return { success: false, error: 'Database not configured' };

  try {
    const { error } = await supabase.from('cms_projects').delete().eq('id', id);
    if (error) throw error;
    revalidatePath('/');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to delete project' };
  }
}

export async function syncGitHubStatsForProjectsAction() {
  const isAdmin = await verifyAdmin();
  if (!isAdmin) return { success: false, error: 'Unauthorized' };

  const supabase = getAdminSupabaseClient();
  if (!supabase) return { success: false, error: 'Database not configured' };

  try {
    const repos = await getGitHubProjects('shaikrohit');
    if (!repos || repos.length === 0) {
      return { success: false, error: 'Failed to retrieve GitHub repositories' };
    }

    const { data: currentProjects } = await supabase.from('cms_projects').select('*');
    if (!currentProjects || currentProjects.length === 0) {
      return { success: false, error: 'No projects in database to sync' };
    }

    const repoMap = new Map(repos.map((r) => [r.name.toLowerCase(), r]));
    let updatedCount = 0;

    for (const project of currentProjects) {
      const match =
        repoMap.get(project.title.toLowerCase()) ||
        repoMap.get(project.slug.toLowerCase()) ||
        repoMap.get(project.title.toLowerCase().replace(/\s+/g, '-'));

      if (match) {
        await supabase
          .from('cms_projects')
          .update({
            stars_count: Math.max(match.stargazers_count, project.stars_count || 0),
            forks_count: Math.max(match.forks_count ?? 0, project.forks_count || 0),
            updated_at: new Date().toISOString(),
          })
          .eq('id', project.id);
        updatedCount++;
      }
    }

    revalidatePath('/');
    return { success: true, updatedCount };
  } catch (err: any) {
    return { success: false, error: err.message || 'GitHub sync failed' };
  }
}

// ---------------------------------------------------------------------------
// 5. EXPERIENCE CRUD
// ---------------------------------------------------------------------------
export async function saveExperienceAction(exp: CMSExperience) {
  const isAdmin = await verifyAdmin();
  if (!isAdmin) return { success: false, error: 'Unauthorized' };

  const supabase = getAdminSupabaseClient();
  if (!supabase) return { success: false, error: 'Database not configured' };

  try {
    const { error } = await supabase.from('cms_experience').upsert({
      ...exp,
      updated_at: new Date().toISOString(),
    });

    if (error) throw error;
    revalidatePath('/');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to save experience' };
  }
}

export async function deleteExperienceAction(id: string) {
  const isAdmin = await verifyAdmin();
  if (!isAdmin) return { success: false, error: 'Unauthorized' };

  const supabase = getAdminSupabaseClient();
  if (!supabase) return { success: false, error: 'Database not configured' };

  try {
    const { error } = await supabase.from('cms_experience').delete().eq('id', id);
    if (error) throw error;
    revalidatePath('/');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to delete experience' };
  }
}

// ---------------------------------------------------------------------------
// 6. EDUCATION CRUD
// ---------------------------------------------------------------------------
export async function saveEducationAction(edu: CMSEducation) {
  const isAdmin = await verifyAdmin();
  if (!isAdmin) return { success: false, error: 'Unauthorized' };

  const supabase = getAdminSupabaseClient();
  if (!supabase) return { success: false, error: 'Database not configured' };

  try {
    const { error } = await supabase.from('cms_education').upsert({
      ...edu,
      updated_at: new Date().toISOString(),
    });

    if (error) throw error;
    revalidatePath('/');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to save education' };
  }
}

export async function deleteEducationAction(id: string) {
  const isAdmin = await verifyAdmin();
  if (!isAdmin) return { success: false, error: 'Unauthorized' };

  const supabase = getAdminSupabaseClient();
  if (!supabase) return { success: false, error: 'Database not configured' };

  try {
    const { error } = await supabase.from('cms_education').delete().eq('id', id);
    if (error) throw error;
    revalidatePath('/');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to delete education' };
  }
}

// ---------------------------------------------------------------------------
// 7. SKILLS CRUD
// ---------------------------------------------------------------------------
export async function saveSkillAction(skill: CMSSkill) {
  const isAdmin = await verifyAdmin();
  if (!isAdmin) return { success: false, error: 'Unauthorized' };

  const supabase = getAdminSupabaseClient();
  if (!supabase) return { success: false, error: 'Database not configured' };

  try {
    const { error } = await supabase.from('cms_skills').upsert({
      ...skill,
      updated_at: new Date().toISOString(),
    });

    if (error) throw error;
    revalidatePath('/');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to save skill' };
  }
}

export async function deleteSkillAction(id: string) {
  const isAdmin = await verifyAdmin();
  if (!isAdmin) return { success: false, error: 'Unauthorized' };

  const supabase = getAdminSupabaseClient();
  if (!supabase) return { success: false, error: 'Database not configured' };

  try {
    const { error } = await supabase.from('cms_skills').delete().eq('id', id);
    if (error) throw error;
    revalidatePath('/');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to delete skill' };
  }
}

// ---------------------------------------------------------------------------
// 8. ACHIEVEMENTS CRUD
// ---------------------------------------------------------------------------
export async function saveAchievementAction(ach: CMSAchievement) {
  const isAdmin = await verifyAdmin();
  if (!isAdmin) return { success: false, error: 'Unauthorized' };

  const supabase = getAdminSupabaseClient();
  if (!supabase) return { success: false, error: 'Database not configured' };

  try {
    const { error } = await supabase.from('cms_achievements').upsert({
      ...ach,
      updated_at: new Date().toISOString(),
    });

    if (error) throw error;
    revalidatePath('/');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to save achievement' };
  }
}

export async function deleteAchievementAction(id: string) {
  const isAdmin = await verifyAdmin();
  if (!isAdmin) return { success: false, error: 'Unauthorized' };

  const supabase = getAdminSupabaseClient();
  if (!supabase) return { success: false, error: 'Database not configured' };

  try {
    const { error } = await supabase.from('cms_achievements').delete().eq('id', id);
    if (error) throw error;
    revalidatePath('/');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to delete achievement' };
  }
}

// ---------------------------------------------------------------------------
// 9. MULTI-PROVIDER MEDIA VAULT ACTIONS
// ---------------------------------------------------------------------------
export async function uploadMediaAction(formData: FormData, provider?: StorageProviderType) {
  const isAdmin = await verifyAdmin();
  if (!isAdmin) return { success: false, error: 'Unauthorized', data: null };

  const file = formData.get('file') as File;
  if (!file) return { success: false, error: 'No file provided', data: null };

  try {
    const result = await uploadAsset(file, provider, 'media');

    // Register media in settings or database if desired
    return {
      success: true,
      error: null,
      data: {
        id: result.publicId,
        name: file.name,
        url: result.url,
        provider: result.provider,
        size_bytes: result.bytes || file.size,
        created_at: new Date().toISOString(),
      } as CMSMediaItem,
    };
  } catch (err: any) {
    return { success: false, error: err.message || 'Media upload failed', data: null };
  }
}

// ---------------------------------------------------------------------------
// 10. EMERGENCY RESET TO VERIFIED FACTORY DEFAULTS
// ---------------------------------------------------------------------------
export async function emergencyResetToDefaultsAction(section?: string) {
  const isAdmin = await verifyAdmin();
  if (!isAdmin) return { success: false, error: 'Unauthorized' };

  const supabase = getAdminSupabaseClient();
  if (!supabase) return { success: false, error: 'Database not configured' };

  try {
    if (!section || section === 'all' || section === 'profile') {
      await supabase.from('cms_profile').upsert(DEFAULT_PROFILE);
    }

    if (!section || section === 'all' || section === 'projects') {
      await supabase.from('cms_projects').delete().neq('slug', '');
      for (const p of DEFAULT_PROJECTS) {
        await supabase.from('cms_projects').insert(p);
      }
    }

    if (!section || section === 'all' || section === 'experience') {
      await supabase.from('cms_experience').delete().neq('company', '');
      for (const e of DEFAULT_EXPERIENCE) {
        await supabase.from('cms_experience').insert(e);
      }
    }

    if (!section || section === 'all' || section === 'education') {
      await supabase.from('cms_education').delete().neq('institution', '');
      for (const ed of DEFAULT_EDUCATION) {
        await supabase.from('cms_education').insert(ed);
      }
    }

    if (!section || section === 'all' || section === 'skills') {
      await supabase.from('cms_skills').delete().neq('name', '');
      for (const s of DEFAULT_SKILLS) {
        await supabase.from('cms_skills').insert(s);
      }
    }

    if (!section || section === 'all' || section === 'achievements') {
      await supabase.from('cms_achievements').delete().neq('title', '');
      for (const a of DEFAULT_ACHIEVEMENTS) {
        await supabase.from('cms_achievements').insert(a);
      }
    }

    // Clear drafts
    if (!section || section === 'all') {
      await supabase.from('cms_content_drafts').delete().neq('section', '');
    } else {
      await supabase.from('cms_content_drafts').delete().eq('section', section);
    }

    revalidatePath('/');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Emergency reset failed' };
  }
}
