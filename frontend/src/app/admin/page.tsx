'use client';

import React, { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { createBrowserClient } from '@supabase/ssr';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { NewtonsCradle } from 'ldrs/react';
import 'ldrs/react/NewtonsCradle.css';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

const AdminPage: React.FC = () => {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [slug, setSlug] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);
  const [createdBy, setCreatedBy] = useState<string>('');
  const [coverLink, setCoverLink] = useState<string>('');

  const [tagInput, setTagInput] = useState<string>('');

  const isLoginValid = email.trim() !== '' && password.trim() !== '';
  const isPostFormValid =
    title.trim() !== '' && content.trim() !== '' && slug.trim() !== '' && createdBy.trim() !== '';

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setLoggedIn(!!session);
      setLoading(false);
    };
    checkAuth();
  }, [supabase.auth]);

  const handleTagsChange = (input: string) => {
    setTagInput(input);

    const tagsArray = input
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag !== '');

    setTags(tagsArray);
  };

  const handleLogin = async (e?: FormEvent) => {
    if (e) e.preventDefault();

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
    if (e) e.preventDefault();

    if (!title || !content || !slug || !createdBy) {
      toast('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);

      const {
        data: { session },
      } = await supabase.auth.getSession();

      const token = session?.access_token;
      const payload = {
        title,
        content,
        slug,
        tags,
        created_by: createdBy,
        cover_link: coverLink,
      };

      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token || session?.access_token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error('Failed to create blog post');
      }

      toast('Blog post created successfully!');

      // Reset form
      setTitle('');
      setContent('');
      setSlug('');
      setTags([]);
      setTagInput('');
      setCreatedBy('');
      setCoverLink('');
    } catch (error: unknown) {
      toast(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="flex flex-col items-center justify-center min-h-[50vh]" aria-live="polite">
        <NewtonsCradle size="64" speed="1.4" color="#f5f5f5" aria-hidden="true" />
        <h1 className="animate-pulse text-center mt-4" role="status">
          Loading...
        </h1>
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
        <form onSubmit={handleBlogPost} className="flex flex-col gap-lg">
          <div className="grid grid-cols-2 gap-lg">
            <div className="flex flex-col gap-2xs col-span-2 md:col-span-1">
              <Label htmlFor="title">Post Title</Label>
              <Input
                id="title"
                required
                placeholder="Enter a catchy and descriptive title"
                autoFocus
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2xs col-span-2 md:col-span-1">
              <Label htmlFor="slug">URL Slug</Label>
              <Input
                id="slug"
                required
                placeholder="post-url-path (use hyphens, no spaces)"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2xs col-span-2 md:col-span-1">
              <Label htmlFor="author">Author</Label>
              <Input
                id="author"
                required
                placeholder="Your name or username"
                value={createdBy}
                onChange={(e) => setCreatedBy(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2xs col-span-2 md:col-span-1">
              <Label htmlFor="coverImage">Cover Image URL</Label>
              <Input
                id="coverImage"
                placeholder="https://example.com/image.jpg"
                value={coverLink}
                onChange={(e) => setCoverLink(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2xs col-span-2">
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                placeholder="technology, tutorial, coding (separate with commas)"
                value={tagInput}
                onChange={(e) => handleTagsChange(e.target.value)}
              />
              {tags.length > 0 && (
                <div className="mt-2xs" role="group" aria-label="Selected tags">
                  {tags.map((tag, index) => (
                    <Badge className="mr-2xs" key={index}>
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2xs col-span-2">
              <Label htmlFor="content">Post Content</Label>
              <Textarea
                id="content"
                required
                placeholder="Write your post content here... (Markdown supported)"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[200px]"
              />
            </div>
          </div>
          <Button type="submit" className="col-span-2" disabled={loading || !isPostFormValid}>
            {loading ? 'Publishing...' : 'Publish Post'}
          </Button>
        </form>
      </main>
    </div>
  );
};

export default AdminPage;
