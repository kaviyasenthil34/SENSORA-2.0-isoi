import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  getMyTeamApi,
  createTeamApi,
  joinTeamApi,
  updateProjectDescriptionApi
} from "../lib/api";
import type { Team, User } from "../types";
import {
  Loader2,
  Copy,
  Check,
  Crown,
  Users,
  Award,
  FileText,
  AlertCircle,
  CheckCircle2,
  PlusCircle,
  LogIn,
  RefreshCw,
  LogOut,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  GraduationCap,
  Building
} from "lucide-react";

export default function Dashboard() {
  const { user, logout, isAdmin } = useAuth();

  const [team, setTeam] = useState<Team | null>(null);
  const [loadingTeam, setLoadingTeam] = useState(true);
  const [generalError, setGeneralError] = useState("");

  // Create team state
  const [newTeamName, setNewTeamName] = useState("");
  const [creatingTeam, setCreatingTeam] = useState(false);
  const [createError, setCreateError] = useState("");

  // Join team state
  const [joinTeamCode, setJoinTeamCode] = useState("");
  const [joiningTeam, setJoiningTeam] = useState(false);
  const [joinError, setJoinError] = useState("");

  // Description edit state
  const [projectDescription, setProjectDescription] = useState("");
  const [savingDescription, setSavingDescription] = useState(false);
  const [descSuccess, setDescSuccess] = useState("");
  const [descError, setDescError] = useState("");

  // Copy code feedback
  const [copied, setCopied] = useState(false);

  const fetchTeam = async () => {
    setLoadingTeam(true);
    setGeneralError("");
    try {
      const data = await getMyTeamApi();
      if (data?.team) {
        setTeam(data.team);
        setProjectDescription(data.team.projectDescription || "");
      } else {
        setTeam(null);
      }
    } catch (err: any) {
      if (err?.response?.status === 404) {
        // User doesn't have a team yet - normal state
        setTeam(null);
      } else {
        setGeneralError(
          err?.response?.data?.message || "Failed to load your team details"
        );
      }
    } finally {
      setLoadingTeam(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError("");
    if (!newTeamName.trim()) {
      setCreateError("Please enter a team name.");
      return;
    }

    setCreatingTeam(true);
    try {
      const res = await createTeamApi(newTeamName.trim());
      setTeam(res.team);
      setProjectDescription(res.team.projectDescription || "");
      setNewTeamName("");
    } catch (err: any) {
      setCreateError(err?.response?.data?.message || "Failed to create team.");
    } finally {
      setCreatingTeam(false);
    }
  };

  const handleJoinTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    setJoinError("");
    if (!joinTeamCode.trim()) {
      setJoinError("Please enter the team code.");
      return;
    }

    setJoiningTeam(true);
    try {
      const res = await joinTeamApi(joinTeamCode.trim().toUpperCase());
      setTeam(res.team);
      setProjectDescription(res.team.projectDescription || "");
      setJoinTeamCode("");
    } catch (err: any) {
      setJoinError(err?.response?.data?.message || "Failed to join team.");
    } finally {
      setJoiningTeam(false);
    }
  };

  const handleSaveDescription = async (e: React.FormEvent) => {
    e.preventDefault();
    setDescError("");
    setDescSuccess("");
    setSavingDescription(true);

    try {
      const res = await updateProjectDescriptionApi(projectDescription);
      setTeam(res.team);
      setDescSuccess("Project description saved successfully!");
      setTimeout(() => setDescSuccess(""), 4000);
    } catch (err: any) {
      setDescError(
        err?.response?.data?.message || "Failed to update project description."
      );
    } finally {
      setSavingDescription(false);
    }
  };

  const copyTeamCode = () => {
    if (!team?.teamCode) return;
    navigator.clipboard.writeText(team.teamCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Check if current user is leader
  const isLeader =
    team &&
    user &&
    (typeof team.leader === "string"
      ? team.leader === user.id || team.leader === user._id
      : team.leader?.id === user.id ||
        (team.leader as any)?._id === user.id ||
        team.leader?.email === user.email);

  const memberList: User[] = (team?.members as any[]) || [];

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-gray-200">
      {/* Top Bar */}
      <header className="sticky top-0 z-40 bg-[#0a0a0f]/90 backdrop-blur-md border-b border-gray-800 px-4 sm:px-8 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-xs sm:text-sm text-gray-400 hover:text-cyan-400 transition-colors"
            >
              <ArrowLeft size={16} />
              Website
            </Link>
            <div className="h-4 w-px bg-gray-700 hidden sm:block" />
            <div className="flex items-center gap-2.5">
              <img
                src="/sensora-logo.png"
                alt="Sensora 2.0"
                className="h-9 w-auto object-contain rounded-lg shadow-sm"
              />
              <span className="font-extrabold text-sm sm:text-base tracking-tight text-white hidden sm:inline">
                Team Dashboard
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Admin Portal Button */}
            {isAdmin && (
              <Link
                to="/admin"
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-red-500/50 bg-red-500/15 text-red-300 text-xs font-bold hover:bg-red-500/25 transition-all shadow-sm shadow-red-500/10"
              >
                <ShieldCheck size={15} className="text-red-400" />
                <span>Admin Portal</span>
              </Link>
            )}

            {/* User Profile Pill */}
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs font-semibold text-white">{user?.name}</span>
              <span className="text-[11px] text-gray-400 capitalize">
                {user?.role === "admin" ? "System Admin" : `${user?.participantType} participant`}
              </span>
            </div>

            <button
              onClick={fetchTeam}
              disabled={loadingTeam}
              title="Refresh team data"
              className="p-2 rounded-lg border border-gray-800 hover:border-cyan-500/40 text-gray-400 hover:text-cyan-400 transition-colors"
            >
              <RefreshCw size={16} className={loadingTeam ? "animate-spin" : ""} />
            </button>

            <button
              onClick={logout}
              title="Sign Out"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-500/30 bg-red-500/10 text-red-300 text-xs font-medium hover:bg-red-500/20 transition-colors cursor-pointer"
            >
              <LogOut size={14} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
        {/* Admin Access Notice Banner */}
        {isAdmin && (
          <div className="mb-6 p-4 rounded-2xl border border-red-500/40 bg-gradient-to-r from-red-950/40 to-gray-900/60 backdrop-blur-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg shadow-red-500/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 shrink-0">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>Administrator Portal Active</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/30 uppercase font-mono">
                    {user?.email}
                  </span>
                </h4>
                <p className="text-xs text-gray-300 mt-0.5">
                  You have administrator rights to view all teams, manage participant details, answer queries, and update jury evaluation marks.
                </p>
              </div>
            </div>
            <Link
              to="/admin"
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-400 hover:to-rose-500 text-white font-bold text-xs shrink-0 transition-all shadow-md shadow-red-500/20 text-center"
            >
              Open Admin Control Center &rarr;
            </Link>
          </div>
        )}

        {generalError && (
          <div className="mb-6 flex items-center gap-3 p-4 rounded-xl border border-red-500/30 bg-red-500/10">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <p className="text-sm text-red-300">{generalError}</p>
          </div>
        )}

        {/* LOADING STATE */}
        {loadingTeam ? (
          <div className="py-24 flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-10 h-10 text-cyan-400 animate-spin" />
            <p className="text-gray-400 text-sm">Loading team status...</p>
          </div>
        ) : !team ? (
          /* ========================================================================= */
          /* NO TEAM STATE — DUAL CHOICE: CREATE OR JOIN                              */
          /* ========================================================================= */
          <div className="space-y-8 animate-fade-in">
            {/* Welcome banner */}
            <div className="p-6 sm:p-8 rounded-3xl border border-gray-800 bg-gradient-to-r from-cyan-950/30 via-gray-900/40 to-orange-950/20 backdrop-blur-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-2">
                    <Sparkles size={13} />
                    Registration Step 2 of 2
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black text-white">
                    Hello, {user?.name}! You haven't joined a team yet.
                  </h1>
                  <p className="text-sm text-gray-400 mt-1 max-w-2xl">
                    Every participant must be part of a team (1 to 4 members). You can either create a new team as its leader, or join an existing team using the code provided by your teammate.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider border ${
                      user?.participantType === "internal"
                        ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-400"
                        : "bg-orange-500/10 border-orange-500/30 text-orange-400"
                    }`}
                  >
                    {user?.participantType === "internal" ? "VIT Internal" : "External Team"}
                  </span>
                </div>
              </div>

              {/* Self-Service Notice */}
              <div className="mt-5 p-3.5 rounded-xl border border-gray-800 bg-gray-950/60 text-xs text-gray-400 flex items-center gap-2.5">
                <ShieldCheck size={16} className="text-cyan-400 flex-shrink-0" />
                <span>
                  <strong>Self-Service Rule:</strong> Leaders do NOT manually add members. When you create a team, you will receive a unique team code. Share it with your teammates so they can join independently.
                </span>
              </div>
            </div>

            {/* DUAL CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              {/* CARD 1: CREATE TEAM */}
              <div className="p-6 sm:p-8 rounded-3xl border border-gray-800 bg-gray-900/50 backdrop-blur-sm flex flex-col justify-between hover:border-cyan-500/30 transition-all duration-300 group">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-5 group-hover:scale-105 transition-transform">
                    <PlusCircle size={26} />
                  </div>

                  <h2 className="text-xl font-black text-white mb-2">Create New Team</h2>
                  <p className="text-xs sm:text-sm text-gray-400 mb-6 leading-relaxed">
                    Choose a creative team name. You will automatically become the Team Leader and receive a shareable team code for your teammates to join.
                  </p>

                  <form onSubmit={handleCreateTeam} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                        Team Name
                      </label>
                      <input
                        type="text"
                        required
                        value={newTeamName}
                        onChange={(e) => {
                          setNewTeamName(e.target.value);
                          setCreateError("");
                        }}
                        placeholder="e.g. ByteBusters"
                        className="w-full px-4 py-3 rounded-xl bg-gray-800/80 border border-gray-700 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                      />
                    </div>

                    {createError && (
                      <div className="flex items-start gap-2.5 p-3 rounded-xl border border-red-500/30 bg-red-500/10 text-xs text-red-300">
                        <AlertCircle size={15} className="flex-shrink-0 mt-0.5" />
                        <span>{createError}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={creatingTeam}
                      className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-400 text-black font-bold text-sm hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 cursor-pointer"
                    >
                      {creatingTeam ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          <span>Creating team...</span>
                        </>
                      ) : (
                        <>
                          <PlusCircle size={16} />
                          <span>Create Team as Leader</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-800/80 text-[11px] text-gray-500">
                  Your team will be categorized as <strong>{user?.participantType}</strong>.
                </div>
              </div>

              {/* CARD 2: JOIN TEAM */}
              <div className="p-6 sm:p-8 rounded-3xl border border-gray-800 bg-gray-900/50 backdrop-blur-sm flex flex-col justify-between hover:border-orange-500/30 transition-all duration-300 group">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 mb-5 group-hover:scale-105 transition-transform">
                    <LogIn size={26} />
                  </div>

                  <h2 className="text-xl font-black text-white mb-2">Join Existing Team</h2>
                  <p className="text-xs sm:text-sm text-gray-400 mb-6 leading-relaxed">
                    Did your team leader already create a team? Ask them for their <strong>ISOI-XXXXXX</strong> code and enter it below to join them.
                  </p>

                  <form onSubmit={handleJoinTeam} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                        Team Code
                      </label>
                      <input
                        type="text"
                        required
                        value={joinTeamCode}
                        onChange={(e) => {
                          setJoinTeamCode(e.target.value);
                          setJoinError("");
                        }}
                        placeholder="ISOI-XXXXXX"
                        className="w-full px-4 py-3 rounded-xl bg-gray-800/80 border border-gray-700 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-500/20 transition-all uppercase font-mono tracking-wider"
                      />
                    </div>

                    {joinError && (
                      <div className="flex items-start gap-2.5 p-3 rounded-xl border border-red-500/30 bg-red-500/10 text-xs text-red-300">
                        <AlertCircle size={15} className="flex-shrink-0 mt-0.5" />
                        <span>{joinError}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={joiningTeam}
                      className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-gradient-to-r from-orange-500 to-amber-400 text-black font-bold text-sm hover:shadow-lg hover:shadow-orange-500/25 transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 cursor-pointer"
                    >
                      {joiningTeam ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          <span>Joining team...</span>
                        </>
                      ) : (
                        <>
                          <LogIn size={16} />
                          <span>Join Team</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-800/80 text-[11px] text-gray-500">
                  Reminder: Internal and external participants cannot mix in the same team.
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* ========================================================================= */
          /* HAS A TEAM STATE                                                          */
          /* ========================================================================= */
          <div className="space-y-8 animate-fade-in">
            {/* Team Banner */}
            <div className="p-6 sm:p-8 rounded-3xl border border-gray-800 bg-gray-900/60 backdrop-blur-xl relative overflow-hidden">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span
                      className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${
                        team.participantType === "internal"
                          ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-400"
                          : "bg-orange-500/10 border-orange-500/30 text-orange-400"
                      }`}
                    >
                      {team.participantType === "internal"
                        ? "Internal Team (VIT)"
                        : "External Team"}
                    </span>

                    {isLeader && (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400">
                        <Crown size={12} />
                        You are Team Leader
                      </span>
                    )}
                  </div>

                  <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                    {team.teamName}
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-400 mt-1">
                    Registered for Sensora 2.0 &bull; 36-Hour Hackathon
                  </p>
                </div>

                {/* Team Code Copy Box */}
                <div className="p-4 sm:p-5 rounded-2xl border border-cyan-500/30 bg-cyan-950/20 backdrop-blur-sm min-w-[280px]">
                  <p className="text-xs font-semibold text-cyan-300 uppercase tracking-wider mb-1.5">
                    Team Code
                  </p>
                  <div className="flex items-center justify-between gap-3 bg-gray-900/90 border border-gray-700 px-3.5 py-2.5 rounded-xl">
                    <span className="font-mono text-lg sm:text-xl font-black text-white tracking-wider">
                      {team.teamCode}
                    </span>
                    <button
                      onClick={copyTeamCode}
                      className="p-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 transition-colors cursor-pointer"
                      title="Copy code to clipboard"
                    >
                      {copied ? (
                        <Check size={16} className="text-emerald-400" />
                      ) : (
                        <Copy size={16} />
                      )}
                    </button>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-2 flex items-center gap-1">
                    {copied ? (
                      <span className="text-emerald-400 font-medium">Copied to clipboard!</span>
                    ) : (
                      <span>Share this code with up to 3 teammates so they can join.</span>
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Team Members */}
            <div className="p-6 sm:p-8 rounded-3xl border border-gray-800 bg-gray-900/50 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2.5">
                  <Users className="text-cyan-400" size={22} />
                  <h2 className="text-lg sm:text-xl font-black text-white">Team Members</h2>
                </div>

                {/* Progress Indicator X/4 */}
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 rounded-full bg-gray-800 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-400 to-orange-400 transition-all duration-500"
                      style={{ width: `${(memberList.length / 4) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-gray-300 font-mono">
                    {memberList.length}/4 Members
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {memberList.map((member: any, idx: number) => {
                  const memberId = member._id || member.id;
                  const leaderId =
                    typeof team.leader === "string"
                      ? team.leader
                      : team.leader?._id || team.leader?.id;
                  const isMemLeader = memberId && leaderId && memberId.toString() === leaderId.toString();

                  return (
                    <div
                      key={memberId || idx}
                      className="flex items-center justify-between p-4 rounded-2xl border border-gray-800 bg-gray-800/40 hover:border-gray-700 transition-all"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center font-bold text-white text-sm">
                          {member.name ? member.name.charAt(0).toUpperCase() : "M"}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-bold text-white">{member.name}</p>
                            {isMemLeader && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400">
                                <Crown size={10} />
                                Leader
                              </span>
                            )}
                            {memberId === user?.id && (
                              <span className="text-[10px] font-medium text-cyan-400">
                                (You)
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-400">{member.email}</p>
                        </div>
                      </div>

                      <div className="text-right text-xs text-gray-400">
                        {member.registrationNumber && (
                          <span className="font-mono text-cyan-300 block">
                            {member.registrationNumber}
                          </span>
                        )}
                        {member.collegeName && (
                          <span className="text-gray-300 truncate max-w-[140px] block">
                            {member.collegeName}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Project Description Block */}
            <div className="p-6 sm:p-8 rounded-3xl border border-gray-800 bg-gray-900/50 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <FileText className="text-cyan-400" size={22} />
                  <div>
                    <h2 className="text-lg sm:text-xl font-black text-white">Project Description</h2>
                    <p className="text-xs text-gray-400">
                      Summarize what your team is building during the 36-hour sprint.
                    </p>
                  </div>
                </div>

                {isLeader ? (
                  <span className="text-xs font-semibold text-cyan-400 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20">
                    Leader Editable
                  </span>
                ) : (
                  <span className="text-xs text-gray-500 px-2.5 py-1 rounded-full bg-gray-800">
                    Read Only
                  </span>
                )}
              </div>

              {isLeader ? (
                /* Leader editable textarea */
                <form onSubmit={handleSaveDescription} className="space-y-4">
                  <textarea
                    rows={4}
                    value={projectDescription}
                    onChange={(e) => {
                      setProjectDescription(e.target.value);
                      setDescSuccess("");
                      setDescError("");
                    }}
                    placeholder="Describe your hackathon project, problem statement, hardware/software stack, and target outcome..."
                    className="w-full p-4 rounded-2xl bg-gray-800/60 border border-gray-700 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition-all resize-y"
                  />

                  {descError && (
                    <div className="flex items-center gap-2 text-xs text-red-400 bg-red-500/10 p-3 rounded-xl border border-red-500/20">
                      <AlertCircle size={15} />
                      <span>{descError}</span>
                    </div>
                  )}

                  {descSuccess && (
                    <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20">
                      <CheckCircle2 size={15} />
                      <span>{descSuccess}</span>
                    </div>
                  )}

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={savingDescription}
                      className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-400 text-black font-bold text-sm hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 disabled:opacity-50 cursor-pointer"
                    >
                      {savingDescription ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <span>Save Description</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                /* Member read-only display */
                <div className="p-5 rounded-2xl bg-gray-950/60 border border-gray-800 text-sm leading-relaxed">
                  {team.projectDescription ? (
                    <p className="text-gray-200 whitespace-pre-wrap">
                      {team.projectDescription}
                    </p>
                  ) : (
                    <p className="text-gray-500 italic">
                      No project description has been added by your team leader yet.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
