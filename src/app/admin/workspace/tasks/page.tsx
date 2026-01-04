

'use client';

import * as React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, PlusCircle, Trash2, Edit, GripVertical, CalendarIcon, X as XIcon, Lightbulb, Eye, User, Tag, FileText, Filter, Copy } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragOverlay, DragStartEvent, DragOverEvent, DragEndEvent, UniqueIdentifier } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { motion, AnimatePresence } from 'framer-motion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getClients, getTasks } from '@/lib/db';
import { handleAddTask, handleUpdateTask, handleDeleteTask } from '@/lib/actions';
import type { Client } from '../clients/page';


export type Task = {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  due_date?: Date;
  client_id?: string;
  tags?: string[];
};

export type TaskStatus = 'todo' | 'in-progress' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';

const getPriorityBadge = (priority: Task['priority']) => {
    switch (priority) {
        case 'high':
            return <Badge variant="outline" className="text-red-500 dark:text-red-400 border-red-500/40 dark:border-red-400/40 bg-red-500/10 dark:bg-red-400/10">High</Badge>;
        case 'medium':
            return <Badge variant="outline" className="text-orange-500 dark:text-orange-400 border-orange-500/40 dark:border-orange-400/40 bg-orange-500/10 dark:bg-orange-400/10">Medium</Badge>;
        case 'low':
            return <Badge variant="outline" className="text-blue-500 dark:text-blue-400 border-blue-500/40 dark:border-blue-400/40 bg-blue-500/10 dark:bg-blue-400/10">Low</Badge>;
    }
}

