import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  getAllTeamsAdmin,
  getAllUsersAdmin,
  updateTeamMarksAdmin,
  updateTeamStatusAdmin,
  getQueriesApi,
  replyToQueryAdminApi,
} from "../lib/api";
import type { Team, User, ParticipantType, TeamStatus, QueryItem } from "../types";
import {
  Loader2,
  Users,
  Shield,
  Search,
  Filter,
  ArrowUpDown,
  Check,
  X,
  Edit2,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  ArrowLeft,
  RefreshCw,
  Award,
  Crown,
  Sparkles,
  GraduationCap,
  Download,
  CheckCircle2,
  XCircle,
  Lock,
  Calendar,
  FileText
} from "lucide-react";

type AdminTab = "teams" | "participants" | "queries";

export default function AdminDashboard() {
  const { user } = useAuth();

  const [currentTab, setCurrentTab] = useState<AdminTab>("teams");
  const [filterType, setFilterType] = useState<"all" | ParticipantType>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | TeamStatus>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const [teams, setTeams] = useState<Team[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [queries, setQueries] = useState<QueryItem[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Leaderboard sorting
  const [sortByMarks, setSortByMarks] = useState(false);

  // Description expansion per team
  const [expandedDesc, setExpandedDesc] = useState<Record<string, boolean>>({});

  // Inline Marks & Evaluation Editing per team
  const [editingMarksId, setEditingMarksId] = useState<string | null>(null);
  const [marksForm, setMarksForm] = useState<{
    marks: string;
    day1Marks: string;
    day2Marks: string;
    status: TeamStatus;
    evaluationNotes: string;
  }>({
    marks: "",
    day1Marks: "",
    day2Marks: "",
    status: "active",
    evaluationNotes: "",
  });
  const [savingMarks, setSavingMarks] = useState(false);
  const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null);
  const [marksSuccessId, setMarksSuccessId] = useState<string | null>(null);
  const [marksError, setMarksError] = useState("");

  // Query replying state
  const [replyInputs, setReplyInputs] = useState<Record<string, string>>({});
  const [replyingId, setReplyingId] = useState<string | null>(null);
  const [querySuccess, setQuerySuccess] = useState("");

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const [teamsRes, usersRes, queriesRes] = await Promise.all([
        getAllTeamsAdmin(),
        getAllUsersAdmin(),
        getQueriesApi(),
      ]);
      setTeams(teamsRes.teams || []);
      setUsers(usersRes.users || []);
      setQueries(queriesRes.queries || []);
    } catch (err: any) {
      setError(
        err?.response?.data?.message || "Failed to load admin management data"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const toggleDesc = (id: string) => {
    setExpandedDesc((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleStartEditMarks = (team: Team) => {
    const id = team._id || team.id || "";
    setEditingMarksId(id);
    setMarksForm({
      marks: team.marks !== null && team.marks !== undefined ? String(team.marks) : "",
      day1Marks: team.day1Marks !== null && team.day1Marks !== undefined ? String(team.day1Marks) : "",
      day2Marks: team.day2Marks !== null && team.day2Marks !== undefined ? String(team.day2Marks) : "",
      status: team.status || "active",
      evaluationNotes: team.evaluationNotes || "",
    });
    setMarksError("");
  };

  const handleCancelEditMarks = () => {
    setEditingMarksId(null);
    setMarksError("");
  };

  const handleSaveMarks = async (teamId: string) => {
    setMarksError("");
    const marksNum = marksForm.marks.trim() !== "" ? Number(marksForm.marks) : undefined;
    const day1Num = marksForm.day1Marks.trim() !== "" ? Number(marksForm.day1Marks) : undefined;
    const day2Num = marksForm.day2Marks.trim() !== "" ? Number(marksForm.day2Marks) : undefined;

    if (marksNum !== undefined && (isNaN(marksNum) || marksNum < 0)) {
      setMarksError("Total score must be a non-negative number.");
      return;
    }
    if (day1Num !== undefined && (isNaN(day1Num) || day1Num < 0)) {
      setMarksError("Day 1 marks must be a non-negative number.");
      return;
    }
    if (day2Num !== undefined && (isNaN(day2Num) || day2Num < 0)) {
      setMarksError("Day 2 marks must be a non-negative number.");
      return;
    }

    setSavingMarks(true);
    try {
      const res = await updateTeamMarksAdmin(teamId, {
        marks: marksNum,
        day1Marks: day1Num,
        day2Marks: day2Num,
        status: marksForm.status,
        evaluationNotes: marksForm.evaluationNotes,
      });
      setTeams((prev) =>
        prev.map((t) => ((t._id || t.id) === teamId ? res.team : t))
      );
      setEditingMarksId(null);
      setMarksSuccessId(teamId);
      setTimeout(() => setMarksSuccessId(null), 3000);
    } catch (err: any) {
      setMarksError(err?.response?.data?.message || "Failed to update marks.");
    } finally {
      setSavingMarks(false);
    }
  };

  const handleQuickStatusChange = async (teamId: string, newStatus: TeamStatus) => {
    setUpdatingStatusId(teamId);
    try {
      const res = await updateTeamStatusAdmin(teamId, newStatus);
      setTeams((prev) =>
        prev.map((t) => ((t._id || t.id) === teamId ? { ...t, status: res.team.status } : t))
      );
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to update team status.");
    } finally {
      setUpdatingStatusId(null);
    }
  };

  const exportToCSV = () => {
    if (teams.length === 0) return;
    const headers = ["Team Code", "Team Name", "Category", "Leader", "Day 1 Marks", "Day 2 Marks", "Total Marks", "Day 2 Status"];
    const rows = teams.map((t) => [
      t.teamCode,
      `"${t.teamName.replace(/"/g, '""')}"`,
      t.participantType,
      typeof t.leader === "object" ? `"${(t.leader as any).name}"` : "N/A",
      t.day1Marks ?? "N/A",
      t.day2Marks ?? "N/A",
      t.marks ?? "N/A",
      t.status || "active",
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `ISOI_Hackathon_Marks_Evaluation_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleReplyQuery = async (queryId: string) => {
    const text = replyInputs[queryId]?.trim();
    if (!text) return;

    setReplyingId(queryId);
    try {
      const res = await replyToQueryAdminApi(queryId, text);
      setQueries((prev) =>
        prev.map((q) => (q._id === queryId ? res.query : q))
      );
      setReplyInputs((prev) => ({ ...prev, [queryId]: "" }));
      setQuerySuccess("Reply successfully sent and published to the website!");
      setTimeout(() => setQuerySuccess(""), 4000);
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to post reply.");
    } finally {
      setReplyingId(null);
    }
  };

  // Filtered teams
  const filteredTeams = useMemo(() => {
    let list = teams.filter((t) => {
      const matchesFilter =
        filterType === "all" || t.participantType === filterType;
      const matchesStatus =
        statusFilter === "all" || (t.status || "active") === statusFilter;
      const matchesSearch =
        t.teamName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.teamCode.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesStatus && matchesSearch;
    });

    if (sortByMarks) {
      list = [...list].sort((a, b) => {
        const aMarks = a.marks !== null && a.marks !== undefined ? a.marks : -1;
        const bMarks = b.marks !== null && b.marks !== undefined ? b.marks : -1;
        return bMarks - aMarks;
      });
    }

    return list;
  }, [teams, filterType, statusFilter, searchQuery, sortByMarks]);

  // Filtered users
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesFilter =
        filterType === "all" || u.participantType === filterType;
      const matchesSearch =
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (u.registrationNumber &&
          u.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (u.collegeName &&
          u.collegeName.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesFilter && matchesSearch;
    });
  }, [users, filterType, searchQuery]);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-gray-200">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#0a0a0f]/90 backdrop-blur-md border-b border-gray-800 px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 text-xs sm:text-sm text-gray-400 hover:text-cyan-400 transition-colors"
            >
              <ArrowLeft size={16} />
              Team Dashboard
            </Link>
            <div className="h-4 w-px bg-gray-700 hidden sm:block" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 font-black text-xs">
                <Shield size={16} />
              </div>
              <div>
                <span className="font-extrabold text-sm sm:text-base tracking-tight text-white block">
                  Admin Evaluation & Elimination Portal
                </span>
                <span className="text-[10px] text-gray-400 hidden sm:inline">
                  Logged in as {user?.name} ({user?.role})
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={exportToCSV}
              disabled={teams.length === 0}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-700 hover:border-emerald-500/50 bg-emerald-500/10 text-emerald-400 text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
              title="Download Marks & Elimination Sheet"
            >
              <Download size={14} />
              <span className="hidden sm:inline">Export CSV</span>
            </button>

            <button
              onClick={fetchData}
              disabled={loading}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-800 hover:border-cyan-500/40 text-gray-400 hover:text-cyan-400 text-xs font-medium transition-colors cursor-pointer"
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
        {/* Metric summary badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="p-4 rounded-2xl border border-gray-800 bg-gray-900/40">
            <span className="text-xs text-gray-500 uppercase tracking-wider block">Total Teams</span>
            <span className="text-2xl font-black text-white">{teams.length}</span>
          </div>
          <div className="p-4 rounded-2xl border border-gray-800 bg-gray-900/40">
            <span className="text-xs text-gray-500 uppercase tracking-wider block">Graded Teams</span>
            <span className="text-2xl font-black text-cyan-400">
              {teams.filter((t) => t.marks !== null && t.marks !== undefined).length}
            </span>
          </div>
          <div className="p-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/5">
            <span className="text-xs text-emerald-400 uppercase tracking-wider block">Day 2 Qualified</span>
            <span className="text-2xl font-black text-emerald-400">
              {teams.filter((t) => t.status === "qualified_day2").length}
            </span>
          </div>
          <div className="p-4 rounded-2xl border border-gray-800 bg-gray-900/40">
            <span className="text-xs text-rose-400 uppercase tracking-wider block">Eliminated</span>
            <span className="text-2xl font-black text-rose-400">
              {teams.filter((t) => t.status === "eliminated").length}
            </span>
          </div>
        </div>

        {/* Confidentiality Alert Banner */}
        <div className="mb-6 p-3.5 rounded-2xl border border-cyan-500/20 bg-cyan-500/5 flex items-center gap-3 text-xs text-cyan-300">
          <Lock size={16} className="text-cyan-400 shrink-0" />
          <span>
            <strong>Jury Confidentiality Mode:</strong> Numerical scores and grading rubrics are strictly confidential and visible only in this Admin Control Center. Participants can never see their marks; their dashboard reflects only their Day 1/Day 2 qualification status.
          </span>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-300 text-sm">
            {error}
          </div>
        )}

        {querySuccess && (
          <div className="mb-6 p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 text-sm">
            {querySuccess}
          </div>
        )}

        {/* CONTROLS BAR: TABS + FILTER + SEARCH */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          {/* Main Tabs */}
          <div className="flex bg-gray-900/90 border border-gray-800 rounded-xl p-1 max-w-fit">
            <button
              onClick={() => setCurrentTab("teams")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                currentTab === "teams"
                  ? "bg-cyan-500 text-black shadow-md shadow-cyan-500/20"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Users size={16} />
              <span>Teams ({teams.length})</span>
            </button>

            <button
              onClick={() => setCurrentTab("participants")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                currentTab === "participants"
                  ? "bg-cyan-500 text-black shadow-md shadow-cyan-500/20"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <GraduationCap size={16} />
              <span>Participants ({users.length})</span>
            </button>

            <button
              onClick={() => setCurrentTab("queries")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                currentTab === "queries"
                  ? "bg-cyan-500 text-black shadow-md shadow-cyan-500/20"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <MessageSquare size={16} />
              <span>Queries ({queries.length})</span>
            </button>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative min-w-[200px]">
              <Search className="absolute left-3 top-2.5 text-gray-500" size={16} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search team or code..."
                className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-gray-900 border border-gray-800 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* Type Filter Dropdown */}
            {currentTab === "teams" && (
              <div className="flex items-center gap-1.5 bg-gray-900 border border-gray-800 rounded-xl px-2.5 py-1">
                <Filter size={14} className="text-gray-500" />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as any)}
                  className="bg-transparent text-xs text-white focus:outline-none cursor-pointer py-1"
                >
                  <option value="all" className="bg-gray-900">All Categories</option>
                  <option value="internal" className="bg-gray-900">Internal (VIT)</option>
                  <option value="external" className="bg-gray-900">External</option>
                </select>
              </div>
            )}

            {/* Day 2 Elimination Status Filter */}
            {currentTab === "teams" && (
              <div className="flex items-center gap-1.5 bg-gray-900 border border-gray-800 rounded-xl px-2.5 py-1">
                <Calendar size={14} className="text-orange-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="bg-transparent text-xs text-white focus:outline-none cursor-pointer py-1"
                >
                  <option value="all" className="bg-gray-900">All Statuses</option>
                  <option value="active" className="bg-gray-900">Day 1 Active</option>
                  <option value="qualified_day2" className="bg-gray-900">Qualified Day 2</option>
                  <option value="eliminated" className="bg-gray-900">Eliminated</option>
                </select>
              </div>
            )}

            {/* Leaderboard toggle on teams */}
            {currentTab === "teams" && (
              <button
                onClick={() => setSortByMarks(!sortByMarks)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  sortByMarks
                    ? "bg-orange-500/20 border-orange-500 text-orange-400"
                    : "bg-gray-900 border-gray-800 text-gray-400 hover:text-white"
                }`}
              >
                <ArrowUpDown size={14} />
                <span>Rank: {sortByMarks ? "Top Marks" : "Default"}</span>
              </button>
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: TEAMS VIEW                                                         */}
        {/* ========================================================================= */}
        {currentTab === "teams" && (
          <div className="space-y-4 animate-fade-in">
            {filteredTeams.length === 0 ? (
              <div className="p-12 text-center rounded-3xl border border-gray-800 bg-gray-900/30">
                <p className="text-gray-400 text-sm">No teams match your filter or search criteria.</p>
              </div>
            ) : (
              filteredTeams.map((team) => {
                const teamId = team._id || team.id || "";
                const isEditingMarks = editingMarksId === teamId;
                const isSuccessMarks = marksSuccessId === teamId;
                const isExpanded = !!expandedDesc[teamId];
                const isUpdatingStatus = updatingStatusId === teamId;
                const members = (team.members as any[]) || [];
                const teamStatus = team.status || "active";

                return (
                  <div
                    key={teamId}
                    className={`p-5 sm:p-6 rounded-3xl border transition-all space-y-4 ${
                      teamStatus === "qualified_day2"
                        ? "border-emerald-500/40 bg-emerald-950/10"
                        : teamStatus === "eliminated"
                        ? "border-rose-500/30 bg-rose-950/5 opacity-80"
                        : "border-gray-800 bg-gray-900/50 hover:border-gray-700"
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      {/* Team Name and Badges */}
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-black text-white">{team.teamName}</h3>
                          <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-lg bg-gray-800 border border-gray-700 text-cyan-300">
                            {team.teamCode}
                          </span>
                          <span
                            className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                              team.participantType === "internal"
                                ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                                : "bg-orange-500/10 text-orange-400 border border-orange-500/20"
                            }`}
                          >
                            {team.participantType}
                          </span>

                          {/* Day 2 Elimination Status Badge */}
                          {teamStatus === "qualified_day2" && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                              <CheckCircle2 size={12} />
                              Qualified for Day 2
                            </span>
                          )}
                          {teamStatus === "eliminated" && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-rose-500/20 text-rose-400 border border-rose-500/40">
                              <XCircle size={12} />
                              Eliminated
                            </span>
                          )}
                          {teamStatus === "active" && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                              Day 1 Active
                            </span>
                          )}

                          <span className="text-xs text-gray-400 font-medium">
                            &bull; {members.length}/4 members
                          </span>
                        </div>

                        {/* Members Pill List */}
                        <div className="flex flex-wrap gap-2 text-xs text-gray-400">
                          {members.map((m: any, i: number) => {
                            const isLeader =
                              (typeof team.leader === "string"
                                ? team.leader === (m._id || m.id)
                                : (team.leader as any)?._id === (m._id || m.id)) || i === 0;

                            return (
                              <span
                                key={m._id || m.id || i}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gray-800/60 border border-gray-700/60 text-gray-300 text-[11px]"
                              >
                                {isLeader && <Crown size={11} className="text-amber-400" />}
                                <span>{m.name || "Member"}</span>
                              </span>
                            );
                          })}
                        </div>
                      </div>

                      {/* Right Section: Score Badges & Action Controls */}
                      <div className="flex flex-wrap items-center gap-3">
                        {/* Score Display Badges */}
                        <div className="flex items-center gap-2">
                          {/* Day 1 Score */}
                          <div className="px-3 py-1.5 rounded-xl bg-gray-950 border border-gray-800 text-center min-w-[70px]">
                            <span className="text-[9px] text-gray-500 uppercase tracking-wider block">Day 1</span>
                            <span className="text-sm font-bold text-gray-300">
                              {team.day1Marks !== null && team.day1Marks !== undefined ? `${team.day1Marks}` : "—"}
                            </span>
                          </div>

                          {/* Day 2 Score */}
                          <div className="px-3 py-1.5 rounded-xl bg-gray-950 border border-gray-800 text-center min-w-[70px]">
                            <span className="text-[9px] text-gray-500 uppercase tracking-wider block">Day 2</span>
                            <span className="text-sm font-bold text-gray-300">
                              {team.day2Marks !== null && team.day2Marks !== undefined ? `${team.day2Marks}` : "—"}
                            </span>
                          </div>

                          {/* Total Score */}
                          <div className="px-3.5 py-1.5 rounded-xl bg-gray-950 border border-cyan-500/30 text-center min-w-[85px]">
                            <span className="text-[9px] text-cyan-400 uppercase tracking-wider block">Total Score</span>
                            <span className="text-base font-black text-cyan-300">
                              {team.marks !== null && team.marks !== undefined ? `${team.marks} pts` : "Ungraded"}
                            </span>
                          </div>
                        </div>

                        {/* Quick Elimination Controls */}
                        <div className="flex items-center gap-1.5 border-l border-gray-800 pl-3">
                          {teamStatus !== "qualified_day2" && (
                            <button
                              onClick={() => handleQuickStatusChange(teamId, "qualified_day2")}
                              disabled={isUpdatingStatus}
                              className="px-2.5 py-1.5 rounded-lg border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-semibold transition-all cursor-pointer flex items-center gap-1"
                              title="Qualify for Day 2 Finals"
                            >
                              <CheckCircle2 size={13} />
                              <span className="hidden sm:inline">Advance</span>
                            </button>
                          )}

                          {teamStatus !== "eliminated" && (
                            <button
                              onClick={() => handleQuickStatusChange(teamId, "eliminated")}
                              disabled={isUpdatingStatus}
                              className="px-2.5 py-1.5 rounded-lg border border-rose-500/40 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold transition-all cursor-pointer flex items-center gap-1"
                              title="Eliminate Team"
                            >
                              <XCircle size={13} />
                              <span className="hidden sm:inline">Eliminate</span>
                            </button>
                          )}

                          {teamStatus !== "active" && (
                            <button
                              onClick={() => handleQuickStatusChange(teamId, "active")}
                              disabled={isUpdatingStatus}
                              className="px-2 py-1.5 rounded-lg border border-gray-700 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs transition-all cursor-pointer"
                              title="Reset status to Day 1 Active"
                            >
                              Reset
                            </button>
                          )}

                          {/* Edit Marks Button */}
                          <button
                            onClick={() => (isEditingMarks ? handleCancelEditMarks() : handleStartEditMarks(team))}
                            className={`p-2 rounded-xl border transition-all cursor-pointer ${
                              isEditingMarks
                                ? "border-cyan-500 bg-cyan-500/10 text-cyan-300"
                                : "border-gray-700 hover:border-cyan-500/50 text-gray-400 hover:text-cyan-400"
                            }`}
                            title="Edit marks and evaluation"
                          >
                            <Edit2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Inline Marks & Evaluation Editor */}
                    {isEditingMarks && (
                      <div className="p-4 rounded-2xl bg-gray-950 border border-cyan-500/50 space-y-3 animate-fade-in">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                            <Edit2 size={13} /> Edit Team Marks & Day 2 Evaluation
                          </span>
                          <span className="text-[11px] text-gray-500">Only admins can view these scores</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                          <div>
                            <label className="text-[10px] text-gray-400 uppercase font-semibold block mb-1">
                              Day 1 Checkpoint Score
                            </label>
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={marksForm.day1Marks}
                              onChange={(e) => {
                                const val = e.target.value;
                                setMarksForm((prev) => {
                                  const updated = { ...prev, day1Marks: val };
                                  // Auto calculate total if day2 is present
                                  const d1 = Number(val);
                                  const d2 = Number(prev.day2Marks);
                                  if (!isNaN(d1) && !isNaN(d2) && prev.day2Marks.trim() !== "") {
                                    updated.marks = String(d1 + d2);
                                  }
                                  return updated;
                                });
                              }}
                              placeholder="e.g. 45"
                              className="w-full px-3 py-1.5 rounded-lg bg-gray-900 text-white font-mono text-xs border border-gray-700 focus:outline-none focus:border-cyan-400"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] text-gray-400 uppercase font-semibold block mb-1">
                              Day 2 Final Pitch Score
                            </label>
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={marksForm.day2Marks}
                              onChange={(e) => {
                                const val = e.target.value;
                                setMarksForm((prev) => {
                                  const updated = { ...prev, day2Marks: val };
                                  // Auto calculate total if day1 is present
                                  const d1 = Number(prev.day1Marks);
                                  const d2 = Number(val);
                                  if (!isNaN(d1) && !isNaN(d2) && prev.day1Marks.trim() !== "") {
                                    updated.marks = String(d1 + d2);
                                  }
                                  return updated;
                                });
                              }}
                              placeholder="e.g. 50"
                              className="w-full px-3 py-1.5 rounded-lg bg-gray-900 text-white font-mono text-xs border border-gray-700 focus:outline-none focus:border-cyan-400"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] text-cyan-400 uppercase font-bold block mb-1">
                              Total Marks (Overall)
                            </label>
                            <input
                              type="number"
                              min="0"
                              max="200"
                              value={marksForm.marks}
                              onChange={(e) => setMarksForm({ ...marksForm, marks: e.target.value })}
                              placeholder="e.g. 95"
                              className="w-full px-3 py-1.5 rounded-lg bg-gray-900 text-cyan-300 font-mono font-bold text-xs border border-cyan-500/40 focus:outline-none focus:border-cyan-400"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] text-gray-400 uppercase font-semibold block mb-1">
                              Day 2 Status
                            </label>
                            <select
                              value={marksForm.status}
                              onChange={(e) => setMarksForm({ ...marksForm, status: e.target.value as TeamStatus })}
                              className="w-full px-2.5 py-1.5 rounded-lg bg-gray-900 text-white text-xs border border-gray-700 focus:outline-none focus:border-cyan-400 cursor-pointer"
                            >
                              <option value="active">Day 1 Active</option>
                              <option value="qualified_day2">Qualified for Day 2</option>
                              <option value="eliminated">Eliminated</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="text-[10px] text-gray-400 uppercase font-semibold block mb-1">
                            Internal Jury Evaluation Notes (Optional)
                          </label>
                          <input
                            type="text"
                            value={marksForm.evaluationNotes}
                            onChange={(e) => setMarksForm({ ...marksForm, evaluationNotes: e.target.value })}
                            placeholder="Feedback on tech stack, pitch presentation, architecture..."
                            className="w-full px-3 py-1.5 rounded-lg bg-gray-900 text-white text-xs border border-gray-700 focus:outline-none focus:border-cyan-400"
                          />
                        </div>

                        {marksError && (
                          <div className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 px-3 py-1.5 rounded-lg">
                            {marksError}
                          </div>
                        )}

                        <div className="flex items-center justify-end gap-2 pt-1">
                          <button
                            onClick={handleCancelEditMarks}
                            className="px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs transition-colors cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleSaveMarks(teamId)}
                            disabled={savingMarks}
                            className="px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                          >
                            {savingMarks ? (
                              <>
                                <Loader2 size={13} className="animate-spin" />
                                <span>Saving...</span>
                              </>
                            ) : (
                              <>
                                <Check size={13} />
                                <span>Save Marks & Status</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    )}

                    {isSuccessMarks && (
                      <div className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-lg flex items-center gap-2">
                        <Check size={14} />
                        <span>Team evaluation marks & status successfully saved!</span>
                      </div>
                    )}

                    {/* Project Description (Truncated & Expandable) */}
                    <div className="pt-2 border-t border-gray-800/60">
                      <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                        <span className="font-semibold uppercase tracking-wider text-[10px] text-gray-500">
                          Project Description
                        </span>
                        {team.projectDescription && team.projectDescription.length > 140 && (
                          <button
                            onClick={() => toggleDesc(teamId)}
                            className="text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <span>{isExpanded ? "Collapse" : "Read More"}</span>
                            {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                          </button>
                        )}
                      </div>

                      <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                        {team.projectDescription ? (
                          isExpanded || team.projectDescription.length <= 140
                            ? team.projectDescription
                            : `${team.projectDescription.slice(0, 140)}...`
                        ) : (
                          <span className="text-gray-500 italic">No description provided yet by leader.</span>
                        )}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: PARTICIPANTS VIEW                                                  */}
        {/* ========================================================================= */}
        {currentTab === "participants" && (
          <div className="space-y-4 animate-fade-in">
            {filteredUsers.length === 0 ? (
              <div className="p-12 text-center rounded-3xl border border-gray-800 bg-gray-900/30">
                <p className="text-gray-400 text-sm">No participants match this filter.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredUsers.map((u) => {
                  const teamObj: any = u.team;
                  return (
                    <div
                      key={u._id || u.id}
                      className="p-5 rounded-3xl border border-gray-800 bg-gray-900/50 hover:border-gray-700 transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div>
                            <h4 className="text-base font-bold text-white">{u.name}</h4>
                            <p className="text-xs text-gray-400">{u.email}</p>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                                u.participantType === "internal"
                                  ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                                  : "bg-orange-500/10 text-orange-400 border border-orange-500/20"
                              }`}
                            >
                              {u.participantType}
                            </span>
                            <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md bg-gray-800 text-gray-400 border border-gray-700">
                              {u.role}
                            </span>
                          </div>
                        </div>

                        {/* Contact details */}
                        <div className="grid grid-cols-2 gap-2 text-xs py-2 my-2 border-y border-gray-800/60 text-gray-300">
                          <div>
                            <span className="text-gray-500 text-[10px] uppercase block">Phone</span>
                            <span>{u.phone || "N/A"}</span>
                          </div>
                          <div>
                            <span className="text-gray-500 text-[10px] uppercase block">Gender</span>
                            <span className="capitalize">{u.gender || "N/A"}</span>
                          </div>
                        </div>

                        {/* Type-Specific Details */}
                        <div className="text-xs space-y-1 my-2">
                          {u.participantType === "internal" ? (
                            <>
                              <div className="flex items-center justify-between text-gray-400">
                                <span className="text-gray-500">Reg No:</span>
                                <span className="font-mono text-cyan-300">{u.registrationNumber || "—"}</span>
                              </div>
                              <div className="flex items-center justify-between text-gray-400">
                                <span className="text-gray-500">Hostel:</span>
                                <span className="text-gray-300">{u.hostelDetails || "—"}</span>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="flex items-center justify-between text-gray-400">
                                <span className="text-gray-500">College:</span>
                                <span className="text-orange-300 truncate max-w-[180px]">{u.collegeName || "—"}</span>
                              </div>
                              <div className="flex items-center justify-between text-gray-400">
                                <span className="text-gray-500">Dept:</span>
                                <span className="text-gray-300 truncate max-w-[180px]">{u.departmentName || "—"}</span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Team tag */}
                      <div className="pt-2 border-t border-gray-800 text-[11px] text-gray-400 flex items-center justify-between">
                        <span>Team Membership:</span>
                        {teamObj ? (
                          <span className="text-cyan-400 font-semibold font-mono">
                            {teamObj.teamName || teamObj.teamCode || "Joined"}
                          </span>
                        ) : (
                          <span className="text-gray-500 italic">No team joined yet</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: QUERIES VIEW & ADMIN REPLIES                                       */}
        {/* ========================================================================= */}
        {currentTab === "queries" && (
          <div className="space-y-4 animate-fade-in">
            {queries.length === 0 ? (
              <div className="p-12 text-center rounded-3xl border border-gray-800 bg-gray-900/30">
                <p className="text-gray-400 text-sm">No participant queries have been submitted yet.</p>
              </div>
            ) : (
              queries.map((q) => {
                const isAnswered = q.status === "answered";
                const isReplying = replyingId === q._id;

                return (
                  <div
                    key={q._id}
                    className="p-5 sm:p-6 rounded-3xl border border-gray-800 bg-gray-900/50 hover:border-gray-700 transition-all space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-base font-bold text-white">{q.name}</h4>
                          <span className="text-xs font-mono px-2 py-0.5 rounded bg-gray-800 text-cyan-300">
                            Team: {q.teamName}
                          </span>
                          <span className="text-xs text-gray-400">({q.email})</span>
                        </div>
                        <span className="text-[11px] text-gray-500">
                          Asked on {new Date(q.createdAt).toLocaleString()}
                        </span>
                      </div>

                      <span
                        className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider self-start sm:self-auto ${
                          isAnswered
                            ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
                            : "bg-amber-500/10 border border-amber-500/30 text-amber-400"
                        }`}
                      >
                        {isAnswered ? "Answered" : "Pending Reply"}
                      </span>
                    </div>

                    {/* Query text */}
                    <div className="p-4 rounded-xl bg-gray-950/70 border border-gray-800/80 text-sm text-gray-200">
                      <p className="font-medium text-gray-400 text-xs uppercase tracking-wider mb-1">Question:</p>
                      <p className="whitespace-pre-wrap">{q.message}</p>
                    </div>

                    {/* Existing reply or reply form */}
                    {isAnswered && q.reply ? (
                      <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/30 text-sm text-cyan-200 space-y-1">
                        <div className="flex items-center justify-between text-xs text-cyan-400 font-semibold">
                          <span>Official Response by {q.repliedBy || "Admin"}</span>
                          <span className="text-emerald-400 flex items-center gap-1">
                            <Check size={12} /> Published to Website
                          </span>
                        </div>
                        <p className="whitespace-pre-wrap">{q.reply}</p>
                      </div>
                    ) : null}

                    {/* Reply Form */}
                    <div className="pt-2">
                      <div className="flex flex-col sm:flex-row gap-2">
                        <input
                          type="text"
                          value={replyInputs[q._id] || ""}
                          onChange={(e) =>
                            setReplyInputs((prev) => ({ ...prev, [q._id]: e.target.value }))
                          }
                          placeholder={isAnswered ? "Update answer..." : "Write official reply..."}
                          className="flex-1 px-4 py-2.5 rounded-xl bg-gray-800/80 border border-gray-700 text-white placeholder-gray-500 text-xs sm:text-sm focus:outline-none focus:border-cyan-400"
                        />
                        <button
                          onClick={() => handleReplyQuery(q._id)}
                          disabled={isReplying || !(replyInputs[q._id] || "").trim()}
                          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-400 text-black font-bold text-xs sm:text-sm hover:shadow-lg hover:shadow-cyan-500/25 transition-all disabled:opacity-50 cursor-pointer"
                        >
                          {isReplying ? "Posting..." : isAnswered ? "Update Reply" : "Post Reply"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </main>
    </div>
  );
}
