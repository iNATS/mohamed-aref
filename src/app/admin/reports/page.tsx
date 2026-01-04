
'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Briefcase, Users, Palette, Activity, TrendingUp, CheckCircle, Clock, GanttChartSquare } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, Pie, PieChart, Cell, Line, LineChart, CartesianGrid } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import { useTheme } from 'next-themes';
import { getReportsData } from '@/lib/db';
import { createClient } from '@/lib/supabase/client';


interface ReportsData {
    totalBilled: number;
    completedProjectsCount: number;
    totalClientsCount: number;
    activeProjectsCount: number;
    incomeData: { name: string; income: number }[];
    workloadData: { name: string; value: number }[];
    clientLeaderboard: any[];
    projectStatusData: { name: string; value: number }[];
    taskPriorityData: { name: string; value: number }[];
}

const COLORS = {
    light: ['#3b82f6', '#8b5cf6', '#ec4899', '#f97316', '#10b981'],
    dark: ['#60a5fa', '#a78bfa', '#f472b6', '#fb923c', '#34d399']
};

export default function ReportsPage() {
    const [data, setData] = React.useState<ReportsData | null>(null);
    const [loading, setLoading] = React.useState(true);
    const { theme } = useTheme();
    const chartColors = theme === 'dark' ? COLORS.dark : COLORS.light;


    React.useEffect(() => {
        async function fetchData() {
            setLoading(true);
            const supabase = createClient();
            const reportsData = await getReportsData(supabase);
            setData(reportsData as ReportsData);
            setLoading(false);
        }
        fetchData();
    }, []);
    
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } },
    };
    
    if (loading || !data) {
        return (
            <>
                <div className="flex items-center mb-6">
                    <h1 className="text-2xl font-bold tracking-tight">Analytics & Insights</h1>
                </div>
                 <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
                    <Skeleton className="h-28 rounded-2xl" /> <Skeleton className="h-28 rounded-2xl" />
                    <Skeleton className="h-28 rounded-2xl" /> <Skeleton className="h-28 rounded-2xl" />
                </div>
                <div className="grid gap-6 lg:grid-cols-2">
                    <Skeleton className="h-80 rounded-2xl" /> <Skeleton className="h-80 rounded-2xl" />
                </div>
                <div className="grid gap-6 lg:grid-cols-3 mt-6">
                    <Skeleton className="h-80 rounded-2xl" /> <Skeleton className="h-80 rounded-2xl" />
                    <Skeleton className="h-80 rounded-2xl" />
                </div>
            </>
        )
    }
    
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="rounded-lg border bg-background/80 backdrop-blur-sm p-2 shadow-sm">
                    <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col space-y-1">
                            <span className="text-[0.7rem] uppercase text-muted-foreground">{label}</span>
                            <span className="font-bold text-foreground">
                                {payload[0].value.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                            </span>
                        </div>
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <>
            <div className="flex items-center mb-6">
                <h1 className="text-2xl font-bold tracking-tight">Analytics & Insights</h1>
            </div>
            
            <motion.div 
                className="flex-1 overflow-y-auto pb-4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
                    <motion.div variants={itemVariants}>
                        <Card className="bg-white/60 dark:bg-white/5 backdrop-blur-2xl border-zinc-200/50 dark:border-white/10 dark:shadow-xl dark:shadow-none rounded-2xl transition-all duration-300 hover:border-zinc-300 dark:hover:border-white/20 hover:-translate-y-1">
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
                        <Card className="bg-white/60 dark:bg-white/5 backdrop-blur-2xl border-zinc-200/50 dark:border-white/10 dark:shadow-xl dark:shadow-none rounded-2xl transition-all duration-300 hover:border-zinc-300 dark:hover:border-white/20 hover:-translate-y-1">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-zinc-600 dark:text-white/70">Completed Projects</CardTitle>
                                <CheckCircle className="h-5 w-5 text-blue-500 dark:text-blue-400" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">{data.completedProjectsCount}</div>
                                <p className="text-xs text-zinc-500 dark:text-white/50">Across all time</p>
                            </CardContent>
                        </Card>
                    </motion.div>
                    <motion.div variants={itemVariants}>
                        <Card className="bg-white/60 dark:bg-white/5 backdrop-blur-2xl border-zinc-200/50 dark:border-white/10 dark:shadow-xl dark:shadow-none rounded-2xl transition-all duration-300 hover:border-zinc-300 dark:hover:border-white/20 hover:-translate-y-1">
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
                        <Card className="bg-white/60 dark:bg-white/5 backdrop-blur-2xl border-zinc-200/50 dark:border-white/10 dark:shadow-xl dark:shadow-none rounded-2xl transition-all duration-300 hover:border-zinc-300 dark:hover:border-white/20 hover:-translate-y-1">
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
                </div>

                <div className="grid gap-6 lg:grid-cols-1 mb-6">
                     <motion.div variants={itemVariants}>
                        <Card className="bg-white/60 dark:bg-white/5 backdrop-blur-2xl border-zinc-200/50 dark:border-white/10 dark:shadow-xl dark:shadow-none rounded-2xl h-full">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2"><TrendingUp className="h-5 w-5"/>Revenue Over Time</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={250}>
                                    <LineChart data={data.incomeData}>
                                        <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                                        <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${Number(value) / 1000}k`} />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Line type="monotone" dataKey="income" stroke={chartColors[0]} strokeWidth={2} dot={{ r: 4, fill: chartColors[0] }} activeDot={{ r: 8 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
                 <div className="grid gap-6 lg:grid-cols-3 mb-6">
                    <motion.div variants={itemVariants}>
                        <Card className="bg-white/60 dark:bg-white/5 backdrop-blur-2xl border-zinc-200/50 dark:border-white/10 dark:shadow-xl dark:shadow-none rounded-2xl h-full">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2"><Briefcase className="h-5 w-5"/>Project Status</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={200}>
                                    <PieChart>
                                        <Pie data={data.projectStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                                            {data.projectStatusData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={(value, name) => [`${value} projects`, name]} />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </motion.div>
                    <motion.div variants={itemVariants}>
                        <Card className="bg-white/60 dark:bg-white/5 backdrop-blur-2xl border-zinc-200/50 dark:border-white/10 dark:shadow-xl dark:shadow-none rounded-2xl h-full">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2"><Palette className="h-5 w-5"/>Workload by Category</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={200}>
                                    <BarChart data={data.workloadData} layout="vertical" margin={{ left: 10 }}>
                                        <XAxis type="number" hide />
                                        <YAxis type="category" dataKey="name" tickLine={false} axisLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} width={60} />
                                        <Tooltip cursor={{ fill: 'hsla(var(--primary-rgb), 0.1)' }} formatter={(value) => [`${value} projects`, 'Count']} />
                                        <Bar dataKey="value" radius={[0, 4, 4, 0]} >
                                             {data.workloadData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </motion.div>
                    <motion.div variants={itemVariants}>
                        <Card className="bg-white/60 dark:bg-white/5 backdrop-blur-2xl border-zinc-200/50 dark:border-white/10 dark:shadow-xl dark:shadow-none rounded-2xl h-full">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2"><GanttChartSquare className="h-5 w-5"/>Task Priority</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={200}>
                                     <PieChart>
                                        <Pie data={data.taskPriorityData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={5} label>
                                            {data.taskPriorityData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={(value, name) => [`${value} tasks`, name]} />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>

                <motion.div
                    className="mt-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    <Card className="bg-white/60 dark:bg-white/5 backdrop-blur-2xl border-zinc-200/50 dark:border-white/10 dark:shadow-xl dark:shadow-none rounded-2xl">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2"><Users className="h-5 w-5"/>Top Clients by Value</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {data.clientLeaderboard.map((client, index) => (
                                    <div key={client.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <span className="text-sm font-bold text-zinc-500 dark:text-white/50 w-4">{index + 1}.</span>
                                            <div className="font-medium">{client.client_name}</div>
                                            <div className="text-xs text-zinc-600 dark:text-white/60">{client.client_company}</div>
                                        </div>
                                        <div className="font-mono text-lg text-green-600 dark:text-green-300">{client.total_value.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 })}</div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </motion.div>
        </>
    );
}
