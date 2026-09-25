import { useCallback, useEffect, useState } from "react";
import { supabase } from "../supabase";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const [accounts, setAccounts] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const loadAccounts = useCallback(async () => {
    setLoading(true);
    setError("");
    const { data, error: fetchError } = await supabase.rpc("admin_list_accounts");
    if (fetchError) setError(fetchError.message);
    else setAccounts(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { loadAccounts(); }, [loadAccounts]);

  async function toggleAccount(account) {
    setBusyId(account.id);
    setError("");
    const { error: updateError } = await supabase.rpc("admin_set_account_active", {
      target_user_id: account.id,
      active: !account.is_active,
    });
    if (updateError) setError(updateError.message);
    else setAccounts((current) => current.map((item) => item.id === account.id
      ? { ...item, is_active: !item.is_active }
      : item));
    setBusyId(null);
  }

  const shownAccounts = accounts.filter((account) => filter === "all" || account.role === filter);
  const activeCount = accounts.filter((account) => account.is_active).length;

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">CampusLink administration</p>
            <h1 className="mt-1 text-3xl font-bold text-slate-900">Master Admin</h1>
            <p className="mt-2 text-slate-600">Control student and faculty account access.</p>
          </div>
          <button onClick={async () => { await supabase.auth.signOut(); navigate("/"); }}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100">
            Sign out
          </button>
        </header>

        <section className="mb-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm text-slate-500">Managed accounts</p>
            <p className="mt-1 text-3xl font-bold text-slate-900">{accounts.length}</p>
          </div>
          <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm text-slate-500">Access enabled</p>
            <p className="mt-1 text-3xl font-bold text-emerald-700">{activeCount}</p>
          </div>
          <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm text-slate-500">Access disabled</p>
            <p className="mt-1 text-3xl font-bold text-rose-700">{accounts.length - activeCount}</p>
          </div>
        </section>

        <section className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-5 py-4">
            <h2 className="text-lg font-semibold text-slate-900">Student and faculty access</h2>
            <div className="flex gap-2">
              <select aria-label="Filter accounts by role" value={filter} onChange={(e) => setFilter(e.target.value)}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm">
                <option value="all">All accounts</option>
                <option value="student">Students</option>
                <option value="faculty">Faculty</option>
              </select>
              <button onClick={loadAccounts} className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium hover:bg-slate-50">Refresh</button>
            </div>
          </div>
          {error && <p role="alert" className="mx-5 mt-4 rounded-lg bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr><th className="px-5 py-3">Name</th><th className="px-5 py-3">Email</th><th className="px-5 py-3">Role</th><th className="px-5 py-3">Status</th><th className="px-5 py-3 text-right">Access</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? <tr><td colSpan="5" className="px-5 py-10 text-center text-slate-500">Loading accounts…</td></tr>
                  : shownAccounts.length === 0 ? <tr><td colSpan="5" className="px-5 py-10 text-center text-slate-500">No accounts found.</td></tr>
                    : shownAccounts.map((account) => (
                      <tr key={account.id}>
                        <td className="px-5 py-4 font-medium text-slate-900">{account.full_name || "—"}</td>
                        <td className="px-5 py-4 text-slate-600">{account.email}</td>
                        <td className="px-5 py-4 capitalize text-slate-600">{account.role}</td>
                        <td className="px-5 py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${account.is_active ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>{account.is_active ? "Active" : "Inactive"}</span></td>
                        <td className="px-5 py-4 text-right"><button disabled={busyId === account.id} onClick={() => toggleAccount(account)}
                          className={`rounded-lg px-3 py-2 text-xs font-semibold text-white disabled:opacity-50 ${account.is_active ? "bg-rose-600 hover:bg-rose-700" : "bg-emerald-600 hover:bg-emerald-700"}`}>
                          {busyId === account.id ? "Saving…" : account.is_active ? "Disable" : "Enable"}
                        </button></td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
          <p className="border-t border-slate-100 px-5 py-3 text-xs text-slate-500">Disabled accounts are rejected at sign-in and blocked from protected pages.</p>
        </section>
      </div>
    </main>
  );
}
