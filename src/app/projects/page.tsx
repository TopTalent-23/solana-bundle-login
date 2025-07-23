'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Package, Calendar, Rocket, ExternalLink } from 'lucide-react';

export default function ProjectsPage() {
  // Placeholder for projects data
  const projects = [
    {
      id: 1,
      name: 'Example Token',
      status: 'active',
      createdAt: '2024-01-15',
      tokenAddress: '0x1234...5678',
      bundleCount: 3,
    },
    // Add more projects as needed
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">My Projects</h1>
          <p className="text-muted-foreground mt-2">
            Manage and monitor all your token launches and bundles
          </p>
        </div>

        {projects.length === 0 ? (
          <Card className="p-12 text-center">
            <Package className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Projects Yet</h3>
            <p className="text-muted-foreground mb-6">
              Start by creating your first token and bundle
            </p>
            <a
              href="/token"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Rocket className="w-4 h-4" />
              Create Token & Bundle
            </a>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <Card key={project.id} className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">{project.name}</h3>
                    <span className={`inline-block px-2 py-1 text-xs rounded-full mt-2 ${
                      project.status === 'active' 
                        ? 'bg-green-500/20 text-green-500' 
                        : 'bg-gray-500/20 text-gray-500'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                  <ExternalLink className="w-4 h-4 text-muted-foreground" />
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>Created {project.createdAt}</span>
                  </div>
                  <div className="text-muted-foreground">
                    <span className="font-mono text-xs">{project.tokenAddress}</span>
                  </div>
                  <div className="pt-2 border-t">
                    <span className="font-semibold">{project.bundleCount}</span>
                    <span className="text-muted-foreground"> bundles created</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
} 