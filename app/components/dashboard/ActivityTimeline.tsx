"use client";

import { CheckCircle2, PlusCircle, UserPlus, Briefcase, ArrowUpRight, ShoppingBag } from "lucide-react";

interface Activity {
    id: string;
    type: 'expense_added' | 'income_updated' | 'project_created' | 'user_added';
    title: string;
    timestamp: string;
    description?: string;
}

export default function ActivityTimeline({ activities = [] }: { activities?: Activity[] }) {
    const displayActivities = activities.length > 0 ? activities : [
        { id: '1', type: 'expense_added', title: 'New Expense Added', description: 'Office Supplies - ₹1,200', timestamp: '2 mins ago' },
        { id: '2', type: 'project_created', title: 'Project Initialized', description: 'Website Redesign', timestamp: '1 hour ago' },
        { id: '3', type: 'user_added', title: 'New Member Joined', description: 'Sarah Chen - Admin', timestamp: '3 hours ago' },
        { id: '4', type: 'income_updated', title: 'Bonus Received', description: 'Quarterly Incentive', timestamp: '5 hours ago' },
    ];

    const getIcon = (type: string) => {
        switch (type) {
            case 'expense_added': return <ShoppingBag size={14} className="text-rose-400" />;
            case 'income_updated': return <ArrowUpRight size={14} className="text-emerald-400" />;
            case 'project_created': return <Briefcase size={14} className="text-blue-400" />;
            case 'user_added': return <UserPlus size={14} className="text-indigo-400" />;
            default: return <CheckCircle2 size={14} className="text-emerald-500" />;
        }
    };

    return (
        <div className="bg-background-card border border-border-main rounded-xl p-8 shadow-sm transition-all flex flex-col h-full">
            <div className="mb-10">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted">Activity Timeline</h3>
                <p className="text-[10px] font-bold text-muted mt-1 uppercase opacity-60">System Log</p>
            </div>

            <div className="relative space-y-8 before:absolute before:inset-0 before:ml-4 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-blue-500/50 before:via-border-main before:to-transparent">
                {displayActivities.map((activity, index) => (
                    <div key={activity.id || index} className="relative flex items-start gap-6 group">
                        {/* Timeline Marker */}
                        <div className="absolute left-0 mt-1 w-8 h-8 flex items-center justify-center rounded-lg bg-background-main border border-border-main group-hover:border-blue-500/50 group-hover:shadow-[0_0_15px_rgba(59,130,246,0.15)] transition-all z-10 shadow-lg">
                            {getIcon(activity.type)}
                        </div>

                        <div className="pl-10 space-y-1">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                <p className="text-xs font-black text-text-primary leading-tight uppercase tracking-tight group-hover:text-blue-400 transition-colors">
                                    {activity.title}
                                </p>
                                <span className="text-[8px] font-black text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20 w-fit drop-shadow-sm">
                                    {activity.timestamp}
                                </span>
                            </div>
                            {activity.description && (
                                <p className="text-[10px] text-text-secondary font-bold uppercase tracking-wider opacity-80">
                                    {activity.description}
                                </p>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <button className="mt-auto pt-6 text-[10px] font-black uppercase tracking-widest text-muted hover:text-text-primary transition-colors text-center border-t border-border-main mt-10">
                View Logs
            </button>
        </div>
    );
}
