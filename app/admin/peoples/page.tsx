"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import AddPersonModal from "@/app/components/modals/AddPersonModal";
import StatCard from "@/app/components/cards/StatCard";

export default function PeoplesPage() {
  const [people, setPeople] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingPerson, setEditingPerson] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");

  useEffect(() => {
    fetchPeople();
  }, []);

  const fetchPeople = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/peoples");
      const data = await res.json();
      setPeople(data);
    } catch (error) {
      console.error("Failed to fetch people:", error);
      toast.error("Failed to load people");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (PeopleID: number) => {
    if (!confirm("Are you sure you want to delete this person?")) return;

    try {
      const res = await fetch("/api/peoples", {
        method: "DELETE",
        body: JSON.stringify({ PeopleID }),
      });

      if (res.ok) {
        toast.success("Person deleted");
        fetchPeople();
      } else {
        toast.error("Failed to delete");
      }
    } catch (error) {
      toast.error("Error deleting person");
    }
  };

  const handleSave = async (personData: any) => {
    try {
      const method = editingPerson ? "PUT" : "POST";
      const body = editingPerson
        ? { PeopleID: editingPerson.PeopleID, ...personData }
        : personData;

      const res = await fetch("/api/peoples", {
        method,
        body: JSON.stringify(body),
      });

      if (res.ok) {
        toast.success(editingPerson ? "Person updated" : "Person added");
        setOpen(false);
        setEditingPerson(null);
        fetchPeople();
      } else {
        toast.error("Failed to save person");
      }
    } catch (error) {
      toast.error("Error saving person");
    }
  };

  return (
    <div className="space-y-8">
      {/* PAGE HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-black uppercase tracking-[0.2em] text-text-primary">People</h1>
          <p className="text-[10px] font-bold text-muted uppercase tracking-widest mt-1 opacity-60">
            Contact Registry
          </p>
        </div>

        <button
          onClick={() => {
            setEditingPerson(null);
            setOpen(true);
          }}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-500/20 hover:scale-[1.02] active:scale-95 transition-all"
        >
          <Plus size={16} />
          Add Person
        </button>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard title="Total People" value={people.length} subtitle="Active + Inactive" />
        <StatCard title="Active" value={people.filter(p => p.IsActive).length} subtitle="Currently Active" />
        <StatCard title="Inactive" value={people.filter(p => !p.IsActive).length} subtitle="Currently Inactive" />
      </div>

      {/* SEARCH & FILTER */}
      <div className="bg-background-card border border-border-main rounded-xl p-8 flex flex-wrap gap-6 shadow-sm items-center transition-all">
        <div className="flex-1 min-w-[300px] relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
          <input
            placeholder="Filter people..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-background-main border border-border-main rounded-xl py-3 pl-12 pr-6 text-xs font-bold text-text-primary focus:border-foreground outline-none transition-all placeholder:opacity-50"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-background-main border border-border-main rounded-xl p-3 text-[10px] font-black uppercase tracking-widest text-text-primary outline-none cursor-pointer focus:border-foreground appearance-none transition-all min-w-[150px]"
        >
          <option>All Status</option>
          <option>Active</option>
          <option>Inactive</option>
        </select>
      </div>

      {/* PEOPLE TABLE */}
      <div className="bg-background-card border border-border-main rounded-xl overflow-hidden shadow-sm transition-all duration-300">
        <div className="p-8 border-b border-border-main flex justify-between items-center bg-background-main/50 backdrop-blur-sm">
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary">Directory Base</h2>
          <span className="text-[10px] font-black uppercase tracking-widest text-blue-400 bg-blue-500/10 px-3 py-1 rounded-md border border-blue-500/20 shadow-sm">
            {people.length} Verified
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-background-main border-b border-border-main/50">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted">Name</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted">Email</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted">Mobile</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted text-center">Status</th>
                <th className="px-8 py-6"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-main/50">
              {loading ? (
                <tr><td colSpan={5} className="px-8 py-20 text-center text-[10px] font-black uppercase tracking-widest text-muted animate-pulse">Synchronizing directory...</td></tr>
              ) : (() => {
                const filteredPeople = people.filter((p) => {
                  const matchesSearch = p.PeopleName?.toLowerCase().includes(search.toLowerCase()) ||
                    (p.Email && p.Email.toLowerCase().includes(search.toLowerCase())) ||
                    (p.MobileNo && p.MobileNo.includes(search));
                  const matchesStatus = statusFilter === "All Status" ||
                    (statusFilter === "Active" && p.IsActive) ||
                    (statusFilter === "Inactive" && !p.IsActive);
                  return matchesSearch && matchesStatus;
                });

                if (filteredPeople.length === 0) {
                  return <tr><td colSpan={5} className="px-8 py-20 text-center text-[10px] font-black uppercase tracking-widest text-muted">No records found</td></tr>;
                }

                return filteredPeople.map((person) => (
                  <tr
                    key={person.PeopleID}
                    className="hover:bg-background-main/50 transition-all group"
                  >
                    <td className="px-8 py-6">
                      <div className="text-xs font-black text-text-primary uppercase tracking-tight">{person.PeopleName}</div>
                    </td>
                    <td className="px-8 py-6 text-[10px] font-bold text-muted uppercase tracking-wider">{person.Email}</td>
                    <td className="px-8 py-6 text-[10px] font-bold text-muted uppercase tracking-wider tabular-nums">{person.MobileNo}</td>

                    <td className="px-8 py-6 text-center">
                      <span className={`px-3 py-1 rounded-md text-[8px] font-black uppercase tracking-widest border transition-all
                        ${person.IsActive
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-sm"
                          : "bg-background-main text-text-secondary border-border-main opacity-50"}`}>
                        {person.IsActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td className="px-8 py-6 text-right">
                      <div className="flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-all">
                        <button
                          onClick={() => {
                            setEditingPerson(person);
                            setOpen(true);
                          }}
                          className="p-2 hover:bg-foreground hover:text-background rounded-lg transition-all text-muted border border-transparent"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(person.PeopleID)}
                          className="p-2 hover:bg-foreground hover:text-background rounded-lg transition-all text-muted border border-transparent"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ));
              })()}
            </tbody>
          </table>
        </div>
      </div>

      <AddPersonModal
        open={open}
        onClose={() => setOpen(false)}
        onSave={handleSave}
        initialData={editingPerson}
      />
    </div>
  );
}

