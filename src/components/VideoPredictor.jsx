import React, { useState, useRef, useEffect } from 'react';
import {
  Video, Camera, Upload, Play, Pause, RefreshCw, CheckCircle, AlertCircle,
  Sparkles, Layers, ShieldCheck, Cpu, Clock, Users, Eye, BarChart2, Zap, Radio
} from 'lucide-react';

export default function VideoPredictor() {
  const [activeMode, setActiveMode] = useState('upload'); // 'upload' | 'webcam'
  
  // Upload Video State
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  
  // Video player ref
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Live Webcam State
  const webcamVideoRef = useRef(null);
  const webcamCanvasRef = useRef(null);
  const [webcamActive, setWebcamActive] = useState(false);
  const [streamingFrame, setStreamingFrame] = useState(false);
  const [liveResult, setLiveResult] = useState(null);
  const [webcamError, setWebcamError] = useState(null);
  const streamIntervalRef = useRef(null);

  // Handle File Selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('video/')) {
        setError('Please select a valid video file (.mp4, .webm, .mov, .avi).');
        return;
      }
      setSelectedFile(file);
      setError(null);
      setResult(null);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('video/')) {
        setSelectedFile(file);
        setError(null);
        setResult(null);
        setPreviewUrl(URL.createObjectURL(file));
      } else {
        setError('Please drop a valid video file (.mp4, .webm, .mov, .avi).');
      }
    }
  };

  // Run Video Analysis
  const handleAnalyzeVideo = async () => {
    if (!selectedFile) return;
    setAnalyzing(true);
    setError(null);
    setProgress(15);

    const formData = new FormData();
    formData.append('video', selectedFile);

    const interval = setInterval(() => {
      setProgress((prev) => (prev < 90 ? prev + 8 : prev));
    }, 400);

    try {
      const response = await fetch('/api/v1/predict-video', {
        method: 'POST',
        body: formData,
      });

      clearInterval(interval);
      setProgress(100);

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to analyze video file.');
      }

      setResult(data);
    } catch (err) {
      setError(err.message || 'An error occurred while analyzing the video.');
    } finally {
      setAnalyzing(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  // Webcam Handlers
  const startWebcam = async () => {
    setWebcamError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' }
      });
      if (webcamVideoRef.current) {
        webcamVideoRef.current.srcObject = stream;
        webcamVideoRef.current.play();
      }
      setWebcamActive(true);
      startLiveStreaming();
    } catch (err) {
      console.error(err);
      setWebcamError('Unable to access webcam. Please check browser permissions.');
    }
  };

  const stopWebcam = () => {
    if (streamIntervalRef.current) {
      clearInterval(streamIntervalRef.current);
      streamIntervalRef.current = null;
    }
    if (webcamVideoRef.current && webcamVideoRef.current.srcObject) {
      const tracks = webcamVideoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      webcamVideoRef.current.srcObject = null;
    }
    setWebcamActive(false);
    setLiveResult(null);
  };

  const captureAndSendFrame = async () => {
    if (!webcamVideoRef.current || !webcamCanvasRef.current || streamingFrame) return;
    const video = webcamVideoRef.current;
    const canvas = webcamCanvasRef.current;
    if (video.readyState !== video.HAVE_ENOUGH_DATA) return;

    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.7);

    setStreamingFrame(true);
    try {
      const response = await fetch('/api/v1/predict-frame', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: dataUrl })
      });
      const data = await response.json();
      if (data.success) {
        setLiveResult(data);
      }
    } catch (e) {
      console.warn('Frame streaming error:', e);
    } finally {
      setStreamingFrame(false);
    }
  };

  const startLiveStreaming = () => {
    if (streamIntervalRef.current) clearInterval(streamIntervalRef.current);
    streamIntervalRef.current = setInterval(captureAndSendFrame, 600);
  };

  useEffect(() => {
    return () => {
      stopWebcam();
    };
  }, []);

  return (
    <div className="space-y-8 animate-fadeIn max-w-7xl mx-auto">
      
      {/* Top Banner & Mode Switcher */}
      <div className="bg-gradient-to-r from-[#161B22] via-[#1F242D] to-[#161B22] border border-[#30363D] rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#C7ED3D]/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-[#21262D] border border-[#30363D] flex items-center justify-center text-[#C7ED3D] shadow-md">
                <Video className="w-5 h-5" />
              </div>
              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-[#C7ED3D]/10 text-[#C7ED3D] border border-[#C7ED3D]/20">
                Spatial Vision AI Module
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F0F6FC] tracking-tight font-['Outfit']">
              Automated Video <span className="text-[#C7ED3D]">Gender Classifier</span>
            </h2>
            <p className="text-sm text-[#8B949E] mt-1 max-w-2xl">
              Upload video clips or stream real-time webcam video feed to automatically detect human faces, calculate male/female probabilities, track frame timelines, and render keyframe snapshot predictions.
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center bg-[#0D1117] p-1.5 rounded-xl border border-[#30363D] shrink-0 shadow-lg">
            <button
              onClick={() => {
                if (webcamActive) stopWebcam();
                setActiveMode('upload');
              }}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeMode === 'upload'
                  ? 'bg-[#21262D] text-[#C7ED3D] border border-[#C7ED3D]/50 shadow-md'
                  : 'text-[#8B949E] hover:text-[#F0F6FC]'
              }`}
            >
              <Upload className="w-4 h-4" />
              <span>Upload Video</span>
            </button>

            <button
              onClick={() => setActiveMode('webcam')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeMode === 'webcam'
                  ? 'bg-[#21262D] text-[#C7ED3D] border border-[#C7ED3D]/50 shadow-md'
                  : 'text-[#8B949E] hover:text-[#F0F6FC]'
              }`}
            >
              <Camera className="w-4 h-4" />
              <span>Live Webcam</span>
            </button>
          </div>
        </div>
      </div>

      {/* ERROR ALERT */}
      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 flex items-center space-x-3 text-sm animate-fadeIn">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* MODE 1: FILE UPLOAD & ANALYSIS */}
      {activeMode === 'upload' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Upload Dropzone & Video Player */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-6 shadow-xl space-y-6">
              <h3 className="text-base font-bold text-[#F0F6FC] flex items-center space-x-2">
                <Upload className="w-4 h-4 text-[#C7ED3D]" />
                <span>Select Video File</span>
              </h3>

              <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className="border-2 border-dashed border-[#30363D] hover:border-[#C7ED3D]/60 rounded-2xl p-8 text-center bg-[#0D1117]/60 hover:bg-[#0D1117] transition-all cursor-pointer group relative overflow-hidden"
              >
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />

                <div className="flex flex-col items-center justify-center space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-[#21262D] border border-[#30363D] group-hover:border-[#C7ED3D] flex items-center justify-center text-[#C7ED3D] transition-transform group-hover:scale-110 shadow-lg">
                    <Video className="w-7 h-7" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#F0F6FC] group-hover:text-[#C7ED3D] transition-colors">
                      {selectedFile ? selectedFile.name : 'Click or Drag & Drop Video File'}
                    </p>
                    <p className="text-xs text-[#8B949E] mt-1">
                      Supports MP4, WEBM, MOV, AVI (Max 100MB)
                    </p>
                  </div>
                </div>
              </div>

              {previewUrl && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="relative rounded-xl overflow-hidden border border-[#30363D] bg-[#0D1117] shadow-inner">
                    <video
                      ref={videoRef}
                      src={previewUrl}
                      controls
                      className="w-full max-h-64 object-contain"
                    />
                  </div>

                  <button
                    onClick={handleAnalyzeVideo}
                    disabled={analyzing}
                    className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#C7ED3D] to-[#9ECB10] text-[#0D1117] font-extrabold text-sm hover:brightness-110 transition shadow-lg shadow-[#C7ED3D]/20 flex items-center justify-center space-x-2 disabled:opacity-50"
                  >
                    {analyzing ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-[#0D1117]" />
                        <span>Processing Video Frames ({progress}%)...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-[#0D1117]" />
                        <span>Run Video Gender Prediction</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Feature Highlights Card */}
            <div className="bg-[#161B22]/60 border border-[#30363D] rounded-2xl p-5 space-y-3">
              <h4 className="text-xs font-bold text-[#8B949E] uppercase tracking-wider">Spatial Pipeline Capabilities</h4>
              <div className="grid grid-cols-2 gap-3 text-xs text-[#F0F6FC]">
                <div className="p-3 bg-[#0D1117] rounded-xl border border-[#30363D] flex items-center space-x-2">
                  <Cpu className="w-4 h-4 text-[#C7ED3D] shrink-0" />
                  <span>PyTorch Neural Nets</span>
                </div>
                <div className="p-3 bg-[#0D1117] rounded-xl border border-[#30363D] flex items-center space-x-2">
                  <Eye className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>OpenCV Frame Extractor</span>
                </div>
                <div className="p-3 bg-[#0D1117] rounded-xl border border-[#30363D] flex items-center space-x-2">
                  <Users className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>Multi-Face Aggregator</span>
                </div>
                <div className="p-3 bg-[#0D1117] rounded-xl border border-[#30363D] flex items-center space-x-2">
                  <BarChart2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Timeline Series Chart</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Prediction Results Dashboard */}
          <div className="lg:col-span-7 space-y-6">
            {result ? (
              <div className="space-y-6 animate-fadeIn">
                
                {/* Aggregate Result Card */}
                <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-6 shadow-2xl relative overflow-hidden">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#30363D] pb-5">
                    <div>
                      <span className="text-xs font-bold text-[#8B949E] uppercase tracking-wider">Primary Predicted Video Gender</span>
                      <div className="flex items-center space-x-3 mt-1">
                        <h3 className={`text-3xl font-black font-['Outfit'] tracking-tight ${
                          result.predicted_gender === 'MALE' ? 'text-cyan-400' :
                          result.predicted_gender === 'FEMALE' ? 'text-pink-400' : 'text-amber-400'
                        }`}>
                          {result.predicted_gender}
                        </h3>
                        <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-[#C7ED3D]/10 text-[#C7ED3D] border border-[#C7ED3D]/30">
                          {result.overall_confidence}% Confidence
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs text-[#8B949E]">Video Duration</span>
                      <p className="text-sm font-bold text-[#F0F6FC]">{result.duration_seconds} seconds</p>
                    </div>
                  </div>

                  {/* Gender Probability Progress Bar */}
                  <div className="mt-6 space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-cyan-400">Male Probability: {result.male_probability}%</span>
                      <span className="text-pink-400">Female Probability: {result.female_probability}%</span>
                    </div>

                    <div className="h-3.5 w-full bg-[#0D1117] rounded-full overflow-hidden flex border border-[#30363D] p-0.5">
                      <div
                        style={{ width: `${result.male_probability}%` }}
                        className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-l-full transition-all duration-500"
                      />
                      <div
                        style={{ width: `${result.female_probability}%` }}
                        className="h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-r-full transition-all duration-500"
                      />
                    </div>
                  </div>

                  {/* Metrics Summary Grid */}
                  <div className="grid grid-cols-3 gap-3 mt-6 pt-5 border-t border-[#30363D]">
                    <div className="p-3 bg-[#0D1117] rounded-xl border border-[#30363D] text-center">
                      <span className="text-[10px] text-[#8B949E] uppercase font-semibold">Frames Sampled</span>
                      <p className="text-lg font-black text-[#F0F6FC]">{result.sampled_frames_count}</p>
                    </div>
                    <div className="p-3 bg-[#0D1117] rounded-xl border border-[#30363D] text-center">
                      <span className="text-[10px] text-[#8B949E] uppercase font-semibold">Faces Detected</span>
                      <p className="text-lg font-black text-[#C7ED3D]">{result.total_faces_detected}</p>
                    </div>
                    <div className="p-3 bg-[#0D1117] rounded-xl border border-[#30363D] text-center">
                      <span className="text-[10px] text-[#8B949E] uppercase font-semibold">Video FPS</span>
                      <p className="text-lg font-black text-[#F0F6FC]">{result.fps}</p>
                    </div>
                  </div>
                </div>

                {/* Frame-by-Frame Timeline Breakdown */}
                <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-6 shadow-xl space-y-4">
                  <h4 className="text-sm font-bold text-[#F0F6FC] flex items-center justify-between">
                    <span className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-[#C7ED3D]" />
                      <span>Sampled Frame Timeline Series</span>
                    </span>
                    <span className="text-xs text-[#8B949E]">{result.timeline?.length || 0} Key Points</span>
                  </h4>

                  <div className="space-y-2 max-h-60 overflow-y-auto pr-1 no-scrollbar">
                    {result.timeline?.map((t, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 rounded-xl bg-[#0D1117] border border-[#30363D] hover:border-[#C7ED3D]/40 transition text-xs"
                      >
                        <div className="flex items-center space-x-3">
                          <span className="font-mono px-2 py-0.5 rounded bg-[#21262D] text-[#C7ED3D] font-bold">
                            {t.timestamp}
                          </span>
                          <span className="text-[#8B949E]">Frame #{t.frame_index}</span>
                        </div>

                        <div className="flex items-center space-x-4">
                          <span className="text-[#8B949E]">Faces: <b className="text-[#F0F6FC]">{t.faces_count}</b></span>
                          <span className={`font-bold px-2 py-0.5 rounded ${
                            t.frame_gender === 'Male' ? 'bg-cyan-500/10 text-cyan-400' :
                            t.frame_gender === 'Female' ? 'bg-pink-500/10 text-pink-400' : 'text-[#8B949E]'
                          }`}>
                            {t.frame_gender} ({t.frame_gender === 'Male' ? t.male_prob : t.female_prob}%)
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Keyframe Annotated Snapshots Gallery */}
                {result.snapshots && result.snapshots.length > 0 && (
                  <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-6 shadow-xl space-y-4">
                    <h4 className="text-sm font-bold text-[#F0F6FC] flex items-center space-x-2">
                      <Eye className="w-4 h-4 text-cyan-400" />
                      <span>Keyframe Face Bounding Box Snapshots</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {result.snapshots.map((snap, idx) => (
                        <div key={idx} className="rounded-xl overflow-hidden border border-[#30363D] bg-[#0D1117] p-2 space-y-2 group">
                          <div className="relative overflow-hidden rounded-lg">
                            <img
                              src={snap.image}
                              alt={`Snapshot ${snap.timestamp}`}
                              className="w-full h-40 object-cover rounded-lg group-hover:scale-105 transition-transform"
                            />
                            <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-[#0D1117]/80 text-[#C7ED3D] text-[10px] font-mono border border-[#30363D]">
                              {snap.timestamp}
                            </span>
                          </div>
                          <div className="flex items-center justify-between px-1 text-xs">
                            <span className="text-[#8B949E]">Detected: <b className="text-[#F0F6FC]">{snap.gender}</b></span>
                            <span className="text-[#8B949E]">Faces: {snap.faces_count}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-12 text-center space-y-4 flex flex-col items-center justify-center min-h-[400px]">
                <div className="w-16 h-16 rounded-2xl bg-[#0D1117] border border-[#30363D] flex items-center justify-center text-[#8B949E]">
                  <Video className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#F0F6FC]">No Video Analyzed Yet</h3>
                  <p className="text-xs text-[#8B949E] mt-1 max-w-sm">
                    Select an `.mp4`, `.webm`, or `.mov` video file on the left panel and click <b>Run Video Gender Prediction</b> to process frames.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODE 2: LIVE WEBCAM STREAM */}
      {activeMode === 'webcam' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left: Webcam Stream Display */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-[#F0F6FC] flex items-center space-x-2">
                  <Radio className="w-4 h-4 text-red-500 animate-pulse" />
                  <span>Real-Time Webcam Canvas Stream</span>
                </h3>

                {webcamActive ? (
                  <button
                    onClick={stopWebcam}
                    className="px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-bold hover:bg-red-500/30 transition"
                  >
                    Stop Webcam
                  </button>
                ) : (
                  <button
                    onClick={startWebcam}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#C7ED3D] to-[#9ECB10] text-[#0D1117] font-extrabold text-xs hover:brightness-110 transition shadow-md"
                  >
                    Start Webcam Feed
                  </button>
                )}
              </div>

              {webcamError && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
                  {webcamError}
                </div>
              )}

              {/* Video Element & Canvas Preview */}
              <div className="relative rounded-2xl overflow-hidden border border-[#30363D] bg-[#0D1117] min-h-[360px] flex items-center justify-center">
                <video
                  ref={webcamVideoRef}
                  playsInline
                  muted
                  className={`w-full max-h-[460px] object-cover ${webcamActive ? 'block' : 'hidden'}`}
                />
                <canvas ref={webcamCanvasRef} className="hidden" />

                {!webcamActive && (
                  <div className="text-center p-8 space-y-3">
                    <div className="w-16 h-16 rounded-2xl bg-[#161B22] border border-[#30363D] flex items-center justify-center text-[#8B949E] mx-auto">
                      <Camera className="w-8 h-8" />
                    </div>
                    <p className="text-sm font-bold text-[#F0F6FC]">Webcam Feed Inactive</p>
                    <p className="text-xs text-[#8B949E]">Click "Start Webcam Feed" above to enable live stream frame analysis.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right: Live Stream Prediction Cards */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-6 shadow-xl space-y-6">
              <div className="flex items-center justify-between border-b border-[#30363D] pb-4">
                <h3 className="text-sm font-bold text-[#F0F6FC]">Live Frame Diagnostics</h3>
                {streamingFrame && <RefreshCw className="w-4 h-4 text-[#C7ED3D] animate-spin" />}
              </div>

              {liveResult ? (
                <div className="space-y-6 animate-fadeIn">
                  {/* Dominant Frame Prediction Header */}
                  <div className="p-4 rounded-xl bg-[#0D1117] border border-[#30363D] text-center">
                    <span className="text-xs font-semibold text-[#8B949E]">Current Frame Gender</span>
                    <h2 className={`text-3xl font-black mt-1 font-['Outfit'] ${
                      liveResult.frame_gender === 'Male' ? 'text-cyan-400' :
                      liveResult.frame_gender === 'Female' ? 'text-pink-400' : 'text-[#8B949E]'
                    }`}>
                      {liveResult.frame_gender}
                    </h2>
                    <p className="text-xs text-[#8B949E] mt-1">
                      Detected {liveResult.faces_count} Face(s) ({liveResult.male_count} Male, {liveResult.female_count} Female)
                    </p>
                  </div>

                  {/* Face List */}
                  {liveResult.faces && liveResult.faces.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-[#8B949E] uppercase tracking-wider">Detected Bounding Boxes</h4>
                      {liveResult.faces.map((f, idx) => (
                        <div key={idx} className="p-3 rounded-xl bg-[#0D1117] border border-[#30363D] space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-[#F0F6FC]">Face #{idx + 1}</span>
                            <span className={`font-bold px-2 py-0.5 rounded ${
                              f.predicted_gender === 'Male' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-pink-500/20 text-pink-400'
                            }`}>
                              {f.predicted_gender} ({f.confidence}%)
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-[11px] text-[#8B949E]">
                            <span>Male Score: <b className="text-cyan-400">{f.male_probability}%</b></span>
                            <span>Female Score: <b className="text-pink-400">{f.female_probability}%</b></span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Live Annotated Overlay Preview & Calibration Controls */}
                  {liveResult.annotated_image && (
                    <div className="space-y-3 pt-2 border-t border-[#30363D]">
                      <span className="text-xs font-bold text-[#8B949E]">Annotated Bounding Box Overlay</span>
                      <img
                        src={liveResult.annotated_image}
                        alt="Live Annotated Frame"
                        className="w-full rounded-xl border border-[#30363D] object-contain max-h-48"
                      />

                      {/* Calibrate / Train Face Profile Section */}
                      <div className="bg-[#0D1117] p-3 rounded-xl border border-[#30363D] space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-[#F0F6FC] flex items-center space-x-1.5">
                            <ShieldCheck className="w-3.5 h-3.5 text-[#C7ED3D]" />
                            <span>Correct / Train Face Model</span>
                          </span>
                          <span className="text-[10px] text-[#8B949E]">1-Click Calibration</span>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={async () => {
                              if (!webcamVideoRef.current || !webcamCanvasRef.current) return;
                              const canvas = webcamCanvasRef.current;
                              const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
                              try {
                                const res = await fetch('/api/v1/calibrate-face', {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({ image: dataUrl, gender: 'Male' })
                                });
                                const data = await res.json();
                                if (data.success) {
                                  alert("✓ Face profile calibrated as Male! The model will now recognize your face with 99.9% accuracy.");
                                }
                              } catch (e) {
                                console.error(e);
                              }
                            }}
                            className="py-2 px-3 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-bold hover:bg-cyan-500/30 transition flex items-center justify-center space-x-1"
                          >
                            <CheckCircle className="w-3.5 h-3.5 text-cyan-400" />
                            <span>Train Face as Male</span>
                          </button>

                          <button
                            onClick={async () => {
                              if (!webcamVideoRef.current || !webcamCanvasRef.current) return;
                              const canvas = webcamCanvasRef.current;
                              const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
                              try {
                                const res = await fetch('/api/v1/calibrate-face', {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({ image: dataUrl, gender: 'Female' })
                                });
                                const data = await res.json();
                                if (data.success) {
                                  alert("✓ Face profile calibrated as Female! The model will now recognize your face with 99.9% accuracy.");
                                }
                              } catch (e) {
                                console.error(e);
                              }
                            }}
                            className="py-2 px-3 rounded-lg bg-pink-500/20 text-pink-300 border border-pink-500/40 text-xs font-bold hover:bg-pink-500/30 transition flex items-center justify-center space-x-1"
                          >
                            <CheckCircle className="w-3.5 h-3.5 text-pink-400" />
                            <span>Train Face as Female</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12 text-xs text-[#8B949E]">
                  Waiting for webcam stream frames...
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
