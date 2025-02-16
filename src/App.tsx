import Form from "./components/form/Form";
import { Toaster } from "./components/ui/toaster";

function App() {
  return (
    <div className="flex justify-center items-center h-screen">
      <Form />
      <Toaster />
    </div>
  );
}

export default App;
