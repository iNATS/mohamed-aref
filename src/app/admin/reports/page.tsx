
'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Briefcase, Users, Palette, Activity, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, RadialBar, RadialBarChart, Legend } from 'recharts';
import { useToast } from '@/hooks/use-toast';
import { addMonths, format, startOfMonth, subMonths, isSameMonth } from 'date-fns';
import { getReportsData } from '@/lib/db';

interface ReportsData {
    totalBilled: number;
    completedProjectsCount: number;
    totalClientsCount: number;
    activeProjectsCount: number;
    incomeData: { name: string; income: number }[];
    workloadData: { name: string; value: number; fill: string }[];
    clientLeaderboard: any[];
}

export default function ReportsPage() {
    const { toast } = useToast();
    const [data, setData] = React.useState<ReportsData | null>(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        async function fetchData() {
            const reportsData = await getReportsData();
            setData(reportsData);
            setLoading(false);
        }
        fetchData();
    }, []);
    
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.2 },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: 'spring', stiffness: 100 },
        },
    };
    
    if (loading || !data) {
        return <p>Loading...</p>;
    }

    return (
        <>
            <div className="flex items-center mb-6">
                <h1 className="text-2xl font-bold tracking-tight">Analytics & Insights</h1>
            </div>
            
            <div className="flex-1 overflow-y-auto pb-4">
                <motion.div 
                    className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.div variants={itemVariants}>
                        <Card className="bg-white/60 dark:bg-white/5 backdrop-blur-2xl border-zinc-200/50 dark:border-white/10 shadow-xl rounded-2xl transition-all duration-300 hover:border-zinc-300 dark:hover:border-white/20 hover:-translate-y-1">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-zinc-600 dark:text-white/70">Total Revenue</CardTitle>
                                <DollarSign className="h-5 w-5 text-green-500 dark:text-green-400" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">{data.totalBilled.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</div>
                                <p className="text-xs text-zinc-500 dark:text-white/50">From {data.completedProjectsCount} completed projects</p>
                            </CardContent>
                        </Card>
                    </motion.div>
                    <motion.div variants={itemVariants}>
                        <Card className="bg-white/60 dark:bg-white/5 backdrop-blur-2xl border-zinc-200/50 dark:border-white/10 shadow-xl rounded-2xl transition-all duration-300 hover:border-zinc-300 dark:hover:border-white/20 hover:-translate-y-1">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-zinc-600 dark:text-white/70">Completed Projects</CardTitle>
                                <Briefcase className="h-5 w-5 text-blue-500 dark:text-blue-400" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">{data.completedProjectsCount}</div>
                                <p className="text-xs text-zinc-500 dark:text-white/50">Across all time</p>
                            </CardContent>
                        </Card>
                    </motion.div>
                    <motion.div variants={itemVariants}>
                        <Card className="bg-white/60 dark:bg-white/5 backdrop-blur-2xl border-zinc-200/50 dark:border-white/10 shadow-xl rounded-2xl transition-all duration-300 hover:border-zinc-300 dark:hover:border-white/20 hover:-translate-y-1">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-zinc-600 dark:text-white/70">Total Clients</CardTitle>
                                <Users className="h-5 w-5 text-purple-500 dark:text-purple-400" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">{data.totalClientsCount}</div>
                                <p className="text-xs text-zinc-500 dark:text-white/50">All-time client count</p>
                            </CardContent>
                        </Card>
                    </motion.div>
                    <motion.div variants={itemVariants}>
                        <Card className="bg-white/60 dark:bg-white/5 backdrop-blur-2xl border-zinc-200/50 dark:border-white/10 shadow-xl rounded-2xl transition-all duration-300 hover:border-zinc-300 dark:hover:border-white/20 hover:-translate-y-1">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-zinc-600 dark:text-white/70 flex items-center justify-between">
                                    Active Projects
                                    <Activity className="h-5 w-5 text-orange-500 dark:text-orange-400" />
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                            <div className="text-3xl font-bold">{data.activeProjectsCount}</div>
                            <p className="text-xs text-zinc-500 dark:text-white/50">Currently in progress</p>
                            </CardContent>
                        </Card>
                    </motion.div>
                </motion.div>

                <motion.div 
                    className="grid gap-6 lg:grid-cols-3"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.div variants={itemVariants} className="lg:col-span-2">
                        <Card className="bg-white/60 dark:bg-white/5 backdrop-blur-2xl border-zinc-200/50 dark:border-white/10 shadow-xl rounded-2xl h-full">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2"><TrendingUp className="h-5 w-5"/>6-Month Income</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={250}>
                                    <BarChart data={data.incomeData}>
                                        <defs>
                                            <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4}/>
                                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${Number(value) / 1000}k`} />
                                        <Tooltip
                                            cursor={{ fill: 'hsla(var(--primary-rgb), 0.1)', radius: 4 }}
                                            contentStyle={{
                                                background: 'hsla(var(--background), 0.8)',
                                                border: '1px solid hsl(var(--border))',
                                                borderRadius: '0.75rem',
                                                color: 'hsl(var(--foreground))',
                                                backdropFilter: 'blur(4px)',
                                            }}
                                            formatter={(value) => [value.toLocaleString('en-US', { style: 'currency', currency: 'USD' }), "Income"]}
                                        />
                                        <Bar dataKey="income" fill="url(#incomeGradient)" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </motion.div>
                    <motion.div variants={itemVariants}>
                        <Card className="bg-white/60 dark:bg-white/5 backdrop-blur-2xl border-zinc-200/50 dark:border-white/10 shadow-xl rounded-2xl h-full">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2"><Palette className="h-5 w-5"/>Workload</CardTitle>
                            </CardHeader>
                            <CardContent>
                            <ResponsiveContainer width="100%" height={250}>
                                    <RadialBarChart 
                                        innerRadius="30%" 
                                        outerRadius="100%" 
                                        data={data.workloadData} 
                                        startAngle={90} 
                                        endAngle={-270}
                                    >
                                        <RadialBar
                                            background
                                            dataKey='value'
                                            className="[&_.recharts-radial-bar-background-sector]:fill-black/5 dark:[&_.recharts-radial-bar-background-sector]:fill-white/5"
                                        />
                                        <Legend iconSize={10} layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{color: 'hsl(var(--foreground))', fontSize: '14px', padding: '10px'}} />
                                        <Tooltip
                                            contentStyle={{
                                                background: 'hsla(var(--background), 0.8)',
                                                border: '1px solid hsl(var(--border))',
                                                borderRadius: '0.75rem',
                                                color: 'hsl(var(--foreground))',
                                                backdropFilter: 'blur(4px)',
                                            }}
                                            formatter={(value, name) => [`${value} projects`, name]}
                                        />
                                    </RadialBarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </motion.div>
                </motion.div>

                <motion.div
                    className="mt-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    <Card className="bg-white/60 dark:bg-white/5 backdrop-blur-2xl border-zinc-200/50 dark:border-white/10 shadow-xl rounded-2xl">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2"><Users className="h-5 w-5"/>Top Clients by Value</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {data.clientLeaderboard.map((client, index) => (
                                    <div key={client.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <span className="text-sm font-bold text-zinc-500 dark:text-white/50 w-4">{index + 1}.</span>
                                            <div className="font-medium">{client.name}</div>
                                            <div className="text-xs text-zinc-600 dark:text-white/60">{client.company}</div>
                                        </div>
                                        <div className="font-mono text-lg text-green-600 dark:text-green-300">{client.totalValue.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 })}</div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </>
    );
}

    
