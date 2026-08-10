import { useState } from "react";


function Dashboard() {
    const [validate, setValidate] = useState('');

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome to the dashboard!</p>
    </div>
  );
}