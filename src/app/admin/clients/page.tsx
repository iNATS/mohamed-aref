'use client';

import * as React from 'react';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
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
import { MoreHorizontal, PlusCircle, Trash2, Edit, Eye, User, Mail, Building, Phone, MapPin, FileText, Search, Filter, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Pagination } from '@/components/ui/pagination';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Skeleton } from '@/components/ui/skeleton';


export type Client = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  status: 'active' | 'archived' | 'new';
  company: string;
  phone: string;
  address: string;
  notes: string;
};

const ClientForm = ({ client, onSubmit, onCancel }: { client?: Client, onSubmit: (values: any) => void, onCancel: () => void }) => {
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const values = Object.fromEntries(formData.entries());
        onSubmit(values);
    }
    
    return (
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input id="name" name="name" defaultValue={client?.name} className="col-span-3 bg-black/5 dark:bg-white/5 border-zinc-300 dark:border-white/10" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input id="email" name="email" type="email" defaultValue={client?.email} className="col-span-3 bg-black/5 dark:bg-white/5 border-zinc-300 dark:border-white/10" required />
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                Phone
              </Label>
              <Input id="phone" name="phone" defaultValue={client?.phone} className="col-span-3 bg-black/5 dark:bg-white/5 border-zinc-300 dark:border-white/10" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="company" className="text-right">
                Company
              </Label>
              <Input id="company" name="company" defaultValue={client?.company} className="col-span-3 bg-black/5 dark:bg-white/5 border-zinc-300 dark:border-white/10" required />
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="address" className="text-right">
                Address
              </Label>
              <Input id="address" name="address" defaultValue={client?.address} className="col-span-3 bg-black/5 dark:bg-white/5 border-zinc-300 dark:border-white/10" />
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
               <Select name="status" defaultValue={client?.status || 'new'}>
                <SelectTrigger id="status" className="col-span-3 bg-black/5 dark:bg-white/5 border-zinc-300 dark:border-white/10">
                    <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent className="bg-background/80 backdrop-blur-xl border-zinc-200/50 dark:border-white/10 text-foreground dark:text-white">
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
                </Select>
            </div>
             <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="notes" className="text-right pt-2">
                    Notes
                </Label>
                <Textarea id="notes" name="notes" defaultValue={client?.notes} className="col-span-3 bg-black/5 dark:bg-white/5 border-zinc-300 dark:border-white/10" />
            </div>
            <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="ghost" onClick={onCancel} className="rounded-lg">Cancel</Button>
                <Button type="submit" className="rounded-lg">Save changes</Button>
            </div>
          </form>
    )
}

const getStatusBadge = (status: Client['status']) => {
    switch (status) {
        case 'active':
            return <Badge variant="outline" className="text-green-600 dark:text-green-400 border-green-500/40 dark:border-green-400/40 bg-green-500/10 dark:bg-green-400/10">Active</Badge>;
        case 'new':
            return <Badge variant="outline" className="text-blue-600 dark:text-blue-400 border-blue-500/40 dark:border-blue-400/40 bg-blue-500/10 dark:bg-blue-400/10">New</Badge>;
        case 'archived':
            return <Badge variant="outline" className="text-zinc-500 dark:text-white/50 border-zinc-300 dark:border-white/20 bg-zinc-500/10 dark:bg-white/10">Archived</Badge>;
    }
}

