import React, { useState, useEffect } from 'react';
import QRCodeDisplay from './QRCodeDisplay';
import userService, { LeadInfo } from '../lib/userService';

interface AdminPanelProps {}

const AdminPanel: React.FC<AdminPanelProps> = () => {
  const [leads, setLeads] = useState<LeadInfo[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<LeadInfo[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [dateSort, setDateSort] = useState<'asc' | 'desc'>('desc');
  const [selectedLead, setSelectedLead] = useState<LeadInfo | null>(null);
  const [showQRModal, setShowQRModal] = useState(false);

  // Load leads on component mount
  useEffect(() => {
    const allLeads = userService.getLeads();
    setLeads(allLeads);
    setFilteredLeads(allLeads);
  }, []);

  // Handle filtering and sorting
  useEffect(() => {
    let results = [...leads];
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(lead => 
        lead.name.toLowerCase().includes(term) || 
        lead.email.toLowerCase().includes(term) ||
        lead.uniqueCode.toLowerCase().includes(term)
      );
    }
    
    // Apply category filter
    if (categoryFilter) {
      results = results.filter(lead => lead.category === categoryFilter);
    }
    
    // Apply date sorting
    results.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateSort === 'asc' ? dateA - dateB : dateB - dateA;
    });
    
    setFilteredLeads(results);
  }, [leads, searchTerm, categoryFilter, dateSort]);

  // Handle lead selection for details
  const handleLeadClick = (lead: LeadInfo) => {
    setSelectedLead(lead);
  };

  // Handle showing QR Code modal
  const handleQRCodeClick = (lead: LeadInfo) => {
    setSelectedLead(lead);
    setShowQRModal(true);
  };

  // Export leads to CSV
  const exportToCSV = () => {
    const headers = ['ID', 'Name', 'Email', 'Phone', 'Code', 'Category', 'Date', 'Source'];
    
    const csvContent = [
      headers.join(','),
      ...filteredLeads.map(lead => [
        lead.id,
        `"${lead.name}"`,
        `"${lead.email}"`,
        lead.phone ? `"${lead.phone}"` : '""',
        `"${lead.uniqueCode}"`,
        `"${lead.category}"`,
        `"${new Date(lead.date).toLocaleString()}"`,
        `"${lead.source}"`
      ].join(','))
    ].join('\n');
    
    // Create a downloadable CSV file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `fitness_ai_leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Generate formatted category label
  const getCategoryLabel = (code: string) => {
    const categories: Record<string, string> = {
      'BEG': 'Beginner',
      'INT': 'Intermediate',
      'ADV': 'Advanced',
      'PRO': 'Professional',
      'VIP': 'VIP'
    };
    
    return categories[code] || code;
  };

  // Format date from ISO string
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage leads and user profiles
          </p>
        </div>
        
        <div className="mt-4 md:mt-0">
          <button
            onClick={exportToCSV}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Export to CSV
          </button>
        </div>
      </div>
      
      {/* Filters and Search */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Search
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, email, or code"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          {/* Category filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Filter by Category
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">All Categories</option>
              <option value="BEG">Beginner</option>
              <option value="INT">Intermediate</option>
              <option value="ADV">Advanced</option>
              <option value="PRO">Professional</option>
              <option value="VIP">VIP</option>
            </select>
          </div>
          
          {/* Date sort */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Date
            </label>
            <select
              value={dateSort}
              onChange={(e) => setDateSort(e.target.value as 'asc' | 'desc')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="desc">Newest First</option>
              <option value="asc">Oldest First</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6">
        {/* Leads Table */}
        <div className="md:w-7/12 bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
            <h2 className="font-medium">Leads ({filteredLeads.length})</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Source
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredLeads.length > 0 ? (
                  filteredLeads.map((lead) => (
                    <tr 
                      key={lead.id}
                      onClick={() => handleLeadClick(lead)}
                      className="hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {lead.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {lead.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {lead.uniqueCode}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full
                          ${lead.category === 'BEG' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                            lead.category === 'INT' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                            lead.category === 'ADV' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
                            lead.category === 'PRO' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' :
                            lead.category === 'VIP' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                            'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                          }`}
                        >
                          {getCategoryLabel(lead.category)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(lead.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {lead.source}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleQRCodeClick(lead);
                          }}
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          View QR
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                      No leads match your search criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Lead Details */}
        <div className="md:w-5/12 bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
            <h2 className="font-medium">Lead Details</h2>
          </div>
          
          {selectedLead ? (
            <div className="p-6">
              <div className="flex items-start mb-6">
                <div className="bg-gray-100 dark:bg-gray-700 rounded-md p-2 mr-4">
                  <div className="w-20 h-20">
                    <QRCodeDisplay 
                      code={selectedLead.uniqueCode} 
                      size={80} 
                      background="#f3f4f6"
                      foreground="#111827"
                    />
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    {selectedLead.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {selectedLead.email}
                  </p>
                  {selectedLead.phone && (
                    <p className="text-gray-600 dark:text-gray-400">
                      {selectedLead.phone}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Access Code
                  </div>
                  <div className="mt-1 text-gray-900 dark:text-white font-medium">
                    {selectedLead.uniqueCode}
                  </div>
                </div>
                
                <div>
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Category
                  </div>
                  <div className="mt-1">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full
                      ${selectedLead.category === 'BEG' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                        selectedLead.category === 'INT' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                        selectedLead.category === 'ADV' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
                        selectedLead.category === 'PRO' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' :
                        selectedLead.category === 'VIP' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                        'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                      }`}
                    >
                      {getCategoryLabel(selectedLead.category)}
                    </span>
                  </div>
                </div>
                
                <div>
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Sign Up Date
                  </div>
                  <div className="mt-1 text-gray-900 dark:text-white">
                    {new Date(selectedLead.date).toLocaleDateString()}
                  </div>
                </div>
                
                <div>
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Lead Source
                  </div>
                  <div className="mt-1 text-gray-900 dark:text-white">
                    {selectedLead.source}
                  </div>
                </div>
              </div>
              
              <div className="mt-6 space-y-3">
                <button
                  onClick={() => {
                    // Copy code to clipboard
                    navigator.clipboard.writeText(selectedLead.uniqueCode);
                    // Show alert or toast
                    alert('Code copied to clipboard');
                  }}
                  className="w-full py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Copy Code
                </button>
                
                <button
                  onClick={() => setShowQRModal(true)}
                  className="w-full py-2 px-4 border border-blue-500 text-blue-500 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900"
                >
                  View QR Code
                </button>
                
                <button
                  onClick={() => {
                    // Email the user their code (in a real app)
                    alert('In a real app, this would send an email with the access code');
                  }}
                  className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Send Code via Email
                </button>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center text-gray-500 dark:text-gray-400">
              Select a lead to view details
            </div>
          )}
        </div>
      </div>
      
      {/* QR Code Modal */}
      {showQRModal && selectedLead && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-md w-full">
            <div className="text-center mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                QR Code for {selectedLead.name}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Code: {selectedLead.uniqueCode}
              </p>
            </div>
            
            <div className="flex justify-center mb-6">
              <div className="bg-white p-4 rounded-md">
                <QRCodeDisplay 
                  code={selectedLead.uniqueCode} 
                  size={250} 
                  background="#ffffff"
                  foreground="#000000"
                />
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                onClick={() => setShowQRModal(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Close
              </button>
              
              <button
                onClick={() => {
                  // Download QR code (in a real app)
                  alert('In a real app, this would download the QR code as an image');
                  setShowQRModal(false);
                }}
                className="ml-3 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Download
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;