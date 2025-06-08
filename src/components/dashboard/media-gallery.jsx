"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { 
  Camera, 
  Video, 
  Download, 
  Eye, 
  Search, 
  Filter, 
  Calendar,
  User,
  MapPin,
  Clock,
  Upload,
  Grid3X3,
  List,
  Play,
  FileText
} from 'lucide-react';

// Mock media data
const mediaFiles = [
  {
    id: '1',
    type: 'image',
    url: 'https://images.pexels.com/photos/1181533/pexels-photo-1181533.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
    thumbnail: 'https://images.pexels.com/photos/1181533/pexels-photo-1181533.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
    filename: 'site_inspection_001.jpg',
    uploadedBy: {
      name: 'Marcus Rodriguez',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    },
    taskId: 'TASK-1247',
    location: 'Downtown Office District',
    uploadDate: '2024-01-15T10:30:00Z',
    size: '2.4 MB',
    tags: ['safety', 'inspection', 'equipment']
  },
  {
    id: '2',
    type: 'video',
    url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
    thumbnail: 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
    filename: 'equipment_check.mp4',
    uploadedBy: {
      name: 'Emily Watson',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    },
    taskId: 'TASK-1245',
    location: 'Industrial Zone B',
    uploadDate: '2024-01-15T09:15:00Z',
    size: '15.7 MB',
    duration: '2:34',
    tags: ['equipment', 'maintenance', 'video']
  },
  {
    id: '3',
    type: 'image',
    url: 'https://images.pexels.com/photos/1181534/pexels-photo-1181534.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
    thumbnail: 'https://images.pexels.com/photos/1181534/pexels-photo-1181534.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
    filename: 'quality_audit_report.jpg',
    uploadedBy: {
      name: 'Sarah Johnson',
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    },
    taskId: 'TASK-1249',
    location: 'Tech Campus',
    uploadDate: '2024-01-14T16:45:00Z',
    size: '3.1 MB',
    tags: ['quality', 'audit', 'documentation']
  },
  {
    id: '4',
    type: 'image',
    url: 'https://images.pexels.com/photos/1181535/pexels-photo-1181535.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
    thumbnail: 'https://images.pexels.com/photos/1181535/pexels-photo-1181535.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
    filename: 'safety_compliance.jpg',
    uploadedBy: {
      name: 'David Kim',
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    },
    taskId: 'TASK-1243',
    location: 'Warehouse District',
    uploadDate: '2024-01-14T11:20:00Z',
    size: '1.8 MB',
    tags: ['safety', 'compliance', 'warehouse']
  },
  {
    id: '5',
    type: 'video',
    url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4',
    thumbnail: 'https://images.pexels.com/photos/1181468/pexels-photo-1181468.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
    filename: 'training_session.mp4',
    uploadedBy: {
      name: 'Alex Chen',
      avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    },
    taskId: 'TASK-1251',
    location: 'Training Center',
    uploadDate: '2024-01-13T14:30:00Z',
    size: '28.5 MB',
    duration: '5:12',
    tags: ['training', 'education', 'team']
  }
];

