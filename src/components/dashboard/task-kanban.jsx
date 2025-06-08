"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  Clock, 
  AlertCircle, 
  CheckCircle,
  User,
  MapPin,
  Paperclip,
  MoreVertical,
  Flag
} from 'lucide-react';

// Mock tasks data
const mockTasks = [
  {
    id: '1',
    title: 'Site Inspection #1247',
    description: 'Conduct safety inspection at downtown construction site',
    status: 'pending',
    priority: 'high',
    assignee: {
      name: 'Marcus Rodriguez',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    },
    dueDate: '2024-01-15',
    location: 'Downtown Office District',
    attachments: 2,
    tags: ['Safety', 'Inspection']
  },
  {
    id: '2',
    title: 'Equipment Check #1245',
    description: 'Routine maintenance check on industrial equipment',
    status: 'ongoing',
    priority: 'medium',
    assignee: {
      name: 'Emily Watson',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    },
    dueDate: '2024-01-16',
    location: 'Industrial Zone B',
    attachments: 1,
    tags: ['Maintenance', 'Equipment']
  },
  {
    id: '3',
    title: 'Quality Audit #1249',
    description: 'Quality assurance audit for production line',
    status: 'ongoing',
    priority: 'high',
    assignee: {
      name: 'Sarah Johnson',
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    },
    dueDate: '2024-01-14',
    location: 'Tech Campus',
    attachments: 3,
    tags: ['Quality', 'Audit']
  },
  {
    id: '4',
    title: 'Maintenance Check #1243',
    description: 'Scheduled maintenance for warehouse systems',
    status: 'completed',
    priority: 'low',
    assignee: {
      name: 'David Kim',
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    },
    dueDate: '2024-01-13',
    location: 'Warehouse District',
    attachments: 0,
    tags: ['Maintenance', 'Systems']
  },
  {
    id: '5',
    title: 'Security Review #1251',
    description: 'Monthly security protocol review',
    status: 'escalated',
    priority: 'high',
    assignee: {
      name: 'Marcus Rodriguez',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    },
    dueDate: '2024-01-12',
    location: 'Main Office',
    attachments: 1,
    tags: ['Security', 'Review']
  }
];

const statusColumns = [
  { id: 'pending', title: 'Pending', color: 'bg-gray-900 border-gray-700', icon: <Clock className="h-4 w-4 text-white" /> },
  { id: 'ongoing', title: 'In Progress', color: 'bg-blue-900 border-blue-700', icon: <AlertCircle className="h-4 w-4 text-blue-200" /> },
  { id: 'completed', title: 'Completed', color: 'bg-gray-800 border-gray-600', icon: <CheckCircle className="h-4 w-4 text-white" /> },
  { id: 'escalated', title: 'Escalated', color: 'bg-black border-gray-600', icon: <Flag className="h-4 w-4 text-white" /> }
];

export function TaskKanban() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('all');

  const filteredTasks = mockTasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = selectedPriority === 'all' || task.priority === selectedPriority;
    return matchesSearch && matchesPriority;
  });

  const getTasksByStatus = (status) => {
    return filteredTasks.filter(task => task.status === status);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-white text-black border border-gray-300';
      case 'medium':
        return 'bg-blue-100 text-blue-900 border border-blue-200';
      case 'low':
        return 'bg-gray-200 text-gray-800 border border-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-300';
    }
  };

  const TaskCard = ({ task }) => (
    <Card className="mb-4 bg-white border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer group">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Badge className={getPriorityColor(task.priority)}>
              {task.priority}
            </Badge>
            {task.tags.map((tag, index) => (
              <Badge key={index} className="bg-blue-50 text-blue-800 border border-blue-200 text-xs">
                {tag}
              </Badge>
            ))}
          </div>
          <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-100">
            <MoreVertical className="h-4 w-4 text-gray-600" />
          </Button>
        </div>

        <h3 className="font-semibold text-black mb-2 line-clamp-2">{task.title}</h3>
        <p className="text-sm text-gray-700 mb-3 line-clamp-2">{task.description}</p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-xs text-gray-600">
            <MapPin className="h-3 w-3 mr-1" />
            {task.location}
          </div>
          <div className="flex items-center text-xs text-gray-600">
            <Calendar className="h-3 w-3 mr-1" />
            Due: {new Date(task.dueDate).toLocaleDateString()}
          </div>
          {task.attachments > 0 && (
            <div className="flex items-center text-xs text-gray-600">
              <Paperclip className="h-3 w-3 mr-1" />
              {task.attachments} attachment{task.attachments > 1 ? 's' : ''}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Avatar className="h-6 w-6 border border-gray-200">
              <AvatarImage src={task.assignee.avatar} alt={task.assignee.name} />
              <AvatarFallback className="text-xs bg-gray-100 text-gray-700">
                {task.assignee.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs text-gray-700">{task.assignee.name}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6 bg-gray-50 min-h-screen p-6">
      {/* Header Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center space-x-4">
          <Button className="bg-black hover:bg-gray-800 text-white border-0">
            <Plus className="h-4 w-4 mr-2" />
            Create Task
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white border-0">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>

        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64 bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="px-3 py-2 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>
        </div>
      </div>

      {/* Task Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {statusColumns.map((column) => {
          const count = getTasksByStatus(column.id).length;
          return (
            <Card key={column.id} className="bg-white border border-gray-200 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-700">{column.title}</p>
                    <p className="text-2xl font-bold text-black">{count}</p>
                  </div>
                  <div className="p-2 bg-gray-900 rounded-lg">
                    <Clock className="h-4 w-4 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {statusColumns.map((column) => (
          <div key={column.id} className="space-y-4">
            <Card className={`${column.color} border-2`}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-sm font-semibold text-white">
                  {column.icon}
                  <span className="ml-2">{column.title}</span>
                  <Badge className="ml-auto bg-white text-black">
                    {getTasksByStatus(column.id).length}
                  </Badge>
                </CardTitle>
              </CardHeader>
            </Card>

            <div className="space-y-3 min-h-96">
              {getTasksByStatus(column.id).map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
              
              {getTasksByStatus(column.id).length === 0 && (
                <div className="text-center py-8 text-gray-600">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Clock className="h-6 w-6 text-gray-500" />
                  </div>
                  <p className="text-sm">No tasks in {column.title.toLowerCase()}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}