import { useEffect } from "react";

function App() {
  useEffect(() => {
    console.log("Testing");
  }, []);

  return <div>Test Netlify functions</div>;
}

export default App;
