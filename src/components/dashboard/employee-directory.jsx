"use client";

import { useState } from 'react';
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
  Briefcase
} from 'lucide-react';

// Mock employees data
const employees = [
  {
    id: '1',
    name: 'Marcus Rodriguez',
    email: 'marcus@acme.com',
    phone: '+1 (555) 123-4567',
    role: 'FIELD_AGENT',
    team: 'Alpha Team',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    status: 'online',
    currentTask: 'Site Inspection #1247',
    location: 'Downtown Office District',
    lastActive: '2 minutes ago',
    tasksCompleted: 45,
    joinDate: '2023-06-15',
    region: 'North',
    skills: ['Safety Inspection', 'Equipment Check', 'Documentation']
  },
  {
    id: '2',
    name: 'Emily Watson',
    email: 'emily@acme.com',
    phone: '+1 (555) 234-5678',
    role: 'FIELD_AGENT',
    team: 'Beta Team',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    status: 'online',
    currentTask: 'Equipment Check #1245',
    location: 'Industrial Zone B',
    lastActive: '5 minutes ago',
    tasksCompleted: 38,
    joinDate: '2023-08-22',
    region: 'South',
    skills: ['Maintenance', 'Quality Control', 'Technical Support']
  },
  {
    id: '3',
    name: 'David Kim',
    email: 'david@acme.com',
    phone: '+1 (555) 345-6789',
    role: 'MANAGER',
    team: 'Alpha Team',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    status: 'offline',
    currentTask: 'Team Review Meeting',
    location: 'Main Office',
    lastActive: '1 hour ago',
    tasksCompleted: 62,
    joinDate: '2023-03-10',
    region: 'Central',
    skills: ['Team Management', 'Strategic Planning', 'Process Optimization']
  },
  {
    id: '4',
    name: 'Sarah Johnson',
    email: 'sarah@acme.com',
    phone: '+1 (555) 456-7890',
    role: 'TRAINER',
    team: 'Gamma Team',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    status: 'online',
    currentTask: 'AI Training Module Update',
    location: 'Tech Campus',
    lastActive: '1 minute ago',
    tasksCompleted: 29,
    joinDate: '2023-09-05',
    region: 'East',
    skills: ['AI Training', 'Content Development', 'Knowledge Management']
  },
  {
    id: '5',
    name: 'Alex Chen',
    email: 'alex@acme.com',
    phone: '+1 (555) 567-8901',
    role: 'FIELD_AGENT',
    team: 'Beta Team',
    avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    status: 'online',
    currentTask: 'Quality Audit #1249',
    location: 'Manufacturing Plant',
    lastActive: '8 minutes ago',
    tasksCompleted: 33,
    joinDate: '2023-07-18',
    region: 'West',
    skills: ['Quality Assurance', 'Data Analysis', 'Report Generation']
  }
];

export function EmployeeDirectory() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterTeam, setFilterTeam] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [viewMode, setViewMode] = useState('grid');

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         employee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         employee.currentTask.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === 'all' || employee.role === filterRole;
    const matchesTeam = filterTeam === 'all' || employee.team === filterTeam;
    const matchesStatus = filterStatus === 'all' || employee.status === filterStatus;
    return matchesSearch && matchesRole && matchesTeam && matchesStatus;
  });

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'OWNER':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'MANAGER':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'TRAINER':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'FIELD_AGENT':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const teams = [...new Set(employees.map(emp => emp.team))];
  const roles = [...new Set(employees.map(emp => emp.role))];

  const stats = [
    {
      title: 'Total Employees',
      value: employees.length,
      icon: <Users className="h-5 w-5" />,
      color: 'text-blue-600'
    },
    {
      title: 'Online Now',
      value: employees.filter(emp => emp.status === 'online').length,
      icon: <Activity className="h-5 w-5" />,
      color: 'text-blue-600'
    },
    {
      title: 'Active Tasks',
      value: employees.filter(emp => emp.currentTask && emp.status === 'online').length,
      icon: <Briefcase className="h-5 w-5" />,
      color: 'text-blue-600'
    },
    {
      title: 'Teams',
      value: teams.length,
      icon: <Shield className="h-5 w-5" />,
      color: 'text-blue-600'
    }
  ];

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
            <Button variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50">
              <Filter className="h-4 w-4 mr-2" />
              Advanced Filters
            </Button>
          </div>

          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search employees..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Roles</option>
              {roles.map(role => (
                <option key={role} value={role}>{role.replace('_', ' ')}</option>
              ))}
            </select>

            <select
              value={filterTeam}
              onChange={(e) => setFilterTeam(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Teams</option>
              {teams.map(team => (
                <option key={team} value={team}>{team}</option>
              ))}
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="online">Online</option>
              <option value="offline">Offline</option>
            </select>
          </div>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEmployees.map((employee) => (
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
                        employee.status === 'online' ? 'bg-blue-500' : 'bg-gray-400'
                      }`}></div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-black">{employee.name}</h3>
                      <Badge className={`text-xs border ${getRoleBadgeColor(employee.role)}`}>
                        <Shield className="h-3 w-3 mr-1" />
                        {employee.role.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-100">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
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
                    <Users className="h-4 w-4 mr-2 text-gray-400" />
                    {employee.team}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                    {employee.location}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="h-4 w-4 mr-2 text-gray-400" />
                    Last active: {employee.lastActive}
                  </div>
                </div>

                <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Current Task:</span>
                    <Badge variant="outline" className={`text-xs ${
                      employee.status === 'online' ? 'border-blue-200 text-blue-700' : 'border-gray-200 text-gray-600'
                    }`}>
                      {employee.status === 'online' ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <p className="text-sm font-medium text-blue-600 mt-1">{employee.currentTask}</p>
                </div>

                <div className="mt-4 flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <p className="font-semibold text-black">{employee.tasksCompleted}</p>
                      <p className="text-xs text-gray-500">Tasks</p>
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-black">{employee.region}</p>
                      <p className="text-xs text-gray-500">Region</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex space-x-2">
                  <Button size="sm" variant="outline" className="flex-1 text-xs border-blue-200 text-blue-700 hover:bg-blue-50">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Assign Task
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1 text-xs border-gray-200 text-gray-700 hover:bg-gray-50">
                    <Phone className="h-3 w-3 mr-1" />
                    Contact
                  </Button>
                </div>

                {/* Skills */}
                <div className="mt-4">
                  <p className="text-xs text-gray-500 mb-2">Skills:</p>
                  <div className="flex flex-wrap gap-1">
                    {employee.skills.slice(0, 3).map((skill, index) => (
                      <Badge key={index} variant="outline" className="text-xs border-gray-200 text-gray-700">
                        {skill}
                      </Badge>
                    ))}
                    {employee.skills.length > 3 && (
                      <Badge variant="outline" className="text-xs border-gray-200 text-gray-700">
                        +{employee.skills.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredEmployees.length === 0 && (
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
      </div>
    </div>
  );
}