const ClientViewDialog = ({ client, open, onOpenChange }: { client: Client | null, open: boolean, onOpenChange: (open: boolean) => void }) => {
    if (!client) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-background/80 backdrop-blur-xl border-zinc-200/50 dark:border-white/10 text-foreground dark:text-white sm:max-w-md">
                <DialogHeader className="items-center text-center">
                    <Avatar className="h-24 w-24 border-4 border-zinc-200 dark:border-white/20">
                        <AvatarImage src={client.avatar} alt={client.name} />
                        <AvatarFallback>{client.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <DialogTitle className="text-2xl pt-2">{client.name}</DialogTitle>
                    {getStatusBadge(client.status)}
                </DialogHeader>
                <div className="space-y-4 mt-4">
                    <div className="flex items-start gap-4">
                        <Mail className="h-5 w-5 text-zinc-500 dark:text-white/50 mt-1 flex-shrink-0" />
                        <span className="text-zinc-700 dark:text-white/80">{client.email}</span>
                    </div>
                    <div className="flex items-start gap-4">
                        <Phone className="h-5 w-5 text-zinc-500 dark:text-white/50 mt-1 flex-shrink-0" />
                        <span className="text-zinc-700 dark:text-white/80">{client.phone}</span>
                    </div>
                    <div className="flex items-start gap-4">
                        <Building className="h-5 w-5 text-zinc-500 dark:text-white/50 mt-1 flex-shrink-0" />
                        <span className="text-zinc-700 dark:text-white/80">{client.company}</span>
                    </div>
                    <div className="flex items-start gap-4">
                        <MapPin className="h-5 w-5 text-zinc-500 dark:text-white/50 mt-1 flex-shrink-0" />
                        <span className="text-zinc-700 dark:text-white/80">{client.address}</span>
                    </div>
                    <div className="flex items-start gap-4">
                        <FileText className="h-5 w-5 text-zinc-500 dark:text-white/50 mt-1 flex-shrink-0" />
                        <p className="text-zinc-700 dark:text-white/80">{client.notes}</p>
                    </div>
                </div>
                <DialogFooter className="mt-6">
                    <Button onClick={() => onOpenChange(false)} className="rounded-lg w-full">Close</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};


export default function ClientsPage() {
  const [clients, setClients] = React.useState<Client[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);
  const [editingClient, setEditingClient] = React.useState<Client | null>(null);
  const [viewingClient, setViewingClient] = React.useState<Client | null>(null);
  const [clientToDelete, setClientToDelete] = React.useState<Client | null>(null);
  const { toast } = useToast();

  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 10;
  
  const [filters, setFilters] = React.useState<{
    searchTerm: string;
    status: 'all' | Client['status'];
  }>({
    searchTerm: '',
    status: 'all',
  });

  const fetchClients = React.useCallback(async () => {
    setLoading(true);
    // Mock data
    const clientsData = [
      { id: '1', name: 'Innovate Inc.', email: 'contact@innovate.com', avatar: 'https://i.pravatar.cc/100?u=innovate', status: 'active', company: 'Innovate Inc.', phone: '555-0101', address: '123 Tech Avenue, Silicon Valley', notes: 'Leading tech startup.'},
      { id: '2', name: 'Creative Solutions', email: 'hello@creative.co', avatar: 'https://i.pravatar.cc/100?u=creative', status: 'active', company: 'Creative Solutions LLC', phone: '555-0102', address: '456 Design Drive, Arts District', notes: 'Design agency.'},
      { id: '3', name: 'Global Goods', email: 'support@globalgoods.com', avatar: 'https://i.pravatar.cc/100?u=global', status: 'new', company: 'Global Goods', phone: '555-0103', address: '789 Market Street, Commerce City', notes: 'New client.'},
    ];
    setClients(clientsData as Client[]);
    setLoading(false);
  }, []);

  React.useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const handleFilterChange = (filterType: keyof typeof filters, value: any) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
  };

  const clearFilters = () => {
    setFilters({
      searchTerm: '',
      status: 'all',
    });
  };

  const filteredClients = React.useMemo(() => {
    return clients.filter(client => {
      const searchTermMatch =
        client.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        client.company.toLowerCase().includes(filters.searchTerm.toLowerCase());
      
      const statusMatch = filters.status === 'all' || client.status === filters.status;

      return searchTermMatch && statusMatch;
    });
  }, [clients, filters]);

  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);

  const paginatedClients = filteredClients.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const hasActiveFilters = filters.searchTerm !== '' || filters.status !== 'all';

  const handleEdit = (client: Client) => {
    setEditingClient(client);
  };
  
  const handleView = (client: Client) => {
    setViewingClient(client);
  };

  const closeEditDialog = () => {
    setEditingClient(null);
  };

  const handleDeleteConfirm = async () => {
    if (clientToDelete) {
      setClients(clients.filter(c => c.id !== clientToDelete.id));
      toast({
        title: 'Client Removed',
        description: `"${clientToDelete.name}" has been removed.`,
      });
      setClientToDelete(null);
    }
  };

  const onAddClient = async (values: any) => {
    const newClient: Client = {
        id: (Math.random() * 1000).toString(),
        name: values.name,
        email: values.email,
        avatar: `https://i.pravatar.cc/100?u=${encodeURIComponent(values.name)}`,
        status: values.status,
        company: values.company,
        phone: values.phone,
        address: values.address,
        notes: values.notes,
    };
    setClients(prev => [newClient, ...prev]);
    setIsAddDialogOpen(false);
    toast({
        title: 'Client Added',
        description: `"${values.name}" has been added.`,
    });
  }

  const onEditClient = async (values: any) => {
    if(!editingClient) return;
    const updatedClient = { ...editingClient, ...values };
    setClients(prev => prev.map(c => c.id === editingClient.id ? updatedClient : c));
    closeEditDialog();
    toast({
        title: 'Client Updated',
        description: `"${values.name}" has been updated.`,
    });
  }
  
  return (
    <>
      <div className="flex items-center mb-6">
          <h1 className="text-2xl font-bold flex-shrink-0">Clients</h1>
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
                              Refine your client list.
                              </p>
                          </div>
                          <div className="grid gap-2">
                              <div className="grid grid-cols-3 items-center gap-4">
                                <Label>Search</Label>
                                <div className="relative col-span-2">
                                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 dark:text-white/50" />
                                  <Input 
                                      placeholder="Name, email, company..."
                                      value={filters.searchTerm}
                                      onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                                      className="bg-black/5 dark:bg-white/5 border-zinc-300 dark:border-white/10 pl-10"
                                  />
                                </div>
                              </div>
                              <div className="grid grid-cols-3 items-center gap-4">
                                <Label>Status</Label>
                                  <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
                                      <SelectTrigger className="bg-black/5 dark:bg-white/5 border-zinc-300 dark:border-white/10 col-span-2">
                                          <SelectValue placeholder="Status..." />
                                      </SelectTrigger>
                                      <SelectContent className="bg-background/80 backdrop-blur-xl border-zinc-200/50 dark:border-white/10 text-foreground dark:text-white">
                                          <SelectItem value="all">All Statuses</SelectItem>
                                          <SelectItem value="new">New</SelectItem>
                                          <SelectItem value="active">Active</SelectItem>
                                          <SelectItem value="archived">Archived</SelectItem>
                                      </SelectContent>
                                  </Select>
                              </div>
                          </div>
                          {hasActiveFilters && (
                              <Button variant="ghost" onClick={clearFilters} className="rounded-lg text-zinc-600 dark:text-white/70 hover:text-foreground dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 w-full justify-center">
                                  <X className="mr-2 h-4 w-4" /> Clear Filters
                              </Button>
                          )}
                      </div>
                  </PopoverContent>
              </Popover>

              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                  <Button
                  size="sm"
                  className="gap-1 bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 text-foreground dark:text-white rounded-lg flex-shrink-0"
                  >
                  <PlusCircle className="h-4 w-4" />
                  Add Client
                  </Button>
              </DialogTrigger>
              <DialogContent className="bg-background/80 backdrop-blur-xl border-zinc-200/50 dark:border-white/10 text-foreground dark:text-white sm:max-w-lg">
                  <DialogHeader>
                  <DialogTitle>Add New Client</DialogTitle>
                  <DialogDescription className="text-zinc-600 dark:text-white/60">
                      Enter the details for the new client.
                  </DialogDescription>
                  </DialogHeader>
                  <ClientForm onSubmit={onAddClient} onCancel={() => setIsAddDialogOpen(false)} />
              </DialogContent>
              </Dialog>
          </div>
      </div>

        {/* Edit Client Dialog */}
        <Dialog open={!!editingClient} onOpenChange={(isOpen) => !isOpen && closeEditDialog()}>
           <DialogContent className="bg-background/80 backdrop-blur-xl border-zinc-200/50 dark:border-white/10 text-foreground dark:text-white sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Edit Client</DialogTitle>
              <DialogDescription className="text-zinc-600 dark:text-white/60">
                 Update the details of your client below.
              </DialogDescription>
            </DialogHeader>
            <ClientForm client={editingClient!} onSubmit={onEditClient} onCancel={closeEditDialog} />
          </DialogContent>
        </Dialog>

        {/* View Client Dialog */}
        <ClientViewDialog 
            client={viewingClient} 
            open={!!viewingClient} 
            onOpenChange={(isOpen) => !isOpen && setViewingClient(null)} 
        />

         {/* Delete Confirmation Dialog */}
         <AlertDialog open={!!clientToDelete} onOpenChange={(isOpen) => !isOpen && setClientToDelete(null)}>
          <AlertDialogContent className="bg-background/80 backdrop-blur-xl border-zinc-200/50 dark:border-white/10 text-foreground dark:text-white">
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the client "{clientToDelete?.name}".
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel asChild>
                <Button variant="ghost" className="rounded-lg">Cancel</Button>
              </AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteConfirm} className="rounded-lg bg-destructive text-destructive-foreground hover:bg-destructive/90">
                <Trash2 className="mr-2 h-4 w-4" />
                Yes, delete client
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      <div className="flex-1 overflow-y-auto pb-8">
        <Card className="bg-white/60 dark:bg-white/5 backdrop-blur-2xl border-zinc-200/50 dark:border-white/10 dark:shadow-xl rounded-2xl flex-1 flex flex-col min-h-0">
            <CardHeader>
                <CardTitle>Your Clients</CardTitle>
                <CardDescription className="text-zinc-600 dark:text-white/60">
                    Manage your client relationships.
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto">
                <Table>
                    <TableHeader>
                    <TableRow className="border-zinc-200/80 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/10">
                        <TableHead className="text-zinc-700 dark:text-white/80">Client</TableHead>
                        <TableHead className="text-zinc-700 dark:text-white/80 hidden md:table-cell">Email</TableHead>
                        <TableHead className="text-zinc-700 dark:text-white/80 hidden lg:table-cell">Company</TableHead>
                        <TableHead className="text-zinc-700 dark:text-white/80">Status</TableHead>
                        <TableHead>
                        <span className="sr-only">Actions</span>
                        </TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                     {loading ? (
                        Array.from({ length: 3 }).map((_, i) => (
                            <TableRow key={i}>
                                <TableCell><Skeleton className="h-6 w-32" /></TableCell>
                                <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-40" /></TableCell>
                                <TableCell className="hidden lg:table-cell"><Skeleton className="h-4 w-24" /></TableCell>
                                <TableCell><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
                                <TableCell><Skeleton className="h-8 w-8 rounded-full" /></TableCell>
                            </TableRow>
                        ))
                    ) : (
                    paginatedClients.map((client) => (
                        <TableRow
                        key={client.id}
                        className="border-zinc-200/80 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5"
                        >
                        <TableCell>
                            <div className="flex items-center gap-3">
                                <Avatar className="hidden h-9 w-9 sm:flex border-2 border-zinc-200 dark:border-white/20">
                                    <AvatarImage src={client.avatar} alt={client.name} />
                                    <AvatarFallback>{client.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="font-medium">{client.name}</div>
                            </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-zinc-600 dark:text-white/70">{client.email}</TableCell>
                        <TableCell className="hidden lg:table-cell text-zinc-600 dark:text-white/70">{client.company}</TableCell>
                        <TableCell>{getStatusBadge(client.status)}</TableCell>
                        <TableCell>
                            <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                aria-haspopup="true"
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 text-zinc-600 dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/10 hover:text-foreground dark:hover:text-white rounded-full"
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
                                <DropdownMenuItem onSelect={(e) => { e.preventDefault(); handleView(client); }}><Eye className="mr-2 h-4 w-4" />View</DropdownMenuItem>
                                <DropdownMenuItem onSelect={(e) => { e.preventDefault(); handleEdit(client); }}><Edit className="mr-2 h-4 w-4" />Edit</DropdownMenuItem>
                                <DropdownMenuItem className="text-red-500 dark:text-red-400 focus:bg-red-400/20 focus:text-red-500 dark:focus:text-white" onSelect={(e) => { e.preventDefault(); setClientToDelete(client); }}>
                                <Trash2 className="mr-2 h-4 w-4" />Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                        </TableRow>
                    )))}
                    </TableBody>
                </Table>
            </CardContent>
            <CardFooter className="border-t border-zinc-200/80 dark:border-white/10 px-6 py-4">
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            </CardFooter>
        </Card>
      </div>
    </>
  );
}