const TaskCard = ({ task, onEdit, onDelete, onView, onDuplicate, clients }: { task: Task, onEdit: (task: Task) => void, onDelete: (task: Task) => void, onView: (task: Task) => void, onDuplicate: (task: Task) => void, clients: Client[] }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id, data: {type: 'Task', task} });
    const client = clients.find(c => c.id === task.client_id);

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };
    
    return (
        <div ref={setNodeRef} style={style} {...attributes}>
            <Card className="bg-white/60 dark:bg-white/5 backdrop-blur-3xl border-zinc-200/50 dark:border-white/10 shadow-lg rounded-xl mb-4 transition-shadow hover:shadow-2xl">
                <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                        <div className="flex items-start gap-2 flex-1">
                             <div {...listeners} className="flex-shrink-0 pt-1 text-zinc-500 dark:text-white/40 hover:text-foreground dark:hover:text-white transition-colors cursor-grab active:cursor-grabbing">
                                <GripVertical className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-semibold text-foreground dark:text-white/90">{task.title}</h4>
                                <p className="text-sm text-zinc-600 dark:text-white/60 mt-1 mb-3 line-clamp-2">{task.description}</p>
                                <div className="flex flex-wrap gap-2 items-center">
                                    {getPriorityBadge(task.priority)}
                                    {task.tags?.map(tag => <Badge key={tag} variant="secondary" className="bg-black/5 dark:bg-white/10 text-zinc-600 dark:text-white/70">{tag}</Badge>)}
                                </div>
                                <div className="flex items-center gap-4 text-sm text-zinc-500 dark:text-white/50 mt-4">
                                    {task.due_date && (
                                        <div className="flex items-center gap-1.5">
                                            <CalendarIcon className="h-4 w-4"/>
                                            <span>{format(new Date(task.due_date), 'MMM d')}</span>
                                        </div>
                                    )}
                                    {client && (
                                        <div className="flex items-center gap-1.5">
                                             <Avatar className="h-5 w-5">
                                                <AvatarImage src={client.avatar} alt={client.name} />
                                                <AvatarFallback>{client.name[0]}</AvatarFallback>
                                            </Avatar>
                                            <span>{client.name}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                            aria-haspopup="true"
                            size="icon"
                            variant="ghost"
                            className="h-6 w-6 text-zinc-600 dark:text-white/70 hover:bg-black/10 dark:hover:bg-white/20 hover:text-foreground dark:hover:text-white"
                            onClick={e => e.stopPropagation()}
                            >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            align="end"
                            className="bg-background/80 backdrop-blur-xl border-zinc-200/50 dark:border-white/10 text-foreground dark:text-white"
                        >
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onSelect={(e) => { e.preventDefault(); onView(task); }}><Eye className="mr-2 h-4 w-4" />View</DropdownMenuItem>
                            <DropdownMenuItem onSelect={(e) => { e.preventDefault(); onEdit(task); }}><Edit className="mr-2 h-4 w-4" />Edit</DropdownMenuItem>
                            <DropdownMenuItem onSelect={(e) => { e.preventDefault(); onDuplicate(task); }}><Copy className="mr-2 h-4 w-4" />Duplicate</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-500 dark:text-red-400 focus:bg-red-400/20 focus:text-red-500 dark:focus:text-white" onSelect={(e) => { e.preventDefault(); onDelete(task); }}>
                              <Trash2 className="mr-2 h-4 w-4" />Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

const TaskColumn = ({ title, status, tasks, ...props }: { title: string, status: TaskStatus, tasks: Task[], onEdit: (task: Task) => void, onDelete: (task: Task) => void, onView: (task: Task) => void, onDuplicate: (task: Task) => void, clients: Client[] }) => {
    const { setNodeRef, isOver } = useSortable({ id: status, data: { type: 'Column', status }});

    const tasksById = React.useMemo(() => tasks.map(t => t.id), [tasks]);

    return (
        <div ref={setNodeRef} className={cn("w-[340px] flex-shrink-0 flex flex-col", isOver ? "ring-2 ring-primary ring-offset-2 ring-offset-background/50 rounded-2xl" : "")}>
            <h3 className="text-lg font-semibold text-foreground dark:text-white/90 mb-4 px-1">{title}</h3>
            <div className="bg-white/50 dark:bg-white/5 border border-zinc-200/50 dark:border-white/10 rounded-2xl p-4 h-full flex-1 overflow-hidden">
                <ScrollArea className="h-full pr-2 -mr-2">
                    <SortableContext items={tasksById} strategy={verticalListSortingStrategy}>
                        {tasks.map(task => <TaskCard key={task.id} task={task} {...props} />)}
                    </SortableContext>
                </ScrollArea>
            </div>
        </div>
    );
};

const TaskForm = ({ task, onSubmit, onCancel, clients }: { task?: Task, onSubmit: (values: any) => void, onCancel: () => void, clients: Client[] }) => {
    const [dueDate, setDueDate] = React.useState<Date | undefined>(task?.due_date ? new Date(task.due_date) : undefined);
    const [selectedClientId, setSelectedClientId] = React.useState(task?.client_id || 'none');


    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        if (dueDate) {
            formData.append('due_date', dueDate.toISOString());
        }
        // Ensure client_id is set from state, as the form element might not be fully controlled
        formData.set('client_id', selectedClientId);
        onSubmit(formData);
    }
    
    return (
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input id="title" name="title" defaultValue={task?.title} className="col-span-3 bg-black/5 dark:bg-white/5 border-zinc-300 dark:border-white/10" required />
            </div>
             <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="description" className="text-right pt-2">
                Description
              </Label>
              <Textarea id="description" name="description" defaultValue={task?.description} className="col-span-3 bg-black/5 dark:bg-white/5 border-zinc-300 dark:border-white/10" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="clientId" className="text-right">
                Client
              </Label>
               <Select name="client_id" value={selectedClientId} onValueChange={setSelectedClientId}>
                <SelectTrigger id="clientId" className="col-span-3 bg-black/5 dark:bg-white/5 border-zinc-300 dark:border-white/10">
                    <SelectValue placeholder="Select a client" />
                </SelectTrigger>
                <SelectContent className="bg-background/80 backdrop-blur-xl border-zinc-200/50 dark:border-white/10 text-foreground dark:text-white">
                    <SelectItem value="none">None</SelectItem>
                    {clients.map(client => <SelectItem key={client.id} value={client.id}>{client.name}</SelectItem>)}
                </SelectContent>
                </Select>
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="due_date" className="text-right">Due Date</Label>
                <Popover>
                    <PopoverTrigger asChild>
                    <Button
                        variant={"outline"}
                        className={cn(
                        "col-span-3 justify-start text-left font-normal bg-black/5 dark:bg-white/5 border-zinc-300 dark:border-white/10 hover:bg-black/10 dark:hover:bg-white/10",
                        !dueDate && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-background/80 backdrop-blur-xl border-zinc-200/50 dark:border-white/10 text-foreground dark:text-white" align="start">
                        <Calendar
                            mode="single"
                            selected={dueDate}
                            onSelect={setDueDate}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="priority" className="text-right">
                Priority
              </Label>
               <Select name="priority" defaultValue={task?.priority || 'medium'}>
                <SelectTrigger id="priority" className="col-span-3 bg-black/5 dark:bg-white/5 border-zinc-300 dark:border-white/10">
                    <SelectValue placeholder="Select a priority" />
                </SelectTrigger>
                <SelectContent className="bg-background/80 backdrop-blur-xl border-zinc-200/50 dark:border-white/10 text-foreground dark:text-white">
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                </SelectContent>
                </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tags" className="text-right">
                Tags
              </Label>
              <Input id="tags" name="tags" defaultValue={task?.tags?.join(', ')} className="col-span-3 bg-black/5 dark:bg-white/5 border-zinc-300 dark:border-white/10" placeholder="e.g. UI, backend, urgent" />
            </div>
            <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="ghost" onClick={onCancel} className="rounded-lg">Cancel</Button>
                <Button type="submit" className="rounded-lg">Save changes</Button>
            </div>
          </form>
    )
}

const TaskViewDialog = ({ task, open, onOpenChange, clients }: { task: Task | null, open: boolean, onOpenChange: (open: boolean) => void, clients: Client[] }) => {
    if (!task) return null;

    const client = clients.find(c => c.id === task.client_id);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-background/80 backdrop-blur-xl border-zinc-200/50 dark:border-white/10 text-foreground dark:text-white sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-xl">{task.title}</DialogTitle>
                </DialogHeader>
                <div className="space-y-6 mt-4">
                    <div className="flex items-start gap-4">
                        <FileText className="h-5 w-5 text-zinc-500 dark:text-white/50 mt-1 flex-shrink-0" />
                        <p className="text-zinc-700 dark:text-white/80">{task.description}</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <Lightbulb className="h-5 w-5 text-zinc-500 dark:text-white/50" />
                        {getPriorityBadge(task.priority)}
                    </div>

                    {task.due_date && (
                        <div className="flex items-center gap-4">
                            <CalendarIcon className="h-5 w-5 text-zinc-500 dark:text-white/50" />
                            <span className="text-zinc-700 dark:text-white/80">{format(new Date(task.due_date), "PPP")}</span>
                        </div>
                    )}
                    
                    {client && (
                        <div className="flex items-center gap-4">
                            <User className="h-5 w-5 text-zinc-500 dark:text-white/50" />
                            <div className="flex items-center gap-2">
                                <Avatar className="h-6 w-6">
                                    <AvatarImage src={client.avatar} alt={client.name} />
                                    <AvatarFallback>{client.name[0]}</AvatarFallback>
                                </Avatar>
                                <span className="text-zinc-700 dark:text-white/80">{client.name}</span>
                            </div>
                        </div>
                    )}

                    {task.tags && task.tags.length > 0 && (
                        <div className="flex items-start gap-4">
                            <Tag className="h-5 w-5 text-zinc-500 dark:text-white/50 mt-1 flex-shrink-0" />
                            <div className="flex flex-wrap gap-2">
                                {task.tags.map(tag => (
                                    <Badge key={tag} variant="secondary" className="bg-black/5 dark:bg-white/10 text-zinc-600 dark:text-white/70">{tag}</Badge>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                 <DialogFooter className="mt-6">
                    <Button onClick={() => onOpenChange(false)} className="rounded-lg w-full">Close</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};


export default function TasksPage() {
    const [tasks, setTasks] = React.useState<Task[]>([]);
    const [clients, setClients] = React.useState<Client[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [activeTask, setActiveTask] = React.useState<Task | null>(null);
    const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);
    const [editingTask, setEditingTask] = React.useState<Task | null>(null);
    const [duplicatingTask, setDuplicatingTask] = React.useState<Task | null>(null);
    const [viewingTask, setViewingTask] = React.useState<Task | null>(null);
    const [taskToDelete, setTaskToDelete] = React.useState<Task | null>(null);
    const { toast } = useToast();
    const sensors = useSensors(useSensor(PointerSensor));

    const [filters, setFilters] = React.useState({
        clientId: 'all',
        priority: 'all',
        tag: '',
    });

    const columns: TaskStatus[] = ['todo', 'in-progress', 'done'];
    const columnTitles = { todo: 'To Do', 'in-progress': 'In Progress', done: 'Done' };

    const fetchData = React.useCallback(async () => {
        setLoading(true);
        const [tasksData, clientsData] = await Promise.all([getTasks(), getClients()]);
        setTasks(tasksData as Task[]);
        setClients(clientsData as Client[]);
        setLoading(false);
    }, []);

    React.useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleFilterChange = (filterType: keyof typeof filters, value: string) => {
        setFilters(prev => ({ ...prev, [filterType]: value }));
    };

    const clearFilters = () => {
        setFilters({ clientId: 'all', priority: 'all', tag: '' });
    };
    
    const hasActiveFilters = filters.clientId !== 'all' || filters.priority !== 'all' || filters.tag !== '';

    const filteredTasks = React.useMemo(() => {
        return tasks.filter(task => {
            const clientMatch = filters.clientId === 'all' || task.client_id === filters.clientId;
            const priorityMatch = filters.priority === 'all' || task.priority === filters.priority;
            const tagMatch = filters.tag === '' || task.tags?.some(t => t.toLowerCase().includes(filters.tag.toLowerCase()));
            return clientMatch && priorityMatch && tagMatch;
        });
    }, [tasks, filters]);


    const handleDragStart = React.useCallback((event: DragStartEvent) => {
        const { active } = event;
        if (active.data.current?.type === 'Task') {
            setActiveTask(active.data.current.task);
        }
    }, []);
    
    const handleDragEnd = React.useCallback(async (event: DragEndEvent) => {
        setActiveTask(null);
        const { active, over } = event;

        if (!over) return;

        const activeId = String(active.id);
        const overId = String(over.id);

        const originalTask = tasks.find(t => t.id === activeId);
        const newStatus = (over.data.current?.status || over.data.current?.task?.status) as TaskStatus | undefined;

        if (originalTask && newStatus && originalTask.status !== newStatus) {
            const updatedTask = { ...originalTask, status: newStatus };
            
            // Optimistically update UI
            setTasks(currentTasks => {
                const activeIndex = currentTasks.findIndex(t => t.id === activeId);
                const overIndex = over.data.current?.type === 'Column' 
                    ? currentTasks.length // put at the end of the new column
                    : currentTasks.findIndex(t => t.id === overId);
                
                let newTasks = [...currentTasks];
                newTasks[activeIndex] = updatedTask;

                if (over.data.current?.type === 'Task') {
                    // reorder within the same column
                    return arrayMove(newTasks, activeIndex, overIndex);
                } else {
                    // just update status and let it be re-rendered
                     return newTasks;
                }
            });

            const result = await handleUpdateTask(activeId, { status: newStatus });
            if (!result.success) {
                // Revert on failure
                toast({
                    variant: "destructive",
                    title: "Update failed",
                    description: "Could not update task status.",
                });
                fetchData(); // Refetch to get latest state
            }
        }
    }, [tasks, toast, fetchData]);


    const handleDragOver = React.useCallback((event: DragOverEvent) => {
        const { active, over } = event;
        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        if (activeId === overId) return;

        const isActiveATask = active.data.current?.type === "Task";
        const isOverAColumn = over.data.current?.type === "Column";

        if (isActiveATask && isOverAColumn) {
            setTasks(currentTasks => {
                const activeIndex = currentTasks.findIndex(t => t.id === activeId);
                if (currentTasks[activeIndex].status === over.data.current?.status) {
                    return currentTasks;
                }
                const updatedTask = {...currentTasks[activeIndex], status: over.data.current?.status as TaskStatus };
                const newTasks = [...currentTasks];
                newTasks[activeIndex] = updatedTask;
                return arrayMove(newTasks, activeIndex, activeIndex);
            });
        }
        
        const isOverATask = over.data.current?.type === "Task";
        if (isActiveATask && isOverATask) {
             setTasks(currentTasks => {
                const activeIndex = currentTasks.findIndex(t => t.id === activeId);
                const overIndex = currentTasks.findIndex(t => t.id === overId);
                
                if (currentTasks[activeIndex].status !== currentTasks[overIndex].status) {
                    const updatedTask = {...currentTasks[activeIndex], status: currentTasks[overIndex].status };
                    const newTasks = [...currentTasks];
                    newTasks[activeIndex] = updatedTask;
                    return arrayMove(newTasks, activeIndex, overIndex);
                }

                return arrayMove(currentTasks, activeIndex, overIndex);
            });
        }
    }, []);

    const handleView = (task: Task) => setViewingTask(task);
    const handleEdit = (task: Task) => setEditingTask(task);
    const closeEditDialog = () => setEditingTask(null);

    const handleDuplicate = (task: Task) => {
        setDuplicatingTask({ ...task, title: `${task.title} - Copy` });
    };

    const handleDeleteConfirm = async () => {
        if (taskToDelete) {
            const result = await handleDeleteTask(taskToDelete.id);
            if (result.success) {
                await fetchData();
                toast({
                    title: 'Task Removed',
                    description: `"${taskToDelete.title}" has been removed.`,
                });
            } else {
                 toast({
                    variant: 'destructive',
                    title: 'Error',
                    description: result.error,
                });
            }
            setTaskToDelete(null);
        }
    };

    const onAddTask = async (formData: FormData) => {
        const title = formData.get('title') as string;
        const result = await handleAddTask(formData);
        if (result.success) {
            await fetchData();
            setIsAddDialogOpen(false);
            setDuplicatingTask(null);
            toast({
                title: 'Task Added',
                description: `"${title}" has been added to 'To Do'.`,
            });
        } else {
             toast({
                variant: 'destructive',
                title: 'Error',
                description: result.error,
            });
        }
    };

    const onEditTask = async (formData: FormData) => {
        if (!editingTask) return;
        const title = formData.get('title') as string;
        const result = await handleUpdateTask(editingTask.id, formData);
        if (result.success) {
            await fetchData();
            closeEditDialog();
            toast({
                title: 'Task Updated',
                description: `"${title}" has been updated.`,
            });
        } else {
             toast({
                variant: 'destructive',
                title: 'Error',
                description: result.error,
            });
        }
    };

    if (loading) {
        return <div className="p-8">Loading tasks and clients...</div>;
    }

    return (
        <div className="h-full flex flex-col">
            <div className="flex items-center mb-6">
                <h1 className="text-2xl font-bold text-foreground dark:text-white flex-shrink-0">Tasks</h1>
                <div className="ml-auto flex items-center gap-2">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="ghost" className="gap-1.5 rounded-lg text-zinc-600 dark:text-white/80 hover:text-foreground dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 relative">
                                <Filter className="h-4 w-4" />
                                <span>Filter</span>
                                {hasActiveFilters && <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-blue-400"></span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80 bg-background/80 backdrop-blur-xl border-zinc-200/50 dark:border-white/10 text-foreground dark:text-white" align="end">
                            <div className="grid gap-4">
                            <div className="space-y-2">
                                <h4 className="font-medium leading-none">Filters</h4>
                                <p className="text-sm text-zinc-600 dark:text-white/60">
                                Adjust the filters to refine the task list.
                                </p>
                            </div>
                            <div className="grid gap-2">
                                <div className="grid grid-cols-3 items-center gap-4">
                                    <Label>Client</Label>
                                    <Select value={filters.clientId} onValueChange={(value) => handleFilterChange('clientId', value)}>
                                        <SelectTrigger className="bg-black/5 dark:bg-white/5 border-zinc-300 dark:border-white/10 col-span-2">
                                            <SelectValue placeholder="Client..." />
                                        </SelectTrigger>
                                        <SelectContent className="bg-background/80 backdrop-blur-xl border-zinc-200/50 dark:border-white/10 text-foreground dark:text-white">
                                            <SelectItem value="all">All Clients</SelectItem>
                                            {clients.map(client => <SelectItem key={client.id} value={client.id}>{client.name}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid grid-cols-3 items-center gap-4">
                                    <Label>Priority</Label>
                                    <Select value={filters.priority} onValueChange={(value) => handleFilterChange('priority', value)}>
                                        <SelectTrigger className="bg-black/5 dark:bg-white/5 border-zinc-300 dark:border-white/10 col-span-2">
                                            <SelectValue placeholder="Priority..." />
                                        </SelectTrigger>
                                        <SelectContent className="bg-background/80 backdrop-blur-xl border-zinc-200/50 dark:border-white/10 text-foreground dark:text-white">
                                            <SelectItem value="all">All Priorities</SelectItem>
                                            <SelectItem value="low">Low</SelectItem>
                                            <SelectItem value="medium">Medium</SelectItem>
                                            <SelectItem value="high">High</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid grid-cols-3 items-center gap-4">
                                    <Label>Tag</Label>
                                    <Input 
                                        type="text" 
                                        placeholder="Filter by tag..."
                                        value={filters.tag}
                                        onChange={(e) => handleFilterChange('tag', e.target.value)}
                                        className="bg-black/5 dark:bg-white/5 border-zinc-300 dark:border-white/10 col-span-2"
                                    />
                                </div>
                            </div>
                            {hasActiveFilters && (
                                <Button variant="ghost" onClick={clearFilters} className="rounded-lg text-zinc-600 dark:text-white/70 hover:text-foreground dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 w-full justify-center">
                                    <XIcon className="mr-2 h-4 w-4" /> Clear Filters
                                </Button>
                            )}
                            </div>
                        </PopoverContent>
                    </Popover>
                
                    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                        <DialogTrigger asChild>
                            <Button
                                size="sm"
                                className="gap-1 bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 text-foreground dark:text-white rounded-lg"
                            >
                                <PlusCircle className="h-4 w-4" />
                                Add Task
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-background/80 backdrop-blur-xl border-zinc-200/50 dark:border-white/10 text-foreground dark:text-white sm:max-w-lg">
                            <DialogHeader>
                            <DialogTitle>Add New Task</DialogTitle>
                            <DialogDescription className="text-zinc-600 dark:text-white/60">
                                Enter the details for the new task.
                            </DialogDescription>
                            </DialogHeader>
                            <TaskForm onSubmit={onAddTask} onCancel={() => setIsAddDialogOpen(false)} clients={clients} />
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
            
            <div className="flex-1 overflow-hidden pb-4">
                <ScrollArea className="h-full" orientation="horizontal">
                    <div className="flex flex-row gap-6 h-full py-2">
                        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
                            {columns.map(status => (
                                <TaskColumn
                                    key={status}
                                    title={columnTitles[status]}
                                    status={status}
                                    tasks={filteredTasks.filter(t => t.status === status)}
                                    onEdit={handleEdit}
                                    onDelete={setTaskToDelete}
                                    onView={handleView}
                                    onDuplicate={handleDuplicate}
                                    clients={clients}
                                />
                            ))}
                            <DragOverlay>
                                {activeTask ? (
                                    <div className="w-[340px]">
                                    <TaskCard task={activeTask} onEdit={() => {}} onDelete={() => {}} onView={() => {}} onDuplicate={() => {}} clients={clients} />
                                    </div>
                                ) : null}
                            </DragOverlay>
                        </DndContext>
                    </div>
                </ScrollArea>
            </div>


             <TaskViewDialog 
                task={viewingTask} 
                open={!!viewingTask} 
                onOpenChange={(isOpen) => !isOpen && setViewingTask(null)}
                clients={clients}
            />

            {/* Edit Task Dialog */}
            <Dialog open={!!editingTask} onOpenChange={(isOpen) => !isOpen && closeEditDialog()}>
                <DialogContent className="bg-background/80 backdrop-blur-xl border-zinc-200/50 dark:border-white/10 text-foreground dark:text-white sm:max-w-lg">
                    <DialogHeader>
                    <DialogTitle>Edit Task</DialogTitle>
                    <DialogDescription className="text-zinc-600 dark:text-white/60">
                        Update the details of your task below.
                    </DialogDescription>
                    </DialogHeader>
                    <TaskForm task={editingTask!} onSubmit={onEditTask} onCancel={closeEditDialog} clients={clients} />
                </DialogContent>
            </Dialog>
            
            {/* Duplicate Task Dialog */}
            <Dialog open={!!duplicatingTask} onOpenChange={(isOpen) => !isOpen && setDuplicatingTask(null)}>
                <DialogContent className="bg-background/80 backdrop-blur-xl border-zinc-200/50 dark:border-white/10 text-foreground dark:text-white sm:max-w-lg">
                    <DialogHeader>
                    <DialogTitle>Duplicate Task</DialogTitle>
                    <DialogDescription className="text-zinc-600 dark:text-white/60">
                        Modify the details below and save to create a new task.
                    </DialogDescription>
                    </DialogHeader>
                    <TaskForm task={duplicatingTask!} onSubmit={onAddTask} onCancel={() => setDuplicatingTask(null)} clients={clients} />
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={!!taskToDelete} onOpenChange={(isOpen) => !isOpen && setTaskToDelete(null)}>
                <AlertDialogContent className="bg-background/80 backdrop-blur-xl border-zinc-200/50 dark:border-white/10 text-foreground dark:text-white">
                    <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the task "{taskToDelete?.title}".
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel asChild>
                        <Button variant="ghost" className="rounded-lg">Cancel</Button>
                    </AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteConfirm} className="rounded-lg bg-destructive text-destructive-foreground hover:bg-destructive/90">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Yes, delete task
                    </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
