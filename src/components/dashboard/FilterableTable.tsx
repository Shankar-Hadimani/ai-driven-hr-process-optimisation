import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FilterOptions, HREfficiencyCase } from "@/types/hr-types";
import { Filter, ArrowUp, ArrowDown, Search } from "lucide-react";

interface FilterableTableProps {
  cases: HREfficiencyCase[];
  filterOptions: {
    departments: string[];
    jobPositions: string[];
    statuses: string[];
  };
  filters: FilterOptions;
  setFilters: (filters: FilterOptions) => void;
}

export function FilterableTable({ 
  cases, 
  filterOptions, 
  filters, 
  setFilters 
}: FilterableTableProps) {
  const [sortField, setSortField] = useState<keyof HREfficiencyCase>('time_to_hire');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [searchTerm, setSearchTerm] = useState('');

  // Handle sort
  const handleSort = (field: keyof HREfficiencyCase) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Filter and sort data
  const filteredData = cases
    .filter(item => {
      if (searchTerm === '') return true;
      
      // Handle string fields with toLowerCase()
      const jobPositionMatch = typeof item.job_position === 'string' && 
        item.job_position.toLowerCase().includes(searchTerm.toLowerCase());
      
      const departmentMatch = typeof item.department === 'string' && 
        item.department.toLowerCase().includes(searchTerm.toLowerCase());
      
      const statusMatch = typeof item.status === 'string' && item.status && 
        item.status.toLowerCase().includes(searchTerm.toLowerCase());
      
      const caseIdMatch = typeof item.case_id === 'string' ? 
        item.case_id.toLowerCase().includes(searchTerm.toLowerCase()) : 
        item.case_id.toString().includes(searchTerm);
      
      return jobPositionMatch || departmentMatch || statusMatch || caseIdMatch;
    })
    .sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue) 
          : bValue.localeCompare(aValue);
      } else {
        // Assuming numeric comparison
        return sortDirection === 'asc' 
          ? (aValue as number) - (bValue as number)
          : (bValue as number) - (aValue as number);
      }
    });

  // Reset filters
  const resetFilters = () => {
    setFilters({
      department: null,
      jobPosition: null,
      status: null,
      timeToHireMin: null,
      timeToHireMax: null
    });
  };

  // Format date for display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Case Details</CardTitle>
        <CardDescription>Explore recruitment cases and filter by attributes</CardDescription>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search cases..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span>Filter</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Filter Options</DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              <div className="p-2">
                <p className="text-sm font-medium mb-1">Department</p>
                <Select
                  value={filters.department || ''}
                  onValueChange={(val) => setFilters({ ...filters, department: val || null })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Departments" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Departments</SelectItem>
                    {filterOptions.departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="p-2">
                <p className="text-sm font-medium mb-1">Job Position</p>
                <Select
                  value={filters.jobPosition || ''}
                  onValueChange={(val) => setFilters({ ...filters, jobPosition: val || null })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Positions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Positions</SelectItem>
                    {filterOptions.jobPositions.map((position) => (
                      <SelectItem key={position} value={position}>{position}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="p-2">
                <p className="text-sm font-medium mb-1">Status</p>
                <Select
                  value={filters.status || ''}
                  onValueChange={(val) => setFilters({ ...filters, status: val || null })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Statuses</SelectItem>
                    {filterOptions.statuses.map((status) => (
                      <SelectItem key={status} value={status}>{status}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="p-2">
                <p className="text-sm font-medium mb-1">Time to Hire (Min days)</p>
                <Input
                  type="number"
                  placeholder="Min days"
                  value={filters.timeToHireMin || ''}
                  onChange={(e) => setFilters({ 
                    ...filters, 
                    timeToHireMin: e.target.value ? Number(e.target.value) : null 
                  })}
                  className="w-full"
                />
              </div>
              
              <div className="p-2">
                <p className="text-sm font-medium mb-1">Time to Hire (Max days)</p>
                <Input
                  type="number"
                  placeholder="Max days"
                  value={filters.timeToHireMax || ''}
                  onChange={(e) => setFilters({ 
                    ...filters, 
                    timeToHireMax: e.target.value ? Number(e.target.value) : null 
                  })}
                  className="w-full"
                />
              </div>
              
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="justify-center font-medium cursor-pointer" 
                onClick={resetFilters}
              >
                Reset Filters
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="cursor-pointer" onClick={() => handleSort('case_id')}>
                  Case ID
                  {sortField === 'case_id' && (
                    sortDirection === 'asc' ? <ArrowUp className="inline ml-1 h-3 w-3" /> : <ArrowDown className="inline ml-1 h-3 w-3" />
                  )}
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort('job_position')}>
                  Job Position
                  {sortField === 'job_position' && (
                    sortDirection === 'asc' ? <ArrowUp className="inline ml-1 h-3 w-3" /> : <ArrowDown className="inline ml-1 h-3 w-3" />
                  )}
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort('department')}>
                  Department
                  {sortField === 'department' && (
                    sortDirection === 'asc' ? <ArrowUp className="inline ml-1 h-3 w-3" /> : <ArrowDown className="inline ml-1 h-3 w-3" />
                  )}
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort('status')}>
                  Status
                  {sortField === 'status' && (
                    sortDirection === 'asc' ? <ArrowUp className="inline ml-1 h-3 w-3" /> : <ArrowDown className="inline ml-1 h-3 w-3" />
                  )}
                </TableHead>
                <TableHead className="cursor-pointer text-right" onClick={() => handleSort('time_to_hire')}>
                  Time to Hire
                  {sortField === 'time_to_hire' && (
                    sortDirection === 'asc' ? <ArrowUp className="inline ml-1 h-3 w-3" /> : <ArrowDown className="inline ml-1 h-3 w-3" />
                  )}
                </TableHead>
                <TableHead className="text-right">Start Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No results found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.slice(0, 10).map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.case_id}</TableCell>
                    <TableCell>{item.job_position}</TableCell>
                    <TableCell>{item.department}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        item.status === 'Completed' ? 'bg-green-100 text-green-800' :
                        item.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {item.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">{item.time_to_hire} days</TableCell>
                    <TableCell className="text-right">{formatDate(item.start_date)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        <div className="text-sm text-muted-foreground mt-2">
          Showing {Math.min(filteredData.length, 10)} of {filteredData.length} results
        </div>
      </CardContent>
    </Card>
  );
}
