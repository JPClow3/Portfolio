import { describe, it, expect } from 'vitest';
import { useTranslations, getLangFromUrl, languages, defaultLang, ui } from '../../src/lib/i18n';
import type { Lang } from '../../src/lib/i18n';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

describe('i18n Utilities', () => {
  describe('languages', () => {
    it('should contain expected languages', () => {
      expect('en' in languages).toBe(true);
      expect('pt' in languages).toBe(true);
    });

    it('should have correct language names', () => {
      expect(languages.en).toBe('English');
      expect(languages.pt).toBe('Português');
    });
  });

  describe('defaultLang', () => {
    it('should be set to English', () => {
      expect(defaultLang).toBe('en');
    });

    it('should be a valid language key', () => {
      expect(defaultLang in languages).toBe(true);
    });
  });

  describe('useTranslations()', () => {
    it('should return a translation function', () => {
      const t = useTranslations('en');
      expect(typeof t).toBe('function');
    });

    it('should translate English strings correctly', () => {
      const t = useTranslations('en');
      
      expect(t('nav.company')).toBe('Company');
      expect(t('nav.contact')).toBe('Contact');
      expect(t('nav.startProject').length).toBeGreaterThan(0);
    });

    it('should translate Portuguese strings correctly', () => {
      const t = useTranslations('pt');
      
      expect(t('nav.company')).toBe('Empresa');
      expect(t('nav.contact')).toBe('Contato');
      expect(t('nav.startProject').length).toBeGreaterThan(0);
    });

    it('should fallback to English for missing translation key in selected language', () => {
      const ptDict = ui.pt as Record<string, string>;
      const original = ptDict['common.backToTop'];

      delete ptDict['common.backToTop'];

      const t = useTranslations('pt');
      const result = t('common.backToTop');

      expect(result).toBe(ui.en['common.backToTop']);

      ptDict['common.backToTop'] = original;
    });

    it('should handle all EN translations without errors', () => {
      const t = useTranslations('en');
      
      Object.keys(ui.en).forEach(key => {
        const result = t(key as keyof typeof ui.en);
        expect(typeof result).toBe('string');
        expect(result.length).toBeGreaterThan(0);
      });
    });

    it('should handle all PT translations without errors', () => {
      const t = useTranslations('pt');
      
      Object.keys(ui.pt).forEach(key => {
        const result = t(key as keyof typeof ui.pt);
        expect(typeof result).toBe('string');
        expect(result.length).toBeGreaterThan(0);
      });
    });

    it('should work with different language codes', () => {
      const enT = useTranslations('en');
      const ptT = useTranslations('pt');
      
      expect(enT('nav.company')).not.toBe(ptT('nav.company'));
      expect(enT('nav.company')).toBe('Company');
      expect(ptT('nav.company')).toBe('Empresa');
    });
  });

  describe('getLangFromUrl()', () => {
    it('should extract language from URL pathname', () => {
      const url = new URL('http://localhost:3000/en/');
      expect(getLangFromUrl(url)).toBe('en');
    });

    it('should extract Portuguese language from URL', () => {
      const url = new URL('http://localhost:3000/pt/');
      expect(getLangFromUrl(url)).toBe('pt');
    });

    it('should return default language for invalid language code', () => {
      const url = new URL('http://localhost:3000/invalid/');
      expect(getLangFromUrl(url)).toBe(defaultLang);
    });

    it('should return default language for root path', () => {
      const url = new URL('http://localhost:3000/');
      expect(getLangFromUrl(url)).toBe(defaultLang);
    });

    it('should handle nested paths correctly', () => {
      const url = new URL('http://localhost:3000/en/blog/hello-world');
      expect(getLangFromUrl(url)).toBe('en');
    });

    it('should handle case-sensitive language codes', () => {
      const urlEn = new URL('http://localhost:3000/EN/');
      const urlPt = new URL('http://localhost:3000/PT/');
      
      // Language codes should be case-sensitive
      expect(getLangFromUrl(urlEn)).toBe(defaultLang); // EN is not in languages
      expect(getLangFromUrl(urlPt)).toBe(defaultLang); // PT is not in languages
    });

    it('should handle URLs with query parameters', () => {
      const url = new URL('http://localhost:3000/en/?page=1');
      expect(getLangFromUrl(url)).toBe('en');
    });

    it('should handle URLs with hash fragments', () => {
      const url = new URL('http://localhost:3000/pt/#section');
      expect(getLangFromUrl(url)).toBe('pt');
    });

    it('should work with different domains', () => {
      const url1 = new URL('https://jpclow.dev/en/');
      const url2 = new URL('https://example.com/pt/');
      
      expect(getLangFromUrl(url1)).toBe('en');
      expect(getLangFromUrl(url2)).toBe('pt');
    });
  });

  describe('Integration tests', () => {
    it('should support complete translation flow', () => {
      const url = new URL('http://localhost:3000/pt/');
      const lang = getLangFromUrl(url);
      const t = useTranslations(lang as Lang);
      
      expect(lang).toBe('pt');
      expect(t('nav.company')).toBe('Empresa');
    });

    it('should handle language switching', () => {
      const enT = useTranslations('en');
      const ptT = useTranslations('pt');
      
      expect(enT('nav.startProject')).toBe('Start a project');
      expect(ptT('nav.startProject')).toBe('Iniciar projeto');
    });

    it('should maintain consistency across languages', () => {
      // Both language versions should have the same keys
      const enKeys = Object.keys(ui.en).sort();
      const ptKeys = Object.keys(ui.pt).sort();

      expect(enKeys.length).toBeGreaterThan(0);
      expect(ptKeys.length).toBeGreaterThan(0);
      // Note: Keys might not be exactly the same if some keys are language-specific
      // This test ensures both have translations
    });
  });

  describe('Translation content validation', () => {
    it('should not have empty translation strings', () => {
      Object.values(ui.en).forEach((value) => {
        expect(value).not.toBe('');
        expect(value.length).toBeGreaterThan(0);
      });

      Object.values(ui.pt).forEach((value) => {
        expect(value).not.toBe('');
        expect(value.length).toBeGreaterThan(0);
      });
    });

    it('should have strict key parity across languages', () => {
      const enKeys = Object.keys(ui.en).sort();
      const ptKeys = Object.keys(ui.pt).sort();

      const missingInPt = enKeys.filter((key) => !ptKeys.includes(key));
      const missingInEn = ptKeys.filter((key) => !enKeys.includes(key));

      expect(missingInPt, `Missing keys in PT: ${missingInPt.join(', ')}`).toEqual([]);
      expect(missingInEn, `Missing keys in EN: ${missingInEn.join(', ')}`).toEqual([]);
      expect(enKeys).toEqual(ptKeys);
    });
  });

  describe('dictionary hygiene', () => {
    it('keeps English and Portuguese keys in parity', () => {
      expect(Object.keys(ui.pt).sort()).toEqual(Object.keys(ui.en).sort());
    });

    it('has no dead keys that no component references', () => {
      const root = resolve(__dirname, '../../src');
      const files: string[] = [];
      const walk = (dir: string) => {
        for (const entry of readdirSync(dir)) {
          const full = join(dir, entry);
          if (statSync(full).isDirectory()) walk(full);
          else if (/\.(astro|ts|svelte)$/.test(entry) && !full.endsWith(join('lib', 'i18n.ts'))) files.push(full);
        }
      };
      walk(root);
      const source = files.map((file) => readFileSync(file, 'utf-8')).join('\n');
      const unused = Object.keys(ui.en).filter((key) => !source.includes(`'${key}'`) && !source.includes(`"${key}"`));
      expect(unused).toEqual([]);
    });

    it('does not use first-person singular copy for the studio', () => {
      const values = [...Object.values(ui.en), ...Object.values(ui.pt)].join(' ');
      expect(values).not.toMatch(/\b(I'm|I've|I haven't|my)\b/);
    });
  });
});
