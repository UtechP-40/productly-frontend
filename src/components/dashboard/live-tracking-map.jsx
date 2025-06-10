"use client";

import React, { useState, useEffect } from 'react';
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
  Route,
  Phone,
  MessageCircle,
  X,
  Maximize2,
  Battery,
  Signal
} from 'lucide-react';

// Delhi locations with real coordinates
const delhiLocations = [
  { name: 'Connaught Place', lat: 28.6315, lng: 77.2167, area: 'Central Delhi' },
  { name: 'India Gate', lat: 28.6129, lng: 77.2295, area: 'New Delhi' },
  { name: 'Red Fort', lat: 28.6562, lng: 77.2410, area: 'Old Delhi' },
  { name: 'Lotus Temple', lat: 28.5535, lng: 77.2588, area: 'South Delhi' },
  { name: 'Akshardham Temple', lat: 28.6127, lng: 77.2773, area: 'East Delhi' },
  { name: 'Qutub Minar', lat: 28.5244, lng: 77.1855, area: 'South Delhi' },
  { name: 'Chandni Chowk', lat: 28.6506, lng: 77.2303, area: 'Old Delhi' },
  { name: 'Karol Bagh', lat: 28.6519, lng: 77.1909, area: 'Central Delhi' },
  { name: 'Lajpat Nagar', lat: 28.5678, lng: 77.2436, area: 'South Delhi' },
  { name: 'Janakpuri', lat: 28.6219, lng: 77.0858, area: 'West Delhi' },
  { name: 'Rohini', lat: 28.7041, lng: 77.1025, area: 'North Delhi' },
  { name: 'Dwarka', lat: 28.5921, lng: 77.0460, area: 'South West Delhi' }
];

const generateRandomAgent = (id) => {
  const names = [
    'Arjun Sharma', 'Priya Patel', 'Rahul Singh', 'Sneha Gupta', 'Vikram Kumar',
    'Anita Verma', 'Rajesh Agarwal', 'Kavya Nair', 'Amit Joshi', 'Ritu Mehta',
    'Suresh Yadav', 'Pooja Saxena', 'Nikhil Bansal', 'Deepika Rao', 'Manish Tiwari'
  ];
  
  const tasks = [
    'Site Inspection', 'Equipment Check', 'Maintenance Audit', 'Quality Control',
    'Safety Assessment', 'Client Meeting', 'Installation Task', 'Repair Work',
    'Documentation', 'Training Session', 'Compliance Check', 'Survey Task'
  ];

  const teams = ['Alpha Team', 'Beta Team', 'Gamma Team', 'Delta Team'];
  const location = delhiLocations[Math.floor(Math.random() * delhiLocations.length)];
  
  return {
    id: id.toString(),
    name: names[Math.floor(Math.random() * names.length)],
    status: Math.random() > 0.3 ? 'online' : 'offline',
    currentTask: `${tasks[Math.floor(Math.random() * tasks.length)]} #${1200 + Math.floor(Math.random() * 100)}`,
    location: location.name,
    area: location.area,
    coordinates: { lat: location.lat, lng: location.lng },
    lastUpdate: Math.random() > 0.5 ? `${Math.floor(Math.random() * 30)} minutes ago` : `${Math.floor(Math.random() * 5)} minutes ago`,
    team: teams[Math.floor(Math.random() * teams.length)],
    battery: 20 + Math.floor(Math.random() * 80),
    signal: Math.floor(Math.random() * 5) + 1
  };
};

