import Image from "next/image";
import Navigation from "../components/Navigation"; 

export default function Home() {
  return (
    <div>
      <Navigation isAuthenticated={false} /> 
    </div>
  );
}
