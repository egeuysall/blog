'use client';

import React, { useEffect, useState } from 'react';
import type { FormEvent } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { getSupabaseBrowserClient } from '@/lib/supabase/browser';
import { NewtonsCradle } from 'ldrs/react';
import 'ldrs/react/NewtonsCradle.css';
import { toast } from 'sonner';

const AUTHOR_STORAGE_KEY = 'blog-admin-authors';
const LAST_AUTHOR_STORAGE_KEY = 'blog-admin-last-author';
const NEW_AUTHOR_OPTION = '__new_author__';
const TAG_STOP_WORDS = new Set([
  'a',
  'an',
  'and',
  'at',
  'by',
  'for',
  'from',
  'in',
  'into',
  'of',
  'on',
  'or',
  'the',
  'to',
  'with',
]);

function slugifyTitle(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function buildTagsFromTitle(value: string) {
  const words = value
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .map((word) => word.trim())
    .filter((word) => word.length > 2 && !TAG_STOP_WORDS.has(word));

  return Array.from(new Set(words)).slice(0, 4);
}

function formatTags(tags: string[]) {
  return tags.join(', ');
}

function parseTags(input: string) {
  return Array.from(
    new Set(
      input
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean)
    )
  );
}

function readStoredAuthors() {
  if (typeof window === 'undefined') {
    return { authors: [] as string[], lastAuthor: '' };
  }

  const savedAuthors = window.localStorage.getItem(AUTHOR_STORAGE_KEY);
  const lastAuthor = window.localStorage.getItem(LAST_AUTHOR_STORAGE_KEY) ?? '';

  if (!savedAuthors) {
    return { authors: [], lastAuthor };
  }

  try {
    const parsed = JSON.parse(savedAuthors);
    return {
      authors: Array.isArray(parsed)
        ? parsed.filter((author): author is string => typeof author === 'string' && author.trim() !== '')
        : [],
      lastAuthor,
    };
  } catch {
    return { authors: [], lastAuthor };
  }
}

function persistAuthors(authors: string[], lastAuthor: string) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(AUTHOR_STORAGE_KEY, JSON.stringify(authors));

  if (lastAuthor) {
    window.localStorage.setItem(LAST_AUTHOR_STORAGE_KEY, lastAuthor);
    return;
  }

  window.localStorage.removeItem(LAST_AUTHOR_STORAGE_KEY);
}