export function LiveTrackingMap() {
  const [fieldAgents, setFieldAgents] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [filterTeam, setFilterTeam] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLiveTracking, setIsLiveTracking] = useState(true);
  const [showMap, setShowMap] = useState(false);
  const [mapAgent, setMapAgent] = useState(null);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  // Initialize agents
  useEffect(() => {
    const agents = Array.from({ length: 12 }, (_, i) => generateRandomAgent(i + 1));
    setFieldAgents(agents);
  }, []);

  // Live tracking simulation
  useEffect(() => {
    if (!isLiveTracking) return;

    const interval = setInterval(() => {
      setFieldAgents(prev => prev.map(agent => ({
        ...agent,
        lastUpdate: Math.random() > 0.7 ? 'Just now' : agent.lastUpdate,
        battery: Math.max(10, agent.battery - (Math.random() > 0.9 ? 1 : 0)),
        coordinates: {
          lat: agent.coordinates.lat + (Math.random() - 0.5) * 0.001,
          lng: agent.coordinates.lng + (Math.random() - 0.5) * 0.001
        }
      })));
      setLastRefresh(new Date());
    }, 5000);

    return () => clearInterval(interval);
  }, [isLiveTracking]);

  const filteredAgents = fieldAgents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         agent.currentTask.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         agent.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTeam = filterTeam === 'all' || agent.team === filterTeam;
    return matchesSearch && matchesTeam;
  });

  const onlineAgents = fieldAgents.filter(agent => agent.status === 'online').length;
  const teams = [...new Set(fieldAgents.map(agent => agent.team))];

  const handleTrackAgent = (agent) => {
    setMapAgent(agent);
    setShowMap(true);
  };

  const handleRefresh = () => {
    const newAgents = Array.from({ length: 12 }, (_, i) => generateRandomAgent(i + 1));
    setFieldAgents(newAgents);
    setLastRefresh(new Date());
  };

  const handleContact = (agent, type) => {
    if (type === 'call') {
      alert(`Calling ${agent.name}...`);
    } else {
      alert(`Sending message to ${agent.name}...`);
    }
  };

