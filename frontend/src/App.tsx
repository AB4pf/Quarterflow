import { useState, FormEvent } from "react";
import { login as loginApi } from "./api/auth";
import googleLogo from "./images/googleLogo.jpg";
import './App.css';
import { useGoogleLogin } from '@react-oauth/google'

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const googleLogin = useGoogleLogin({
    onSuccess: tokenResponse => {console.log(tokenResponse)},
    onError: errorResponse => {console.error(errorResponse)},
  });

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { token } = await loginApi(email, password);
      localStorage.setItem("token", token);
      // TODO: redirect / update app state once routing exists
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="main-div">
      <h1 className="main-heading">VIZION</h1>
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
          <button type="button" className="google-button" onClick={() => googleLogin()}>
            <img src={googleLogo} alt="Sign in with Google" />
          </button>
          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "LOGIN"}
          </button>
        </div>
      </form>
    </div>
  );
}

// function handleGoogleLogin() {
//   // Redirect to the backend endpoint that initiates the Google OAuth flow
//   window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/google`;
// }
export default App;
