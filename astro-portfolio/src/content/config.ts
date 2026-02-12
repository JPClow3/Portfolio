import { defineCollection, z } from 'astro:content';

// Projects Collection
const projectsCollection = defineCollection({
  type: 'content',
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
  type: 'content',
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
  type: 'content',
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

export const collections = {
  projects: projectsCollection,
  experience: experienceCollection,
  blog: blogCollection,
};