const AdminPage: React.FC = () => {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [slug, setSlug] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);
  const [coverLink, setCoverLink] = useState<string>('');

  const [tagInput, setTagInput] = useState<string>('');
  const [slugEdited, setSlugEdited] = useState<boolean>(false);
  const [tagsEdited, setTagsEdited] = useState<boolean>(false);

  const [savedAuthors, setSavedAuthors] = useState<string[]>([]);
  const [selectedAuthor, setSelectedAuthor] = useState<string>(NEW_AUTHOR_OPTION);
  const [newAuthorName, setNewAuthorName] = useState<string>('');

  const [supabase] = useState(() => getSupabaseBrowserClient());

  const createdBy =
    selectedAuthor === NEW_AUTHOR_OPTION ? newAuthorName.trim() : selectedAuthor.trim();

  const isLoginValid = email.trim() !== '' && password.trim() !== '';
  const isPostFormValid =
    title.trim() !== '' && content.trim() !== '' && slug.trim() !== '' && createdBy !== '';

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setLoggedIn(Boolean(session));
      setLoading(false);
    };

    checkAuth();
  }, [supabase.auth]);

  useEffect(() => {
    const loadAuthors = async () => {
      const { authors, lastAuthor } = readStoredAuthors();
      setSavedAuthors(authors);

      if (lastAuthor && authors.includes(lastAuthor)) {
        setSelectedAuthor(lastAuthor);
        return;
      }

      if (authors.length > 0 && authors[0]) {
        setSelectedAuthor(authors[0]);
      }
    };

    loadAuthors();
  }, []);

  const saveAuthor = (authorName: string) => {
    const normalizedAuthor = authorName.trim();

    if (!normalizedAuthor) {
      toast('Enter an author name first');
      return null;
    }

    const existingAuthor =
      savedAuthors.find((author) => author.toLowerCase() === normalizedAuthor.toLowerCase()) ??
      normalizedAuthor;

    const nextAuthors =
      existingAuthor === normalizedAuthor && !savedAuthors.includes(existingAuthor)
        ? [...savedAuthors, normalizedAuthor]
        : savedAuthors;

    setSavedAuthors(nextAuthors);
    setSelectedAuthor(existingAuthor);
    setNewAuthorName('');
    persistAuthors(nextAuthors, existingAuthor);

    return existingAuthor;
  };

  const handleTitleChange = (value: string) => {
    setTitle(value);

    if (!slugEdited) {
      setSlug(slugifyTitle(value));
    }

    if (!tagsEdited) {
      const generatedTags = buildTagsFromTitle(value);
      setTags(generatedTags);
      setTagInput(formatTags(generatedTags));
    }
  };

  const handleSlugChange = (value: string) => {
    setSlugEdited(true);
    setSlug(value);
  };

  const handleTagsChange = (input: string) => {
    setTagsEdited(true);
    setTagInput(input);
    setTags(parseTags(input));
  };

  const handleAuthorSelect = (value: string) => {
    setSelectedAuthor(value);

    if (value !== NEW_AUTHOR_OPTION) {
      persistAuthors(savedAuthors, value);
    }
  };

  const handleLogin = async (e?: FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    if (!email || !password) {
      toast('Please enter both email and password');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login error:', error);
        toast('Login failed: ' + error.message);
      } else {
        setLoggedIn(true);
        toast('Logged in successfully!');
      }
    } catch (err) {
      toast('An unexpected error occurred');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBlogPost = async (e?: FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    let authorName = createdBy;

    if (selectedAuthor === NEW_AUTHOR_OPTION) {
      const savedAuthor = saveAuthor(newAuthorName);

      if (!savedAuthor) {
        return;
      }

      authorName = savedAuthor;
    }

    if (!title || !content || !slug || !authorName) {
      toast('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);

      const payload = {
        title: title.trim(),
        content,
        slug: slug.trim(),
        tags,
        created_by: authorName,
        cover_link: coverLink,
      };

      const res = await fetch('/api/blogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorResponse = await res.json().catch(() => null);
        throw new Error(errorResponse?.error || 'Failed to create blog post');
      }

      persistAuthors(
        savedAuthors.some((author) => author === authorName) ? savedAuthors : [...savedAuthors, authorName],
        authorName
      );

      if (!savedAuthors.includes(authorName)) {
        setSavedAuthors((currentAuthors) => [...currentAuthors, authorName]);
      }

      setSelectedAuthor(authorName);
      toast('Blog post created successfully!');

      setTitle('');
      setContent('');
      setSlug('');
      setTags([]);
      setTagInput('');
      setCoverLink('');
      setSlugEdited(false);
      setTagsEdited(false);
    } catch (error: unknown) {
      toast(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="flex flex-col items-center justify-center min-h-[50vh]" aria-live="polite">
        <div className="text-neutral-900 dark:text-neutral-100">
          <NewtonsCradle size="48" speed="1.4" color="currentColor" aria-hidden="true" />
        </div>
        <h3 className="animate-pulse text-center mt-md" role="status">
          Loading...
        </h3>
      </main>
    );
  }

  if (!loggedIn) {
    return (
      <div className="flex items-center justify-center p-lg">
        <main className="w-full flex flex-col gap-lg max-w-72">
          <Card>
            <CardHeader>
              <CardTitle>Log in</CardTitle>
              <CardDescription>Access your account.</CardDescription>
              <Separator className="my-2" />
            </CardHeader>
            <CardContent className="flex flex-col gap-lg">
              <form onSubmit={handleLogin} className="flex flex-col gap-lg">
                <div className="flex flex-col gap-2xs">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    required
                    autoFocus
                    autoComplete="email"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-2xs">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    required
                    autoComplete="current-password"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <Button type="submit" disabled={loading || !isLoginValid}>
                  {loading ? 'Logging in...' : 'Log in'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-4">
      <main className="w-full flex flex-col gap-lg md:w-3/4 lg:max-w-2/4">
        <section className="flex flex-col gap-2xs">
          <div className="flex justify-between items-center">
            <h4>Create New Post</h4>
          </div>
          <p className="text-small">Share your thoughts with a fresh new post.</p>
          <Separator className="my-2" />
        </section>

        <section>
          <div className="flex flex-col gap-md">
            <div className="flex flex-col gap-2xs">
              <Label htmlFor="title">
                Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                type="text"
                placeholder="Enter blog title"
                value={title}
                required
                onChange={(e) => handleTitleChange(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2xs">
              <Label htmlFor="slug">
                Slug <span className="text-destructive">*</span>
              </Label>
              <Input
                id="slug"
                type="text"
                placeholder="my-blog-post"
                value={slug}
                required
                onChange={(e) => handleSlugChange(e.target.value)}
              />
              <p className="text-small text-neutral-600 dark:text-neutral-400">
                Auto-generated from the title until you edit it manually.
              </p>
            </div>

            <div className="flex flex-col gap-2xs">
              <Label htmlFor="createdBy">
                Author <span className="text-destructive">*</span>
              </Label>
              <Select value={selectedAuthor} onValueChange={handleAuthorSelect}>
                <SelectTrigger id="createdBy" className="w-full" aria-label="Author">
                  <SelectValue placeholder="Select an author" />
                </SelectTrigger>
                <SelectContent>
                  {savedAuthors.map((author) => (
                    <SelectItem key={author} value={author}>
                      {author}
                    </SelectItem>
                  ))}
                  <SelectItem value={NEW_AUTHOR_OPTION}>Add new author</SelectItem>
                </SelectContent>
              </Select>
              {selectedAuthor === NEW_AUTHOR_OPTION ? (
                <div className="flex flex-col gap-2xs sm:flex-row sm:items-end">
                  <div className="flex-1">
                    <Label htmlFor="newAuthorName">New author name</Label>
                    <Input
                      id="newAuthorName"
                      type="text"
                      placeholder="Your name"
                      value={newAuthorName}
                      onChange={(e) => setNewAuthorName(e.target.value)}
                    />
                  </div>
                  <Button
                    type="button"
                    className="sm:w-fit"
                    onClick={() => {
                      saveAuthor(newAuthorName);
                    }}
                  >
                    Save Author
                  </Button>
                </div>
              ) : null}
            </div>

            <div className="flex flex-col gap-2xs">
              <Label htmlFor="coverLink">Cover Image URL</Label>
              <Input
                id="coverLink"
                type="url"
                placeholder="https://..."
                value={coverLink}
                onChange={(e) => setCoverLink(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2xs">
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                type="text"
                placeholder="Auto-generated from title, editable as comma-separated values"
                value={tagInput}
                onChange={(e) => handleTagsChange(e.target.value)}
              />
              {tags.length > 0 ? (
                <div className="flex flex-wrap gap-2xs">
                  {tags.map((tag) => (
                    <Badge key={tag}>{tag}</Badge>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="flex flex-col gap-2xs">
              <Label htmlFor="content">
                Content <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="content"
                placeholder="Write your post in markdown..."
                value={content}
                required
                className="min-h-64 font-mono text-sm"
                onChange={(e) => setContent(e.target.value)}
              />
            </div>

            <Button type="submit" onClick={() => handleBlogPost()} disabled={loading || !isPostFormValid}>
              {loading ? 'Publishing...' : 'Publish Post'}
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminPage;
