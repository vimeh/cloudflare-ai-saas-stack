import { Button } from "@client/components/ui/button";

export default function App() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold">
        Hello World
        <Button>Click me!</Button>
      </h1>
    </div>
  );
}
