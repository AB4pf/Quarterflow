import { useEffect, useState, FormEvent } from "react";

type Term = {
  id: number;
  user_id: number;
  name: string;
  start_date: string;
  end_date: string;
};

function DashboardPage() {
  const [terms, setTerms] = useState<Term[]>([]);
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState<string | null>(null);
  const apiUrl = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

  useEffect(() => {
    fetchTerms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchTerms() {
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${apiUrl}/api/terms`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error("Failed to fetch terms");
      const data = await res.json();
      setTerms(data.terms || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${apiUrl}/api/terms`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ name, start_date: startDate, end_date: endDate }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.error || "Failed to create term");
      }
      setName("");
      setStartDate("");
      setEndDate("");
      await fetchTerms();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <section>
        <h2>Create Quarter / Term</h2>
        <form onSubmit={handleCreate}>
          <div>
            <label>Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div>
            <label>Start Date</label>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
          </div>
          <div>
            <label>End Date</label>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
          </div>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <button type="submit">Create Term</button>
        </form>
      </section>

      <section>
        <h2>Your Terms</h2>
        {terms.length === 0 ? (
          <p>No terms yet.</p>
        ) : (
          <ul>
            {terms.map((t) => (
              <li key={t.id}>
                <strong>{t.name}</strong> — {t.start_date} to {t.end_date}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default DashboardPage;
