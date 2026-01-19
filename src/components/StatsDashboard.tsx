
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            <StatCard
                label="Progress"
                value={`${progress}%`}
                subtext={`${completedCredits}/${totalCredits} Credits`}
                icon={<TrendingUp size={20} />}
                bgColor="bg-emerald-500 dark:bg-emerald-600"
            />
            <StatCard
                label="Average Grade"
                value={average}
                subtext="Cumulative GPA"
                icon={<Trophy size={20} />}
                bgColor="bg-princeton-orange-500 dark:bg-princeton-orange-600"
            />
            <StatCard
                label="Completed"
                value={completed.length.toString()}
                subtext="Total Subjects"
                icon={<Book size={20} />}
                bgColor="bg-crimson-violet-500 dark:bg-crimson-violet-600"
            />
            <StatCard
                label="Remaining"
                value={(subjects.length - completed.length).toString()}
                subtext="To Graduate"
                icon={<Zap size={20} />}
                bgColor="bg-dark-teal-500 dark:bg-dark-teal-600"
            />
        </div>
    );
};

const StatCard = ({ label, value, subtext, icon, bgColor }: any) => (
    <div className={`${bgColor} shadow-lg transition-all hover:shadow-xl hover:scale-[1.02] p-3 rounded-xl flex items-center justify-between`}>
        <div>
            <p className="text-xs sm:text-sm font-medium text-white/90">{label}</p>
            <h3 className="text-xl sm:text-2xl font-bold text-white mt-0.5 sm:mt-1">{value}</h3>
            <p className="text-[10px] sm:text-xs text-white/70 mt-0.5">{subtext}</p>
        </div>
        <div className="text-white/90 shrink-0">
            {icon}
        </div>
    </div>
);
