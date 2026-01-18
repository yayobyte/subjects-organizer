
import { useSubjects } from '../contexts/SubjectContext';
import { Trophy, Book, Zap, TrendingUp } from 'lucide-react';

export const StatsOverview = () => {
    const { subjects } = useSubjects();

    const completed = subjects.filter(s => s.status === 'completed');
    const totalCredits = subjects.reduce((acc, s) => acc + s.credits, 0);
    const completedCredits = completed.reduce((acc, s) => acc + s.credits, 0);
    const progress = Math.round((completedCredits / totalCredits) * 100);

    // Calculate Average Grade
    const grades = completed
        .map(s => s.grade)
        .filter((g): g is number => typeof g === 'number');

    const average = grades.length > 0
        ? (grades.reduce((a, b) => a + b, 0) / grades.length).toFixed(1)
        : '-';

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <StatCard
                label="Progress"
                value={`${progress}%`}
                subtext={`${completedCredits}/${totalCredits} Credits`}
                icon={<TrendingUp className="text-emerald-500" />}
                color="bg-emerald-50 dark:bg-emerald-900/20"
            />
            <StatCard
                label="Average Grade"
                value={average}
                subtext="Cumulative GPA"
                icon={<Trophy className="text-princeton-orange-500" />}
                color="bg-princeton-orange-50 dark:bg-princeton-orange-900/20"
            />
            <StatCard
                label="Completed"
                value={completed.length.toString()}
                subtext="Total Subjects"
                icon={<Book className="text-crimson-violet-500" />}
                color="bg-crimson-violet-50 dark:bg-crimson-violet-900/20"
            />
            <StatCard
                label="Remaining"
                value={(subjects.length - completed.length).toString()}
                subtext="To Graduate"
                icon={<Zap className="text-dark-teal-500" />}
                color="bg-dark-teal-50 dark:bg-dark-teal-900/20"
            />
        </div>
    );
};

const StatCard = ({ label, value, subtext, icon, color }: any) => (
    <div className="bg-white/40 dark:bg-black/40 backdrop-blur-md border border-white/10 shadow-sm transition-all hover:bg-white/60 dark:hover:bg-black/60 p-4 rounded-xl flex items-center justify-between">
        <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{value}</h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{subtext}</p>
        </div>
        <div className={`p-3 rounded-xl ${color}`}>
            {icon}
        </div>
    </div>
);
