"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Plus, Edit, Trash2 } from "lucide-react";
import ProjectCard from "@/app/components/cards/ProjectCard";
import ProjectBudgetChart from "@/app/components/charts/ProjectBudgetChart";
import AddProjectModal from "@/app/components/modals/AddProjectModal";
import StatCard from "@/app/components/cards/StatCard";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/projects");
      const data = await res.json();
      setProjects(data);
    } catch (error) {
      toast.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (ProjectID: number) => {
    if (!confirm("Are you sure?")) return;

    try {
      const res = await fetch("/api/projects", {
        method: "DELETE",
        body: JSON.stringify({ ProjectID }),
      });

      if (res.ok) {
        toast.success("Project deleted");
        fetchProjects();
      } else {
        toast.error("Failed to delete");
      }
    } catch (error) {
      toast.error("Error deleting project");
    }
  };

  const handleSave = async (projectData: any) => {
    try {
      const method = editingProject ? "PUT" : "POST";
      const body = editingProject
        ? { ProjectID: editingProject.ProjectID, ...projectData }
        : projectData;

      const res = await fetch("/api/projects", {
        method,
        body: JSON.stringify(body),
      });

      if (res.ok) {
        toast.success(editingProject ? "Project updated" : "Project added");
        setOpen(false);
        setEditingProject(null);
        fetchProjects();
      } else {
        toast.error("Failed to save project");
      }
    } catch (error) {
      toast.error("Error saving project");
    }
  };

  return (
    <div className="space-y-10">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-black uppercase tracking-[0.2em] text-text-primary">Projects</h1>
          <p className="text-[10px] font-bold text-muted uppercase tracking-widest mt-1 opacity-60">
            Strategic Initiatives
          </p>
        </div>

        <button
          onClick={() => {
            setEditingProject(null);
            setOpen(true);
          }}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-500/20 hover:scale-[1.02] active:scale-95 transition-all"
        >
          <Plus size={16} />
          Add Project
        </button>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <StatCard title="Total Projects" value={projects.length} subtitle="Lifetime Projects" />
        <StatCard title="Active Projects" value={projects.filter(p => p.IsActive).length} subtitle="Currently Ongoing" />
        <StatCard title="Inactive Projects" value={projects.filter(p => !p.IsActive).length} subtitle="Completed/Paused" />
      </div>

      {/* CHART + INSIGHTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-background-card border border-border-main rounded-xl p-8 shadow-sm">
          <ProjectBudgetChart />
        </div>

        <div className="bg-background-card border border-border-main rounded-xl p-8 shadow-xl shadow-black/20 flex flex-col justify-center text-center group">
          <div className="bg-blue-500/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-blue-500/20 group-hover:scale-110 transition-all">
            <span className="text-xl">💡</span>
          </div>
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary mb-4 group-hover:text-blue-400 transition-colors">Strategic Summary</h3>
          <p className="text-xs font-bold text-text-primary uppercase tracking-tight leading-relaxed px-4 opacity-80 group-hover:opacity-100">
            Unified resource allocation dashboard for monitoring capital performance across all active initiatives.
          </p>
        </div>
      </div>

      {/* PROJECT LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          <div className="col-span-full text-center py-20 text-[10px] font-black uppercase tracking-widest text-muted animate-pulse">Scanning project database...</div>
        ) : projects.length === 0 ? (
          <div className="col-span-full text-center py-20 text-[10px] font-black uppercase tracking-widest text-muted">No records found</div>
        ) : (
          projects.map((project) => (
            <div key={project.ProjectID} className="relative group transition-all duration-300">
              <ProjectCard
                name={project.ProjectName}
                status={project.IsActive ? "Active" : "Inactive"}
                manager="Project Lead"
                budget={project.Budget || 0}
                spent={project.Spent || 0}
                progress={project.Progress || 0}
              />
              <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                <button
                  onClick={() => { setEditingProject(project); setOpen(true); }}
                  className="p-2 bg-background-main text-text-secondary rounded-lg shadow-xl border border-border-main hover:text-blue-400 hover:border-blue-500/30 transition-all font-black"
                >
                  <Edit size={14} />
                </button>
                <button
                  onClick={() => handleDelete(project.ProjectID)}
                  className="p-2 bg-background-main text-text-secondary rounded-lg shadow-xl border border-border-main hover:text-rose-400 hover:border-rose-500/30 transition-all font-black"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <AddProjectModal
        open={open}
        onClose={() => setOpen(false)}
        onSave={handleSave}
        initialData={editingProject}
      />
    </div>
  );
}
