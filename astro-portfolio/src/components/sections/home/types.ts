export interface HeroPersonalProps {
  name: string;
  title: string;
  tagline: string;
  availability: string;
  githubUrl: string;
  contactHref: string;
}

export interface ProjectItem {
  title: string;
  description: string;
  tech: string[];
  github?: string;
  link?: string;
  featured: boolean;
}

export interface ExperienceItem {
  company: string;
  role: string;
  startDate: Date;
  endDate?: Date;
  location?: string;
  tasks: string[];
}

export interface GithubRepo {
  name: string;
  url: string;
  stars: number;
  updatedAt: string;
  language?: string | null;
}

export interface GithubStats {
  username: string;
  profileUrl: string;
  publicRepos: number;
  followers: number;
  following: number;
  totalStars: number;
  recentRepos: GithubRepo[];
}

export interface ContactPanelProps {
  email: string;
  location: string;
  linkedinUrl: string;
  githubUrl: string;
}