const MapModal = ({ agent, onClose }) => {
  const { name, location, area, coordinates, status, battery, signal } = agent;
  const mapUrl = `https://maps.google.com/maps?q=${coordinates.lat},${coordinates.lng}&z=15&output=embed`;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl h-[600px] m-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-3">
            <MapPin className="h-5 w-5 text-blue-600" />
            <div>
              <h3 className="font-semibold text-gray-900">{name}</h3>
              <p className="text-sm text-gray-600">{location}, {area}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-col md:flex-row h-full">
          {/* Map */}
          <div className="w-full md:w-2/3 h-[400px] md:h-full">
            <iframe
              src={mapUrl}
              width="100%"
              height="100%"
              frameBorder="0"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              title="Agent Location"
            ></iframe>
          </div>

          {/* Info Panel */}
          <div className="w-full md:w-1/3 bg-gray-50 p-4 flex flex-col justify-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Live Status</h3>
            <div className="space-y-3 text-sm text-gray-700">
              <div className="flex justify-between">
                <span>Status:</span>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    status === 'online'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {status}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Battery:</span>
                <span className="font-medium">{battery}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Signal:</span>
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-1 h-3 rounded-full ${
                        i < signal ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <div className="text-xs text-gray-500 pt-4">
                Lat: {coordinates.lat.toFixed(4)}, Lng: {coordinates.lng.toFixed(4)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

  return (
    <div className="space-y-6 bg-gray-50 min-h-screen p-6">
      {/* Header Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${isLiveTracking ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
            <span className="text-sm font-medium text-gray-700">
              {isLiveTracking ? 'Live Tracking Active' : 'Tracking Paused'}
            </span>
          </div>
          <button
            onClick={() => setIsLiveTracking(!isLiveTracking)}
            className="flex items-center px-3 py-2 border border-blue-500 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm"
          >
            {isLiveTracking ? <PauseCircle className="h-4 w-4 mr-2" /> : <PlayCircle className="h-4 w-4 mr-2" />}
            {isLiveTracking ? 'Pause' : 'Resume'}
          </button>
          <button 
            onClick={handleRefresh}
            className="flex items-center px-3 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors text-sm"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </button>
          <span className="text-xs text-gray-500">
            Last updated: {lastRefresh.toLocaleTimeString()}
          </span>
        </div>

        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              placeholder="Search agents, tasks, or locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>
          <select
            value={filterTeam}
            onChange={(e) => setFilterTeam(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Online Agents</p>
              <p className="text-2xl font-bold text-green-600">{onlineAgents}</p>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <Activity className="h-5 w-5 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Agents</p>
              <p className="text-2xl font-bold text-gray-900">{fieldAgents.length}</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Routes</p>
              <p className="text-2xl font-bold text-blue-600">{onlineAgents * 2}</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <Route className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Response</p>
              <p className="text-2xl font-bold text-gray-900">3.2m</p>
            </div>
            <div className="p-2 bg-gray-100 rounded-lg">
              <Clock className="h-5 w-5 text-gray-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map View */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-blue-600" />
              Delhi Live Location Overview
            </h3>
            <p className="text-gray-600 text-sm mt-1">
              Real-time tracking of field agents across Delhi NCR region
            </p>
          </div>
          <div className="p-6">
            <div className="h-96 bg-gradient-to-br from-blue-50 to-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
              <div className="text-center">
                <MapPin className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Delhi Agent Distribution</h3>
                <p className="text-gray-600 mb-4">Interactive map showing all {onlineAgents} active agents</p>
                <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-gray-700">Online ({onlineAgents})</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                    <span className="text-gray-700">Offline ({fieldAgents.length - onlineAgents})</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  Click "Track" on any agent to view their exact location
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Agent List */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Users className="h-5 w-5 mr-2 text-blue-600" />
              Field Agents
            </h3>
            <p className="text-gray-600 text-sm mt-1">
              {filteredAgents.length} of {fieldAgents.length} agents shown
            </p>
          </div>
          <div className="p-6">
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {filteredAgents.map((agent) => (
                <div
                  key={agent.id}
                  className={`p-4 rounded-lg border transition-all duration-200 ${
                    selectedAgent === agent.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="relative">
                      <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                        {agent.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                        agent.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                      }`}></div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-semibold text-gray-900 truncate">{agent.name}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          agent.status === 'online' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {agent.status}
                        </span>
                      </div>
                      
                      <p className="text-xs text-blue-600 font-medium mt-1">{agent.currentTask}</p>
                      <p className="text-xs text-gray-600 mt-1 flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {agent.location}, {agent.area}
                      </p>
                      <p className="text-xs text-gray-500 mt-1 flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {agent.lastUpdate}
                      </p>
                      
                      <div className="mt-2 flex items-center justify-between">
                        <button 
                          onClick={() => setSelectedAgent(selectedAgent === agent.id ? null : agent.id)}
                          className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                        >
                          {selectedAgent === agent.id ? 'Hide Details' : 'Show Details'}
                        </button>
                        <div className="flex items-center space-x-1">
                          <Battery className="h-3 w-3 text-gray-500" />
                          <span className={`text-xs ${
                            agent.battery > 50 ? 'text-green-600' : 
                            agent.battery > 20 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {agent.battery}%
                          </span>
                        </div>
                      </div>
                      
                      {selectedAgent === agent.id && (
                        <div className="mt-3 pt-3 border-t border-gray-200 space-y-2">
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Team:</span>
                              <span className="font-medium">{agent.team}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Signal:</span>
                              <div className="flex items-center space-x-1">
                                {[...Array(5)].map((_, i) => (
                                  <div
                                    key={i}
                                    className={`w-1 h-2 rounded-full ${
                                      i < agent.signal ? 'bg-blue-600' : 'bg-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="flex space-x-2 mt-3">
                            <button 
                              onClick={() => handleTrackAgent(agent)}
                              className="flex-1 flex items-center justify-center px-3 py-2 text-xs border border-blue-500 text-blue-600 rounded hover:bg-blue-50 transition-colors"
                            >
                              <Navigation className="h-3 w-3 mr-1" />
                              Track
                            </button>
                            <button 
                              onClick={() => handleContact(agent, 'call')}
                              className="flex items-center justify-center px-3 py-2 text-xs border border-green-500 text-green-600 rounded hover:bg-green-50 transition-colors"
                            >
                              <Phone className="h-3 w-3" />
                            </button>
                            <button 
                              onClick={() => handleContact(agent, 'message')}
                              className="flex items-center justify-center px-3 py-2 text-xs border border-gray-300 text-gray-600 rounded hover:bg-gray-50 transition-colors"
                            >
                              <MessageCircle className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Map Modal */}
      {showMap && mapAgent && (
        <MapModal 
          agent={mapAgent} 
          onClose={() => setShowMap(false)} 
        />
      )}
    </div>
  );
}
// const MapEmbed = ({ lat = 28.6668, lng = 77.2167 }) => {
//   const mapUrl = `https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`;

//   return (
//     <iframe
//       width="100%"
//       height="400"
//       frameBorder="0"
//       scrolling="no"
//       marginHeight={0}
//       marginWidth={0}
//       src={mapUrl}
//       title="location"
//     />
//   );
// };
