import { useState, FormEvent } from "react";
import { login } from "./api/auth";
import './App.css';

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { token } = await login(email, password);
      localStorage.setItem("token", token);
      // TODO: redirect / update app state once routing exists
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-container first-container">
          <h1>Welcome to QuarterFlow</h1>
          <p>QuarterFlow is an intelligent planner designed for college students to manage courses, track assignments, and visualize workload ahead of busy terms.</p>
        </div>
        <div className="form-container second-container">
          <h1>LOG IN</h1>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}/>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required/>
            {error && <p style={{ color: "red", fontSize: "0.875rem" }}>{error}</p>}
          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "LOGIN"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default App;
