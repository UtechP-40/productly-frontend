"use client";

import { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { 
  Users, Clock, CheckCircle, Target, Activity, Zap, Upload, UserPlus, BarChart3, TrendingUp, Plus, Bell
} from 'lucide-react';
import { DashboardSidebar } from '../../components/dashboard/sidebar';
import { LiveTrackingMap } from '../../components/dashboard/live-tracking-map';
import  TaskKanban  from '../../components/dashboard/task-kanban';
import { EmployeeDirectory } from '../../components/dashboard/employee-directory';
import AITrainerModule from '../../components/dashboard/ai-trainer';
import { InvitationManager } from '../../components/dashboard/invitation-manager';
import { AnalyticsDashboard } from '../../components/dashboard/analytics';
import { MediaGallery } from '../../components/dashboard/media-gallery';
import { OrganizationSettings } from '../../components/dashboard/organization-settings';

const currentUser = {
  id: '1',
  name: 'Sarah Chen',
  email: 'sarah@acme.com',
  role: 'OWNER',
  avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
  organization: 'ACME Corp'
};

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const stats = [
    { title: 'Active Field Agents', value: '24', change: '+12%', trend: 'up', icon: <Users className="h-6 w-6" /> },
    { title: 'Tasks Completed Today', value: '156', change: '+8%', trend: 'up', icon: <CheckCircle className="h-6 w-6" /> },
    { title: 'Average Response Time', value: '2.4m', change: '-15%', trend: 'down', icon: <Clock className="h-6 w-6" /> },
    { title: 'SLA Compliance', value: '94.2%', change: '+3%', trend: 'up', icon: <Target className="h-6 w-6" /> }
  ];

  const recentActivities = [
    { id: '1', user: 'Marcus Rodriguez', action: 'completed task', target: 'Site Inspection #1247', time: '2 minutes ago', avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop' },
    { id: '2', user: 'Emily Watson', action: 'uploaded media', target: '3 photos for Task #1245', time: '5 minutes ago', avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop' },
    { id: '3', user: 'David Kim', action: 'checked in at', target: 'Downtown Office', time: '12 minutes ago', avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <Card key={index} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                        <div className="flex items-center mt-2">
                          <span className={`text-sm font-medium ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>{stat.change}</span>
                          <span className="text-sm text-gray-500 ml-1">vs last week</span>
                        </div>
                      </div>
                      <div className="p-3 bg-gradient-to-r from-indigo-100 to-blue-100 rounded-xl text-indigo-600">
                        {stat.icon}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="h-5 w-5 mr-2 text-indigo-600" />
                    Live Activity Feed
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivities.map(activity => (
                      <div key={activity.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={activity.avatar} alt={activity.user} />
                          <AvatarFallback className="bg-indigo-500 text-white">{activity.user.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900">
                            <span className="font-medium">{activity.user}</span> {activity.action} <span className="font-medium text-indigo-600">{activity.target}</span>
                          </p>
                          <p className="text-xs text-gray-500">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Zap className="h-5 w-5 mr-2 text-indigo-600" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start bg-indigo-500 hover:bg-indigo-600 text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Task
                  </Button>
                  <Button variant="outline" className="w-full justify-start border-indigo-100 text-indigo-600 hover:bg-indigo-50">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Invite Team Member
                  </Button>
                  <Button variant="outline" className="w-full justify-start border-blue-100 text-blue-600 hover:bg-blue-50">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Training Data
                  </Button>
                  <Button variant="outline" className="w-full justify-start border-green-100 text-green-600 hover:bg-green-50">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    View Analytics
                  </Button>
                </CardContent>
              </Card>
            </div>
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-indigo-600" />
                  Performance Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 text-indigo-400 mx-auto mb-4" />
                    <p className="text-gray-600">Performance charts will be displayed here</p>
                    <p className="text-sm text-gray-500 mt-2">Integration with Chart.js or Recharts</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      case 'tasks': return <TaskKanban />;
      case 'tracking': return <LiveTrackingMap />;
      case 'employees': return <EmployeeDirectory />;
      case 'ai-trainer': return <AITrainerModule />;
      case 'invitations': return <InvitationManager />;
      case 'analytics': return <AnalyticsDashboard />;
      case 'media': return <MediaGallery />;
      case 'settings': return <OrganizationSettings />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="flex">
        <DashboardSidebar 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
          currentUser={currentUser}
        />
        <div className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
          <header className="bg-white/80 backdrop-blur-md border-b border-white/20 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {activeTab === 'overview' && 'Dashboard Overview'}
                  {activeTab === 'tasks' && 'Task Management'}
                  {activeTab === 'tracking' && 'Live Tracking'}
                  {activeTab === 'employees' && 'Employee Directory'}
                  {activeTab === 'ai-trainer' && 'AI Assistant Trainer'}
                  {activeTab === 'invitations' && 'User Management'}
                  {activeTab === 'analytics' && 'Analytics & Reports'}
                  {activeTab === 'media' && 'Media Gallery'}
                  {activeTab === 'settings' && 'Organization Settings'}
                </h1>
                <p className="text-gray-600 mt-1">
                  {currentUser.organization} • {currentUser.role}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
                </Button>
                <div className="flex items-center space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                    <AvatarFallback>{currentUser.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="hidden md:block">
                    <p className="text-sm font-medium text-gray-900">{currentUser.name}</p>
                    <p className="text-xs text-gray-500">{currentUser.email}</p>
                  </div>
                </div>
              </div>
            </div>
          </header>
          <main className="p-6">
            {renderTabContent()}
          </main>
        </div>
      </div>
    </div>
  );
}