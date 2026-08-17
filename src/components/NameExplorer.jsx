import React, { useState, useEffect } from 'react';
import { Compass, Search, Globe, Tag, Sparkles, BookOpen, RefreshCw, ChevronLeft, ChevronRight, Layers, Filter } from 'lucide-react';

export default function NameExplorer() {
  const [catalog, setCatalog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGender, setSelectedGender] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  
  // Pagination State
  const [page, setPage] = useState(1);
  const [limit] = useState(24);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const fetchExplorerData = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        q: searchTerm.trim(),
        gender: selectedGender,
        category: selectedCategory
      });

      const response = await fetch(`/api/v1/explorer?${queryParams.toString()}`);
      const data = await response.json();
      
      if (data.success && data.catalog) {
        setCatalog(data.catalog);
        setTotalRecords(data.total_records || 0);
        setTotalPages(data.total_pages || 1);
      }
    } catch (err) {
      console.error('Failed to load explorer catalog:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch when page, gender filter, or category filter changes
  useEffect(() => {
    fetchExplorerData();
  }, [page, selectedGender, selectedCategory]);

  // Debounced search when user types search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      fetchExplorerData();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handlePrevPage = () => {
    if (page > 1) {
      setPage((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fadeIn">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#F0F6FC] tracking-tight font-['Outfit']">
          Comprehensive Name Dataset Catalogue
        </h2>
        <p className="text-[#8B949E] max-w-2xl mx-auto text-sm sm:text-base">
          Explore all dataset records across 10.48M ground-truth entries, cultural frequencies, and etymologies.
        </p>
      </div>

      {/* Filter and Search Panel */}
      <div className="bg-[#161B22] p-6 rounded-2xl border border-[#30363D] space-y-4">
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <input
              type="text"
              placeholder="Search names, origins, or meanings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#0D1117] border border-[#30363D] px-4 py-2.5 pl-11 rounded-xl text-[#F0F6FC] text-xs font-medium focus:outline-none focus:border-[#C7ED3D]"
            />
            <Search className="w-4 h-4 text-[#8B949E] absolute left-3.5 top-3" />
          </div>

          {/* Total Count Badge */}
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-[#0D1117] border border-[#30363D] text-xs text-[#8B949E] font-mono font-semibold">
            <Layers className="w-3.5 h-3.5 text-[#C7ED3D]" />
            <span>Showing <strong className="text-[#F0F6FC]">{totalRecords.toLocaleString()}</strong> Dataset Names</span>
          </div>

        </div>

        {/* Filter Pills Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-[#30363D] pt-4">
          
          {/* Gender Filter */}
          <div className="flex items-center space-x-2">
            <span className="text-xs uppercase font-bold text-[#8B949E] flex items-center space-x-1">
              <Filter className="w-3.5 h-3.5" />
              <span>Gender:</span>
            </span>
            <div className="flex items-center space-x-1.5">
              {['ALL', 'MALE', 'FEMALE'].map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => { setSelectedGender(g); setPage(1); }}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition ${
                    selectedGender === g
                      ? 'bg-[#21262D] text-[#C7ED3D] border border-[#C7ED3D]/50 shadow-sm'
                      : 'bg-[#0D1117] text-[#8B949E] border border-[#30363D] hover:text-[#F0F6FC]'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Origin / Language Filter */}
          <div className="flex items-center space-x-2">
            <span className="text-xs uppercase font-bold text-[#8B949E]">Origin:</span>
            <div className="flex flex-wrap items-center gap-1.5">
              {['ALL', 'SANSKRIT', 'LATIN', 'GREEK', 'GERMANIC', 'ARABIC'].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => { setSelectedCategory(cat); setPage(1); }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition ${
                    selectedCategory === cat
                      ? 'bg-[#21262D] text-[#C7ED3D] border border-[#C7ED3D]/50 shadow-sm'
                      : 'bg-[#0D1117] text-[#8B949E] border border-[#30363D] hover:text-[#F0F6FC]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Catalog Cards Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-3">
          <RefreshCw className="w-8 h-8 text-[#C7ED3D] animate-spin" />
          <span className="text-[#8B949E] text-sm font-medium">Fetching dataset records...</span>
        </div>
      ) : catalog.length === 0 ? (
        <div className="py-16 text-center text-[#8B949E] bg-[#161B22] rounded-2xl border border-[#30363D] space-y-2">
          <p className="text-base font-semibold text-[#F0F6FC]">No names match your search criteria.</p>
          <p className="text-xs text-[#8B949E]">Try clearing filters or searching for another name token.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {catalog.map((item, idx) => (
              <div key={`${item.name}-${idx}`} className="bg-[#161B22] p-6 rounded-2xl space-y-4 relative flex flex-col justify-between border border-[#30363D] hover:border-[#C7ED3D] transition">
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-black text-[#F0F6FC] capitalize font-['Outfit']">{item.name}</h3>
                    <span className={`px-2.5 py-1 rounded-md border text-[10px] font-mono font-extrabold uppercase ${
                      item.prediction === 'MALE' ? 'bg-[#58A6FF]/10 border-[#58A6FF]/30 text-[#58A6FF]' : 'bg-[#F778BA]/10 border-[#F778BA]/30 text-[#F778BA]'
                    }`}>
                      {item.prediction}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 text-xs text-[#8B949E]">
                    <Globe className="w-3.5 h-3.5 text-[#C7ED3D]" />
                    <span>{item.origin}</span>
                  </div>

                  <p className="text-[#8B949E] text-xs font-medium leading-relaxed pt-1">
                    {item.meaning || 'Dataset record with verified ground-truth gender classification.'}
                  </p>
                </div>

                {/* Regional demographic coverage */}
                {item.regional && (
                  <div className="pt-3 border-t border-[#30363D] space-y-1.5">
                    <span className="text-[10px] font-bold uppercase text-[#8B949E] tracking-wider block">Demographic Coverage</span>
                    <div className="flex flex-wrap gap-1.5">
                      {Object.entries(item.regional).map(([reg, val]) => (
                        <span key={reg} className="px-2 py-0.5 rounded bg-[#0D1117] text-[#8B949E] text-[10px] border border-[#30363D] font-mono font-semibold">
                          {reg}: {val}%
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-[#161B22] rounded-xl border border-[#30363D]">
            <span className="text-xs text-[#8B949E] font-medium font-mono">
              Page <strong className="text-[#F0F6FC]">{page}</strong> of <strong className="text-[#F0F6FC]">{totalPages.toLocaleString()}</strong> ({totalRecords.toLocaleString()} Total Names)
            </span>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={handlePrevPage}
                disabled={page <= 1}
                className="px-4 py-2 rounded-xl bg-[#21262D] hover:bg-[#30363D] disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold text-[#F0F6FC] border border-[#30363D] flex items-center space-x-1 transition"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <button
                type="button"
                onClick={handleNextPage}
                disabled={page >= totalPages}
                className="px-4 py-2 rounded-xl bg-[#21262D] hover:bg-[#30363D] disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold text-[#F0F6FC] border border-[#30363D] flex items-center space-x-1 transition"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </>
      )}

    </div>
  );
}