export function MediaGallery() {
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterEmployee, setFilterEmployee] = useState('all');
  const [selectedMedia, setSelectedMedia] = useState<any>(null);

  const filteredMedia = mediaFiles.filter(file => {
    const matchesSearch = file.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         file.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
                         file.taskId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || file.type === filterType;
    const matchesEmployee = filterEmployee === 'all' || file.uploadedBy.name === filterEmployee;
    return matchesSearch && matchesType && matchesEmployee;
  });

  const employees = [...new Set(mediaFiles.map(file => file.uploadedBy.name))];

  const stats = [
    {
      title: 'Total Files',
      value: mediaFiles.length,
      icon: <FileText className="h-5 w-5" />,
      color: 'text-blue-400'
    },
    {
      title: 'Images',
      value: mediaFiles.filter(file => file.type === 'image').length,
      icon: <Camera className="h-5 w-5" />,
      color: 'text-blue-400'
    },
    {
      title: 'Videos',
      value: mediaFiles.filter(file => file.type === 'video').length,
      icon: <Video className="h-5 w-5" />,
      color: 'text-blue-400'
    },
    {
      title: 'Storage Used',
      value: '52.4 MB',
      icon: <Upload className="h-5 w-5" />,
      color: 'text-white'
    }
  ];

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6 bg-black min-h-screen p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Media Gallery</h2>
          <p className="text-gray-400">View and manage uploaded photos and videos</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center bg-gray-800 rounded-lg p-1">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className={`h-8 ${viewMode === 'grid' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'text-gray-400 hover:text-white hover:bg-gray-700'}`}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className={`h-8 ${viewMode === 'list' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'text-gray-400 hover:text-white hover:bg-gray-700'}`}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-gray-900 border-gray-700 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-300">{stat.title}</p>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                </div>
                <div className={`p-2 bg-gray-800 rounded-lg ${stat.color}`}>
                  {stat.icon}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search files, tasks, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64 bg-gray-900 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
            />
          </div>
          
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-900 text-white"
          >
            <option value="all">All Types</option>
            <option value="image">Images</option>
            <option value="video">Videos</option>
          </select>

          <select
            value={filterEmployee}
            onChange={(e) => setFilterEmployee(e.target.value)}
            className="px-3 py-2 border border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-900 text-white"
          >
            <option value="all">All Employees</option>
            {employees.map(employee => (
              <option key={employee} value={employee}>{employee}</option>
            ))}
          </select>
        </div>

        <div className="text-sm text-gray-400">
          {filteredMedia.length} of {mediaFiles.length} files
        </div>
      </div>

      {/* Media Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMedia.map((file) => (
            <Card key={file.id} className="bg-gray-900 border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer">
              <div className="relative">
                <img
                  src={file.thumbnail}
                  alt={file.filename}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                {file.type === 'video' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-t-lg">
                    <div className="p-3 bg-blue-600 bg-opacity-90 rounded-full">
                      <Play className="h-6 w-6 text-white" />
                    </div>
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <Badge className={file.type === 'image' ? 'bg-blue-900 text-blue-300' : 'bg-gray-700 text-gray-300'}>
                    {file.type === 'image' ? <Camera className="h-3 w-3 mr-1" /> : <Video className="h-3 w-3 mr-1" />}
                    {file.type}
                  </Badge>
                </div>
                {file.duration && (
                  <div className="absolute bottom-2 right-2">
                    <Badge className="bg-black bg-opacity-70 text-white">
                      {file.duration}
                    </Badge>
                  </div>
                )}
              </div>
              
              <CardContent className="p-4">
                <h3 className="font-medium text-white truncate mb-2">{file.filename}</h3>
                
                <div className="flex items-center space-x-2 mb-3">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={file.uploadedBy.avatar} alt={file.uploadedBy.name} />
                    <AvatarFallback className="text-xs bg-gray-700 text-white">
                      {file.uploadedBy.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-gray-300 truncate">{file.uploadedBy.name}</span>
                </div>

                <div className="space-y-1 text-xs text-gray-400 mb-3">
                  <div className="flex items-center">
                    <FileText className="h-3 w-3 mr-1" />
                    {file.taskId}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-3 w-3 mr-1" />
                    {file.location}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {formatDate(file.uploadDate)}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">{file.size}</span>
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-blue-400 hover:text-white hover:bg-gray-800">
                      <Eye className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-blue-400 hover:text-white hover:bg-gray-800">
                      <Download className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mt-2">
                  {file.tags.slice(0, 2).map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs border-gray-600 text-gray-300">
                      {tag}
                    </Badge>
                  ))}
                  {file.tags.length > 2 && (
                    <Badge variant="outline" className="text-xs border-gray-600 text-gray-300">
                      +{file.tags.length - 2}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="bg-gray-900 border-gray-700 shadow-lg">
          <CardContent className="p-0">
            <div className="space-y-0">
              {filteredMedia.map((file, index) => (
                <div key={file.id} className={`flex items-center space-x-4 p-4 hover:bg-gray-800 transition-colors ${
                  index !== filteredMedia.length - 1 ? 'border-b border-gray-700' : ''
                }`}>
                  <div className="relative flex-shrink-0">
                    <img
                      src={file.thumbnail}
                      alt={file.filename}
                      className="w-16 h-12 object-cover rounded"
                    />
                    {file.type === 'video' && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded">
                        <Play className="h-4 w-4 text-white" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-medium text-white truncate">{file.filename}</h3>
                      <Badge className={file.type === 'image' ? 'bg-blue-900 text-blue-300' : 'bg-gray-700 text-gray-300'}>
                        {file.type}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Avatar className="h-4 w-4">
                          <AvatarImage src={file.uploadedBy.avatar} alt={file.uploadedBy.name} />
                          <AvatarFallback className="text-xs bg-gray-700 text-white">
                            {file.uploadedBy.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <span>{file.uploadedBy.name}</span>
                      </div>
                      <span>{file.taskId}</span>
                      <span>{file.location}</span>
                      <span>{formatDate(file.uploadDate)}</span>
                      <span>{file.size}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <div className="flex flex-wrap gap-1">
                      {file.tags.slice(0, 2).map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs border-gray-600 text-gray-300">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex space-x-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-400 hover:text-white hover:bg-gray-800">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-400 hover:text-white hover:bg-gray-800">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {filteredMedia.length === 0 && (
        <Card className="bg-gray-900 border-gray-700 shadow-lg">
          <CardContent className="p-12 text-center">
            <Camera className="h-16 w-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No media files found</h3>
            <p className="text-gray-400 mb-6">Try adjusting your search criteria or filters</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}