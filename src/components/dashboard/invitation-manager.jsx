"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Checkbox } from '../../components/ui/checkbox';
import { 
  UserPlus, 
  Mail, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Shield, 
  Users,
  Send,
  Copy,
  RefreshCw,
  Search,
  Filter,
  MoreVertical,
  Globe,
  Settings
} from 'lucide-react';

// Mock invitations data
const invitations = [
  {
    id: '1',
    email: 'john.doe@example.com',
    role: 'FIELD_AGENT',
    status: 'pending',
    invitedBy: 'Sarah Chen',
    invitedDate: '2024-01-12',
    expiryDate: '2024-01-19',
    permissions: ['tasks.view', 'tasks.update', 'media.upload']
  },
  {
    id: '2',
    email: 'jane.smith@example.com',
    role: 'MANAGER',
    status: 'accepted',
    invitedBy: 'Sarah Chen',
    invitedDate: '2024-01-10',
    joinedDate: '2024-01-11',
    permissions: ['tasks.all', 'employees.view', 'tracking.view', 'analytics.view']
  },
  {
    id: '3',
    email: 'mike.wilson@example.com',
    role: 'TRAINER',
    status: 'expired',
    invitedBy: 'David Kim',
    invitedDate: '2024-01-05',
    expiryDate: '2024-01-12',
    permissions: ['ai.train', 'ai.manage', 'content.create']
  },
  {
    id: '4',
    email: 'lisa.brown@example.com',
    role: 'FIELD_AGENT',
    status: 'pending',
    invitedBy: 'Sarah Chen',
    invitedDate: '2024-01-13',
    expiryDate: '2024-01-20',
    permissions: ['tasks.view', 'tasks.update', 'media.upload']
  }
];

// Role permissions mapping
const rolePermissions = {
  OWNER: [
    'dashboard.view', 'tasks.all', 'employees.all', 'tracking.all', 
    'ai.all', 'invitations.all', 'analytics.all', 'media.all', 'settings.all'
  ],
  MANAGER: [
    'dashboard.view', 'tasks.all', 'employees.view', 'tracking.view', 
    'analytics.view', 'media.view', 'invitations.create'
  ],
  TRAINER: [
    'dashboard.view', 'ai.train', 'ai.manage', 'content.create', 'media.view'
  ],
  FIELD_AGENT: [
    'dashboard.view', 'tasks.view', 'tasks.update', 'media.upload'
  ]
};

export function InvitationManager() {
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [newInvite, setNewInvite] = useState({
    email: '',
    role: 'FIELD_AGENT',
    customPermissions: []
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredInvitations = invitations.filter(invitation => {
    const matchesSearch = invitation.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || invitation.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'accepted':
        return 'bg-gray-100 text-black border-gray-300';
      case 'expired':
        return 'bg-gray-200 text-gray-700 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'accepted':
        return <CheckCircle className="h-4 w-4" />;
      case 'expired':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Mail className="h-4 w-4" />;
    }
  };

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

  const stats = [
    {
      title: 'Total Invitations',
      value: invitations.length,
      icon: <Mail className="h-5 w-5" />,
      color: 'text-blue-600'
    },
    {
      title: 'Pending',
      value: invitations.filter(inv => inv.status === 'pending').length,
      icon: <Clock className="h-5 w-5" />,
      color: 'text-blue-600'
    },
    {
      title: 'Accepted',
      value: invitations.filter(inv => inv.status === 'accepted').length,
      icon: <CheckCircle className="h-5 w-5" />,
      color: 'text-blue-600'
    },
    {
      title: 'Expired',
      value: invitations.filter(inv => inv.status === 'expired').length,
      icon: <XCircle className="h-5 w-5" />,
      color: 'text-blue-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-black">User Management</h2>
            <p className="text-gray-600">Invite users and manage organization access</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              onClick={() => setShowInviteForm(!showInviteForm)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Invite User
            </Button>
          </div>
        </div>

        {/* Organization Info */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <Globe className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-black">Organization URL</h3>
                <p className="text-gray-600 text-sm">Users will join your organization at:</p>
                <div className="flex items-center space-x-2 mt-2">
                  <code className="bg-white px-3 py-1 rounded border text-sm font-mono border-blue-200">
                    acme.productly.com
                  </code>
                  <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-blue-100">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

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

        {/* Invite Form */}
        {showInviteForm && (
          <Card className="bg-white border-gray-200 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-black">
                <UserPlus className="h-5 w-5 mr-2 text-blue-600" />
                Send Invitation
              </CardTitle>
              <CardDescription>
                Invite a new user to join your organization
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <Input
                    type="email"
                    placeholder="user@example.com"
                    value={newInvite.email}
                    onChange={(e) => setNewInvite({ ...newInvite, email: e.target.value })}
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                  <select
                    value={newInvite.role}
                    onChange={(e) => setNewInvite({ ...newInvite, role: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="FIELD_AGENT">Field Agent</option>
                    <option value="MANAGER">Manager</option>
                    <option value="TRAINER">Trainer</option>
                  </select>
                </div>
              </div>

              {/* Permissions */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Permissions</label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {rolePermissions[newInvite.role]?.map((permission) => (
                    <div key={permission} className="flex items-center space-x-2">
                      <Checkbox id={permission} defaultChecked />
                      <label htmlFor={permission} className="text-sm text-gray-700">
                        {permission.replace('.', ' ').replace('_', ' ')}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex space-x-3">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Send className="h-4 w-4 mr-2" />
                  Send Invitation
                </Button>
                <Button variant="outline" onClick={() => setShowInviteForm(false)} className="border-gray-300 text-gray-700 hover:bg-gray-50">
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search invitations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="expired">Expired</option>
            </select>
          </div>
        </div>

        {/* Invitations List */}
        <Card className="bg-white border-gray-200 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-black">
              <Users className="h-5 w-5 mr-2 text-blue-600" />
              Invitations
            </CardTitle>
            <CardDescription>
              {filteredInvitations.length} of {invitations.length} invitations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredInvitations.map((invitation) => (
                <div key={invitation.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-blue-100 text-blue-800">
                        {invitation.email.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium text-black">{invitation.email}</h4>
                      <div className="flex items-center space-x-3 text-sm text-gray-500 mt-1">
                        <span>Invited by {invitation.invitedBy}</span>
                        <span>•</span>
                        <span>{new Date(invitation.invitedDate).toLocaleDateString()}</span>
                        {invitation.status === 'pending' && (
                          <>
                            <span>•</span>
                            <span>Expires {new Date(invitation.expiryDate).toLocaleDateString()}</span>
                          </>
                        )}
                        {invitation.joinedDate && (
                          <>
                            <span>•</span>
                            <span>Joined {new Date(invitation.joinedDate).toLocaleDateString()}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <Badge className={`border ${getRoleBadgeColor(invitation.role)}`}>
                      <Shield className="h-3 w-3 mr-1" />
                      {invitation.role.replace('_', ' ')}
                    </Badge>
                    
                    <Badge className={`border ${getStatusColor(invitation.status)}`}>
                      {getStatusIcon(invitation.status)}
                      <span className="ml-1 capitalize">{invitation.status}</span>
                    </Badge>

                    <div className="flex space-x-2">
                      {invitation.status === 'pending' && (
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-blue-50">
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                      )}
                      <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-gray-100">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredInvitations.length === 0 && (
              <div className="text-center py-12">
                <Mail className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-black mb-2">No invitations found</h3>
                <p className="text-gray-500 mb-6">Try adjusting your search criteria or send a new invitation</p>
                <Button
                  onClick={() => setShowInviteForm(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Send Invitation
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}