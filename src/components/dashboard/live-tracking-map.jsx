"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { 
  MapPin, 
  Navigation, 
  Clock, 
  Filter, 
  Search, 
  PlayCircle, 
  PauseCircle,
  RefreshCw,
  Users,
  Activity,
  Route
} from 'lucide-react';

// Mock field agents data
const fieldAgents = [
  {
    id: '1',
    name: 'Marcus Rodriguez',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    status: 'online',
    currentTask: 'Site Inspection #1247',
    location: 'Downtown Office District',
    coordinates: { lat: 40.7128, lng: -74.0060 },
    lastUpdate: '2 minutes ago',
    team: 'Alpha Team',
    battery: 85
  },
  {
    id: '2',
    name: 'Emily Watson',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    status: 'online',
    currentTask: 'Equipment Check #1245',
    location: 'Industrial Zone B',
    coordinates: { lat: 40.7589, lng: -73.9851 },
    lastUpdate: '5 minutes ago',
    team: 'Beta Team',
    battery: 92
  },
  {
    id: '3',
    name: 'David Kim',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    status: 'offline',
    currentTask: 'Maintenance Check #1243',
    location: 'Warehouse District',
    coordinates: { lat: 40.6892, lng: -74.0445 },
    lastUpdate: '1 hour ago',
    team: 'Alpha Team',
    battery: 45
  },
  {
    id: '4',
    name: 'Sarah Johnson',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    status: 'online',
    currentTask: 'Quality Audit #1249',
    location: 'Tech Campus',
    coordinates: { lat: 40.7505, lng: -73.9934 },
    lastUpdate: '1 minute ago',
    team: 'Gamma Team',
    battery: 78
  }
];

export function LiveTrackingMap() {
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [filterTeam, setFilterTeam] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLiveTracking, setIsLiveTracking] = useState(true);

  const filteredAgents = fieldAgents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         agent.currentTask.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTeam = filterTeam === 'all' || agent.team === filterTeam;
    return matchesSearch && matchesTeam;
  });

  const onlineAgents = fieldAgents.filter(agent => agent.status === 'online').length;
  const teams = [...new Set(fieldAgents.map(agent => agent.team))];

  return (
    <div className="space-y-6 bg-black min-h-screen p-6">
      {/* Header Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${isLiveTracking ? 'bg-blue-500 animate-pulse' : 'bg-gray-500'}`}></div>
            <span className="text-sm font-medium text-white">
              {isLiveTracking ? 'Live Tracking Active' : 'Tracking Paused'}
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsLiveTracking(!isLiveTracking)}
            className="border-blue-500 text-blue-400 hover:bg-blue-900 bg-black"
          >
            {isLiveTracking ? <PauseCircle className="h-4 w-4 mr-2" /> : <PlayCircle className="h-4 w-4 mr-2" />}
            {isLiveTracking ? 'Pause' : 'Resume'}
          </Button>
          <Button variant="outline" size="sm" className="border-blue-500 text-blue-400 hover:bg-blue-900 bg-black">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search agents or tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64 bg-gray-900 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
            />
          </div>
          <select
            value={filterTeam}
            onChange={(e) => setFilterTeam(e.target.value)}
            className="px-3 py-2 border border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-900 text-white"
          >
            <option value="all">All Teams</option>
            {teams.map(team => (
              <option key={team} value={team}>{team}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gray-900 border-gray-700 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-300">Online Agents</p>
                <p className="text-2xl font-bold text-blue-400">{onlineAgents}</p>
              </div>
              <div className="p-2 bg-blue-900 rounded-lg">
                <Activity className="h-5 w-5 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-700 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-300">Total Agents</p>
                <p className="text-2xl font-bold text-white">{fieldAgents.length}</p>
              </div>
              <div className="p-2 bg-gray-700 rounded-lg">
                <Users className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-700 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-300">Active Routes</p>
                <p className="text-2xl font-bold text-blue-400">12</p>
              </div>
              <div className="p-2 bg-blue-900 rounded-lg">
                <Route className="h-5 w-5 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-700 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-300">Avg Response</p>
                <p className="text-2xl font-bold text-white">2.4m</p>
              </div>
              <div className="p-2 bg-gray-700 rounded-lg">
                <Clock className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map View */}
        <Card className="lg:col-span-2 bg-gray-900 border-gray-700 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-white">
              <MapPin className="h-5 w-5 mr-2 text-blue-400" />
              Live Location Map
            </CardTitle>
            <CardDescription className="text-gray-300">
              Real-time tracking of field agents and their current locations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-96 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-600">
              <div className="text-center">
                <MapPin className="h-16 w-16 text-blue-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Interactive Map</h3>
                <p className="text-gray-400 mb-4">Mapbox or Leaflet integration will be displayed here</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-300">Online Agents</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                    <span className="text-gray-300">Offline Agents</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Agent List */}
        <Card className="bg-gray-900 border-gray-700 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-white">
              <Users className="h-5 w-5 mr-2 text-blue-400" />
              Field Agents
            </CardTitle>
            <CardDescription className="text-gray-300">
              {filteredAgents.length} of {fieldAgents.length} agents
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {filteredAgents.map((agent) => (
                <div
                  key={agent.id}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                    selectedAgent === agent.id
                      ? 'border-blue-500 bg-blue-900/30'
                      : 'border-gray-600 hover:border-blue-400 hover:bg-gray-800'
                  }`}
                  onClick={() => setSelectedAgent(selectedAgent === agent.id ? null : agent.id)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="relative">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={agent.avatar} alt={agent.name} />
                        <AvatarFallback className="bg-gray-700 text-white">{agent.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-gray-900 ${
                        agent.status === 'online' ? 'bg-blue-500' : 'bg-gray-500'
                      }`}></div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-semibold text-white truncate">{agent.name}</h4>
                        <Badge className={`text-xs ${
                          agent.status === 'online' 
                            ? 'bg-blue-900 text-blue-300' 
                            : 'bg-gray-700 text-gray-300'
                        }`}>
                          {agent.status}
                        </Badge>
                      </div>
                      
                      <p className="text-xs text-blue-400 font-medium mt-1">{agent.currentTask}</p>
                      <p className="text-xs text-gray-400 mt-1 flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {agent.location}
                      </p>
                      <p className="text-xs text-gray-400 mt-1 flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {agent.lastUpdate}
                      </p>
                      
                      {selectedAgent === agent.id && (
                        <div className="mt-3 pt-3 border-t border-gray-600 space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-400">Team:</span>
                            <Badge className="bg-gray-700 text-gray-300">{agent.team}</Badge>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-400">Battery:</span>
                            <span className={`font-medium ${
                              agent.battery > 50 ? 'text-blue-400' : 
                              agent.battery > 20 ? 'text-white' : 'text-gray-400'
                            }`}>
                              {agent.battery}%
                            </span>
                          </div>
                          <div className="flex space-x-2 mt-3">
                            <Button size="sm" variant="outline" className="flex-1 text-xs border-blue-500 text-blue-400 hover:bg-blue-900 bg-black">
                              <Navigation className="h-3 w-3 mr-1" />
                              Track
                            </Button>
                            <Button size="sm" variant="outline" className="flex-1 text-xs border-gray-600 text-gray-300 hover:bg-gray-800 bg-black">
                              <Users className="h-3 w-3 mr-1" />
                              Contact
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}