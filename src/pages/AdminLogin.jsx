import { useState } from "react";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../firebase/config";
import { useNavigate } from "react-router-dom";
import useSWR from "swr";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const provider = new GoogleAuthProvider();

  const fetchAdminStatus = async (userId) => {
    const adminDoc = await getDoc(doc(db, "admin", userId));
    return adminDoc.exists();
  };

  const { data: isAdmin, error } = useSWR(auth.currentUser?.uid, fetchAdminStatus);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      if (isAdmin) {
        navigate("/admin/dashboard");
      } else {
        alert("Access denied: You are not an admin.");
      }
    } catch (error) {
      alert("Login failed: " + error.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if user exists in the "admin" collection
      const isAdmin = await fetchAdminStatus(user.uid);

      if (isAdmin) {
        navigate("/admin/dashboard");
      } else {
        alert("Access denied: You are not an admin.");
      }
    } catch (error) {
      alert("Google login failed: " + error.message);
    }
  };

  if (error) {
    return <div>Error checking admin status: {error.message}</div>;
  }

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", backgroundColor: "#f5f5f5" }}>
      <div style={{ padding: "2rem", borderRadius: "8px", backgroundColor: "#fff", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}>
        <h1 style={{ textAlign: "center", marginBottom: "1rem",color:"black" }}>Admin Login</h1>
        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc" }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc" }}
          />
          <button
            type="submit"
            disabled={!isAdmin && isAdmin !== undefined}
            style={{
              padding: "0.5rem",
              borderRadius: "4px",
              border: "none",
              backgroundColor: "#007bff",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            Login
          </button>
        </form>
        <div style={{ textAlign: "center", margin: "1rem 0" }}>OR</div>
        <button
          onClick={handleGoogleLogin}
          style={{
            padding: "0.5rem",
            borderRadius: "4px",
            border: "none",
            backgroundColor: "#db4437",
            color: "#fff",
            cursor: "pointer",
            width: "100%",
          }}
        >
          Login with Google
        </button>
      </div>
    </div>
  );
};

export default AdminLogin;
