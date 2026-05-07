import { useState, useCallback } from 'react';
import type { ResumeData, ExperienceEntry, EducationEntry, ResumeIdentity } from '../types/resume';
import { RESUME_SCHEMA, RESUME_VERSION } from '../config/constants';

const emptyIdentity: ResumeIdentity = {
  name: '', title: '', email: '', location: '',
  website: '', social: '', summary: '', wallet: null,
};

export function useResumeState() {
  const [identity, setIdentity] = useState<ResumeIdentity>(emptyIdentity);
  const [experience, setExperience] = useState<ExperienceEntry[]>([]);
  const [education, setEducation] = useState<EducationEntry[]>([]);
  const [skills, setSkills] = useState<string[]>([]);

  const updateIdentity = useCallback((field: keyof ResumeIdentity, value: string) => {
    setIdentity(prev => ({ ...prev, [field]: value }));
  }, []);

  const setWalletAddress = useCallback((addr: string | null) => {
    setIdentity(prev => ({ ...prev, wallet: addr }));
  }, []);

  // ─── Experience CRUD ──────────────────────────────────────────
  const addExperience = useCallback((entry: ExperienceEntry) => {
    setExperience(prev => [...prev, entry]);
  }, []);

  const updateExperience = useCallback((index: number, entry: ExperienceEntry) => {
    setExperience(prev => prev.map((e, i) => i === index ? entry : e));
  }, []);

  const removeExperience = useCallback((index: number) => {
    setExperience(prev => prev.filter((_, i) => i !== index));
  }, []);

  // ─── Education CRUD ───────────────────────────────────────────
  const addEducation = useCallback((entry: EducationEntry) => {
    setEducation(prev => [...prev, entry]);
  }, []);

  const updateEducation = useCallback((index: number, entry: EducationEntry) => {
    setEducation(prev => prev.map((e, i) => i === index ? entry : e));
  }, []);

  const removeEducation = useCallback((index: number) => {
    setEducation(prev => prev.filter((_, i) => i !== index));
  }, []);

  // ─── Skills CRUD ──────────────────────────────────────────────
  const addSkill = useCallback((skill: string) => {
    setSkills(prev => prev.includes(skill) ? prev : [...prev, skill]);
  }, []);

  const removeSkill = useCallback((index: number) => {
    setSkills(prev => prev.filter((_, i) => i !== index));
  }, []);

  const setAllSkills = useCallback((newSkills: string[]) => {
    setSkills(newSkills);
  }, []);

  // ─── Resume Data Builder ──────────────────────────────────────
  const getResumeData = useCallback((): ResumeData => ({
    schema: RESUME_SCHEMA,
    identity,
    experience,
    education,
    skills,
    meta: {
      published_at: new Date().toISOString(),
      version: RESUME_VERSION,
    },
  }), [identity, experience, education, skills]);

  // ─── Load Sample Profile ─────────────────────────────────────
  const loadProfile = useCallback((profile: {
    name: string; title: string; email: string; location: string; skills: readonly string[];
  }) => {
    setIdentity(prev => ({
      ...prev,
      name: profile.name,
      title: profile.title,
      email: profile.email,
      location: profile.location,
    }));
    setSkills([...profile.skills]);
  }, []);

  return {
    identity, experience, education, skills,
    updateIdentity, setWalletAddress,
    addExperience, updateExperience, removeExperience,
    addEducation, updateEducation, removeEducation,
    addSkill, removeSkill, setAllSkills,
    getResumeData, loadProfile,
  };
}
