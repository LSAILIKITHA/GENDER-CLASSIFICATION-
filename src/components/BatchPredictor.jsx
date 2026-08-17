import React, { useState } from 'react';
import { Layers, Download, Upload, Filter, CheckCircle2, AlertTriangle, FileSpreadsheet, RefreshCw, Trash2, Search } from 'lucide-react';

export default function BatchPredictor() {
  const [rawText, setRawText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [batchResponse, setBatchResponse] = useState(null);
  const [searchFilter, setSearchFilter] = useState('');
  const [genderFilter, setGenderFilter] = useState('ALL');

  const handleProcessBatch = async () => {
    // Extract names from raw text (lines or commas)
    const rawLines = rawText
      .split(/[\n,]/)
      .map((n) => n.trim())
      .filter((n) => n.length > 0);

    if (rawLines.length === 0) {
      setError('Please enter or paste at least one name.');
      return;
    }

    if (rawLines.length > 250) {
      setError('Maximum batch size is 250 names per request.');
      return;
    }

    setLoading(true);
    setError(null);

    const nameObjects = rawLines.map((n) => ({ name: n, country: 'Global' }));

    try {
      const response = await fetch('/api/v1/batch-predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ names: nameObjects }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to process batch names');
      }

      setBatchResponse(data);
    } catch (err) {
      setError(err.message || 'Error executing batch classification.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target.result;
      const lines = content.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);

      // Detect CSV with header row containing a 'name' column
      if (lines.length > 0) {
        const firstLine = lines[0].toLowerCase();
        const headers = firstLine.split(',').map(h => h.replace(/["']/g, '').trim());
        const nameColIdx = headers.findIndex(h => h === 'name' || h === 'student name' || h === 'full name');

        if (nameColIdx !== -1) {
          // CSV with header: extract just the name column
          const names = lines.slice(1)
            .map(row => {
              const cols = row.split(',');
              return (cols[nameColIdx] || '').replace(/["']/g, '').trim();
            })
            .filter(n => n.length > 0);
          setRawText(names.join('\n'));
          return;
        }
      }
      // No header detected: use raw content (one name per line)
      setRawText(content);
    };
    reader.readAsText(file);
  };

  const handleClear = () => {
    setRawText('');
    setBatchResponse(null);
    setError(null);
  };

  const exportCSV = () => {
    if (!batchResponse || !batchResponse.results) return;

    const headers = ['Raw Input', 'Cleaned Name', 'Status', 'Prediction', 'Confidence (%)', 'Country', 'Origin', 'Meaning'];
    const csvRows = [headers.join(',')];

    batchResponse.results.forEach((row) => {
      const line = [
        `"${row.raw_input || row.name}"`,
        `"${row.name}"`,
        `"${row.status}"`,
        `"${row.prediction}"`,
        row.confidence,
        `"${row.country}"`,
        `"${row.origin || ''}"`,
        `"${(row.meaning || '').replace(/"/g, '""')}"`
      ];
      csvRows.push(line.join(','));
    });

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `NameLens_Batch_Results_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered results logic
  const filteredResults = (batchResponse?.results || []).filter((r) => {
    const matchesSearch = r.name.toLowerCase().includes(searchFilter.toLowerCase());
    const matchesGender =
      genderFilter === 'ALL' || r.prediction.toUpperCase() === genderFilter;
    return matchesSearch && matchesGender;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fadeIn">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#F0F6FC] tracking-tight font-['Outfit']">
          Batch Name Classification
        </h2>
        <p className="text-[#8B949E] max-w-xl mx-auto text-sm sm:text-base">
          Classify up to 250 names simultaneously with detailed confidence scoring and downloadable CSV reporting.
        </p>
      </div>

      {/* Input Section */}
      <div className="bg-[#161B22] p-6 sm:p-8 rounded-2xl border border-[#30363D] space-y-6">
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <label className="text-xs font-semibold text-[#8B949E] uppercase tracking-wider">
            Enter or Paste Names (One per line or comma-separated)
          </label>

          <label className="cursor-pointer inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-[#21262D] hover:bg-[#30363D] border border-[#30363D] text-xs font-medium text-[#F0F6FC] transition">
            <Upload className="w-3.5 h-3.5 text-[#C7ED3D]" />
            <span>Upload CSV / TXT File</span>
            <input type="file" accept=".csv,.txt" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>

        <textarea
          rows={6}
          value={rawText}
          onChange={(e) => setRawText(e.target.value)}
          placeholder={`Adithya\nPriya\n21BD1A0512 Sai Likitha\nS. Arjun\nA.K. Kavya\nAlex...`}
          className="w-full bg-[#0D1117] border border-[#30363D] p-4 rounded-xl text-[#F0F6FC] font-mono text-sm placeholder-[#8B949E] resize-y focus:outline-none focus:border-[#C7ED3D]"
        />

        {/* Student-format tip */}
        <div className="flex items-start space-x-2 px-1">
          <span className="text-[#C7ED3D] text-xs mt-0.5">&#9432;</span>
          <p className="text-xs text-[#8B949E] leading-relaxed">
            <span className="text-[#C7ED3D] font-semibold">Student format supported:</span> Roll numbers
            (e.g. <code className="text-[#C7ED3D] font-mono">21BD1A0512 Likitha</code>) and initials
            (e.g. <code className="text-[#C7ED3D] font-mono">S. Priya</code>, <code className="text-[#C7ED3D] font-mono">A.K. Arjun</code>)
            are automatically stripped before prediction.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-[#8B949E] font-medium font-mono">
            {rawText.split(/[\n,]/).filter((n) => n.trim()).length} names detected
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto">
            {rawText && (
              <button
                type="button"
                onClick={handleClear}
                className="px-4 py-3 rounded-xl bg-[#21262D] hover:bg-[#30363D] text-[#8B949E] hover:text-[#F0F6FC] text-xs font-medium flex items-center space-x-1.5 transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            )}

            <button
              type="button"
              disabled={loading}
              onClick={handleProcessBatch}
              className="flex-1 sm:flex-none px-8 py-3.5 rounded-xl bg-[#C7ED3D] hover:bg-[#D4F455] text-[#0D1117] font-extrabold text-sm shadow-lg shadow-[#C7ED3D]/25 flex items-center justify-center space-x-2 transition transform active:scale-95"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-[#0D1117]" />
                  <span>Processing Batch...</span>
                </>
              ) : (
                <>
                  <Layers className="w-4 h-4 text-[#0D1117]" />
                  <span>Run Batch Classification</span>
                </>
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-[#F85149]/10 border border-[#F85149]/30 text-[#F85149] text-sm flex items-center space-x-3">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 text-[#F85149]" />
            <span>{error}</span>
          </div>
        )}

      </div>

      {/* Batch Results Output */}
      {batchResponse && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Summary Stat Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-[#161B22] p-4 rounded-xl border border-[#30363D] space-y-1">
              <span className="text-xs uppercase text-[#8B949E] font-bold">Total Processed</span>
              <p className="text-2xl font-black text-[#F0F6FC] font-mono">{batchResponse.summary.total}</p>
            </div>
            <div className="bg-[#161B22] p-4 rounded-xl border border-[#30363D] space-y-1">
              <span className="text-xs uppercase text-[#8B949E] font-bold">Valid Names</span>
              <p className="text-2xl font-black text-[#3FB950] font-mono">{batchResponse.summary.valid}</p>
            </div>
            <div className="bg-[#161B22] p-4 rounded-xl border border-[#30363D] space-y-1">
              <span className="text-xs uppercase text-[#8B949E] font-bold">High Confidence (&gt;80%)</span>
              <p className="text-2xl font-black text-[#C7ED3D] font-mono">{batchResponse.summary.high_confidence}</p>
            </div>
            <div className="bg-[#161B22] p-4 rounded-xl border border-[#30363D] space-y-1">
              <span className="text-xs uppercase text-[#8B949E] font-bold">Uncertain / Ambiguous</span>
              <p className="text-2xl font-black text-[#D29922] font-mono">{batchResponse.summary.low_confidence}</p>
            </div>
          </div>

          {/* Filter & Export Bar */}
          <div className="bg-[#161B22] p-4 rounded-xl border border-[#30363D] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              
              {/* Search filter */}
              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  placeholder="Filter name..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="w-full bg-[#0D1117] border border-[#30363D] px-3.5 py-2 pl-9 rounded-xl text-[#F0F6FC] text-xs font-medium focus:outline-none focus:border-[#C7ED3D]"
                />
                <Search className="w-3.5 h-3.5 text-[#8B949E] absolute left-3 top-2.5" />
              </div>

              {/* Gender filter dropdown */}
              <select
                value={genderFilter}
                onChange={(e) => setGenderFilter(e.target.value)}
                className="w-full sm:w-auto bg-[#0D1117] border border-[#30363D] px-3 py-2 rounded-xl text-[#F0F6FC] text-xs font-medium focus:outline-none focus:border-[#C7ED3D]"
              >
                <option value="ALL">All Genders</option>
                <option value="MALE">Male Only</option>
                <option value="FEMALE">Female Only</option>
                <option value="NEUTRAL">Neutral Only</option>
              </select>

            </div>

            {/* Export CSV Button */}
            <button
              onClick={exportCSV}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#21262D] hover:bg-[#30363D] border border-[#3FB950]/40 hover:border-[#3FB950] text-[#3FB950] text-xs font-bold flex items-center justify-center space-x-2 shadow-md transition"
            >
              <FileSpreadsheet className="w-4 h-4 text-[#3FB950]" />
              <span>Export Results to CSV</span>
            </button>
          </div>

          {/* Results Table */}
          <div className="bg-[#161B22] rounded-2xl border border-[#30363D] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0D1117] text-[#8B949E] uppercase font-mono font-bold border-b border-[#30363D]">
                  <tr>
                    <th className="p-4">#</th>
                    <th className="p-4">Name / Cleaned As</th>
                    <th className="p-4">Prediction</th>
                    <th className="p-4">Confidence</th>
                    <th className="p-4">Origin</th>
                    <th className="p-4">Meaning</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#30363D]/60">
                  {filteredResults.map((item, idx) => {
                    const isFemale = item.prediction.toLowerCase() === 'female';
                    const isMale = item.prediction.toLowerCase() === 'male';
                    return (
                      <tr key={idx} className="hover:bg-[#21262D]/60 transition">
                        <td className="p-4 text-[#8B949E] font-mono">{idx + 1}</td>
                        <td className="p-4">
                          <span className="font-bold text-[#F0F6FC] text-sm capitalize">{item.name}</span>
                          {item.raw_input && item.raw_input !== item.name && (
                            <div className="text-[10px] text-[#8B949E] mt-0.5 font-mono truncate max-w-[180px]" title={item.raw_input}>
                              &#9986; was: {item.raw_input}
                            </div>
                          )}
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2.5 py-1 rounded-md font-mono font-extrabold uppercase text-[10px] tracking-wide border ${
                              isFemale
                                ? 'bg-[#F778BA]/10 border-[#F778BA]/30 text-[#F778BA]'
                                : isMale
                                ? 'bg-[#58A6FF]/10 border-[#58A6FF]/30 text-[#58A6FF]'
                                : 'bg-[#C7ED3D]/10 border-[#C7ED3D]/30 text-[#C7ED3D]'
                            }`}
                          >
                            {item.prediction}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-[#F0F6FC] font-mono">{item.confidence}%</span>
                            <div className="w-16 h-1.5 bg-[#0D1117] rounded-full overflow-hidden border border-[#30363D]">
                              <div
                                style={{ width: `${item.confidence}%` }}
                                className={`h-full ${
                                  isFemale ? 'bg-[#F778BA]' : isMale ? 'bg-[#58A6FF]' : 'bg-[#C7ED3D]'
                                }`}
                              ></div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-[#8B949E] font-medium">{item.origin}</td>
                        <td className="p-4 text-[#8B949E] max-w-xs truncate">{item.meaning || 'N/A'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
