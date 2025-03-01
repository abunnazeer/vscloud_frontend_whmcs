// src/app/(admin)/admin/knowledge-base/page.tsx
"use client";

import { useState } from "react";
import {
  BookOpenIcon,
  FolderIcon,
  DocumentTextIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";

interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  category: string;
  tags: string[];
  author: string;
  status: "published" | "draft";
  createdAt: string;
  updatedAt: string;
  views: number;
  helpful: number;
  notHelpful: number;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  articleCount: number;
  parentId?: string;
  order: number;
}

const mockCategories: Category[] = [
  {
    id: "1",
    name: "Getting Started",
    slug: "getting-started",
    description: "Basic guides and tutorials",
    articleCount: 5,
    order: 1,
  },
  {
    id: "2",
    name: "Account Management",
    slug: "account-management",
    description: "User account and billing",
    articleCount: 8,
    order: 2,
  },
  {
    id: "3",
    name: "Technical Guides",
    slug: "technical-guides",
    description: "Advanced technical documentation",
    articleCount: 12,
    order: 3,
  },
];

const mockArticles: Article[] = [
  {
    id: "1",
    title: "How to Create Your First Website",
    slug: "create-first-website",
    content: "Step by step guide...",
    category: "getting-started",
    tags: ["beginner", "website", "setup"],
    author: "John Doe",
    status: "published",
    createdAt: "2024-02-01",
    updatedAt: "2024-02-07",
    views: 150,
    helpful: 45,
    notHelpful: 2,
  },
  {
    id: "2",
    title: "Managing Billing and Subscriptions",
    slug: "billing-subscriptions",
    content: "Complete guide to billing...",
    category: "account-management",
    tags: ["billing", "subscription", "payment"],
    author: "Jane Smith",
    status: "published",
    createdAt: "2024-02-03",
    updatedAt: "2024-02-07",
    views: 89,
    helpful: 32,
    notHelpful: 1,
  },
];

export default function KnowledgeBasePage() {
  const [categories] = useState<Category[]>(mockCategories);
  const [articles] = useState<Article[]>(mockArticles);
  const [searchTerm, setSearchTerm] = useState("");

  const handleCreateCategory = () => {
    // TODO: Implement category creation
    console.log("Create category");
  };

  const handleCreateArticle = () => {
    // TODO: Implement article creation
    console.log("Create article");
  };

  const handleEditCategory = (categoryId: string) => {
    // TODO: Implement category editing
    console.log("Edit category:", categoryId);
  };

  const handleDeleteCategory = (categoryId: string) => {
    // TODO: Implement category deletion
    console.log("Delete category:", categoryId);
  };

  const handleEditArticle = (articleId: string) => {
    // TODO: Implement article editing
    console.log("Edit article:", articleId);
  };

  const handleDeleteArticle = (articleId: string) => {
    // TODO: Implement article deletion
    console.log("Delete article:", articleId);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Knowledge Base</h1>
        <p className="mt-2 text-sm text-gray-700">
          Manage help articles and documentation
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg bg-white p-6 shadow">
          <div className="flex items-center">
            <div className="rounded-full bg-blue-100 p-3">
              <DocumentTextIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-900">
                Total Articles
              </h3>
              <p className="text-2xl font-semibold text-gray-900">
                {articles.length}
              </p>
              <p className="text-sm text-green-600">+3 this week</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <div className="flex items-center">
            <div className="rounded-full bg-purple-100 p-3">
              <FolderIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-900">Categories</h3>
              <p className="text-2xl font-semibold text-gray-900">
                {categories.length}
              </p>
              <p className="text-sm text-gray-500">Well organized</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <div className="flex items-center">
            <div className="rounded-full bg-green-100 p-3">
              <ArrowPathIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-900">
                Updated Articles
              </h3>
              <p className="text-2xl font-semibold text-gray-900">12</p>
              <p className="text-sm text-green-600">Last 30 days</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <div className="flex items-center">
            <div className="rounded-full bg-yellow-100 p-3">
              <BookOpenIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-900">Total Views</h3>
              <p className="text-2xl font-semibold text-gray-900">2,458</p>
              <p className="text-sm text-green-600">+15% from last month</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex space-x-4">
        <div className="flex-1">
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search articles..."
              className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 focus:border-blue-500 focus:outline-none"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <Button variant="outline" onClick={handleCreateCategory}>
          <PlusIcon className="mr-2 h-5 w-5" />
          New Category
        </Button>
        <Button onClick={handleCreateArticle}>
          <PlusIcon className="mr-2 h-5 w-5" />
          New Article
        </Button>
      </div>

      {/* Categories and Articles */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Categories List */}
        <div className="lg:col-span-1">
          <div className="rounded-lg bg-white shadow">
            <div className="border-b border-gray-200 px-6 py-4">
              <h2 className="text-lg font-medium text-gray-900">Categories</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {categories.map(category => (
                <div key={category.id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <FolderIcon className="h-6 w-6 text-gray-400" />
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">
                          {category.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {category.articleCount} articles
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditCategory(category.id)}
                      >
                        <PencilIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteCategory(category.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Articles List */}
        <div className="lg:col-span-2">
          <div className="rounded-lg bg-white shadow">
            <div className="border-b border-gray-200 px-6 py-4">
              <h2 className="text-lg font-medium text-gray-900">
                Recent Articles
              </h2>
            </div>
            <div className="divide-y divide-gray-200">
              {articles.map(article => (
                <div key={article.id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {article.title}
                      </h3>
                      <div className="mt-1 flex items-center space-x-4">
                        <span className="text-sm text-gray-500">
                          {article.category}
                        </span>
                        <span className="text-sm text-gray-500">
                          {article.views} views
                        </span>
                        <span className="text-sm text-gray-500">
                          Updated{" "}
                          {new Date(article.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="mt-2 flex space-x-2">
                        {article.tags.map(tag => (
                          <span
                            key={tag}
                            className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditArticle(article.id)}
                      >
                        <PencilIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteArticle(article.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
