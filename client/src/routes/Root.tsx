import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Root() {
  return (
    <div className="min-h-screen bg-black text-white">
      <header className="flex justify-between items-center p-4">
        <div className="text-2xl font-bold">Vento</div>

        <div className="space-x-2">
          <Link to="/login" className="text-white hover:text-purple-500">
            <Button variant="ghost" className="text-white hover:text-purple-500">
              Sign in
            </Button>
          </Link>
          <Link to="/register" className="text-white hover:text-purple-500">
            <Button className="bg-purple-600 hover:bg-purple-700">
              Join Now
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-bold mb-4">
            Get Your Tickets <span className="text-purple-500">Instantly</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8">
            Real-time event ticketing platform with guaranteed secure transactions
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/events">
              <Button className="bg-purple-600 hover:bg-purple-700 text-lg px-8 py-4">
                Browse Events
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="outline" className="bg-slate-500 text-lg px-8 py-4">
                Host Event
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="text-center p-6 rounded-lg bg-gray-900">
            <h3 className="text-xl font-bold mb-3">Real-Time Updates</h3>
            <p className="text-gray-400">Instant ticket availability and live event updates</p>
          </div>
          <div className="text-center p-6 rounded-lg bg-gray-900">
            <h3 className="text-xl font-bold mb-3">Secure Transactions</h3>
            <p className="text-gray-400">Advanced queue management and fraud protection</p>
          </div>
          <div className="text-center p-6 rounded-lg bg-gray-900">
            <h3 className="text-xl font-bold mb-3">Event Analytics</h3>
            <p className="text-gray-400">Detailed insights for event organizers</p>
          </div>
        </div>
      </main>
    </div>
  );
}