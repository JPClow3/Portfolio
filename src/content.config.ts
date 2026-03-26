import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Projects Collection
const projectsCollection = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    tech: z.array(z.string()),
    link: z.string().url().optional(),
    github: z.string().url().optional(),
    image: z.string().optional(),
    featured: z.boolean().default(false),
    order: z.number().default(0),
    lang: z.enum(['en', 'pt']).default('en'),
  }),
});

// Experience Collection
const experienceCollection = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/experience' }),
  schema: z.object({
    company: z.string(),
    role: z.string(),
    startDate: z.coerce.date(),
    endDate: z.coerce.date().optional(),
    location: z.string().optional(),
    tasks: z.array(z.string()),
    order: z.number().default(0),
    lang: z.enum(['en', 'pt']).default('en'),
  }),
});

// Blog Collection
const blogCollection = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    heroImage: z.string().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    lang: z.enum(['en', 'pt']).default('en'),
  }),
});

// Profile Collection
const profileCollection = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/profile' }),
  schema: z.object({
    lang: z.enum(['en', 'pt']).default('en'),
    profile: z.object({
      name: z.string(),
      shortName: z.string(),
      role: z.string(),
      subtitle: z.string(),
      location: z.string(),
      timezone: z.string(),
      github: z.string().url(),
      linkedin: z.string().url(),
      email: z.string().email(),
      gravatarHash: z.string(),
    }),
    currentFocus: z.object({
      title: z.string(),
      items: z.array(z.object({
        label: z.string(),
        value: z.string(),
        icon: z.string(),
      })).min(1),
    }),
    customMetric: z.object({
      label: z.string(),
      githubUsername: z.string(),
      fallbackEvents: z.array(z.object({
        repo: z.string(),
        date: z.coerce.date(),
      })).default([]),
    }),
  }),
});

export const collections = {
  projects: projectsCollection,
  experience: experienceCollection,
  blog: blogCollection,
  profile: profileCollection,
};
