import React, { useState, useEffect } from 'react';
import { LeadInfo } from '../lib/userService';

interface AdminPanelProps {
  // Optional props
}

const AdminPanel: React.FC<AdminPanelProps> = () => {
  const [leads, setLeads] = useState<LeadInfo[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<LeadInfo[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  
  // Simulate fetching leads from localStorage (in a real app, this would be an API call)
  useEffect(() => {
    const fetchLeads = () => {
      setIsLoading(true);
      
      // Get leads from localStorage
      const storedLeads = localStorage.getItem('fitness_ai_leads');
      const leadData: LeadInfo[] = storedLeads ? JSON.parse(storedLeads) : [];
      
      // Sort by newest first
      leadData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      setLeads(leadData);
      setFilteredLeads(leadData);
      setIsLoading(false);
    };
    
    fetchLeads();
    
    // Set up interval to refresh leads every 30 seconds
    const interval = setInterval(fetchLeads, 30000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Filter leads when search term or category filter changes
  useEffect(() => {
    let filtered = [...leads];
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(lead => 
        lead.name.toLowerCase().includes(term) || 
        lead.email.toLowerCase().includes(term) || 
        lead.uniqueCode.toLowerCase().includes(term)
      );
    }
    
    // Apply category filter
    if (filterCategory !== 'all') {
      filtered = filtered.filter(lead => lead.category === filterCategory);
    }
    
    setFilteredLeads(filtered);
  }, [searchTerm, filterCategory, leads]);
  
  // Format date string
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Export leads as CSV
  const exportLeads = () => {
    if (filteredLeads.length === 0) return;
    
    // Create CSV headers
    const headers = ['Name', 'Email', 'Unique Code', 'Category', 'Date', 'Source', 'Preferences'];
    
    // Create CSV rows
    const rows = filteredLeads.map(lead => [
      lead.name,
      lead.email,
      lead.uniqueCode,
      lead.category,
      lead.date,
      lead.source,
      JSON.stringify(lead.preferences)
    ]);
    
    // Combine headers and rows
    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\\n');
    
    // Create a blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    // Create download link
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `fitness_ai_leads_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    // Append, click, and remove link
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <div className="bg-gray-900 text-white min-h-screen">
      {/* Header */}
      <header className="bg-gray-800 py-6 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold">Admin Panel</h1>
          <p className="text-gray-400">Manage leads and user data</p>
        </div>
      </header>
      
      {/* Main content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6">
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          {/* Stats and filters */}
          <div className="flex flex-col md:flex-row justify-between mb-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 md:mb-0">
              <div className="bg-gray-700 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-400">{leads.length}</div>
                <div className="text-sm text-gray-400">Total Leads</div>
              </div>
              
              <div className="bg-gray-700 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-400">
                  {leads.filter(lead => lead.category === 'BEG').length}
                </div>
                <div className="text-sm text-gray-400">Beginner</div>
              </div>
              
              <div className="bg-gray-700 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-yellow-400">
                  {leads.filter(lead => lead.category === 'INT').length}
                </div>
                <div className="text-sm text-gray-400">Intermediate</div>
              </div>
              
              <div className="bg-gray-700 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-purple-400">
                  {leads.filter(lead => lead.category === 'ADV' || lead.category === 'PRO' || lead.category === 'VIP').length}
                </div>
                <div className="text-sm text-gray-400">Advanced+</div>
              </div>
            </div>
            
            <div className="flex">
              <button 
                onClick={exportLeads}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center"
                disabled={filteredLeads.length === 0}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Export CSV
              </button>
            </div>
          </div>
          
          {/* Search and filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search by name, email, or code"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-gray-700 text-white w-full pl-10 pr-4 py-2 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="bg-gray-700 text-white w-full px-4 py-2 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                <option value="BEG">Beginner</option>
                <option value="INT">Intermediate</option>
                <option value="ADV">Advanced</option>
                <option value="PRO">Professional</option>
                <option value="VIP">VIP</option>
              </select>
            </div>
          </div>
          
          {/* Leads table */}
          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
              </div>
            ) : filteredLeads.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                {leads.length === 0 ? 'No leads found. Complete onboarding to generate leads.' : 'No leads match your search criteria.'}
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Unique Code</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Source</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                  {filteredLeads.map((lead, index) => (
                    <tr key={index} className="hover:bg-gray-750">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium">{lead.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-300">{lead.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-mono">{lead.uniqueCode}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${lead.category === 'BEG' ? 'bg-blue-800 text-blue-100' : 
                          lead.category === 'INT' ? 'bg-yellow-800 text-yellow-100' : 
                          lead.category === 'ADV' ? 'bg-green-800 text-green-100' : 
                          lead.category === 'PRO' ? 'bg-purple-800 text-purple-100' : 
                          'bg-red-800 text-red-100'}`}>
                          {lead.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-300">{formatDate(lead.date)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-300">{lead.source}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-green-400 hover:text-green-300 mr-3">View</button>
                        <button className="text-red-400 hover:text-red-300">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
        
        {/* Additional admin features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Email Marketing</h2>
            <p className="text-gray-400 mb-4">Send emails to leads based on their category and preferences.</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Select Category</label>
                <select className="bg-gray-700 text-white w-full px-4 py-2 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent">
                  <option value="all">All Categories</option>
                  <option value="BEG">Beginner</option>
                  <option value="INT">Intermediate</option>
                  <option value="ADV">Advanced</option>
                  <option value="PRO">Professional</option>
                  <option value="VIP">VIP</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Email Template</label>
                <select className="bg-gray-700 text-white w-full px-4 py-2 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent">
                  <option value="welcome">Welcome Email</option>
                  <option value="code">Code Reminder</option>
                  <option value="upgrade">Upgrade Offer</option>
                  <option value="referral">Referral Program</option>
                </select>
              </div>
              
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full">
                Schedule Email Campaign
              </button>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Analytics</h2>
            <p className="text-gray-400 mb-4">Overview of user engagement and conversions.</p>
            
            <div className="space-y-4">
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">Onboarding Completion Rate</h3>
                  <span className="text-green-400 font-medium">78%</span>
                </div>
                <div className="w-full bg-gray-600 rounded-full h-2.5">
                  <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '78%' }}></div>
                </div>
              </div>
              
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">Premium Conversion Rate</h3>
                  <span className="text-yellow-400 font-medium">23%</span>
                </div>
                <div className="w-full bg-gray-600 rounded-full h-2.5">
                  <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: '23%' }}></div>
                </div>
              </div>
              
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">Referral Program Usage</h3>
                  <span className="text-blue-400 font-medium">42%</span>
                </div>
                <div className="w-full bg-gray-600 rounded-full h-2.5">
                  <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: '42%' }}></div>
                </div>
              </div>
              
              <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded w-full">
                View Detailed Analytics
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminPanel;