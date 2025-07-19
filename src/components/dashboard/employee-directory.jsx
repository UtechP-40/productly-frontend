"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { 
  Search, 
  Filter, 
  UserPlus, 
  MoreVertical, 
  MapPin, 
  Clock, 
  Phone, 
  Mail,
  Shield,
  Activity,
  Calendar,
  CheckCircle,
  AlertCircle,
  Users,
  Briefcase,
  UserCheck,
  UserX,
  RefreshCw
} from 'lucide-react';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { toast } from '../ui/use-toast';

export function EmployeeDirectory() {
  // State for employees data
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalEmployees, setTotalEmployees] = useState(0);
  
  // State for filtering and search
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterTeam, setFilterTeam] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  
  // State for role assignment dialog
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Current organization ID (would typically come from context or state)
  const organizationId = "64f5e3e5c7c1a1a1a1a1a1a1"; // Replace with actual organization ID from context
  
  // Fetch employees on component mount and when filters change
  useEffect(() => {
    fetchEmployees();
  }, [currentPage, filterRole, filterStatus]);
  
  // Fetch employees from API
  const fetchEmployees = async () => {
    try {
      setLoading(true);
      
      // Build query parameters
      const queryParams = new URLSearchParams();
      queryParams.append("page", currentPage);
      queryParams.append("limit", 10);
      
      if (searchQuery) queryParams.append("search", searchQuery);
      if (filterRole !== 'all') queryParams.append("role", filterRole);
      if (filterStatus !== 'all') queryParams.append("status", filterStatus === 'online' ? 'active' : filterStatus === 'offline' ? 'inactive' : 'all');
      
      const response = await fetch(`/api/users?organizationId=${organizationId}&${queryParams.toString()}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch employees');
      }
      
      // Transform API data to match component structure
      const transformedEmployees = data.data.users.map(user => ({
        id: user._id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        phone: user.phoneNumber || 'Not provided',
        role: user.organizationRole || 'MEMBER',
        avatar: user.avatar,
        status: user.isActive ? 'online' : 'offline',
        lastActive: user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : 'Never',
        joinDate: new Date(user.createdAt).toLocaleDateString(),
        isActive: user.isActive
      }));
      
      setEmployees(transformedEmployees);
      setTotalPages(data.data.pagination.pages);
      setTotalEmployees(data.data.pagination.total);
      setError(null);
    } catch (error) {
      console.error('Error fetching employees:', error);
      setError(error.message);
      toast({
        title: "Error",
        description: `Failed to fetch employees: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page when searching
    fetchEmployees();
  };
  
  // Open role assignment dialog
  const openRoleDialog = (employee) => {
    setSelectedEmployee(employee);
    setSelectedRole(employee.role);
    setIsRoleDialogOpen(true);
  };
  
  // Open status change dialog
  const openStatusDialog = (employee) => {
    setSelectedEmployee(employee);
    setSelectedStatus(employee.isActive ? 'ACTIVE' : 'INACTIVE');
    setIsStatusDialogOpen(true);
  };
  
  // Assign role to user
  const assignRole = async () => {
    if (!selectedEmployee || !selectedRole) return;
    
    try {
      setIsSubmitting(true);
      
      const response = await fetch(`/api/users/${selectedEmployee.id}/role`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          organizationId,
          role: selectedRole
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to assign role');
      }
      
      // Update employee in state
      setEmployees(employees.map(emp => 
        emp.id === selectedEmployee.id ? { ...emp, role: selectedRole } : emp
      ));
      
      toast({
        title: "Success",
        description: `Role updated to ${selectedRole} for ${selectedEmployee.name}`,
        variant: "default"
      });
      
      setIsRoleDialogOpen(false);
    } catch (error) {
      console.error('Error assigning role:', error);
      toast({
        title: "Error",
        description: `Failed to assign role: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Update user status
  const updateStatus = async () => {
    if (!selectedEmployee || !selectedStatus) return;
    
    try {
      setIsSubmitting(true);
      
      const response = await fetch(`/api/users/${selectedEmployee.id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          organizationId,
          status: selectedStatus
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update status');
      }
      
      // Update employee in state
      setEmployees(employees.map(emp => 
        emp.id === selectedEmployee.id ? { 
          ...emp, 
          status: selectedStatus === 'ACTIVE' ? 'online' : 'offline',
          isActive: selectedStatus === 'ACTIVE'
        } : emp
      ));
      
      toast({
        title: "Success",
        description: `Status updated to ${selectedStatus.toLowerCase()} for ${selectedEmployee.name}`,
        variant: "default"
      });
      
      setIsStatusDialogOpen(false);
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Error",
        description: `Failed to update status: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'OWNER':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'ADMIN':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'MANAGER':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'MEMBER':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Available roles for assignment
  const availableRoles = ['OWNER', 'ADMIN', 'MANAGER', 'MEMBER'];

  const stats = [
    {
      title: 'Total Employees',
      value: totalEmployees,
      icon: <Users className="h-5 w-5" />,
      color: 'text-blue-600'
    },
    {
      title: 'Active',
      value: employees.filter(emp => emp.status === 'online').length,
      icon: <Activity className="h-5 w-5" />,
      color: 'text-green-600'
    },
    {
      title: 'Inactive',
      value: employees.filter(emp => emp.status === 'offline').length,
      icon: <AlertCircle className="h-5 w-5" />,
      color: 'text-gray-600'
    },
    {
      title: 'Roles',
      value: [...new Set(employees.map(emp => emp.role))].length,
      icon: <Shield className="h-5 w-5" />,
      color: 'text-blue-600'
    }
  ];

  // Render role assignment dialog
  const renderRoleDialog = () => (
    <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2 text-blue-600" />
            Assign Role
          </DialogTitle>
          <DialogDescription>
            {selectedEmployee && (
              <>Change role for {selectedEmployee.name}</>
            )}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Select Role</label>
            <Select
              value={selectedRole}
              onValueChange={setSelectedRole}
              disabled={isSubmitting}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                {availableRoles.map(role => (
                  <SelectItem key={role} value={role}>
                    <div className="flex items-center">
                      <Shield className="h-4 w-4 mr-2 text-blue-600" />
                      {role}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="text-sm text-gray-500">
            <p>Role permissions:</p>
            <ul className="list-disc pl-5 mt-1">
              {selectedRole === 'OWNER' && (
                <>
                  <li>Full access to all system features</li>
                  <li>Can manage roles and permissions</li>
                  <li>Can invite and manage all users</li>
                </>
              )}
              {selectedRole === 'ADMIN' && (
                <>
                  <li>Access to most system features</li>
                  <li>Can manage users but not roles</li>
                  <li>Can invite new users</li>
                </>
              )}
              {selectedRole === 'MANAGER' && (
                <>
                  <li>Access to team management features</li>
                  <li>Can view but not modify roles</li>
                  <li>Limited user management</li>
                </>
              )}
              {selectedRole === 'MEMBER' && (
                <>
                  <li>Basic access to system features</li>
                  <li>No user or role management</li>
                  <li>Limited to assigned tasks</li>
                </>
              )}
            </ul>
          </div>
        </div>
        
        <DialogFooter className="flex space-x-2 justify-end">
          <Button variant="outline" onClick={() => setIsRoleDialogOpen(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button 
            onClick={assignRole} 
            className="bg-blue-600 hover:bg-blue-700 text-white"
            disabled={!selectedRole || isSubmitting}
          >
            {isSubmitting ? <LoadingSpinner size="sm" /> : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
  
  // Render status change dialog
  const renderStatusDialog = () => (
    <AlertDialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center">
            {selectedStatus === 'ACTIVE' ? (
              <UserCheck className="h-5 w-5 mr-2 text-green-600" />
            ) : (
              <UserX className="h-5 w-5 mr-2 text-red-600" />
            )}
            {selectedStatus === 'ACTIVE' ? 'Activate User' : 'Deactivate User'}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {selectedEmployee && (
              <>
                Are you sure you want to {selectedStatus === 'ACTIVE' ? 'activate' : 'deactivate'} {selectedEmployee.name}?
                <br />
                {selectedStatus === 'ACTIVE' 
                  ? 'This will allow the user to access the system.' 
                  : 'This will prevent the user from accessing the system.'}
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={updateStatus}
            className={selectedStatus === 'ACTIVE' 
              ? 'bg-green-600 hover:bg-green-700 text-white' 
              : 'bg-red-600 hover:bg-red-700 text-white'}
            disabled={isSubmitting}
          >
            {isSubmitting ? <LoadingSpinner size="sm" /> : (
              selectedStatus === 'ACTIVE' ? 'Activate' : 'Deactivate'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-black mb-2">Employee Directory</h1>
          <p className="text-gray-600">Manage and view your team members</p>
        </div>

        {/* Header Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <UserPlus className="h-4 w-4 mr-2" />
              Invite Employee
            </Button>
            <Button 
              variant="outline" 
              className="border-blue-200 text-blue-700 hover:bg-blue-50"
              onClick={fetchEmployees}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>

          <form onSubmit={handleSearch} className="flex items-center space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search employees..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            
            <Select
              value={filterRole}
              onValueChange={setFilterRole}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                {availableRoles.map(role => (
                  <SelectItem key={role} value={role}>{role}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filterStatus}
              onValueChange={setFilterStatus}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="online">Active</SelectItem>
                <SelectItem value="offline">Inactive</SelectItem>
              </SelectContent>
            </Select>
            
            <Button type="submit" variant="secondary">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </form>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-black">{stat.value}</p>
                  </div>
                  <div className={`p-2 bg-blue-50 rounded-lg ${stat.color}`}>
                    {stat.icon}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Employee Grid */}
        {loading && employees.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : error ? (
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardContent className="p-12 text-center">
              <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-black mb-2">Error Loading Employees</h3>
              <p className="text-gray-500 mb-6">{error}</p>
              <Button 
                onClick={fetchEmployees}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {employees.map((employee) => (
              <Card key={employee.id} className="bg-white border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={employee.avatar} alt={employee.name} />
                          <AvatarFallback className="bg-blue-100 text-blue-800">{employee.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                          employee.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                        }`}></div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-black">{employee.name}</h3>
                        <Badge className={`text-xs border ${getRoleBadgeColor(employee.role)}`}>
                          <Shield className="h-3 w-3 mr-1" />
                          {employee.role}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-blue-50"
                        onClick={() => openRoleDialog(employee)}
                        title="Assign Role"
                      >
                        <Shield className="h-4 w-4 text-blue-600" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-50"
                        onClick={() => openStatusDialog(employee)}
                        title={employee.status === 'online' ? 'Deactivate User' : 'Activate User'}
                      >
                        {employee.status === 'online' ? (
                          <UserX className="h-4 w-4 text-red-500" />
                        ) : (
                          <UserCheck className="h-4 w-4 text-green-500" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="h-4 w-4 mr-2 text-gray-400" />
                      {employee.email}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="h-4 w-4 mr-2 text-gray-400" />
                      {employee.phone}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                      Joined: {employee.joinDate}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-2 text-gray-400" />
                      Last active: {employee.lastActive}
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Status:</span>
                      <Badge variant="outline" className={`text-xs ${
                        employee.status === 'online' 
                          ? 'border-green-200 text-green-700 bg-green-50' 
                          : 'border-gray-200 text-gray-600 bg-gray-50'
                      }`}>
                        {employee.status === 'online' ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </div>

                  <div className="mt-4 flex space-x-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1 text-xs border-blue-200 text-blue-700 hover:bg-blue-50"
                      onClick={() => openRoleDialog(employee)}
                    >
                      <Shield className="h-3 w-3 mr-1" />
                      Assign Role
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className={`flex-1 text-xs ${
                        employee.status === 'online'
                          ? 'border-red-200 text-red-700 hover:bg-red-50'
                          : 'border-green-200 text-green-700 hover:bg-green-50'
                      }`}
                      onClick={() => openStatusDialog(employee)}
                    >
                      {employee.status === 'online' ? (
                        <>
                          <UserX className="h-3 w-3 mr-1" />
                          Deactivate
                        </>
                      ) : (
                        <>
                          <UserCheck className="h-3 w-3 mr-1" />
                          Activate
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!loading && !error && employees.length === 0 && (
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardContent className="p-12 text-center">
              <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-black mb-2">No employees found</h3>
              <p className="text-gray-500 mb-6">Try adjusting your search criteria or filters</p>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <UserPlus className="h-4 w-4 mr-2" />
                Invite New Employee
              </Button>
            </CardContent>
          </Card>
        )}
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-gray-500">
              Showing {employees.length} of {totalEmployees} employees
            </p>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1 || loading}
              >
                Previous
              </Button>
              <span className="text-sm text-gray-500">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages || loading}
              >
                Next
              </Button>
            </div>
          </div>
        )}
        
        {/* Dialogs */}
        {renderRoleDialog()}
        {renderStatusDialog()}
      </div>
    </div>
  );
}