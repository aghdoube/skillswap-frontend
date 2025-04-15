import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ProfileCard from '../components/ProfileCard';
import { Search, MapPin, Briefcase, Filter } from 'lucide-react';

const Dashboard = () => {
  const [userProfiles, setUserProfiles] = useState([]);
  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [skillFilter, setSkillFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [filterType, setFilterType] = useState('all'); 
  const [availableSkills, setAvailableSkills] = useState([]);
  const [availableLocations, setAvailableLocations] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [sortOption, setSortOption] = useState('nameAsc');

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      filterProfiles();
    }, 300); 
  
    return () => clearTimeout(debounceTimeout);
  }, [searchTerm, skillFilter, locationFilter, filterType,sortOption, userProfiles]);
  

  useEffect(() => {
    const fetchUserProfiles = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/profiles`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        });
        setUserProfiles(response.data);
        setFilteredProfiles(response.data);
        
        const skills = new Set();
        const locations = new Set();
        
        response.data.forEach(user => {
          if (user.location) locations.add(user.location);
          
          if (user.skillsOffered) {
            user.skillsOffered.forEach(skill => skills.add(skill.skill));
          }
          
          if (user.skillsWanted) {
            user.skillsWanted.forEach(skill => skills.add(skill.skill));
          }
        });
        
        setAvailableSkills(Array.from(skills).sort());
        setAvailableLocations(Array.from(locations).sort());
      } catch (err) {
        console.error('Error fetching profiles:', err);
        setError('Failed to load profiles. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserProfiles();
  }, []);

  useEffect(() => {
    filterProfiles();
  }, [searchTerm, skillFilter, locationFilter, filterType, userProfiles]);

  const filterProfiles = () => {
    let results = [...userProfiles];
    
    if (searchTerm) {
      results = results.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (locationFilter) {
      results = results.filter(user => 
        user.location && user.location.toLowerCase() === locationFilter.toLowerCase()
      );
    }
    
    if (skillFilter) {
      switch (filterType) {
        case 'offering':
          results = results.filter(user => 
            user.skillsOffered && user.skillsOffered.some(skill => 
              skill.skill.toLowerCase() === skillFilter.toLowerCase()
            )
          );
          break;
        case 'wanting':
          results = results.filter(user => 
            user.skillsWanted && user.skillsWanted.some(skill => 
              skill.skill.toLowerCase() === skillFilter.toLowerCase()
            )
          );
          break;
        default: 
          results = results.filter(user => 
            (user.skillsOffered && user.skillsOffered.some(skill => 
              skill.skill.toLowerCase() === skillFilter.toLowerCase()
            )) || 
            (user.skillsWanted && user.skillsWanted.some(skill => 
              skill.skill.toLowerCase() === skillFilter.toLowerCase()
            ))
          );
      }
    }

    switch (sortOption) {
      case 'nameAsc':
        results = results.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'nameDesc':
        results = results.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'newest':
        results = results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'oldest':
        results = results.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      default:
        break;
    }
    
    setFilteredProfiles(results);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSkillFilter('');
    setLocationFilter('');
    setFilterType('all');
    setSortOption('nameAsc');
    setFilteredProfiles(userProfiles);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <div className="dashboard-container p-4 md:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-3xl font-bold mb-4 md:mb-0">Skill Swap Marketplace</h1>
        <button 
          onClick={toggleFilters}
          className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
        >
          <Filter size={18} className="mr-2" />
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>
      </div>

      <div className={`${showFilters ? 'block' : 'hidden'} bg-gray-50 p-4 rounded-lg mb-6 transition-all`}>
        <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search size={18} className="text-gray-500" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Briefcase size={18} className="text-gray-500" />
              </div>
              <select
                value={skillFilter}
                onChange={(e) => setSkillFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Skills</option>
                {availableSkills.map((skill, index) => (
                  <option key={index} value={skill}>{skill}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <MapPin size={18} className="text-gray-500" />
              </div>
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Locations</option>
                {availableLocations.map((location, index) => (
                  <option key={index} value={location}>{location}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <span className="text-gray-700 font-medium">Filter by:</span>
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="all"
                name="filterType"
                value="all"
                checked={filterType === 'all'}
                onChange={() => setFilterType('all')}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="all" className="text-sm text-gray-700">All Skills</label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="offering"
                name="filterType"
                value="offering"
                checked={filterType === 'offering'}
                onChange={() => setFilterType('offering')}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="offering" className="text-sm text-gray-700">Skills Offered</label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="wanting"
                name="filterType"
                value="wanting"
                checked={filterType === 'wanting'}
                onChange={() => setFilterType('wanting')}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="wanting" className="text-sm text-gray-700">Skills Wanted</label>
            </div>
          </div>
          <div className="md:ml-auto">
            <button
              onClick={resetFilters}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      <div className="mb-4 flex justify-between items-center">
  <p className="text-gray-700">
    Showing {filteredProfiles.length} of {userProfiles.length} profiles
  </p>
  <select
    value={sortOption} 
    onChange={(e) => setSortOption(e.target.value)} 
    className="border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
  >
    <option value="nameAsc">Name (A-Z)</option>
    <option value="nameDesc">Name (Z-A)</option>
    <option value="newest">Newest First</option>
    <option value="oldest">Oldest First</option>
  </select>
</div>


      {error && <p className="text-red-500 p-4 bg-red-50 rounded-lg mb-4">{error}</p>}
      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {!loading && (
        <>
          {filteredProfiles.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg p-8 text-center">
              <p className="text-xl text-gray-600 mb-4">No profiles match your search criteria</p>
              <button 
                onClick={resetFilters}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="profile-cards-container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProfiles.map((user) => (
                <ProfileCard key={user._id} user={user} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;
